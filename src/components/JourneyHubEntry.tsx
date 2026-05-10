"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "sahaja-journey-entry-dismissed-at";
const SESSION_SEEN_KEY = "sahaja-journey-entry-seen";
const SUPPRESS_MS = 1000 * 60 * 60 * 24 * 7;

export default function JourneyHubEntry({
  sourcePage,
  variant = "default",
  autoOpen = false,
}: {
  sourcePage: string;
  variant?: "default" | "compact";
  autoOpen?: boolean;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!autoOpen) {
      return;
    }

    try {
	      const value = window.localStorage.getItem(STORAGE_KEY);
	      const seenInSession = window.sessionStorage.getItem(SESSION_SEEN_KEY);
	      if ((!value || Date.now() - Number(value) > SUPPRESS_MS) && !seenInSession) {
	        const timer = window.setTimeout(() => {
            try {
              window.sessionStorage.setItem(SESSION_SEEN_KEY, "true");
            } catch (sessionError) {
              console.error("Failed to persist journey session state:", sessionError);
            }
            setOpen(true);
          }, 1600);
	        return () => window.clearTimeout(timer);
	      }
    } catch (error) {
      console.error("Failed to inspect journey modal preference:", error);
    }
  }, [autoOpen]);

  const openModal = () => {
    try {
      window.sessionStorage.setItem(SESSION_SEEN_KEY, "true");
    } catch (error) {
      console.error("Failed to persist journey session state:", error);
    }
    setOpen(true);
  };

  const dismiss = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
      window.sessionStorage.setItem(SESSION_SEEN_KEY, "true");
    } catch (error) {
      console.error("Failed to persist journey dismissal:", error);
    }
    setOpen(false);
  };

  return (
    <>
      <div className={variant === "compact" ? "" : "mx-auto max-w-6xl px-6 lg:px-8"}>
        <div className={`overflow-hidden rounded-[28px] border border-[color:var(--border)] bg-[linear-gradient(135deg,_color-mix(in_srgb,var(--surface)_92%,transparent),_color-mix(in_srgb,var(--accent-200)_55%,transparent))] shadow-soft ${variant === "compact" ? "p-5" : "p-6 md:p-8"}`}>
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">Seeker Journey Hub</p>
              <h2 className="mt-3 text-2xl font-semibold text-[color:var(--ink)] md:text-3xl">
                Not sure where to begin? We can guide you gently.
              </h2>
              <p className="mt-3 text-base leading-7 text-[color:var(--muted)]">
                Answer three simple questions and we will suggest the best meditation page, nearby center, and upcoming events for you.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={openModal}
                className="inline-flex items-center justify-center rounded-full bg-[color:var(--primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[color:var(--primary-600)]"
              >
                Help me choose my path
              </button>
              {/* <Link
                href={`/start-your-journey?source=${encodeURIComponent(sourcePage)}`}
                className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] px-6 py-3 text-sm font-semibold text-[color:var(--ink)] transition-colors hover:bg-[color:var(--surface-2)]"
              >
                Open full journey
              </Link> */}
            </div>
          </div>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[70] flex items-end bg-[rgba(23,20,18,0.46)] p-4 sm:items-center sm:justify-center">
          <div className="w-full max-w-xl overflow-hidden rounded-[30px] border border-[color:var(--border)] bg-[color:var(--surface)] shadow-[0_28px_80px_rgba(0,0,0,0.18)]">
            <div className="border-b border-[color:var(--border)] bg-[linear-gradient(180deg,_color-mix(in_srgb,var(--surface-2)_94%,transparent),_color-mix(in_srgb,var(--accent-200)_35%,transparent))] px-6 py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">A calmer way to begin</p>
              <h3 className="mt-2 text-2xl font-semibold text-[color:var(--ink)]">We will help you find the right first step.</h3>
            </div>
            <div className="px-6 py-6">
              <p className="text-base leading-7 text-[color:var(--muted)]">
                This takes less than a minute. We will ask whether you are new to meditation, whether you prefer in-person or online guidance, and which city you are in.
              </p>
              <div className="mt-5 grid gap-3 rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-2)]/70 p-4 text-sm text-[color:var(--muted)]">
                <p>1. Beginner-friendly guidance tailored to your comfort level</p>
                <p>2. A nearby Sahaja Yoga center when it fits</p>
                <p>3. Upcoming events and a gentle support handoff if you want help</p>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/start-your-journey?source=${encodeURIComponent(sourcePage)}`}
                  className="inline-flex items-center justify-center rounded-full bg-[color:var(--primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[color:var(--primary-600)]"
                >
                  Start my journey
                </Link>
                <button
                  type="button"
                  onClick={dismiss}
                  className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] px-6 py-3 text-sm font-semibold text-[color:var(--ink)] transition-colors hover:bg-[color:var(--surface-2)]"
                >
                  Explore on my own
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
