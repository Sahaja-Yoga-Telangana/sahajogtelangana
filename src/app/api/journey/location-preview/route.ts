import { NextRequest, NextResponse } from "next/server";
import { enforceJourneyRateLimit } from "@/lib/journeySecurity";
import { getJourneyLocationPreview } from "@/lib/journey";
import { isSyCentersConfigured } from "@/lib/syCenters";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const rateLimit = await enforceJourneyRateLimit({
      request,
      routeKey: "journey:location-preview",
      windowMs: 1000 * 60 * 10,
      maxRequests: 30,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json({ status: rateLimit.status, message: rateLimit.message }, { status: rateLimit.status });
    }

    const latitude = Number(request.nextUrl.searchParams.get("lat"));
    const longitude = Number(request.nextUrl.searchParams.get("lng"));

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return NextResponse.json({ status: 400, message: "Latitude and longitude are required." }, { status: 400 });
    }

    const preview = await getJourneyLocationPreview({ latitude, longitude });

    return NextResponse.json({
      status: 200,
      data: {
        ...preview,
        liveMatchingEnabled: isSyCentersConfigured(),
      },
    }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch journey location preview:", error);
    return NextResponse.json({ status: 500, message: "Unable to preview the nearest center right now." }, { status: 500 });
  }
}
