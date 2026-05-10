import { createHash } from "crypto";
import { NextRequest } from "next/server";
import { JourneyRequestLog } from "@/models/JourneyRequestLog";

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") || "unknown";
}

export async function enforceJourneyRateLimit(options: {
  request: NextRequest;
  routeKey: string;
  windowMs: number;
  maxRequests: number;
  extraFingerprintParts?: string[];
}) {
  const { request, routeKey, windowMs, maxRequests, extraFingerprintParts = [] } = options;
  const ip = getClientIp(request);
  const fingerprint = sha256([routeKey, ip, ...extraFingerprintParts].join("|"));
  const cutoff = new Date(Date.now() - windowMs);

  const recentCount = await JourneyRequestLog.countDocuments({
    routeKey,
    fingerprint,
    createdAt: { $gte: cutoff },
  });

  if (recentCount >= maxRequests) {
    return {
      allowed: false,
      status: 429,
      message: "Too many requests. Please wait a little and try again.",
    };
  }

  await JourneyRequestLog.create({
    routeKey,
    fingerprint,
  });

  return { allowed: true as const };
}
