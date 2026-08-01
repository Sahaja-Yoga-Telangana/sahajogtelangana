import type { Metadata } from 'next';
import Link from 'next/link';
import { pageMetadata, absoluteUrl } from '@/lib/seo';
import SeoJsonLd from '@/components/SeoJsonLd';
import { getRequestLocale } from '@/lib/serverLocale';

const content = {
  en: {
    seoName: 'Meditation in Hyderabad — Free Sahaja Yoga Classes',
    heroTitle: 'Meditation in Hyderabad',
    heroBody:
      'Sahaja Yoga Telangana offers free, beginner-friendly meditation classes in Hyderabad. Our guided sessions help you experience inner silence, balance, and self-realization. Join local centers across the city or connect with us to find the nearest session.',
    ctaPrimary: 'Find Centers in Hyderabad',
    ctaSecondary: 'Contact Us',
    cards: [
      ['Free Meditation Classes', 'Sahaja Yoga classes are always free. Sessions are led by experienced volunteers and are suitable for beginners and families.'],
      ['Local Centers', 'Join weekly meditation sessions at centers across Hyderabad and nearby cities in Telangana. We offer calm, welcoming spaces for guided practice.'],
      ['Guided Experience', 'Learn simple techniques for self-realization, stress relief, and inner balance with a guided meditation experience.'],
    ],
    faqTitle: 'Frequently Asked Questions',
    exploreTitle: 'Plan your next step',
    exploreLinks: [
      ['Browse Hyderabad centers', '/centers'],
      ['Learn the meditation basics', '/meditate'],
      ['See upcoming collective events', '/events'],
      ['Contact Sahaja Yoga Telangana', '/contact-us'],
    ],
    faqs: [
      ['Are Sahaja Yoga classes in Hyderabad free?', 'Yes. Sahaja Yoga meditation classes are offered free of cost in Hyderabad.'],
      ['Do I need prior experience?', 'No. Sessions are beginner-friendly and guided step by step.'],
      ['How do I find the nearest meditation center?', 'Visit the Centers page for locations, schedules, and contact information.'],
    ],
  },
  te: {
    seoName: 'హైదరాబాద్‌లో ధ్యానం — ఉచిత సహజ యోగ తరగతులు',
    heroTitle: 'హైదరాబాద్‌లో ధ్యానం',
    heroBody:
      'సహజ యోగ తెలంగాణ హైదరాబాద్‌లో ఉచిత, ప్రారంభికులకు అనుకూలమైన ధ్యాన తరగతులను అందిస్తోంది. మా మార్గదర్శిత సెషన్లు అంతర నిశ్శబ్దం, సమతుల్యత, స్వీయ సాక్షాత్కారాన్ని అనుభవించేందుకు సహాయపడతాయి. నగరమంతా ఉన్న కేంద్రాలలో చేరండి లేదా మీకు దగ్గరలోని సెషన్ కోసం మమ్మల్ని సంప్రదించండి.',
    ctaPrimary: 'హైదరాబాద్‌లో కేంద్రాలను కనుగొనండి',
    ctaSecondary: 'మమ్మల్ని సంప్రదించండి',
    cards: [
      ['ఉచిత ధ్యాన తరగతులు', 'సహజ యోగ తరగతులు ఎల్లప్పుడూ ఉచితం. అనుభవజ్ఞులైన వాలంటీర్లు ఈ సెషన్లను నడిపిస్తారు; ఇవి ప్రారంభికులు మరియు కుటుంబాలకు అనువైనవి.'],
      ['స్థానిక కేంద్రాలు', 'హైదరాబాద్ మరియు తెలంగాణ సమీప ప్రాంతాలలో జరిగే వారాంత ధ్యాన సెషన్లలో చేరండి. మేము ప్రశాంతమైన, ఆహ్వానించే వాతావరణాన్ని అందిస్తున్నాము.'],
      ['మార్గదర్శిత అనుభవం', 'స్వీయ సాక్షాత్కారం, ఒత్తిడి ఉపశమనం, అంతర సమతుల్యత కోసం సరళమైన పద్ధతులను మార్గదర్శిత ధ్యానం ద్వారా నేర్చుకోండి.'],
    ],
    faqTitle: 'తరచుగా అడిగే ప్రశ్నలు',
    exploreTitle: 'మీ తదుపరి అడుగు ప్రణాళిక చేసుకోండి',
    exploreLinks: [
      ['హైదరాబాద్ కేంద్రాలను చూడండి', '/centers'],
      ['ధ్యానపు ప్రాథమికాలు నేర్చుకోండి', '/meditate'],
      ['రాబోయే కార్యక్రమాలు చూడండి', '/events'],
      ['సహజ యోగ తెలంగాణను సంప్రదించండి', '/contact-us'],
    ],
    faqs: [
      ['హైదరాబాద్‌లో సహజ యోగ తరగతులు ఉచితమేనా?', 'అవును. హైదరాబాద్‌లో సహజ యోగ ధ్యాన తరగతులు పూర్తిగా ఉచితంగా అందించబడుతున్నాయి.'],
      ['నాకు ముందస్తు అనుభవం అవసరమా?', 'లేదు. ఈ సెషన్లు ప్రారంభికులకు అనువుగా ఉండి దశలవారీగా మార్గదర్శనం చేస్తాయి.'],
      ['నా దగ్గరలోని ధ్యాన కేంద్రాన్ని ఎలా కనుగొనాలి?', 'స్థలాలు, సమయాలు, సంప్రదింపు వివరాల కోసం Centers పేజీని సందర్శించండి.'],
    ],
  },
} as const;

export const metadata: Metadata = pageMetadata({
  title: 'Meditation in Hyderabad — Free Sahaja Yoga Classes',
  description: 'Join free Sahaja Yoga meditation classes in Hyderabad, Telangana. Find nearby centers, upcoming sessions, and guided meditation programs for beginners.',
  path: '/meditation-hyderabad',
});

export default function MeditationHyderabadPage() {
  const locale = getRequestLocale();
  const copy = content[locale];

  return (
    <main className="bg-[color:var(--bg)] py-16">
      <SeoJsonLd
        json={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: copy.seoName,
            url: absoluteUrl('/meditation-hyderabad'),
            about: {
              '@type': 'Thing',
              name: 'Sahaja Yoga Meditation',
            },
            mainEntity: {
              '@type': 'Service',
              serviceType: 'Meditation classes',
              name: copy.seoName,
              areaServed: ['Hyderabad', 'Telangana'],
              provider: {
                '@type': 'Organization',
                name: 'Sahaja Yoga Telangana',
                url: absoluteUrl('/'),
              },
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: copy.faqs.map(([question, answer]) => ({
              '@type': 'Question',
              name: question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: answer,
              },
            })),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
              { '@type': 'ListItem', position: 2, name: 'Meditation in Hyderabad', item: absoluteUrl('/meditation-hyderabad') },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: 'Sahaja Yoga Telangana',
            url: absoluteUrl('/'),
            areaServed: ['Hyderabad', 'Telangana'],
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Hyderabad',
              addressRegion: 'Telangana',
              addressCountry: 'IN',
            },
          },
        ]}
      />

      <section className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-semibold text-[color:var(--ink)]">{copy.heroTitle}</h1>
        <p className="mt-6 text-lg text-[color:var(--muted)] max-w-3xl">{copy.heroBody}</p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link href="/centers" className="inline-flex items-center justify-center rounded-full bg-[color:var(--primary)] px-6 py-3 text-white font-semibold hover:bg-[color:var(--primary-600)] transition-colors">
            {copy.ctaPrimary}
          </Link>
          <Link href="/contact-us" className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] px-6 py-3 text-[color:var(--ink)] font-semibold hover:bg-[color:var(--surface-2)] transition-colors">
            {copy.ctaSecondary}
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 mt-14 grid md:grid-cols-3 gap-6">
        {copy.cards.map(([title, body]) => (
          <div key={title} className="rounded-2xl bg-[color:var(--surface)] border border-[color:var(--border)] shadow-soft p-6">
            <h2 className="text-xl font-semibold text-[color:var(--ink)]">{title}</h2>
            <p className="mt-3 text-[color:var(--muted)]">{body}</p>
          </div>
        ))}
      </section>

      <section className="max-w-5xl mx-auto px-6 mt-14">
        <h2 className="font-display text-[clamp(24px,2.8vw,32px)] font-medium leading-[1.2] tracking-[-0.01em] text-[color:var(--ink)]">{copy.faqTitle}</h2>
        <div className="mt-6 space-y-4 text-[color:var(--muted)]">
          {copy.faqs.map(([question, answer], index) => (
            <div key={question}>
              <h3 className="font-semibold">{question}</h3>
              <p className="mt-1">
                {index === 2 ? (
                  <>
                    {locale === 'te' ? 'స్థలాలు, సమయాలు, సంప్రదింపు వివరాల కోసం ' : 'Visit the '}
                    <Link href="/centers" className="text-[color:var(--primary)] underline">Centers</Link>
                    {locale === 'te' ? ' పేజీని సందర్శించండి.' : ' page for locations, schedules, and contact information.'}
                  </>
                ) : answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 mt-14">
        <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-soft">
          <h2 className="font-display text-[clamp(24px,2.8vw,32px)] font-medium leading-[1.2] tracking-[-0.01em] text-[color:var(--ink)]">{copy.exploreTitle}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {copy.exploreLinks.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] px-5 py-3 text-center font-semibold text-[color:var(--ink)] transition-colors hover:bg-[color:var(--surface-2)]"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
