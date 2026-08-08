import { connect } from "@/database/mongo.config";
import { DailyTalkCache } from "@/models/DailyTalkCache";

const API_BASE = "https://learnsahajayoga.org/api";
const POOL_QUERY = `${API_BASE}/talks?lang=en&has_audio=true&duration_min=30&duration_max=90`;
const POOL_TTL_MS = 24 * 60 * 60 * 1000;

export interface TalkPoolItem {
  id: number;
  title: string;
  date: string;
  duration_talk: number;
  url: string;
  web_url: string;
}

export interface DailyTalkData {
  date: string;
  talk: {
    id: number;
    title: string;
    date: string;
    year: string;
    durationMinutes: number;
    country: string;
    spokenLanguages: string[];
    webUrl: string;
    soundcloudUrl: string | null;
    vimeoUrl: string | null;
    contentMarkdown: string | null;
  };
}

// Calendar date in Asia/Kolkata — the "day" boundary for the daily talk.
export function istDateKey(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

// FNV-1a 32-bit — stable across processes, no crypto dependency.
export function hashSeed(value: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export function pickIndex(poolLength: number, dateKey: string): number {
  if (poolLength <= 0) {
    throw new Error("Talk pool is empty.");
  }
  return hashSeed(dateKey) % poolLength;
}

export async function fetchTalkPool(): Promise<TalkPoolItem[]> {
  const response = await fetch(POOL_QUERY, { signal: AbortSignal.timeout(20000) });
  if (!response.ok) {
    throw new Error(`Talk pool request failed with ${response.status}.`);
  }
  const payload = await response.json();
  const pool = Array.isArray(payload)
    ? payload
    : (payload as any)?.results ?? (payload as any)?.data ?? (payload as any)?.items;
  if (!Array.isArray(pool)) {
    throw new Error("Talk pool response is not an array.");
  }
  return pool as TalkPoolItem[];
}

export async function fetchTalkDetail(id: number): Promise<Record<string, any>> {
  const response = await fetch(`${API_BASE}/talk/${id}`, { signal: AbortSignal.timeout(20000) });
  if (!response.ok) {
    throw new Error(`Talk detail request failed with ${response.status}.`);
  }
  return response.json();
}

export function mediaUrl(
  detail: Record<string, any>,
  provider: "soundcloud" | "vimeo",
): string | null {
  const entry = detail?.media?.[provider];
  if (Array.isArray(entry) && entry.length > 0 && typeof entry[0]?.url === "string") {
    return entry[0].url;
  }
  return null;
}

export function buildDailyTalk(
  dateKey: string,
  item: TalkPoolItem,
  detail: Record<string, any>,
): DailyTalkData {
  return {
    date: dateKey,
    talk: {
      id: item.id,
      title: detail.title ?? item.title,
      date: item.date,
      year: String(detail.year ?? (item.date ? item.date.slice(0, 4) : "")),
      durationMinutes: Number(item.duration_talk ?? detail?.metadata?.duration_talk ?? 0),
      country: String(detail.country ?? ""),
      spokenLanguages: Array.isArray(detail.spoken_languages) ? detail.spoken_languages : [],
      webUrl: String(detail.web_url ?? item.web_url ?? ""),
      soundcloudUrl: mediaUrl(detail, "soundcloud"),
      vimeoUrl: mediaUrl(detail, "vimeo"),
      contentMarkdown: detail.content_markdown ?? null,
    },
  };
}

interface CacheDoc {
  key: string;
  data: unknown;
  updatedAt: Date;
}

// Today's talk: deterministic pick from a cached pool, detail cached per day.
export async function getDailyTalk(dateKey: string = istDateKey()): Promise<DailyTalkData> {
  await connect();

  const poolDoc = (await DailyTalkCache.findOne({ key: "talk-pool" }).lean()) as CacheDoc | null;
  const poolFresh =
    poolDoc?.updatedAt && Date.now() - new Date(poolDoc.updatedAt).getTime() < POOL_TTL_MS;
  let pool: TalkPoolItem[];
  if (poolFresh && Array.isArray(poolDoc.data) && poolDoc.data.length > 0) {
    pool = poolDoc.data as TalkPoolItem[];
  } else {
    pool = await fetchTalkPool();
    await DailyTalkCache.updateOne(
      { key: "talk-pool" },
      { $set: { data: pool, updatedAt: new Date() } },
      { upsert: true },
    );
  }

  const item = pool[pickIndex(pool.length, dateKey)];

  const detailKey = `talk-detail:${dateKey}`;
  const detailDoc = (await DailyTalkCache.findOne({ key: detailKey }).lean()) as CacheDoc | null;
  const detailFresh =
    detailDoc?.updatedAt && Date.now() - new Date(detailDoc.updatedAt).getTime() < POOL_TTL_MS;
  let detail: Record<string, any>;
  if (detailFresh && detailDoc.data) {
    detail = detailDoc.data as Record<string, any>;
  } else {
    detail = await fetchTalkDetail(item.id);
    await DailyTalkCache.updateOne(
      { key: detailKey },
      { $set: { data: detail, updatedAt: new Date() } },
      { upsert: true },
    );
  }

  return buildDailyTalk(dateKey, item, detail);
}
