'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
  const [activeIndex, setActiveIndex] = useState(0);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    if (testimonials.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [testimonials.length]);

  if (testimonials.length === 0) {
    return (
      <section className="px-4 py-16 md:px-6">
        <div className="mx-auto max-w-6xl rounded-[32px] border border-[color:var(--border)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--surface)_92%,transparent),color-mix(in_srgb,var(--surface-2)_96%,transparent))] p-8 shadow-soft md:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--muted)]">Already Practicing?</p>
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight text-[color:var(--ink)] md:text-4xl">You can share what Sahaja Yoga has meant in their lives.</h2>
              <p className="mt-4 text-sm leading-7 text-[color:var(--muted)] md:text-base">
                We have opened a dedicated space for authentic lived experiences. Logged-in yogis can share reflections that may be featured on the homepage.
              </p>
            </div>
            <button
              type="button"
              onClick={() => (isLoggedIn ? router.push('/share-your-experience') : setShowLoginPrompt(true))}
              className="inline-flex items-center justify-center rounded-full bg-[color:var(--primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[color:var(--primary-600)]"
            >
              Share your experience
            </button>
          </div>
        </div>
        {showLoginPrompt ? <LoginPrompt onClose={() => setShowLoginPrompt(false)} /> : null}
      </section>
    );
  }

  const active = testimonials[activeIndex];
  const sideCards = testimonials.filter((_, index) => index !== activeIndex).slice(0, 3);

  return (
    <section className="px-4 py-16 md:px-6">
      <div className="mx-auto max-w-6xl rounded-[36px] border border-[color:var(--border)] bg-[linear-gradient(135deg,rgba(255,248,242,0.98),rgba(255,255,255,0.94))] p-6 shadow-soft md:p-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--muted)]">Yogi Voices</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[color:var(--ink)] md:text-4xl">Real experiences from the collective.</h2>
            <p className="mt-4 text-sm leading-7 text-[color:var(--muted)] md:text-base">
              A rotating glimpse of how Sahaja Yoga is being lived and felt. Each refresh surfaces a different set of authentic experiences from yogis in the community.
            </p>
          </div>
          <button
            type="button"
            onClick={() => (isLoggedIn ? router.push('/share-your-experience') : setShowLoginPrompt(true))}
            className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-6 py-3 text-sm font-semibold text-[color:var(--ink)] transition-colors hover:bg-[color:var(--surface-2)]"
          >
            Share your experience
          </button>
        </div>

        <div className="mt-8 grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
          <article className="relative overflow-hidden rounded-[32px] border border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,241,234,0.98))] p-6 shadow-[0_24px_60px_rgba(98,72,49,0.12)] md:p-8">
            <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#b55d38,#d9a65d,#7ea07d)]" />
            <p className="text-5xl leading-none text-[color:var(--accent-200)]">“</p>
            <p className="mt-4 text-base leading-8 text-[color:var(--ink)] md:text-lg">
              {active.experience}
            </p>
            <div className="mt-8 flex flex-col gap-1 border-t border-[color:var(--border)] pt-5">
              <p className="text-lg font-semibold text-[color:var(--ink)]">{active.name}</p>
              <p className="text-sm text-[color:var(--muted)]">
                {[active.city, active.yearsInSahajaYoga].filter(Boolean).join(' • ') || 'Sahaja Yogi'}
              </p>
            </div>
          </article>

          <div className="grid gap-4">
            {sideCards.map((testimonial, index) => (
              <button
                key={testimonial._id}
                type="button"
                onClick={() => setActiveIndex(testimonials.findIndex((item) => item._id === testimonial._id))}
                className="rounded-[26px] border border-[color:var(--border)] bg-[color:var(--surface)]/92 p-5 text-left transition-all hover:-translate-y-0.5 hover:bg-[color:var(--surface)] hover:shadow-soft"
              >
                <p className="line-clamp-4 text-sm leading-7 text-[color:var(--muted)]">{testimonial.experience}</p>
                <div className="mt-4">
                  <p className="font-semibold text-[color:var(--ink)]">{testimonial.name}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">Story {index + 1}</p>
                </div>
              </button>
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
                className={`h-2.5 rounded-full transition-all ${index === activeIndex ? 'w-8 bg-[color:var(--primary)]' : 'w-2.5 bg-[color:var(--border)]'}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--ink)] transition-colors hover:bg-[color:var(--surface-2)]"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => setActiveIndex((prev) => (prev + 1) % testimonials.length)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--ink)] transition-colors hover:bg-[color:var(--surface-2)]"
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
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 px-4">
      <div className="w-full max-w-md rounded-[28px] border border-white/20 bg-[color:var(--surface)] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.24)]">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">Login Required</p>
        <h3 className="mt-3 text-2xl font-semibold text-[color:var(--ink)]">Please log in first to share your experience.</h3>
        <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
          This page is reserved for logged-in yogis so we can keep experiences authentic and tied to real community members.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login?callbackUrl=/share-your-experience"
            className="inline-flex flex-1 items-center justify-center rounded-full bg-[color:var(--primary)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[color:var(--primary-600)]"
          >
            Log in
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex flex-1 items-center justify-center rounded-full border border-[color:var(--border)] px-5 py-3 text-sm font-semibold text-[color:var(--ink)] transition-colors hover:bg-[color:var(--surface-2)]"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
