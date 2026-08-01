'use client';

import { FEATURES } from '../../constants'
import Image from 'next/image'
import React from 'react'
import Reveal from '@/components/motion/Reveal'
import MaskedReveal from '@/components/motion/MaskedReveal'
import { useTranslations } from '@/app/provider/localeProvider';

const Features = () => {
  const t = useTranslations();
  const localizedFeatures = [
    { title: t('features.free_title'), description: t('features.free_body'), icon: FEATURES[0].icon },
    { title: t('features.transform_title'), description: t('features.transform_body'), icon: FEATURES[1].icon },
    { title: t('features.everyone_title'), description: t('features.everyone_body'), icon: FEATURES[2].icon },
    { title: t('features.benefits_title'), description: t('features.benefits_body'), icon: FEATURES[3].icon },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-[color:var(--surface)] py-[clamp(72px,9vh,104px)]">
      <div className="mx-auto max-w-[1200px] px-[var(--gutter)]">
        {/* Decorative elements */}
        <div className="pointer-events-none absolute left-10 top-12 hidden h-40 w-40 rounded-full bg-[color:var(--accent-200)]/40 blur-3xl lg:block"></div>
        <div className="pointer-events-none absolute bottom-12 right-10 hidden h-44 w-44 rounded-full bg-[color:var(--surface-3)]/60 blur-3xl lg:block"></div>

        {/* Title */}
        <div className="relative z-10 mb-14 text-center">
          <p className="eyebrow">{t('features.eyebrow')}</p>
          <MaskedReveal
            as="h2"
            delay={60}
            text={t('features.title')}
            className="mt-4 text-[clamp(28px,3.4vw,40px)] font-display leading-[1.15] tracking-[-0.015em] text-[color:var(--ink)]"
          />
          <div className="mt-5 flex items-center justify-center gap-2">
            <div className="h-[2px] w-16 bg-[color:var(--accent)]"></div>
            <div className="h-1.5 w-1.5 rotate-45 bg-[color:var(--accent)]"></div>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {localizedFeatures.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 80}>
              <div className="group flex h-full flex-col rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-panel md:p-7">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent-200),var(--surface-2))] border border-[color:var(--accent)]/30 transition-transform duration-300 group-hover:scale-105">
                  <Image src={feature.icon} alt={feature.title} width={26} height={26} className="opacity-80" />
                </div>
                <h3 className="mt-5 text-[19px] font-semibold leading-snug text-[color:var(--ink)]">
                  {feature.title}
                </h3>
                <p className="mt-3 text-[14.5px] leading-[1.7] text-[color:var(--muted)]">
                  {feature.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
