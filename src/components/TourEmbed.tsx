'use client';

const TOUR_URL =
  "https://script.google.com/macros/s/AKfycbzBlc9r_bZiyFBdU4JXiB1V70ga2bk2EvRdk6XC3NnAbkuqINh1odDfWk7nB5CzxFXpDA/exec";

export default function TourEmbed() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] p-8 shadow-card">
      <div className="flex flex-col items-start gap-4">
        <p className="text-sm leading-7 text-[color:var(--muted)]">
          The full schedule, venue details, and volunteer assignments are managed
          live on a Google Sheet. Click below to view the latest version.
        </p>
        <a
          href={TOUR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-lg"
        >
          View Schedule &amp; Assignments
          <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}
