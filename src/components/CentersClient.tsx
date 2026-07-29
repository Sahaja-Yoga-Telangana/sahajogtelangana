"use client";

import React, { useMemo, useState } from "react";
import useSWR, { mutate } from "swr";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useLocale } from "@/app/provider/localeProvider";
import type { PublicCenter } from "@/lib/centers";
import { centerSlug, formatCenterTime } from "@/lib/centers";

type Connection = {
  centerId: string;
  connectionType: "joined";
};

const languageCopy = {
  en: {
    title: "Centers",
    finder: "Find a center near you",
    welcome: "All sessions are always free. It would be our honour to have you visit our meditation centers.",
    address: "Address",
    day: "Day",
    time: "Time",
    contact: "Contact",
    join: "Follow",
    joined: "Following",
    updates: "Updates",
    announcements: "Announcements",
    search: "Search by zone, city, or address",
    always_free: "All sessions are always free",
    outside: "Looking for centers outside Telangana? Find them",
    here: "here",
    loading: "Loading centers",
    load_error: "Failed to load centers.",
    default_city: "Hyderabad",
    view_details: "View details",
    centers_count: "centers",
  },
  te: {
    title: "కేంద్రాలు",
    finder: "మీకు దగ్గరలోని కేంద్రాన్ని కనుగొనండి",
    welcome: "అన్ని సెషన్లు ఎప్పుడూ ఉచితం. మా ధ్యాన కేంద్రాలను సందర్శించడం మాకు గౌరవంగా ఉంటుంది.",
    address: "చిరునామా",
    day: "రోజు",
    time: "సమయం",
    contact: "సంప్రదింపు",
    join: "ఫాలో అవ్వండి",
    joined: "ఫాలో అవుతున్నారు",
    updates: "అప్‌డేట్లు",
    announcements: "ప్రకటనలు",
    search: "జోన్, నగరం లేదా చిరునామా ద్వారా వెతకండి",
    always_free: "అన్ని సెషన్లు ఎప్పుడూ ఉచితం",
    outside: "తెలంగాణ వెలుపల కేంద్రాలను కనుగొనాలంటే",
    here: "ఇక్కడ",
    loading: "కేంద్రాలు లోడ్ అవుతున్నాయి",
    load_error: "కేంద్రాలను లోడ్ చేయలేకపోయాం.",
    default_city: "హైదరాబాద్",
    view_details: "వివరాలు చూడండి",
    centers_count: "కేంద్రాలు",
  },
} as const;

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }
  return res.json();
};

const normalizeConnection = (item: any): Connection => ({
  centerId: String(item.centerId),
  connectionType: "joined",
});

export default function CentersClient({ initialCenters }: { initialCenters: PublicCenter[] }) {
  const { status } = useSession();
  const { locale } = useLocale();
  const {
    data: centers = initialCenters,
    error,
    isLoading,
  } = useSWR<PublicCenter[]>("/api/auth/centers", fetcher, {
    fallbackData: initialCenters,
    dedupingInterval: 60000,
    revalidateIfStale: false,
    revalidateOnFocus: false,
  });
  const { data: connectionsResponse } = useSWR(status === "authenticated" ? "/api/center-connections" : null, fetcher);
  const [query, setQuery] = useState("");
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const connections = ((connectionsResponse?.data || []) as any[]).map(normalizeConnection);
  const copy = languageCopy[locale as keyof typeof languageCopy] || languageCopy.en;

  const allZones = useMemo(() => {
    const zoneSet = new Set(centers.map((c) => c.zone));
    return Array.from(zoneSet).sort();
  }, [centers]);

  const filteredCenters = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return centers;
    }

    return centers.filter((center) =>
      [center.zone, center.city, center.address]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalized))
    );
  }, [centers, query]);

  const isFollowing = (centerId: string) =>
    connections.some((item) => item.centerId === String(centerId) && item.connectionType === "joined");

  const toggleConnection = async (centerId: string) => {
    const normalizedCenterId = String(centerId);
    const exists = isFollowing(normalizedCenterId);
    const connectionType = "joined";
    const url = `/api/center-connections?centerId=${encodeURIComponent(normalizedCenterId)}&connectionType=${connectionType}`;
    const key = `${normalizedCenterId}-${connectionType}`;

    setPendingKey(key);

    const optimistic = exists
      ? connections.filter((item) => !(item.centerId === normalizedCenterId && item.connectionType === "joined"))
      : [...connections, { centerId: normalizedCenterId, connectionType }];

    mutate("/api/center-connections", { status: 200, data: optimistic }, false);

    try {
      const response = await fetch(url, {
        method: exists ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: exists ? undefined : JSON.stringify({ centerId: normalizedCenterId, connectionType }),
      });

      if (!response.ok) {
        throw new Error("Unable to update center preference.");
      }

      await mutate("/api/center-connections");
    } catch (toggleError) {
      console.error(toggleError);
      await mutate("/api/center-connections");
    } finally {
      setPendingKey(null);
    }
  };

  if (error) return <div className="mt-4 text-center text-red-600">{copy.load_error}</div>;
  if (isLoading && centers.length === 0) return <div className="mt-4 text-center">{copy.loading}</div>;

  const zoneChips = allZones.filter((z) =>
    z.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div className="mx-auto max-w-6xl px-4 lg:px-6">
      <div className="py-8">
        <h1 className="text-3xl font-semibold text-[color:var(--ink)]">{copy.title}</h1>
        <p className="mt-1.5 text-base leading-relaxed text-[color:var(--muted)]">
          {copy.welcome}
        </p>
      </div>

      <div className="relative mb-6">
        <svg
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] py-3 pl-12 pr-4 text-[color:var(--ink)] outline-none placeholder:text-[color:var(--muted)]"
          placeholder={copy.search}
        />
      </div>

      {zoneChips.length > 0 && query.trim() && (
        <div className="mb-6 flex flex-wrap gap-2">
          {zoneChips.slice(0, 8).map((zone) => (
            <button
              key={zone}
              type="button"
              onClick={() => setQuery(zone)}
              className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-1.5 text-xs font-medium text-[color:var(--muted)] transition-colors hover:border-[color:var(--primary)] hover:text-[color:var(--primary)]"
            >
              {zone}
            </button>
          ))}
        </div>
      )}

      {filteredCenters.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[color:var(--border)] py-16 text-center">
          <p className="text-[color:var(--muted)]">{copy.loading}</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredCenters.map((center) => {
            const joined = isFollowing(center._id);

            return (
              <article key={center._id} className="flex flex-col h-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 transition-shadow hover:shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/centers/${centerSlug(center)}`}
                      className="text-lg font-semibold text-[color:var(--ink)] transition-colors hover:text-[color:var(--primary)]"
                    >
                      {center.zone}
                    </Link>
                    <p className="mt-0.5 text-sm text-[color:var(--muted)]">{center.city || copy.default_city}</p>
                  </div>
                  {status === "authenticated" ? (
                    <button
                      type="button"
                      onClick={() => toggleConnection(center._id)}
                      disabled={pendingKey === `${center._id}-joined`}
                      className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors disabled:opacity-60 ${
                        joined
                          ? "bg-[color:var(--primary)] text-white"
                          : "border border-[color:var(--border)] text-[color:var(--ink)] hover:border-[color:var(--primary)] hover:text-[color:var(--primary)]"
                      }`}
                    >
                      {pendingKey === `${center._id}-joined` ? "..." : joined ? copy.joined : copy.join}
                    </button>
                  ) : null}
                </div>

                <div className="mt-4 flex-1 space-y-2 text-sm text-[color:var(--muted)]">
                  <div className="flex gap-2">
                    <span className="shrink-0 w-16 font-medium text-[color:var(--ink)]">{copy.day}</span>
                    <span>{center.day}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="shrink-0 w-16 font-medium text-[color:var(--ink)]">{copy.time}</span>
                    <span className="numeric-font">{formatCenterTime(center.time)}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="shrink-0 w-16 font-medium text-[color:var(--ink)]">{copy.contact}</span>
                    <span className="numeric-font">{center.contactNumbers}</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-[color:var(--border)]">
                    <p className="leading-relaxed">
                      <span className="font-medium text-[color:var(--ink)]">{copy.address}: </span>
                      {center.address}
                    </p>
                  </div>

                  {center.weeklyUpdate ? (
                    <p className="pt-3 text-sm leading-relaxed text-[color:var(--muted)]">
                      <span className="font-medium text-[color:var(--ink)]">{copy.updates}: </span>
                      {center.weeklyUpdate}
                    </p>
                  ) : null}

                  {center.announcement ? (
                    <p className="text-sm leading-relaxed text-[color:var(--ink)]">
                      <span className="font-medium">{copy.announcements}: </span>
                      {center.announcement}
                    </p>
                  ) : null}
                </div>

                <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                  <Link
                    href={`/centers/${centerSlug(center)}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-[color:var(--primary)] transition-colors hover:underline"
                  >
                    {copy.view_details}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </Link>
                  {center.link ? (
                    <a
                      href={center.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[color:var(--border)] px-3 py-1.5 text-xs font-medium text-[color:var(--muted)] transition-colors hover:border-[color:var(--primary)] hover:text-[color:var(--primary)]"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      Open Maps
                    </a>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="my-12 text-center">
        <p className="text-sm text-[color:var(--muted)]">
          {copy.outside}{" "}
          <a
            href="https://sycenters.org/centers"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[color:var(--primary)] underline"
          >
            {copy.here}
          </a>
        </p>
      </div>
    </div>
  );
}
