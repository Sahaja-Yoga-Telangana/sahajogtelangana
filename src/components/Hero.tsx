'use client';

import Image from 'next/image'
import { useTranslations } from '@/app/provider/localeProvider';

const Hero = () => {
  const t = useTranslations();

  return (
    <section className="relative w-full overflow-hidden bg-[color:var(--surface)]">
      <div className="absolute inset-0" />
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-24 relative">
        <div className="flex flex-col lg:flex-row items-center gap-12">

          {/* Left Content */}
          <div className="z-10 w-full lg:w-1/2 space-y-6">
            <p className="text-base uppercase tracking-[0.3em] text-[color:var(--muted)]">
              {t('hero.eyebrow')}
            </p>
            <h1 className="text-4xl md:text-6xl font-semibold leading-tight text-[color:var(--ink)]">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-[color:var(--muted)] leading-relaxed">
              {t('hero.body')}
            </p>

            <blockquote className="border-l-2 border-[color:var(--accent)] pl-4 text-base md:text-lg text-[color:var(--muted)]">
              “{t('hero.quote')}”
              <footer className="mt-2 text-base text-[color:var(--muted)]">— {t('hero.quote_author')}</footer>
            </blockquote>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a
                href="#VirtualTour"
                className="inline-flex items-center justify-center rounded-full bg-[color:var(--primary)] px-6 py-3 text-white font-semibold shadow-soft hover:bg-[color:var(--primary-600)] transition-colors"
              >
                {t('hero.start')}
              </a>
              <a
                href="/centers"
                className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] px-6 py-3 text-[color:var(--ink)] font-semibold hover:bg-[color:var(--surface-2)] transition-colors"
              >
                {t('hero.find_center')}
              </a>
            </div>
          </div>

          {/* Right Image */}
          <div className="w-full lg:w-1/2 flex justify-center relative">
            <div className="relative w-72 h-80 md:w-96 md:h-[430px] rounded-[32px] overflow-hidden shadow-soft border border-[color:var(--border)] bg-[color:var(--surface-2)]">
              <Image
                src="/Shri-Mataji-Nirmala-Devi-Lane-Cove-Sydney-X4.jpg"
                alt="Shri Mataji Nirmala Devi"
                fill
                className="object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Hero
