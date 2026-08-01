'use client';

import React from 'react';
import Reveal from '@/components/motion/Reveal';
import SectionTitle from './SectionTitle';
import { useTranslations } from '@/app/provider/localeProvider';

const BOOKLETS = [
  { lang: 'Hindi', file: 'hindi-booklet.pdf', glyph: 'अ' },
  { lang: 'English', file: 'eng-booklet.pdf', glyph: 'A' },
  { lang: 'Telugu', file: 'telugu-booklet.pdf', glyph: 'అ' },
];

const IntroButton = () => {
  const t = useTranslations();

  const downloadPDF = (filename: string) => {
    const link = document.createElement('a');
    link.href = `/${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="py-[clamp(64px,8vh,96px)]">
      <div className="mx-auto max-w-[1200px] px-[var(--gutter)]">
        <SectionTitle
          title={t('intro.title')}
          eyebrow={t('intro.eyebrow')}
          body={t('intro.body')}
        />

        <div className="mx-auto grid max-w-3xl gap-5 sm:grid-cols-3">
          {BOOKLETS.map((booklet, index) => (
            <Reveal key={booklet.lang} delay={index * 90}>
              <button
                type="button"
                onClick={() => downloadPDF(booklet.file)}
                className="group flex w-full flex-col items-center gap-4 rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] p-7 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-panel"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--accent-200)] font-display text-2xl text-[color:var(--primary-700)] transition-transform duration-300 group-hover:scale-105">
                  {booklet.glyph}
                </span>
                <span>
                  <span className="block text-[17px] font-semibold text-[color:var(--ink)]">
                    {booklet.lang}
                  </span>
                  <span className="mt-1 inline-flex items-center gap-1.5 text-[14px] text-[color:var(--muted)] transition-colors group-hover:text-[color:var(--primary)]">
                    PDF
                    <svg className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0 0l-4-4m4 4l4-4" />
                    </svg>
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IntroButton;
