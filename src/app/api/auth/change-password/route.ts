import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database/mongo.config";
import { exactEmailMatch, getSessionFromRequest, normalizeEmail } from "@/lib/auth";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

type ChangePasswordPayload = {
  currentPassword?: string;
  newPassword?: string;
};

export async function POST(request: NextRequest) {
  try {
    await connect();

    const session = await getSessionFromRequest(request);
    if (!session?.email) {
      return NextResponse.json({ error: "Please log in first." }, { status: 401, headers: corsHeaders() });
    }

    const payload = (await request.json().catch(() => ({}))) as ChangePasswordPayload;
    const currentPassword = String(payload.currentPassword ?? "");
    const newPassword = String(payload.newPassword ?? "");

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current and new password are required." },
        { status: 400, headers: corsHeaders() },
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters." },
        { status: 400, headers: corsHeaders() },
      );
    }

    const user = await User.findOne({ email: exactEmailMatch(normalizeEmail(session.email)) });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404, headers: corsHeaders() });
    }

    const checkPassword = bcrypt.compareSync(currentPassword, user.password);
    if (!checkPassword) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 400, headers: corsHeaders() },
      );
    }

    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(newPassword, salt);
    await user.save();

    return NextResponse.json(
      { data: { changed: true }, message: "Password changed successfully." },
      { headers: corsHeaders() },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to change password.";
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders() });
  }
}
