"use client";

import React, { useMemo, useState } from "react";
import useSWR, { mutate } from "swr";
import Image from "next/image";
import { useSession } from "next-auth/react";

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
  English: {
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
  },
  Telugu: {
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
  },
  Hindi: {
    title: "हमसे मिलिए",
    finder: "अपने निकटतम केंद्र को खोजें",
    helper: "शहर या इलाके से खोजें, मैप खोलें, और जिस केंद्र से जुड़ना चाहें उससे जुड़े रहें।",
    zone: "क्षेत्र",
    city: "शहर",
    address: "पता",
    day: "दिन",
    time: "समय",
    contact: "संपर्क",
    join: "केंद्र फॉलो करें",
    joined: "फॉलो कर रहे हैं",
    updates: "केंद्र अपडेट्स",
    announcements: "सूचनाएँ",
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

const CentersTable: React.FC = () => {
  const { status } = useSession();
  const { data: centers = [], error, isLoading } = useSWR<Center[]>("/api/auth/centers", fetcher, {
    dedupingInterval: 60000,
    revalidateOnFocus: false,
  });
  const { data: connectionsResponse } = useSWR(status === "authenticated" ? "/api/center-connections" : null, fetcher);
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState<keyof typeof languageCopy>("English");
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const connections = ((connectionsResponse?.data || []) as any[]).map(normalizeConnection);
  const copy = languageCopy[language];

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

  if (error) return <div className="mt-4 text-center text-red-600">Failed to load centers.</div>;
  if (isLoading) return <div className="mt-4 text-center">Loading centers...</div>;

  return (
    <div className="mx-4 lg:mx-6">
      <div className="mx-auto mb-8 max-w-5xl rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)]/86 p-6 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-[color:var(--ink)]">{copy.title}</h1>
            <p className="mt-3 text-lg font-medium text-[color:var(--ink)]">{copy.finder}</p>
            <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">{copy.helper}</p>
          </div>
          <div className="flex gap-2">
            {(Object.keys(languageCopy) as Array<keyof typeof languageCopy>).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${language === lang ? "bg-[color:var(--primary)] text-white" : "border border-[color:var(--border)] text-[color:var(--ink)]"}`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-5">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-[color:var(--ink)] outline-none"
            placeholder="Search by city, locality, or area"
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
                  <p className="mt-1 text-sm text-[color:var(--muted)]">{center.city || "Hyderabad"}</p>
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
                      aria-label={`Open map for ${center.zone}`}
                    >
                      <Image src="/hyperlink.svg" alt="" width={16} height={16} />
                    </a>
                  ) : null}
                </p>
                <p><span className="font-semibold text-[color:var(--ink)]">{copy.day}:</span> {center.day}</p>
                <p><span className="font-semibold text-[color:var(--ink)]">{copy.time}:</span> {center.time}</p>
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

              {status !== "authenticated" ? (
                <p className="mt-5 text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
                  Sign in to follow this center and receive its updates
                </p>
              ) : null}
            </article>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <p className="mb-2 text-2xl font-semibold text-[color:var(--ink)]">Always free</p>
        <p className="text-lg text-[color:var(--muted)]">
          If you want to find centers apart from Telangana state, please find them{" "}
          <a
            href="https://sycenters.org/centers"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[color:var(--primary)] underline "
          >
            here
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
