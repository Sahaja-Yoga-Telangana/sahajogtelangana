import { connect } from "@/database/mongo.config";
import { centerSlug } from "@/lib/centers";
import { Center } from "@/models/Center";
import { Event } from "@/models/Event";
import {
  findSyCentersForCity,
  getJourneyWhatsappLink,
  getSyCentersCitySuggestions,
  searchSyCentersLocationSuggestions,
} from "@/lib/syCenters";

export type JourneyMode = "in_person" | "online";

const ONLINE_REGISTRATION_URL = "https://sahajayogaeveryday.com/register";

export type JourneyRecommendations = {
  startPage: {
    title: string;
    description: string;
    path: string;
    ctaLabel: string;
    actionLinks?: Array<{
      label: string;
      href: string;
      kind: "primary" | "secondary";
      external?: boolean;
    }>;
  };
  center: {
    _id: string;
    zone: string;
    city: string;
    address: string;
    day: string;
    time: string;
    contactNumbers: string;
    link?: string;
    detailPath: string;
    score: number;
    source?: "local" | "sycenters";
  } | null;
  events: Array<{
    _id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    mode: "online" | "in_person" | "hybrid";
    score: number;
  }>;
  citySuggestions: string[];
  fallbackReason?: string;
};

export type JourneyLocationSuggestion = {
  label: string;
  city: string;
  area: string;
  source: "local" | "sycenters";
};

type ScoredJourneyLocationSuggestion = JourneyLocationSuggestion & {
  score: number;
};

type JourneyActionLink = NonNullable<JourneyRecommendations["startPage"]["actionLinks"]>[number];

function getOnlineActionLinks(): JourneyActionLink[] {
  const links: JourneyActionLink[] = [
    {
      label: "Register for online meditation",
      href: ONLINE_REGISTRATION_URL,
      kind: "primary",
      external: true,
    },
    {
      label: "Chat on WhatsApp",
      href: getJourneyWhatsappLink(),
      kind: "secondary",
      external: true,
    },
  ];

  return links.filter((item) => item.href);
}

function normalizeText(value?: string | null) {
  return String(value || "").trim().toLowerCase();
}

function titleCaseCity(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function buildLocationLabel(area: string, city: string) {
  return [area, city].filter(Boolean).join(", ");
}

function includesCity(source: string, city: string) {
  const normalizedSource = normalizeText(source);
  const normalizedCity = normalizeText(city);
  return normalizedCity ? normalizedSource.includes(normalizedCity) : false;
}

function inferEventMode(event: any): "online" | "in_person" | "hybrid" {
  const haystack = normalizeText([event.title, event.description, event.location].join(" "));
  const hasOnline = /online|zoom|google meet|meet|teams|youtube|virtual/.test(haystack);
  const hasVenue = /hall|center|ashram|hyderabad|odisha|bhubaneswar|cuttack|address|venue|camp|ground/.test(haystack);

  if (hasOnline && hasVenue) {
    return "hybrid";
  }

  return hasOnline ? "online" : "in_person";
}

function isBeginnerFriendly(event: any) {
  const haystack = normalizeText([event.title, event.description].join(" "));
  return /beginner|new to meditation|first time|intro|introduction|guided/.test(haystack);
}

function rankCenter(center: any, city: string, preferredMode: JourneyMode) {
  let score = preferredMode === "in_person" ? 18 : 6;

  if (includesCity(center.city, city)) {
    score += 90;
  }

  if (includesCity(center.zone, city)) {
    score += 55;
  }

  if (includesCity(center.address, city)) {
    score += 30;
  }

  if (normalizeText(center.city) === "hyderabad") {
    score += 3;
  }

  return score;
}

function rankEvent(event: any, city: string, preferredMode: JourneyMode) {
  const mode = inferEventMode(event);
  let score = 0;

  if (preferredMode === "online") {
    score += mode === "online" ? 70 : mode === "hybrid" ? 52 : 12;
  } else {
    score += mode === "in_person" ? 70 : mode === "hybrid" ? 48 : 16;
  }

  if (includesCity(event.location, city)) {
    score += 44;
  }

  if (isBeginnerFriendly(event)) {
    score += 22;
  }

  const eventDate = new Date(event.date);
  const now = new Date();
  const daysUntil = Math.max(0, Math.floor((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  score += Math.max(0, 30 - Math.min(daysUntil, 30));

  return { mode, score };
}

export async function getJourneyCitySuggestions() {
  await connect();
  const [centers, syCenterSuggestions] = await Promise.all([
    Center.find({}, { city: 1 }).lean(),
    getSyCentersCitySuggestions(),
  ]);
  const cities = Array.from(new Set<string>([
    ...centers
      .map((center: any) => titleCaseCity(String(center.city || "")))
      .filter(Boolean),
    ...syCenterSuggestions,
  ]));
  return cities.sort((a, b) => a.localeCompare(b));
}

export async function searchJourneyLocationSuggestions(query: string): Promise<JourneyLocationSuggestion[]> {
  const normalizedQuery = normalizeText(query);
  if (normalizedQuery.length < 2) {
    return [];
  }

  await connect();

  const [centers, sySuggestions] = await Promise.all([
    Center.find({}, { city: 1, zone: 1, address: 1 }).lean(),
    searchSyCentersLocationSuggestions(query),
  ]);

  const localSuggestions = centers
    .map((center: any): ScoredJourneyLocationSuggestion => {
      const city = titleCaseCity(String(center.city || ""));
      const area = String(center.zone || "").trim();
      const address = normalizeText(center.address);
      let score = 0;

      if (normalizeText(area) === normalizedQuery) {
        score += 110;
      }
      if (normalizeText(city) === normalizedQuery) {
        score += 96;
      }
      if (normalizeText(area).includes(normalizedQuery)) {
        score += 78;
      }
      if (normalizeText(city).includes(normalizedQuery)) {
        score += 70;
      }
      if (address.includes(normalizedQuery)) {
        score += 28;
      }

      return {
        label: buildLocationLabel(area, city),
        city,
        area: area || city,
        source: "local" as const,
        score,
      };
    })
    .filter((item: ScoredJourneyLocationSuggestion) => item.score > 0 && item.city)
    .sort((a: ScoredJourneyLocationSuggestion, b: ScoredJourneyLocationSuggestion) => b.score - a.score)
    .filter((item: ScoredJourneyLocationSuggestion, index: number, array: ScoredJourneyLocationSuggestion[]) => array.findIndex((candidate: ScoredJourneyLocationSuggestion) => candidate.label === item.label) === index)
    .slice(0, 5)
    .map(({ score, ...item }: ScoredJourneyLocationSuggestion) => item);

  return [...sySuggestions, ...localSuggestions]
    .filter((item: JourneyLocationSuggestion, index: number, array: JourneyLocationSuggestion[]) => array.findIndex((candidate: JourneyLocationSuggestion) => candidate.label === item.label) === index)
    .slice(0, 8);
}

export async function getJourneyLocationPreview(coordinates: { latitude: number; longitude: number }) {
  const matches = await findSyCentersForCity("", coordinates);
  const center = matches[0] || null;

  return {
    center,
    resolvedCity: center?.city || "",
    distanceLabel: typeof center?.distanceKm === "number"
      ? `${center.distanceKm.toFixed(center.distanceKm < 10 ? 1 : 0)} km away`
      : "",
  };
}

export async function buildJourneyRecommendations(input: {
  city?: string;
  isNewToMeditation: boolean;
  preferredMode: JourneyMode;
  latitude?: number;
  longitude?: number;
}) : Promise<JourneyRecommendations> {
  await connect();

  const normalizedCity = titleCaseCity(input.city || "");
  const currentDate = new Date();
  const [centers, events, syCenterMatches] = await Promise.all([
    Center.find({}).sort({ city: 1, zone: 1, createdAt: -1 }).lean(),
    Event.find({
      isActive: true,
      $or: [
        { endDate: { $gte: currentDate } },
        { endDate: { $exists: false }, date: { $gte: currentDate } },
        { endDate: null, date: { $gte: currentDate } },
      ],
    }).sort({ date: 1 }).limit(24).lean(),
    findSyCentersForCity(
      normalizedCity,
      typeof input.latitude === "number" && typeof input.longitude === "number"
        ? { latitude: input.latitude, longitude: input.longitude }
        : undefined
    ),
  ]);

  const rankedCenters = centers
    .map((center: any) => {
      const score = rankCenter(center, normalizedCity, input.preferredMode);
      return {
        _id: String(center._id),
        zone: center.zone || "",
        city: center.city || "Hyderabad",
        address: center.address || "",
        day: center.day || "",
        time: center.time || "",
        contactNumbers: center.contactNumbers || "",
        link: center.link || "",
        detailPath: `/centers/${centerSlug({ _id: String(center._id), zone: center.zone || "", city: center.city || "Hyderabad" })}`,
        score,
        source: "local" as const,
      };
    })
    .sort((a: { score: number }, b: { score: number }) => b.score - a.score);

  const rankedEvents = events
    .map((event: any) => {
      const { mode, score } = rankEvent(event, normalizedCity, input.preferredMode);
      return {
        _id: String(event._id),
        title: event.title || "",
        description: event.description || "",
        date: new Date(event.date).toISOString(),
        time: event.time || "",
        location: event.location || "",
        mode,
        score,
      };
    })
    .sort((a: { score: number }, b: { score: number }) => b.score - a.score)
    .slice(0, 3);

  const localCenter = rankedCenters[0] && rankedCenters[0].score >= 40 ? rankedCenters[0] : null;
  const externalCenter = syCenterMatches[0] || null;
  const center = externalCenter || localCenter;
  const citySuggestions = Array.from(new Set<string>([
    ...rankedCenters.map((item: { city: string }) => item.city),
    ...syCenterMatches.map((item) => item.city),
  ]))
    .sort((a, b) => a.localeCompare(b));

  const startPage = input.isNewToMeditation
      ? {
        title: "Begin with the 10-minute Sahaja Yoga practice",
        description: "A gentle starting point with balancing steps, daily guidance, and beginner-friendly support.",
        path: "/meditate",
        ctaLabel: "Start meditation now",
        actionLinks: input.preferredMode === "online" ? getOnlineActionLinks() : undefined,
      }
    : input.preferredMode === "online"
      ? {
          title: "Begin with online meditation support",
          description: "Register for guided online meditation, or message us on WhatsApp if you want a more personal handoff.",
          path: "/meditate",
          ctaLabel: "Open meditation guide",
          actionLinks: getOnlineActionLinks(),
        }
      : {
          title: "Reconnect through a nearby center",
          description: "Meet the collective in person, meditate together, and build a steady practice with local support.",
          path: center?.detailPath || "/centers",
          ctaLabel: "See this center",
        };

  let fallbackReason = "";
  const locationLabel = normalizedCity || "your area";
  if (!center && input.preferredMode === "in_person") {
    fallbackReason = `We could not find a strong in-person match in ${locationLabel} yet, so we are prioritizing online guidance and upcoming events.`;
  } else if (rankedEvents.length === 0 && normalizedCity) {
    fallbackReason = `There are no upcoming events matching ${locationLabel} right now, so we are focusing on your meditation start page and nearest center.`;
  }

  return {
    startPage,
    center,
    events: rankedEvents,
    citySuggestions,
    fallbackReason: fallbackReason || undefined,
  };
}
