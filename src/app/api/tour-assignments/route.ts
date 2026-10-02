import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { connect } from "@/database/mongo.config";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { SpeakerAssignment } from "@/models/SpeakerAssignment";
import { TourSession } from "@/models/TourSession";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await connect();
    const { searchParams } = new URL(request.url);
    const sessionKeys = searchParams.get("sessionKeys");

    let query = {};
    if (sessionKeys) {
      const keys = sessionKeys.split(",").map((k) => k.trim()).filter(Boolean);
      query = { sessionKey: { $in: keys } };
    }

    const assignments = await SpeakerAssignment.find(query)
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json({ assignments });
  } catch (err) {
    console.error("Failed to fetch speaker assignments:", err);
    return NextResponse.json({ error: "Failed to load assignments" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const sessionKey = String(body.sessionKey || "").trim();
    const speakerName = String(body.speakerName || "").trim();
    const speakerPhone = String(body.speakerPhone || "").trim();

    if (!sessionKey || !speakerName || speakerName.length < 2) {
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    }
    if (!speakerPhone || !/^[0-9+\-\s()]{8,15}$/.test(speakerPhone)) {
      return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
    }

    await connect();

    const existing = await SpeakerAssignment.findOne({
      sessionKey,
      speakerPhone: speakerPhone.replace(/\s+/g, ""),
    }).lean();

    if (existing) {
      return NextResponse.json({ error: "You have already assigned yourself to this session." }, { status: 409 });
    }

    // Look up session maxSpeakers from sessionKey (format: sno-dateKey-institution)
    const parts = sessionKey.split("-");
    const institution = parts.slice(2).join("-");

    let maxSpeakers = 4;
    const sessionDoc = await TourSession.findOne({ institution }).lean();
    if (sessionDoc?.maxSpeakers) {
      maxSpeakers = sessionDoc.maxSpeakers;
    }

    const count = await SpeakerAssignment.countDocuments({ sessionKey });
    if (count >= maxSpeakers) {
      return NextResponse.json({ error: "All speaker slots for this session are filled." }, { status: 409 });
    }

    const assignment = await SpeakerAssignment.create({
      sessionKey,
      speakerName,
      speakerPhone: speakerPhone.replace(/\s+/g, ""),
    });

    return NextResponse.json({ assignment }, { status: 201 });
  } catch (err) {
    console.error("Failed to create speaker assignment:", err);
    return NextResponse.json({ error: "Failed to assign speaker" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const phone = searchParams.get("phone");

    if (!id) {
      return NextResponse.json({ error: "Assignment ID is required." }, { status: 400 });
    }

    await connect();
    const assignment = await SpeakerAssignment.findById(id).lean();
    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found." }, { status: 404 });
    }

    // Allow if: logged-in admin/volunteer, OR phone matches the assignment (self-release)
    const session = await getServerSession(authOptions);
    const user = (session?.user as any) || {};
    const role = String(user.role || "").toLowerCase();
    const isAdminOrVolunteer = ["admin", "volunteer"].includes(role);
    const isOwner = phone && phone.replace(/\s+/g, "") === assignment.speakerPhone;

    if (!isAdminOrVolunteer && !isOwner) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await SpeakerAssignment.findByIdAndDelete(id).lean();

    return NextResponse.json({ message: "Assignment released successfully." });
  } catch (err) {
    console.error("Failed to release speaker assignment:", err);
    return NextResponse.json({ error: "Failed to release assignment" }, { status: 500 });
  }
}
