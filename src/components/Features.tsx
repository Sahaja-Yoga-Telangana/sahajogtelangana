'use client';

import { FEATURES } from '../../constants'
import React from 'react'
import Reveal from '@/components/motion/Reveal'
import MaskedReveal from '@/components/motion/MaskedReveal'
import { useTranslations } from '@/app/provider/localeProvider';

const FEATURE_ICONS: Record<string, React.ReactNode> = {
  '/free1.svg': (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M8 12.3333L10.4615 15L16 9M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  '/smile.svg': (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M8.4 13.8C8.4 13.8 9.75 15.6 12 15.6C14.25 15.6 15.6 13.8 15.6 13.8M14.7 9.3H14.709M9.3 9.3H9.309M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM15.15 9.3C15.15 9.54853 14.9485 9.75 14.7 9.75C14.4515 9.75 14.25 9.54853 14.25 9.3C14.25 9.05147 14.4515 8.85 14.7 8.85C14.9485 8.85 15.15 9.05147 15.15 9.3ZM9.75 9.3C9.75 9.54853 9.54853 9.75 9.3 9.75C9.05147 9.75 8.85 9.54853 8.85 9.3C8.85 9.05147 9.05147 8.85 9.3 8.85C9.54853 8.85 9.75 9.05147 9.75 9.3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  '/heart.svg': (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path fillRule="evenodd" clipRule="evenodd" d="M11.9973 9.33059C11.1975 8.4216 9.8639 8.17708 8.86188 9.00945C7.85986 9.84182 7.71879 11.2335 8.50568 12.2179C8.97361 12.8033 10.1197 13.8531 10.9719 14.6079C11.3237 14.9195 11.4996 15.0753 11.7114 15.1385C11.8925 15.1926 12.102 15.1926 12.2832 15.1385C12.4949 15.0753 12.6708 14.9195 13.0226 14.6079C13.8748 13.8531 15.0209 12.8033 15.4888 12.2179C16.2757 11.2335 16.1519 9.83306 15.1326 9.00945C14.1134 8.18584 12.797 8.4216 11.9973 9.33059Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  '/sparkle.svg': (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M5 16V20M6 4V8M7 18H3M8 6H4M13 4L14.7528 8.44437C14.9407 8.92083 15.0347 9.15906 15.1786 9.35994C15.3061 9.538 15.462 9.69391 15.6401 9.82143C15.8409 9.9653 16.0792 10.0593 16.5556 10.2472L21 12L16.5556 13.7528C16.0792 13.9407 15.8409 14.0347 15.6401 14.1786C15.462 14.3061 15.3061 14.462 15.1786 14.6401C15.0347 14.8409 14.9407 15.0792 14.7528 15.5556L13 20L11.2472 15.5556C11.0593 15.0792 10.9653 14.8409 10.8214 14.6401C10.6939 14.462 10.538 14.3061 10.3599 14.1786C10.1591 14.0347 9.92083 13.9407 9.44437 13.7528L5 12L9.44437 10.2472C9.92083 10.0593 10.1591 9.9653 10.3599 9.82143C10.538 9.69391 10.6939 9.538 10.8214 9.35994C10.9653 9.15906 11.0593 8.92083 11.2472 8.44437L13 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

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
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[color:var(--accent)]/30 bg-[linear-gradient(135deg,var(--accent-200),var(--surface-2))] text-[color:var(--primary)] transition-transform duration-300 group-hover:scale-105 dark:text-[color:var(--accent)]">
                  <span className="block h-[26px] w-[26px] [&_svg]:h-full [&_svg]:w-full">{FEATURE_ICONS[feature.icon]}</span>
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
