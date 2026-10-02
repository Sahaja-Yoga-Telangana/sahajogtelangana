import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { connect } from "@/database/mongo.config";

export const dynamic = "force-dynamic";

function clean(value: unknown, maxLength = 200) {
  return String(value || "").trim().slice(0, maxLength);
}

async function requireVolunteerOrAdmin() {
  const session = await getServerSession(authOptions);
  const user = (session?.user as any) || {};
  const role = String(user.role || "").toLowerCase();
  if (!["admin", "volunteer"].includes(role)) {
    return null;
  }
  return user;
}

export async function GET() {
  try {
    const user = await requireVolunteerOrAdmin();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connect();
    const rows = await mongoose.connection.db
      .collection("toursessions")
      .find({})
      .sort({ dateKey: 1, sno: 1 })
      .toArray();

    return NextResponse.json({ rows });
  } catch (err) {
    console.error("Tour sessions fetch error:", err);
    return NextResponse.json({ error: "Failed to load sessions" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireVolunteerOrAdmin();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const institution = clean(body.institution, 120);
    if (!institution) {
      return NextResponse.json({ error: "Institution name is required." }, { status: 400 });
    }

    await connect();
    const maxSpeakers = Number(body.maxSpeakers) || 4;

    const doc = {
      sno: Number(body.sno) || 0,
      speaker: clean(body.speaker, 80),
      speakerPhone: clean(body.speakerPhone, 20),
      institution,
      branch: clean(body.branch, 120),
      principal: clean(body.principal, 80),
      phone: clean(body.phone, 20),
      date: clean(body.date, 20),
      dateKey: clean(body.dateKey, 20),
      time: clean(body.time, 20),
      remarks: clean(body.remarks, 300),
      students: body.students != null ? Number(body.students) : null,
      direction: clean(body.direction, 40),
      approvalBy: clean(body.approvalBy, 80),
      approvalContact: clean(body.approvalContact, 20),
      mapUrl: clean(body.mapUrl, 500),
      maxSpeakers: Math.max(1, Math.min(20, maxSpeakers)),
      createdAt: new Date(),
    };

    const result = await mongoose.connection.db
      .collection("toursessions")
      .insertOne(doc);

    return NextResponse.json({ session: { ...doc, _id: result.insertedId } }, { status: 201 });
  } catch (err) {
    console.error("Failed to create tour session:", err);
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireVolunteerOrAdmin();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const id = clean(body.id, 50);
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Valid session ID is required." }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    const fields = [
      "sno", "speaker", "speakerPhone", "institution", "branch", "principal",
      "phone", "date", "dateKey", "time", "remarks", "students", "direction",
      "approvalBy", "approvalContact", "mapUrl", "maxSpeakers",
    ];
    for (const f of fields) {
      if (body[f] !== undefined) {
        if (f === "maxSpeakers") {
          updates[f] = Math.max(1, Math.min(20, Number(body[f]) || 4));
        } else if (f === "sno" || f === "students") {
          updates[f] = body[f] != null ? Number(body[f]) : null;
        } else {
          updates[f] = clean(body[f], f === "remarks" ? 300 : f === "mapUrl" ? 500 : 120);
        }
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No fields to update." }, { status: 400 });
    }

    await connect();
    const result = await mongoose.connection.db
      .collection("toursessions")
      .findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        { $set: updates },
        { returnDocument: "after" }
      );

    if (!result) {
      return NextResponse.json({ error: "Session not found." }, { status: 404 });
    }

    return NextResponse.json({ session: result });
  } catch (err) {
    console.error("Failed to update tour session:", err);
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireVolunteerOrAdmin();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Valid session ID is required." }, { status: 400 });
    }

    await connect();
    const result = await mongoose.connection.db
      .collection("toursessions")
      .findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });

    if (!result) {
      return NextResponse.json({ error: "Session not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Session deleted." });
  } catch (err) {
    console.error("Failed to delete tour session:", err);
    return NextResponse.json({ error: "Failed to delete session" }, { status: 500 });
  }
}
