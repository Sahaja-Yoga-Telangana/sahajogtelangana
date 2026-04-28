import { connect } from "@/database/mongo.config";
import { Center } from "@/models/Center";

export type PublicCenter = {
  _id: string;
  address: string;
  day: string;
  time: string;
  zone: string;
  city?: string;
  link?: string;
  contactNumbers: string;
  weeklyUpdate?: string;
  announcement?: string;
  createdAt?: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function centerSlug(center: Pick<PublicCenter, "_id" | "zone" | "city">) {
  const location = [center.zone, center.city].filter(Boolean).join(" ");
  return `${slugify(location || "center")}--${center._id}`;
}

export function centerIdFromSlug(slug: string) {
  const parts = slug.split("--");
  return parts.at(-1) || slug;
}

export function formatSingleTime(value: string) {
  const match = value.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);
  if (!match) {
    return value.trim();
  }

  const [, hourPart, minutePart = "00", meridiem] = match;
  let hour = Number(hourPart);

  if (Number.isNaN(hour) || hour > 23) {
    return value.trim();
  }

  if (meridiem) {
    const normalizedHour = ((hour + 11) % 12) + 1;
    return `${normalizedHour}:${minutePart} ${meridiem.toUpperCase()}`;
  }

  const suffix = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minutePart} ${suffix}`;
}

export function formatCenterTime(value: string) {
  const normalized = value.trim();
  if (!normalized) {
    return value;
  }

  const rangeSeparator = normalized.includes(" - ")
    ? " - "
    : normalized.includes("-")
      ? "-"
      : normalized.includes(" to ")
        ? " to "
        : null;

  if (!rangeSeparator) {
    return formatSingleTime(normalized);
  }

  const [start, end, ...rest] = normalized.split(rangeSeparator);
  if (!start || !end || rest.length > 0) {
    return normalized;
  }

  return `${formatSingleTime(start)}${rangeSeparator}${formatSingleTime(end)}`;
}

export async function getPublicCenters(): Promise<PublicCenter[]> {
  await connect();
  const centers = await Center.find({}).sort({ city: 1, zone: 1, createdAt: -1 }).lean();

  return centers.map((center: any) => ({
    _id: String(center._id),
    address: center.address || "",
    day: center.day || "",
    time: center.time || "",
    zone: center.zone || "",
    city: center.city || "Hyderabad",
    link: center.link || "",
    contactNumbers: center.contactNumbers || "",
    weeklyUpdate: center.weeklyUpdate || "",
    announcement: center.announcement || "",
    createdAt: center.createdAt ? new Date(center.createdAt).toISOString() : undefined,
  }));
}
