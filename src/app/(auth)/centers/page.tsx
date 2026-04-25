"use client";

import React, { useMemo, useState } from "react";
import useSWR, { mutate } from "swr";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useLocale } from "@/app/provider/localeProvider";

interface Center {
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
}

type Connection = {
  centerId: string;
  connectionType: "joined";
};

const languageCopy = {
  en: {
    title: "Visit Us",
    finder: "Find your nearest center",
    helper: "Search by city or locality, open the map, and stay connected with the center that feels right for you.",
    zone: "Zone",
    city: "City",
    address: "Address",
    day: "Day",
    time: "Time",
    contact: "Contact No.",
    join: "Follow center",
    joined: "Following",
    updates: "Center updates",
    announcements: "Announcements",
    search: "Search by city, locality, or area",
    always_free: "Always free",
    outside: "If you want to find centers apart from Telangana state, please find them",
    here: "here",
    loading: "Loading centers...",
    load_error: "Failed to load centers.",
    default_city: "Hyderabad",
    open_map: "Open map for",
  },
  te: {
    title: "మాతో కలవండి",
    finder: "మీకు దగ్గరలోని కేంద్రాన్ని కనుగొనండి",
    helper: "నగరం లేదా ప్రాంతం ద్వారా వెతకండి, మ్యాప్ తెరవండి, మరియు మీకు అనుకూలమైన కేంద్రంతో అనుసంధానంగా ఉండండి.",
    zone: "ప్రాంతం",
    city: "నగరం",
    address: "చిరునామా",
    day: "రోజు",
    time: "సమయం",
    contact: "సంప్రదింపు",
    join: "కేంద్రాన్ని ఫాలో అవ్వండి",
    joined: "ఫాలో అవుతున్నారు",
    updates: "కేంద్ర అప్‌డేట్లు",
    announcements: "ప్రకటనలు",
    search: "నగరం, ప్రాంతం లేదా ఏరియా ద్వారా వెతకండి",
    always_free: "ఎప్పుడూ ఉచితం",
    outside: "తెలంగాణ రాష్ట్రం వెలుపల కేంద్రాలను కనుగొనాలంటే వాటిని",
    here: "ఇక్కడ",
    loading: "కేంద్రాలు లోడ్ అవుతున్నాయి...",
    load_error: "కేంద్రాలను లోడ్ చేయలేకపోయాం.",
    default_city: "హైదరాబాద్",
    open_map: "మ్యాప్ తెరవండి",
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

const formatSingleTime = (value: string) => {
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
};

const formatCenterTime = (value: string) => {
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
};

const CentersTable: React.FC = () => {
  const { status } = useSession();
  const { locale } = useLocale();
  const { data: centers = [], error, isLoading } = useSWR<Center[]>("/api/auth/centers", fetcher, {
    dedupingInterval: 60000,
    revalidateOnFocus: false,
  });
  const { data: connectionsResponse } = useSWR(status === "authenticated" ? "/api/center-connections" : null, fetcher);
  const [query, setQuery] = useState("");
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const connections = ((connectionsResponse?.data || []) as any[]).map(normalizeConnection);
  const copy = languageCopy[locale as keyof typeof languageCopy] || languageCopy.en;

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
  if (isLoading) return <div className="mt-4 text-center">{copy.loading}</div>;

  return (
    <div className="mx-4 lg:mx-6">
      <div className="mx-auto mb-8 max-w-5xl rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)]/86 p-6 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-[color:var(--ink)]">{copy.title}</h1>
            <p className="mt-3 text-lg font-medium text-[color:var(--ink)]">{copy.finder}</p>
            <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">{copy.helper}</p>
          </div>
        </div>
        <div className="mt-5">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-[color:var(--ink)] outline-none"
            placeholder={copy.search}
          />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredCenters.map((center) => {
          const joined = isFollowing(center._id);

          return (
            <article key={center._id} className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">{copy.city}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-[color:var(--ink)]">{center.zone}</h2>
                  <p className="mt-1 text-sm text-[color:var(--muted)]">{center.city || copy.default_city}</p>
                </div>
                {status === "authenticated" ? (
                  <div className="flex items-start">
                    <button
                      type="button"
                      onClick={() => toggleConnection(center._id)}
                      disabled={pendingKey === `${center._id}-joined`}
                      className={`rounded-full px-4 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-60 ${joined ? "bg-[color:var(--primary-600)] shadow-[0_10px_24px_rgba(0,0,0,0.16)]" : "bg-[color:var(--primary)] hover:bg-[color:var(--primary-600)]"}`}
                    >
                      {pendingKey === `${center._id}-joined` ? "..." : joined ? copy.joined : copy.join}
                    </button>
                  </div>
                ) : null}
              </div>

              <div className="mt-5 space-y-3 text-sm leading-7 text-[color:var(--muted)]">
                <p>
                  <span className="font-semibold text-[color:var(--ink)]">{copy.address}:</span> {center.address}
                  {center.link ? (
                    <a
                      href={center.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 inline-flex items-center align-middle"
                      aria-label={`${copy.open_map} ${center.zone}`}
                    >
                      <Image src="/hyperlink.svg" alt="" width={16} height={16} />
                    </a>
                  ) : null}
                </p>
                <p><span className="font-semibold text-[color:var(--ink)]">{copy.day}:</span> {center.day}</p>
                <p><span className="font-semibold text-[color:var(--ink)]">{copy.time}:</span> {formatCenterTime(center.time)}</p>
                <p><span className="font-semibold text-[color:var(--ink)]">{copy.contact}:</span> {center.contactNumbers}</p>
              </div>

              {center.weeklyUpdate ? (
                <div className="mt-5 rounded-[20px] border border-[color:var(--border)] bg-[color:var(--surface-2)]/65 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">{copy.updates}</p>
                  <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">{center.weeklyUpdate}</p>
                </div>
              ) : null}

              {center.announcement ? (
                <div className="mt-4 rounded-[20px] border border-[color:var(--border)] bg-[color:var(--surface-2)]/65 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">{copy.announcements}</p>
                  <p className="mt-2 text-sm leading-7 text-[color:var(--ink)]">{center.announcement}</p>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <p className="mb-2 text-2xl font-semibold text-[color:var(--ink)]">{copy.always_free}</p>
        <p className="text-lg text-[color:var(--muted)]">
          {copy.outside}{" "}
          <a
            href="https://sycenters.org/centers"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[color:var(--primary)] underline "
          >
            {copy.here}
          </a>
        </p>
      </div>

      <hr className="m-10" />
    </div>
  );
};

const Page: React.FC = () => {
  return (
    <div className="page-container bg-[color:var(--bg)] pb-6 text-[color:var(--ink)] lg:px-20">
      <CentersTable />
    </div>
  );
};

export default Page;
