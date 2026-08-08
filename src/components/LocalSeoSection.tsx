'use client';

import Link from 'next/link';
import { useTranslations } from '@/app/provider/localeProvider';
import Marquee from '@/components/motion/Marquee';
import Reveal from '@/components/motion/Reveal';
import { INDIAN_CITIES } from '@/data/indian-districts';

const TELANGANA_CITIES = INDIAN_CITIES.filter((c) => c.state === 'Telangana').map((c) => c.name);

export default function LocalSeoSection() {
  const t = useTranslations();

  const cities = TELANGANA_CITIES.length > 0 ? TELANGANA_CITIES : ['Hyderabad', 'Secunderabad', 'Warangal'];

  return (
    <section className="bg-[color:var(--surface)] overflow-hidden">
      {/* City marquee */}
      <div className="border-y border-[color:var(--border)] py-4">
        <Marquee
          items={cities.map((city, i) => (
            <span key={city} className="flex items-center gap-6">
              <span className="text-[15px] font-medium tracking-[0.14em] uppercase text-[color:var(--muted)]">
                {city}
              </span>
              <span className="h-1.5 w-1.5 rotate-45 bg-[color:var(--accent)]" aria-hidden />
              {i === cities.length - 1 ? null : null}
            </span>
          ))}
          speed="36s"
        />
      </div>

      <div className="mx-auto max-w-[1200px] px-[var(--gutter)]">
        <Reveal className="mx-auto max-w-3xl py-[clamp(64px,8vh,96px)] text-center">
          <p className="eyebrow">{t('local_seo.eyebrow')}</p>
          <h2 className="mt-4 text-[clamp(28px,3.4vw,40px)] font-display leading-[1.15] tracking-[-0.015em] text-[color:var(--ink)]">
            {t('local_seo.title')}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[17px] leading-[1.7] text-[color:var(--muted)]">
            {t('local_seo.body')}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/meditation-hyderabad" className="btn btn-primary">
              {t('local_seo.cta_primary')}
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
              </svg>
            </Link>
            <Link href="/centers" className="btn btn-secondary">
              {t('local_seo.cta_secondary')}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
