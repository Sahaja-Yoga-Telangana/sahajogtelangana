'use client';

import React from 'react';
import Link from 'next/link';
import SectionTitle from './SectionTitle';
import Reveal from '@/components/motion/Reveal';
import { useTranslations } from '@/app/provider/localeProvider';

const VirtualTour = () => {
  const t = useTranslations();

  return (
    <section id="VirtualTour" className="py-[clamp(72px,9vh,104px)] bg-[color:var(--surface-2)]">
      <div className="mx-auto max-w-[1200px] px-[var(--gutter)]">
        <SectionTitle
          title={t('virtual.title')}
          eyebrow={t('virtual.eyebrow')}
        />

        <Reveal delay={120}>
          <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[color:var(--border)] bg-[color:var(--surface)] p-3 shadow-panel md:p-5">
            <div className="relative w-full overflow-hidden rounded-[var(--radius-lg)] bg-[color:var(--surface-3)] pb-[56.25%]">
              <iframe
                src="https://www.youtube.com/embed/wIfjGQDAcdI?si=VpyUB-iWskYTRaJq"
                title="Virtual Tour of Sahaja Yoga Center"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 h-full w-full"
              ></iframe>
            </div>

            <div className="flex justify-center py-6">
              <Link href="/meditate" className="btn btn-primary btn-icon-shift">
                {t('virtual.learn_more')}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default VirtualTour;
