import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database/mongo.config";
import { exactEmailMatch, getSessionFromRequest, normalizeEmail } from "@/lib/auth";
import { User } from "@/models/User";
import { VolunteerInvite } from "@/models/VolunteerInvite";
import { VolunteerProfile } from "@/models/VolunteerProfile";

type RouteContext = { params: { token: string } };

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    await connect();

    const invite = await VolunteerInvite.findOne({ token: params.token });
    if (!invite) {
      return NextResponse.json({ error: "Invite not found." }, { status: 404, headers: corsHeaders() });
    }

    return NextResponse.json(
      {
        status: invite.status,
        createdByEmail: invite.createdByEmail,
        usedByEmail: invite.usedByEmail,
        usedAt: invite.usedAt,
        createdAt: invite.createdAt,
      },
      { headers: corsHeaders() },
    );
  } catch (error: any) {
    console.error("Volunteer invite lookup error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error." },
      { status: 500, headers: corsHeaders() },
    );
  }
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    await connect();

    const session = await getSessionFromRequest(request);
    if (!session?.email || !session.id) {
      return NextResponse.json(
        { error: "You must be logged in to accept this invite." },
        { status: 401, headers: corsHeaders() },
      );
    }

    const invite = await VolunteerInvite.findOne({ token: params.token });
    if (!invite) {
      return NextResponse.json({ error: "Invite not found." }, { status: 404, headers: corsHeaders() });
    }

    if (invite.status !== "active") {
      return NextResponse.json({ error: "This invite has already been used." }, { status: 410, headers: corsHeaders() });
    }

    const user = await User.findOne({ email: exactEmailMatch(normalizeEmail(session.email)) });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404, headers: corsHeaders() });
    }

    const currentRole = String(user.role || "").toLowerCase();
    if (currentRole === "volunteer" || currentRole === "admin") {
      return NextResponse.json({ error: "You are already a volunteer." }, { status: 409, headers: corsHeaders() });
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
      { upsert: true, new: true },
    );

    invite.status = "used";
    invite.usedByEmail = userEmail;
    invite.usedAt = new Date();
    await invite.save();

    return NextResponse.json({ message: "You are now a volunteer!" }, { status: 200, headers: corsHeaders() });
  } catch (error: any) {
    console.error("Volunteer invite accept error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error." },
      { status: 500, headers: corsHeaders() },
    );
  }
}
