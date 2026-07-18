import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database/mongo.config";
import { getSessionFromRequest, normalizeEmail } from "@/lib/auth";
import { User } from "@/models/User";
import { VolunteerInvite } from "@/models/VolunteerInvite";
import { VolunteerProfile } from "@/models/VolunteerProfile";

type RouteContext = { params: { token: string } };

export async function GET(_request: NextRequest, { params }: RouteContext) {
  await connect();

  const invite = await VolunteerInvite.findOne({ token: params.token });
  if (!invite) {
    return NextResponse.json({ error: "Invite not found." }, { status: 404 });
  }

  return NextResponse.json({
    status: invite.status,
    createdByEmail: invite.createdByEmail,
    usedByEmail: invite.usedByEmail,
    usedAt: invite.usedAt,
    createdAt: invite.createdAt,
  });
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  await connect();

  const session = await getSessionFromRequest(request);
  if (!session?.email || !session.id) {
    return NextResponse.json({ error: "You must be logged in to accept this invite." }, { status: 401 });
  }

  const invite = await VolunteerInvite.findOne({ token: params.token });
  if (!invite) {
    return NextResponse.json({ error: "Invite not found." }, { status: 404 });
  }

  if (invite.status !== "active") {
    return NextResponse.json({ error: "This invite has already been used." }, { status: 410 });
  }

  const user = await User.findById(session.id);
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const currentRole = String(user.role || "").toLowerCase();
  if (currentRole === "volunteer" || currentRole === "admin") {
    return NextResponse.json({ error: "You are already a volunteer." }, { status: 409 });
  }

  const userEmail = normalizeEmail(session.email);

  user.role = "Volunteer";
  await user.save();

  await VolunteerProfile.findOneAndUpdate(
    { email: userEmail },
    {
      $set: {
        name: user.name || "Sahaja Yogi",
        email: userEmail,
        city: user.city || "",
        isActive: true,
      },
      $setOnInsert: {
        roles: [],
        assignments: [],
        availability: "",
        staffingFocus: "",
        notes: "Invited by " + invite.createdByEmail,
      },
    },
    { upsert: true, new: true }
  );

  invite.status = "used";
  invite.usedByEmail = userEmail;
  invite.usedAt = new Date();
  await invite.save();

  return NextResponse.json({ message: "You are now a volunteer!" }, { status: 200 });
}
