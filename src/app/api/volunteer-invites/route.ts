import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connect } from "@/database/mongo.config";
import { getSessionFromRequest, normalizeEmail } from "@/lib/auth";
import { User } from "@/models/User";
import { VolunteerInvite } from "@/models/VolunteerInvite";
import { normalizeRole } from "@/lib/roles";

export async function GET(request: NextRequest) {
  await connect();

  const session = await getSessionFromRequest(request);
  if (!session?.email) {
    return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  }

  const user = await User.findById(session.id).lean();
  const role = normalizeRole((user as any)?.role);
  if (role !== "Volunteer" && role !== "Admin") {
    return NextResponse.json({ error: "Only volunteers can view invites." }, { status: 403 });
  }

  const invites = await VolunteerInvite.find({ createdBy: session.id })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  return NextResponse.json({ invites });
}

export async function POST(request: NextRequest) {
  await connect();

  const session = await getSessionFromRequest(request);
  if (!session?.email) {
    return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  }

  const user = await User.findById(session.id).lean();
  const role = normalizeRole((user as any)?.role);
  if (role !== "Volunteer" && role !== "Admin") {
    return NextResponse.json({ error: "Only volunteers can generate invite links." }, { status: 403 });
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

  return NextResponse.json({ inviteLink, token }, { status: 201 });
}
