import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connect } from "@/database/mongo.config";
import { exactEmailMatch, getSessionFromRequest, normalizeEmail } from "@/lib/auth";
import { User } from "@/models/User";
import { VolunteerInvite } from "@/models/VolunteerInvite";
import { normalizeRole } from "@/lib/roles";

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    },
  );
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

export async function GET(request: NextRequest) {
  try {
    await connect();

    const session = await getSessionFromRequest(request);
    if (!session?.email) {
      return NextResponse.json({ error: "Please log in first." }, { status: 401, headers: corsHeaders() });
    }

    const user = await User.findOne({ email: exactEmailMatch(normalizeEmail(session.email)) }).lean();
    const role = normalizeRole((user as any)?.role);
    if (role !== "Volunteer" && role !== "Admin") {
      return NextResponse.json({ error: "Only volunteers can view invites." }, { status: 403, headers: corsHeaders() });
    }

    const invites = await VolunteerInvite.find({ createdBy: session.id })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json({ invites }, { headers: corsHeaders() });
  } catch (error: any) {
    console.error("Volunteer invite list error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error." },
      { status: 500, headers: corsHeaders() },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connect();

    const session = await getSessionFromRequest(request);
    if (!session?.email) {
      return NextResponse.json({ error: "Please log in first." }, { status: 401, headers: corsHeaders() });
    }

    const user = await User.findOne({ email: exactEmailMatch(normalizeEmail(session.email)) }).lean();
    if (!user) {
      return NextResponse.json({ error: "User not found. Please log in again." }, { status: 401, headers: corsHeaders() });
    }

    const role = normalizeRole((user as any)?.role);
    if (role !== "Volunteer" && role !== "Admin") {
      return NextResponse.json(
        { error: "Only volunteers can generate invite links." },
        { status: 403, headers: corsHeaders() },
      );
    }

    const token = crypto.randomBytes(24).toString("hex");

    await VolunteerInvite.create({
      token,
      createdBy: session.id,
      createdByEmail: normalizeEmail(session.email),
      status: "active",
    });

    const baseUrl = process.env.APP_URL || "http://localhost:3000";
    const inviteLink = `${baseUrl}/invite/${token}`;

    return NextResponse.json({ inviteLink, token }, { status: 201, headers: corsHeaders() });
  } catch (error: any) {
    console.error("Volunteer invite generation error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error." },
      { status: 500, headers: corsHeaders() },
    );
  }
}
