import { NextRequest, NextResponse } from "next/server";
import { enforceJourneyRateLimit } from "@/lib/journeySecurity";
import { searchJourneyLocationSuggestions } from "@/lib/journey";
import { isSyCentersConfigured } from "@/lib/syCenters";

export async function GET(request: NextRequest) {
  try {
    const rateLimit = await enforceJourneyRateLimit({
      request,
      routeKey: "journey:location-suggestions",
      windowMs: 1000 * 60 * 10,
      maxRequests: 60,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json({ status: rateLimit.status, message: rateLimit.message }, { status: rateLimit.status });
    }

    const query = request.nextUrl.searchParams.get("q") || "";
    const suggestions = await searchJourneyLocationSuggestions(query);

    return NextResponse.json({
      status: 200,
      data: {
        suggestions,
        liveSearchEnabled: isSyCentersConfigured(),
      },
    }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch journey location suggestions:", error);
    return NextResponse.json({ status: 500, message: "Unable to fetch location suggestions right now." }, { status: 500 });
  }
}
