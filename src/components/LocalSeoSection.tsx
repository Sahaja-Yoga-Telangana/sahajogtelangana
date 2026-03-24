import Link from 'next/link';

export default function LocalSeoSection() {
  return (
    <section className="bg-[color:var(--surface)] py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-[color:var(--ink)]">
            Free Meditation Classes in Hyderabad, Telangana
          </h2>
          <p className="mt-4 text-lg text-[color:var(--muted)] max-w-3xl mx-auto">
            Looking for meditation in Hyderabad? Sahaja Yoga Telangana offers free, beginner-friendly
            meditation classes and guided sessions across Hyderabad and nearby cities. Join local
            centers to experience self-realization, inner peace, and a balanced mind.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/meditation-hyderabad"
              className="inline-flex items-center justify-center rounded-full bg-[color:var(--primary)] px-6 py-3 text-white font-semibold hover:bg-[color:var(--primary-600)] transition-colors"
            >
              Meditation in Hyderabad
            </Link>
            <Link
              href="/centers"
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] px-6 py-3 text-[color:var(--ink)] font-semibold hover:bg-[color:var(--surface-2)] transition-colors"
            >
              Find a Center
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
