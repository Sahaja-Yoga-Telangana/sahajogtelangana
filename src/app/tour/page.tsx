import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import TourSchedule from "@/components/TourSchedule";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Hyderabad 2026 Self Realization Tour",
  description:
    "Schedule and volunteer assignments for the Hyderabad 2026 Self Realization Tour. Find session timings, venues, and team responsibilities.",
  path: "/tour",
});

export default function TourPage() {
  return (
    <main className="bg-[color:var(--bg)] py-14">
      <div className="mx-auto max-w-6xl px-6">
        <p className="eyebrow">Hyderabad 2026</p>
        <h1 className="mt-3 text-[clamp(2rem,4vw,3rem)] font-display leading-[1.1] tracking-[-0.015em] text-[color:var(--ink)]">
          Self Realization Tour
        </h1>
        <div className="mt-4 h-[2px] w-12 bg-[color:var(--accent)]" />
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--muted)] md:text-base">
          School and institution visit schedule for the Hyderabad 2026 Self
          Realization Tour. Timings, venues, and coordinator assignments are
          synced live from the organizing team&rsquo;s Google Sheet.
        </p>

        <div className="mt-8">
          <TourSchedule />
        </div>
      </div>
    </main>
  );
}
