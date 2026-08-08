import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { getDailyTalk } from "@/lib/dailyTalk";

export const dynamic = "force-dynamic";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session?.email) {
      return NextResponse.json({ error: "Please log in first." }, { status: 401, headers: corsHeaders() });
    }

    const data = await getDailyTalk();
    return NextResponse.json({ data }, { headers: corsHeaders() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch today's talk.";
    return NextResponse.json({ error: message }, { status: 502, headers: corsHeaders() });
  }
}
