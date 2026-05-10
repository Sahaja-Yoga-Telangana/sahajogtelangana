import { JOURNEY_WHATSAPP_BOT_NUMBER } from "../../constants";

const SYCENTERS_API_BASE = process.env.SYCENTERS_API_BASE || "https://sycenters.org/api";
const SYCENTERS_APP_KEY = process.env.SYCENTERS_APP_KEY || "";
const SYCENTERS_ACCESS_TOKEN = process.env.SYCENTERS_ACCESS_TOKEN || "";

type SyCentersCacheCenter = {
  id: number;
  name: string;
  country: string;
  state: string;
  district: string;
  time_day: string;
  time_hour: number;
  lat: number;
  lng: number;
};

type SyCenterDetail = {
  id: number;
  name: string;
  country: string;
  state: string;
  district: string;
  city: string;
  address: string;
  time_day: string;
  time_hour: number;
  contact_1_name?: string;
  contact_1_phone?: string;
  contact_1_email?: string;
  contact_2_name?: string;
  contact_2_phone?: string;
  contact_2_email?: string;
  contact_zone_name?: string;
  contact_zone_phone?: string;
  contact_zone_email?: string;
  description?: string;
  website?: string;
  strength?: number;
  lat?: number;
  lng?: number;
};

export type PublicSyCenterDetail = SyCenterDetail;

export type SyCenterRecommendation = {
  _id: string;
  externalCenterId: number;
  zone: string;
  city: string;
  address: string;
  day: string;
  time: string;
  contactNumbers: string;
  link?: string;
  detailPath: string;
  score: number;
  source: "sycenters";
  distanceKm?: number;
};

export type SyCenterLocationSuggestion = {
  label: string;
  city: string;
  area: string;
  state: string;
  source: "sycenters";
};

function normalize(value?: string | null) {
  return String(value || "").trim().toLowerCase();
}

function titleCase(value: string) {
  return value
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDay(value?: string) {
  return titleCase(String(value || "").replace(/_/g, " "));
}

function formatTime(value?: number) {
  const raw = String(value || "").padStart(4, "0");
  if (!/^\d{4}$/.test(raw)) {
    return "";
  }

  const hour = Number(raw.slice(0, 2));
  const minute = raw.slice(2);
  const suffix = hour >= 12 ? "PM" : "AM";
  const normalizedHour = hour % 12 || 12;
  return `${normalizedHour}:${minute} ${suffix}`;
}

function getCenterNameParts(name?: string) {
  const [city, zone] = String(name || "").split(":");
  return {
    city: titleCase(city || ""),
    zone: (zone || city || "").trim(),
  };
}

function buildContacts(detail: SyCenterDetail) {
  return [
    detail.contact_1_phone,
    detail.contact_2_phone,
    detail.contact_zone_phone,
  ]
    .map((value) => String(value || "").trim())
    .filter(Boolean)
    .filter((value, index, array) => array.indexOf(value) === index)
    .join(", ");
}

function scoreCacheCenter(center: SyCentersCacheCenter, city: string) {
  const normalizedCity = normalize(city);
  const parts = getCenterNameParts(center.name);
  let score = 0;

  if (normalize(center.district) === normalizedCity) {
    score += 120;
  }

  if (normalize(parts.city) === normalizedCity) {
    score += 90;
  }

  if (normalize(center.name).includes(normalizedCity)) {
    score += 70;
  }

  if (normalize(center.state).includes(normalizedCity)) {
    score += 25;
  }

  return score;
}

function scoreLocationSuggestion(center: SyCentersCacheCenter, query: string) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) {
    return 0;
  }

  const parts = getCenterNameParts(center.name);
  let score = 0;

  if (normalize(center.district) === normalizedQuery) {
    score += 120;
  }

  if (normalize(parts.city) === normalizedQuery) {
    score += 100;
  }

  if (normalize(parts.zone) === normalizedQuery) {
    score += 90;
  }

  if (normalize(center.district).includes(normalizedQuery)) {
    score += 80;
  }

  if (normalize(parts.city).includes(normalizedQuery)) {
    score += 72;
  }

  if (normalize(parts.zone).includes(normalizedQuery)) {
    score += 64;
  }

  if (normalize(center.state).includes(normalizedQuery)) {
    score += 18;
  }

  return score;
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function getDistanceKm(origin: { latitude: number; longitude: number }, target: { latitude: number; longitude: number }) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(target.latitude - origin.latitude);
  const dLng = toRadians(target.longitude - origin.longitude);
  const lat1 = toRadians(origin.latitude);
  const lat2 = toRadians(target.latitude);

  const a = Math.sin(dLat / 2) ** 2
    + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

function hasSyCentersCredentials() {
  return !!SYCENTERS_APP_KEY && !!SYCENTERS_ACCESS_TOKEN;
}

export function isSyCentersConfigured() {
  return hasSyCentersCredentials();
}

async function syCentersFetch<T>(path: string, revalidateSeconds = 3600): Promise<T> {
  const response = await fetch(`${SYCENTERS_API_BASE}${path}`, {
    headers: {
      app: SYCENTERS_APP_KEY,
      accessToken: SYCENTERS_ACCESS_TOKEN,
    },
    next: { revalidate: revalidateSeconds },
  });

  if (!response.ok) {
    throw new Error(`SYCenters request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function fetchSyCentersCache() {
  return syCentersFetch<{ centers: SyCentersCacheCenter[] }>("/cache");
}

async function fetchSyCenterDetail(centerId: number) {
  return syCentersFetch<{ success: boolean; center: SyCenterDetail }>(`/centers/${centerId}`);
}

export async function getSyCenterDetail(centerId: number) {
  if (!hasSyCentersCredentials()) {
    return null;
  }

  try {
    const response = await fetchSyCenterDetail(centerId);
    return response.center || null;
  } catch (error) {
    console.error("Failed to fetch SYCenter detail:", error);
    return null;
  }
}

export async function getSyCentersCitySuggestions() {
  if (!hasSyCentersCredentials()) {
    return [];
  }

  try {
    const payload = await fetchSyCentersCache();
    const suggestions = Array.from(new Set<string>(
      (payload.centers || [])
        .flatMap((center) => {
          const parts = getCenterNameParts(center.name);
          return [center.district, parts.city];
        })
        .map((value) => titleCase(String(value || "")))
        .filter(Boolean)
    ));

    return suggestions.sort((a, b) => a.localeCompare(b));
  } catch (error) {
    console.error("Failed to fetch SYCenters city suggestions:", error);
    return [];
  }
}

export async function searchSyCentersLocationSuggestions(query: string): Promise<SyCenterLocationSuggestion[]> {
  if (!hasSyCentersCredentials()) {
    return [];
  }

  try {
    const payload = await fetchSyCentersCache();
    const suggestions = (payload.centers || [])
      .map((center) => {
        const parts = getCenterNameParts(center.name);
        const score = scoreLocationSuggestion(center, query);
        return {
          label: [parts.zone, parts.city || center.district, center.state]
            .filter(Boolean)
            .join(", "),
          city: titleCase(parts.city || center.district || ""),
          area: parts.zone || titleCase(center.district || ""),
          state: titleCase(center.state || ""),
          source: "sycenters" as const,
          score,
        };
      })
      .filter((item) => item.score > 0 && item.city)
      .sort((a, b) => b.score - a.score)
      .filter((item, index, array) => array.findIndex((candidate) => candidate.label === item.label) === index)
      .slice(0, 8)
      .map(({ score, ...item }) => item);

    return suggestions;
  } catch (error) {
    console.error("Failed to fetch SYCenters location suggestions:", error);
    return [];
  }
}

export async function findSyCentersForCity(
  city: string,
  coordinates?: { latitude: number; longitude: number }
): Promise<SyCenterRecommendation[]> {
  if (!hasSyCentersCredentials()) {
    return [];
  }

  try {
    const payload = await fetchSyCentersCache();
    const candidates = (payload.centers || [])
      .map((center) => ({
        center,
        score: scoreCacheCenter(center, city),
        distanceKm: coordinates && Number.isFinite(center.lat) && Number.isFinite(center.lng)
          ? getDistanceKm(coordinates, { latitude: center.lat, longitude: center.lng })
          : undefined,
      }))
      .filter((item) => item.score > 0 || typeof item.distanceKm === "number")
      .sort((a, b) => {
        if (typeof a.distanceKm === "number" && typeof b.distanceKm === "number") {
          return a.distanceKm - b.distanceKm;
        }

        if (typeof a.distanceKm === "number") {
          return -1;
        }

        if (typeof b.distanceKm === "number") {
          return 1;
        }

        return b.score - a.score;
      })
      .slice(0, 3);

    if (!candidates.length) {
      return [];
    }

    const detailResults = await Promise.all(
      candidates.map(async ({ center, score, distanceKm }) => {
        const detailResponse = await fetchSyCenterDetail(center.id);
        const detail = detailResponse.center;
        const parts = getCenterNameParts(detail.name);

        return {
          _id: `sycenters-${detail.id}`,
          externalCenterId: detail.id,
          zone: parts.zone || detail.city || detail.district || "Center",
          city: titleCase(detail.city || detail.district || parts.city || ""),
          address: detail.address || detail.description || "",
          day: formatDay(detail.time_day),
          time: formatTime(detail.time_hour),
          contactNumbers: buildContacts(detail),
          link: detail.website || "",
          detailPath: `/centers/external/${detail.id}`,
          score,
          source: "sycenters" as const,
          distanceKm,
        };
      })
    );

    return detailResults.sort((a, b) => {
      if (typeof a.distanceKm === "number" && typeof b.distanceKm === "number") {
        return a.distanceKm - b.distanceKm;
      }

      if (typeof a.distanceKm === "number") {
        return -1;
      }

      if (typeof b.distanceKm === "number") {
        return 1;
      }

      return b.score - a.score;
    });
  } catch (error) {
    console.error("Failed to fetch nearest SYCenters match:", error);
    return [];
  }
}

export function getJourneyWhatsappLink() {
  return `https://wa.me/${JOURNEY_WHATSAPP_BOT_NUMBER}?text=${encodeURIComponent("Hi I want to learn meditation")}`;
}
