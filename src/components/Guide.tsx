'use client';

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Reveal from '@/components/motion/Reveal'
import MaskedReveal from '@/components/motion/MaskedReveal'
import CountUp from '@/components/motion/CountUp'
import { useTranslations } from '@/app/provider/localeProvider';

const Guide = () => {
  const t = useTranslations();

  return (
    <section className="py-[clamp(72px,9vh,104px)] bg-[color:var(--surface-2)]">
      <div className="mx-auto max-w-[1200px] px-[var(--gutter)]">
        {/* Shri Mataji */}
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal variant="scale" className="relative order-2 lg:order-1">
            <div className="pointer-events-none absolute -left-8 -top-8 h-40 w-40 rounded-full bg-[color:color-mix(in_srgb,var(--accent-200)_60%,transparent)] blur-3xl" />
            <div className="arch relative mx-auto h-[420px] w-[300px] overflow-hidden border border-[color:var(--border)] bg-[color:var(--surface)] shadow-panel md:h-[500px] md:w-[360px]">
              <Image
                src="/maaaa.jpg"
                alt="Shri Mataji"
                fill
                sizes="(max-width: 768px) 300px, 360px"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[color:color-mix(in_srgb,var(--primary-700)_25%,transparent)] via-transparent to-transparent" />
            </div>
            <div className="mx-auto -mt-2 flex h-12 w-36 items-center justify-center rounded-b-[20px] border border-t-0 border-[color:var(--border)] bg-[color:var(--surface)] shadow-card">
              <p className="eyebrow !tracking-[0.28em]">Shri Mataji</p>
            </div>
          </Reveal>

          <div className="order-1 lg:order-2">
            <p className="eyebrow">{t('guide.our_mother')}</p>
            <MaskedReveal
              as="h2"
              delay={60}
              text={t('guide.shri_mataji')}
              className="mt-4 text-[clamp(32px,4vw,44px)] font-display leading-[1.1] tracking-[-0.015em] text-[color:var(--ink)]"
            />
            <p className="mt-6 max-w-xl text-[17px] leading-[1.75] text-[color:var(--muted)]">
              {t('guide.shri_mataji_body')}
            </p>
            <Link href="/shri-mataji" className="btn btn-primary btn-icon-shift mt-8">
              {t('guide.know_more')}
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Corporate */}
        <div className="relative mt-24 overflow-hidden rounded-[var(--radius-xl)]">
          <div className="relative h-[420px] md:h-[380px]">
            <Image
              src="/corporate.jpg"
              alt="Corporate wellness and meditation"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[color:color-mix(in_srgb,var(--primary-700)_85%,transparent)] via-[color:color-mix(in_srgb,var(--primary-700)_60%,transparent)] to-[color:color-mix(in_srgb,var(--primary-700)_35%,transparent)]" />
          </div>

          {/* Overlapping content card */}
          <Reveal delay={120} className="relative z-10 -mt-36 mx-auto max-w-2xl px-4 md:-mt-32 md:px-0">
            <div className="rounded-[var(--radius-xl)] border border-[color:var(--border)] bg-[color:var(--surface)] p-7 shadow-pop md:p-10">
              <h2 className="text-[clamp(22px,2.6vw,30px)] font-display leading-[1.25] text-[color:var(--ink)]">
                {t('guide.corporate_title')}
              </h2>
              <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--muted)]">
                {t('guide.corporate_body')}
              </p>

              <div className="mt-7">
                <p className="eyebrow text-center">{t('guide.impact')}</p>
                <div className="mt-4 grid grid-cols-2 gap-5 sm:grid-cols-4">
                  {[
                    { label: t('guide.orgs'), value: 300, suffix: '+' },
                    { label: t('guide.employees'), value: 50, suffix: 'K+' },
                    { label: t('guide.countries'), value: 25, suffix: '+' },
                    { label: t('guide.years'), value: 30, suffix: '+' },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <CountUp
                        value={item.value}
                        suffix={item.suffix}
                        className="font-display text-[clamp(24px,2.6vw,32px)] font-medium text-[color:var(--ink)]"
                      />
                      <p className="mt-1 text-[12.5px] leading-snug text-[color:var(--muted)]">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <Link href="/corporate-register" className="btn btn-primary">
                  {t('guide.corporate_cta')}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default Guide
