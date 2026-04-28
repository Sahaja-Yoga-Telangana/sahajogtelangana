'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight, FiCalendar, FiMapPin } from 'react-icons/fi';
import { useLocale, useTranslations } from '@/app/provider/localeProvider';
import { AppEvent, getEventDateLabel, getEventExcerpt } from '@/lib/events';

export default function EventCard({
  event,
  ctaLabel,
  href,
}: {
  event: AppEvent;
  ctaLabel?: string;
  href?: string;
}) {
  const { locale } = useLocale();
  const t = useTranslations();
  const targetHref = href ?? `/register-event/${event._id}`;
  const hasRemoteImage = !!event.image && /^https?:\/\//.test(event.image);
  const isFreeEntry =
    (event.priceBelow12 ?? 1000) === 0 &&
    (event.price12To24 ?? 1800) === 0 &&
    (event.price25AndAbove ?? 2600) === 0;

  return (
    <Link
      href={targetHref}
      className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(16,16,16,0.12)]"
    >
      <div className="relative h-56 overflow-hidden bg-[linear-gradient(160deg,_color-mix(in_srgb,var(--accent-200)_72%,transparent),_color-mix(in_srgb,var(--surface-2)_86%,transparent),_color-mix(in_srgb,var(--surface)_88%,transparent))]">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.title}
            width={960}
            height={720}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized={hasRemoteImage}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface)]/80 px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--primary)]">
              {t('events.badge')}
            </div>
          </div>
        )}
        {/* {isFreeEntry ? (
          <div className="absolute left-4 top-4 z-10 inline-flex items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)]/96 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--primary)] shadow-[0_10px_24px_rgba(0,0,0,0.18)] backdrop-blur-sm">
            Free Entry
          </div>
        ) : null} */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[color:var(--surface)]/35 to-transparent" />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-3 text-sm text-[color:var(--muted)]">
          <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--surface-2)] px-3 py-1.5">
            <FiCalendar className="h-4 w-4" aria-hidden="true" />
            <span className="numeric-font">{getEventDateLabel(event.date, event.endDate, locale)}</span>
          </span>
          <span className="numeric-font inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] px-3 py-1.5">
            {event.time}
          </span>
        </div>

        <h3 className="mt-5 text-2xl font-semibold tracking-tight text-[color:var(--ink)]">{event.title}</h3>
        <p className="mt-3 text-sm leading-7 text-[color:var(--muted)] md:text-base">{getEventExcerpt(event.description, 150)}</p>

        <div className="mt-5 flex items-center gap-2 text-sm leading-7 text-[color:var(--muted)] md:text-base">
          <FiMapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{event.location}</span>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-[color:var(--primary)] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-300 group-hover:bg-[color:var(--primary-600)]">
            {ctaLabel || t('events.register')}
          </span>
          <FiArrowRight className="h-5 w-5 text-[color:var(--primary)] transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </div>
      </div>
    </Link>
  );
}
