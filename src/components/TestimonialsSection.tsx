'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from '@/app/provider/localeProvider';
import MaskedReveal from '@/components/motion/MaskedReveal';
import Reveal from '@/components/motion/Reveal';

type TestimonialCard = {
  _id: string;
  name: string;
  city?: string;
  yearsInSahajaYoga?: string;
  experience: string;
};

export default function TestimonialsSection({
  testimonials,
  isLoggedIn,
}: {
  testimonials: TestimonialCard[];
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const t = useTranslations();
  const [activeIndex, setActiveIndex] = useState(0);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    if (testimonials.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [testimonials.length]);

  const shareButton = (outline: boolean) => (
    <button
      type="button"
      onClick={() => (isLoggedIn ? router.push('/share-your-experience') : setShowLoginPrompt(true))}
      className={outline ? 'btn btn-secondary btn-sm' : 'btn btn-primary btn-sm'}
    >
      {t('testimonials.share')}
    </button>
  );

  if (testimonials.length === 0) {
    return (
      <section className="px-4 py-[clamp(72px,9vh,104px)] md:px-6">
        <Reveal className="mx-auto max-w-6xl rounded-[var(--radius-xl)] border border-[color:var(--border)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--surface)_92%,transparent),color-mix(in_srgb,var(--surface-2)_96%,transparent))] p-8 shadow-panel md:p-12">
          <p className="eyebrow">{t('testimonials.empty_eyebrow')}</p>
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-[clamp(28px,3.4vw,40px)] font-display leading-[1.15] text-[color:var(--ink)]">
                {t('testimonials.empty_title')}
              </h2>
              <p className="mt-4 text-[16px] leading-7 text-[color:var(--muted)]">
                {t('testimonials.empty_body')}
              </p>
            </div>
            {shareButton(false)}
          </div>
        </Reveal>
        {showLoginPrompt ? <LoginPrompt onClose={() => setShowLoginPrompt(false)} /> : null}
      </section>
    );
  }

  const active = testimonials[activeIndex];
  const sideCards = testimonials.filter((_, index) => index !== activeIndex).slice(0, 3);

  return (
    <section className="px-4 py-[clamp(72px,9vh,104px)] md:px-6">
      <div className="mx-auto max-w-6xl rounded-[var(--radius-xl)] border border-[color:var(--border)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--surface)_94%,transparent),color-mix(in_srgb,var(--surface-2)_92%,transparent))] p-6 shadow-panel md:p-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow">{t('testimonials.eyebrow')}</p>
            <MaskedReveal
              as="h2"
              delay={60}
              text={t('testimonials.title')}
              className="mt-4 text-[clamp(28px,3.4vw,40px)] font-display leading-[1.15] tracking-[-0.015em] text-[color:var(--ink)]"
            />
            <p className="mt-4 text-[16px] leading-7 text-[color:var(--muted)]">
              {t('testimonials.body')}
            </p>
          </div>
          {shareButton(true)}
        </div>

        <div className="mt-8 grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
          <Reveal>
            <article className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[color:var(--border)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface)_97%,transparent),color-mix(in_srgb,var(--surface-2)_95%,transparent))] p-6 shadow-panel md:p-8">
              <div className="absolute inset-x-0 top-0 h-[2px] bg-[linear-gradient(90deg,var(--accent),var(--primary),var(--accent))]" />
              <p className="font-display text-6xl leading-none text-[color:var(--accent)] select-none" aria-hidden>
                “
              </p>
              <p className="mt-4 text-[17px] leading-8 text-[color:var(--ink)] md:text-[18px]">
                {active.experience}
              </p>
              <div className="mt-8 flex flex-col gap-1 border-t border-[color:var(--border)] pt-5">
                <p className="text-[17px] font-semibold text-[color:var(--ink)]">{active.name}</p>
                <p className="text-sm text-[color:var(--muted)]">
                  {[active.city, active.yearsInSahajaYoga].filter(Boolean).join(' • ') || t('testimonials.default_name')}
                </p>
              </div>
            </article>
          </Reveal>

          <div className="grid gap-4">
            {sideCards.map((testimonial, index) => (
              <Reveal key={testimonial._id} delay={120 + index * 80}>
                <button
                  type="button"
                  onClick={() => setActiveIndex(testimonials.findIndex((item) => item._id === testimonial._id))}
                  className="w-full rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)]/92 p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:bg-[color:var(--surface)] hover:shadow-panel"
                >
                  <p className="line-clamp-4 text-[14.5px] leading-7 text-[color:var(--muted)]">{testimonial.experience}</p>
                  <div className="mt-4">
                    <p className="font-semibold text-[color:var(--ink)]">{testimonial.name}</p>
                    <p className="mt-0.5 text-[11px] uppercase tracking-[0.2em] text-[color:var(--muted)]">
                      {t('testimonials.story')} {index + 1}
                    </p>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {testimonials.map((testimonial, index) => (
              <button
                key={testimonial._id}
                type="button"
                aria-label={`Show testimonial ${index + 1}`}
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === activeIndex ? 'w-8 bg-[color:var(--accent)]' : 'w-2.5 bg-[color:var(--border-strong)] hover:bg-[color:var(--accent)]/50'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous testimonial"
              onClick={() => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--ink)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Next testimonial"
              onClick={() => setActiveIndex((prev) => (prev + 1) % testimonials.length)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--ink)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {showLoginPrompt ? <LoginPrompt onClose={() => setShowLoginPrompt(false)} /> : null}
    </section>
  );
}

function LoginPrompt({ onClose }: { onClose: () => void }) {
  const t = useTranslations();

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[color:var(--primary-700)]/45 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[var(--radius-xl)] border border-[color:var(--border)] bg-[color:var(--surface)] p-7 shadow-pop">
        <p className="eyebrow">{t('testimonials.login_required')}</p>
        <h3 className="mt-3 text-2xl font-display text-[color:var(--ink)]">{t('testimonials.login_title')}</h3>
        <p className="mt-3 text-[15px] leading-7 text-[color:var(--muted)]">
          {t('testimonials.login_body')}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login?callbackUrl=/share-your-experience"
            className="btn btn-primary flex-1"
          >
            {t('testimonials.log_in')}
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary flex-1"
          >
            {t('testimonials.maybe_later')}
          </button>
        </div>
      </div>
    </div>
  );
}
