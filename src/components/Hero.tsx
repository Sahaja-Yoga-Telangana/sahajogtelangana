'use client';

import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from '@/app/provider/localeProvider';
import MaskedReveal from '@/components/motion/MaskedReveal';
import Parallax from '@/components/motion/Parallax';

const Hero = () => {
  const t = useTranslations();

  return (
    <section className="relative w-full overflow-hidden wash-dawn">
      <div className="mx-auto max-w-[1200px] px-[var(--gutter)]">
        <div className="grid min-h-[88vh] max-lg:min-h-0 grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] py-[clamp(72px,10vh,120px)]">

          {/* Left Content */}
          <div className="relative z-10 space-y-7 max-lg:pt-2">
            <p className="eyebrow hero-anim" style={{ ['--hero-delay' as string]: '120ms' }}>
              {t('hero.eyebrow')}
            </p>

            <MaskedReveal
              as="h1"
              delay={240}
              text={t('hero.title')}
              className="text-[clamp(44px,5.2vw,68px)] font-display leading-[1.08] tracking-[-0.02em] text-[color:var(--ink)]"
            />

            <p className="max-w-xl text-[19px] leading-[1.7] text-[color:var(--muted)] hero-anim" style={{ ['--hero-delay' as string]: '560ms' }}>
              {t('hero.body')}
            </p>

            <blockquote className="max-w-xl hero-anim" style={{ ['--hero-delay' as string]: '660ms' }}>
              <span className="font-display text-5xl leading-none text-[color:var(--accent)] select-none">“</span>
              <p className="-mt-5 border-l-2 border-[color:var(--accent)] pl-5 text-[17px] italic leading-relaxed text-[color:var(--ink-soft)]">
                {t('hero.quote')}
              </p>
              <footer className="mt-3 pl-7 text-[14px] font-medium text-[color:var(--muted)]">
                — {t('hero.quote_author')}
              </footer>
            </blockquote>

            <div className="flex flex-col gap-4 pt-1 sm:flex-row hero-anim" style={{ ['--hero-delay' as string]: '780ms' }}>
              <Link
                href="#VirtualTour"
                className="btn btn-primary btn-lg"
              >
                {t('hero.start')}
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
                </svg>
              </Link>
              <Link
                href="/centers"
                className="btn btn-secondary btn-lg"
              >
                {t('hero.find_center')}
              </Link>
            </div>
          </div>

          {/* Right Image — temple arch */}
          <div className="relative flex justify-center lg:justify-end hero-anim-fade" style={{ ['--hero-delay' as string]: '760ms' }}>
            {/* Offset gold wash */}
            <div className="pointer-events-none absolute right-1/2 top-8 h-[420px] w-[320px] translate-x-1/2 rounded-full bg-[color:var(--accent-200)] blur-3xl lg:right-4 lg:translate-x-0" />

            {/* Thin orbit ring */}
            <div className="pointer-events-none absolute -right-6 top-12 hidden h-40 w-40 rounded-full border border-[color:var(--accent)]/40 lg:block" />

            <Parallax strength={18} className="relative">
              <div className="arch relative h-[440px] w-[330px] overflow-hidden border border-[color:var(--border)] bg-[color:var(--surface-2)] shadow-pop md:h-[520px] md:w-[390px]">
                <Image
                  src="/Shri-Mataji-Nirmala-Devi-Lane-Cove-Sydney-X4.jpg"
                  alt="Shri Mataji Nirmala Devi"
                  fill
                  priority
                  sizes="(max-width: 768px) 330px, 390px"
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[color:var(--primary-700)]/20 via-transparent to-transparent" />
              </div>
              {/* Arch base plaque */}
              <div className="mx-auto -mt-2 flex h-14 w-40 items-center justify-center rounded-b-[20px] border border-t-0 border-[color:var(--border)] bg-[color:var(--surface)] shadow-card">
                <p className="eyebrow !tracking-[0.3em]">Sahaja&nbsp;Yoga</p>
              </div>
            </Parallax>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
