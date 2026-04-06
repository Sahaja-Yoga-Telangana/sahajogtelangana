'use client';

import Link from 'next/link';
import { useTranslations } from '@/app/provider/localeProvider';

export default function LocalSeoSection() {
  const t = useTranslations();

  return (
    <section className="bg-[color:var(--surface)] py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-[color:var(--ink)]">
            {t('local_seo.title')}
          </h2>
          <p className="mt-4 text-lg text-[color:var(--muted)] max-w-3xl mx-auto">
            {t('local_seo.body')}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/meditation-hyderabad"
              className="inline-flex items-center justify-center rounded-full bg-[color:var(--primary)] px-6 py-3 text-white font-semibold hover:bg-[color:var(--primary-600)] transition-colors"
            >
              {t('local_seo.cta_primary')}
            </Link>
            <Link
              href="/centers"
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] px-6 py-3 text-[color:var(--ink)] font-semibold hover:bg-[color:var(--surface-2)] transition-colors"
            >
              {t('local_seo.cta_secondary')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
