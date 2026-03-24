import type { Metadata } from 'next';
import Link from 'next/link';
import { pageMetadata, absoluteUrl } from '@/lib/seo';
import SeoJsonLd from '@/components/SeoJsonLd';

export const metadata: Metadata = pageMetadata({
  title: 'Meditation in Hyderabad — Free Sahaja Yoga Classes',
  description: 'Join free Sahaja Yoga meditation classes in Hyderabad, Telangana. Find nearby centers, upcoming sessions, and guided meditation programs for beginners.',
  path: '/meditation-hyderabad',
  keywords: [
    'meditation in Hyderabad',
    'free meditation classes in Hyderabad',
    'Sahaja Yoga Hyderabad',
    'yoga classes Hyderabad',
    'guided meditation Hyderabad',
    'meditation centers Hyderabad',
  ],
});

export default function MeditationHyderabadPage() {
  return (
    <main className="bg-[color:var(--bg)] py-16">
      <SeoJsonLd
        json={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Meditation in Hyderabad — Free Sahaja Yoga Classes',
          url: absoluteUrl('/meditation-hyderabad'),
          about: {
            '@type': 'Thing',
            name: 'Sahaja Yoga Meditation',
          },
          mainEntity: {
            '@type': 'Service',
            serviceType: 'Meditation classes',
            name: 'Free Sahaja Yoga Meditation Classes in Hyderabad',
            areaServed: ['Hyderabad', 'Telangana'],
            provider: {
              '@type': 'Organization',
              name: 'Sahaja Yoga Telangana',
              url: absoluteUrl('/'),
            },
          },
        }}
      />

      <section className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-semibold text-[color:var(--ink)]">
          Meditation in Hyderabad
        </h1>
        <p className="mt-6 text-lg text-[color:var(--muted)] max-w-3xl">
          Sahaja Yoga Telangana offers free, beginner-friendly meditation classes in Hyderabad.
          Our guided sessions help you experience inner silence, balance, and self-realization.
          Join local centers across the city or connect with us to find the nearest session.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            href="/centers"
            className="inline-flex items-center justify-center rounded-full bg-[color:var(--primary)] px-6 py-3 text-white font-semibold hover:bg-[color:var(--primary-600)] transition-colors"
          >
            Find Centers in Hyderabad
          </Link>
          <Link
            href="/contact-us"
            className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] px-6 py-3 text-[color:var(--ink)] font-semibold hover:bg-[color:var(--surface-2)] transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 mt-14 grid md:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-[color:var(--surface)] border border-[color:var(--border)] shadow-soft p-6">
          <h2 className="text-xl font-semibold text-[color:var(--ink)]">Free Meditation Classes</h2>
          <p className="mt-3 text-[color:var(--muted)]">
            Sahaja Yoga classes are always free. Sessions are led by experienced volunteers and are
            suitable for beginners and families.
          </p>
        </div>
        <div className="rounded-2xl bg-[color:var(--surface)] border border-[color:var(--border)] shadow-soft p-6">
          <h2 className="text-xl font-semibold text-[color:var(--ink)]">Local Centers</h2>
          <p className="mt-3 text-[color:var(--muted)]">
            Join weekly meditation sessions at centers across Hyderabad and nearby cities in Telangana.
            We offer calm, welcoming spaces for guided practice.
          </p>
        </div>
        <div className="rounded-2xl bg-[color:var(--surface)] border border-[color:var(--border)] shadow-soft p-6">
          <h2 className="text-xl font-semibold text-[color:var(--ink)]">Guided Experience</h2>
          <p className="mt-3 text-[color:var(--muted)]">
            Learn simple techniques for self-realization, stress relief, and inner balance with a guided
            meditation experience.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 mt-14">
        <h2 className="text-2xl md:text-3xl font-semibold text-[color:var(--ink)]">
          Frequently Asked Questions
        </h2>
        <div className="mt-6 space-y-4 text-[color:var(--muted)]">
          <div>
            <h3 className="font-semibold">Are Sahaja Yoga classes in Hyderabad free?</h3>
            <p className="mt-1">Yes. Sahaja Yoga meditation classes are offered free of cost in Hyderabad.</p>
          </div>
          <div>
            <h3 className="font-semibold">Do I need prior experience?</h3>
            <p className="mt-1">No. Sessions are beginner-friendly and guided step by step.</p>
          </div>
          <div>
            <h3 className="font-semibold">How do I find the nearest meditation center?</h3>
            <p className="mt-1">
              Visit the <Link href="/centers" className="text-[color:var(--primary)] underline">Centers</Link> page for locations,
              schedules, and contact information.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
