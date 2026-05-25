"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "@/app/provider/localeProvider";

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
  const t = useTranslations();
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
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">{t('journey_hub.eyebrow')}</p>
              <h2 className="mt-3 text-2xl font-semibold text-[color:var(--ink)] md:text-3xl">
                {t('journey_hub.title')}
              </h2>
              <p className="mt-3 text-base leading-7 text-[color:var(--muted)]">
                {t('journey_hub.desc')}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={openModal}
                className="inline-flex items-center justify-center rounded-full bg-[color:var(--primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[color:var(--primary-600)]"
              >
                {t('journey_hub.cta')}
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
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(23,20,18,0.42)] p-3 sm:p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-[26px] border border-[color:var(--border)] bg-[color:var(--surface)] shadow-[0_24px_72px_rgba(0,0,0,0.16)]">
            <div className="border-b border-[color:var(--border)] bg-[linear-gradient(180deg,_color-mix(in_srgb,var(--surface-2)_94%,transparent),_color-mix(in_srgb,var(--accent-200)_30%,transparent))] px-5 py-4 sm:px-6 sm:py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">{t('journey_hub.modal_eyebrow')}</p>
              <h3 className="mt-2 text-2xl font-semibold leading-tight text-[color:var(--ink)] sm:text-[2rem]">{t('journey_hub.modal_title')}</h3>
            </div>
            <div className="px-5 py-5 sm:px-6 sm:py-6">
              <p className="text-base leading-7 text-[color:var(--muted)] sm:text-lg sm:leading-8">
                {t('journey_hub.modal_desc')}
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row">
                <Link
                  href={`/start-your-journey?source=${encodeURIComponent(sourcePage)}`}
                  className="inline-flex items-center justify-center rounded-full bg-[color:var(--primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[color:var(--primary-600)]"
                >
                  {t('journey_hub.modal_start')}
                </Link>
                <button
                  type="button"
                  onClick={dismiss}
                  className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] px-6 py-3 text-sm font-semibold text-[color:var(--ink)] transition-colors hover:bg-[color:var(--surface-2)]"
                >
                  {t('journey_hub.modal_explore')}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
