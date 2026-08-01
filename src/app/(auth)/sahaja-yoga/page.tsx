import Image from 'next/image';
import Link from 'next/link';
import { getRequestLocale } from '@/lib/serverLocale';
import SeoJsonLd from '@/components/SeoJsonLd';
import Reveal from '@/components/motion/Reveal';
import MaskedReveal from '@/components/motion/MaskedReveal';

const content = {
  en: {
    badge: 'Meditation • Self-Realization • Inner Peace',
    eyebrow: 'The Method',
    title: 'Sahaja Yoga Meditation',
    intro:
      'Sahaja Yoga is a unique meditation method that enables a spontaneous experience of self-realization, a state of thoughtless awareness, inner silence, and deep peace that unfolds naturally from within.',
    whatTitle: 'What is Sahaja Yoga?',
    what: [
      'Sahaja Yoga is a unique method of meditation founded by Shri Mataji Nirmala Devi in 1970. It involves the awakening of the dormant spiritual energy known as Kundalini, which resides within every human being.',
      'Once awakened, this energy rises through the subtle energy system, resulting in a spontaneous state of meditation and a tangible experience of self-realization.',
      'The word Sahaja means “born with”, and Yoga means “union”. Sahaja Yoga therefore refers to the innate union with the all-pervading power that exists within every individual.',
    ],
    firstMeditation: 'Your First Meditation with Shri Mataji',
    differentTitle: 'How is Sahaja Yoga Different?',
    different: [
      'Sahaja Yoga does not require concentration, chanting, affirmations, or rigorous mental discipline. The experience of meditation happens naturally and effortlessly.',
      'It allows the practitioner to go beyond thoughts and experience a state of inner silence, clarity, and balance without effort.',
      'Sahaja Yoga is practiced free of cost worldwide and empowers individuals to become their own masters through direct experience.',
    ],
    originsTitle: 'Origins of Sahaja Yoga',
    origins: [
      'Shri Mataji Nirmala Devi, born in 1923 in Chhindwara, India, dedicated her life to awakening the innate spiritual potential of humanity. Observing the deep inner seeking in people, she introduced Sahaja Yoga in 1970 as a means for true inner transformation.',
      'Today, Sahaja Yoga is practiced in more than 95 countries, offering free meditation sessions to millions across cultures, religions, and backgrounds.',
    ],
    benefitsTitle: 'Benefits of Sahaja Yoga Meditation',
    benefits: [
      {
        title: 'Mental & Emotional Balance',
        text: 'Regular meditation reduces stress, anxiety, and emotional instability, allowing practitioners to remain calm and balanced in daily life.',
      },
      {
        title: 'Improved Attention & Self-Control',
        text: 'Scientific studies show improved attention, self-regulation, and clarity of thought among long-term practitioners.',
      },
      {
        title: 'Holistic Well-Being',
        text: 'Sahaja Yoga supports physical, emotional, and mental health and is used as a complementary approach in managing various conditions.',
      },
    ],
    awardsTitle: 'Awards & Global Recognition',
    awards: [
      '1986 — Personality of the Year, Italy',
      '1989 — Government-sponsored medical research, Russia',
      '1990–1994 — Invited by the United Nations to speak on world peace',
      '2003 — Best regenerative therapy, Russian Ministry of Health',
      '2006 — Honorary Citizenship of Cabella Ligure, Italy',
    ],
    scienceTitle: 'Scientific Research on Sahaja Yoga',
    science:
      'Scientific research using MRI scans, EEG studies, and clinical trials has demonstrated that Sahaja Yoga meditation enhances brain regions associated with attention, emotional regulation, compassion, and self-control. Clinical studies have also shown positive outcomes in managing asthma, epilepsy, ADHD, and depression.',
    ctaTitle: 'Experience It for Yourself',
    ctaBody:
      'Sahaja Yoga offers a direct, experiential path to inner peace and self-realization, freely available to all, without obligation.',
    ctaButton: 'Start Your Journey',
    ctaSecondary: 'Visit a Center',
  },
  te: {
    badge: 'ధ్యానం • స్వీయ సాక్షాత్కారం • అంతరశాంతి',
    eyebrow: 'పద్ధతి',
    title: 'సహజ యోగ ధ్యానం',
    intro:
      'సహజ యోగ అనేది స్వీయ సాక్షాత్కారాన్ని సహజసిద్ధంగా అనుభవించేందుకు సహాయపడే ప్రత్యేక ధ్యాన పద్ధతి. ఇది నిర్విచార అవగాహన, అంతర నిశ్శబ్దం, లోతైన శాంతి వంటి అనుభవాలను లోనుండే మేల్కొలుపుతుంది.',
    whatTitle: 'సహజ యోగ అంటే ఏమిటి?',
    what: [
      'సహజ యోగ అనేది శ్రీ మాతాజీ నిర్మలా దేవి 1970లో స్థాపించిన ప్రత్యేక ధ్యాన పద్ధతి. ఇది ప్రతి మనిషిలోనూ నిద్రావస్థలో ఉన్న కుండలిని శక్తిని మేల్కొలుపుతుంది.',
      'ఈ శక్తి మేల్కొన్న తర్వాత సూక్ష్మ శక్తి వ్యవస్థలో పైకి ఎగసి సహజ ధ్యాన స్థితి మరియు స్పష్టమైన స్వీయ సాక్షాత్కార అనుభూతిని అందిస్తుంది.',
      'సహజ అంటే సహజంగా పుట్టినది, యోగ అంటే ఐక్యం. కాబట్టి సహజ యోగ అనేది ప్రతి మనిషిలోనూ ఉన్న సర్వవ్యాప్త శక్తితో సహజమైన ఐక్యాన్ని సూచిస్తుంది.',
    ],
    firstMeditation: 'శ్రీ మాతాజీతో మీ తొలి ధ్యానం',
    differentTitle: 'సహజ యోగ ప్రత్యేకత ఏమిటి?',
    different: [
      'సహజ యోగలో బలవంతపు ఏకాగ్రత, జపం, ఆఫర్మేషన్లు, లేదా కఠిన మానసిక నియంత్రణ అవసరం లేదు. ధ్యాన అనుభవం సహజంగా, సులభంగా జరుగుతుంది.',
      'ఇది ఆలోచనలను దాటి అంతర నిశ్శబ్దం, స్పష్టత, సమతుల్యత అనుభవించేందుకు సహాయపడుతుంది.',
      'సహజ యోగ ప్రపంచవ్యాప్తంగా ఉచితంగా ఆచరించబడుతుంది మరియు ప్రత్యక్ష అనుభవం ద్వారా వ్యక్తి తనకుతానే గురువు కావడానికి ప్రేరేపిస్తుంది.',
    ],
    originsTitle: 'సహజ యోగ ఆవిర్భావం',
    origins: [
      '1923లో చింద్వారాలో జన్మించిన శ్రీ మాతాజీ నిర్మలా దేవి, మానవుల సహజ ఆధ్యాత్మిక సామర్థ్యాన్ని మేల్కొలిపేందుకు తన జీవితాన్ని అంకితం చేశారు. ప్రజల అంతరాన్వేషణను గమనించి 1970లో సహజ యోగను నిజమైన అంతర్మార్పు మార్గంగా పరిచయం చేశారు.',
      'ఈరోజు సహజ యోగ 95కి పైగా దేశాలలో ఆచరించబడుతూ, విభిన్న సంస్కృతులు, మతాలు, నేపథ్యాల ప్రజలకు ఉచిత ధ్యానాన్ని అందిస్తోంది.',
    ],
    benefitsTitle: 'సహజ యోగ ధ్యాన ప్రయోజనాలు',
    benefits: [
      {
        title: 'మానసిక & భావోద్వేగ సమతుల్యత',
        text: 'నియమిత ధ్యానం ఒత్తిడి, ఆందోళన, భావోద్వేగ అస్థిరతను తగ్గించి జీవితంలో ప్రశాంతంగా ఉండేందుకు సహాయపడుతుంది.',
      },
      {
        title: 'ఏకాగ్రత & ఆత్మ నియంత్రణ మెరుగుదల',
        text: 'శాస్త్రీయ అధ్యయనాలు దీర్ఘకాలిక సాధకుల్లో ఏకాగ్రత, ఆలోచనా స్పష్టత, స్వీయ నియంత్రణ మెరుగుపడినట్లు చూపించాయి.',
      },
      {
        title: 'సమగ్ర శ్రేయస్సు',
        text: 'సహజ యోగ శారీరక, భావోద్వేగ, మానసిక ఆరోగ్యానికి మద్దతునిస్తుంది మరియు అనేక పరిస్థితుల నిర్వహణలో తోడ్పడగలదు.',
      },
    ],
    awardsTitle: 'పురస్కారాలు & ప్రపంచవ్యాప్త గుర్తింపు',
    awards: [
      '1986 — ఇటలీ లో పర్సనాలిటీ ఆఫ్ ది ఇయర్',
      '1989 — రష్యాలో ప్రభుత్వ ప్రాయోజిత వైద్య పరిశోధన',
      '1990–1994 — ప్రపంచ శాంతిపై మాట్లాడేందుకు ఐక్యరాజ్యసమితి ఆహ్వానం',
      '2003 — రష్యా ఆరోగ్య మంత్రిత్వ శాఖ నుండి ఉత్తమ పునరుద్ధరణ చికిత్స గుర్తింపు',
      '2006 — ఇటలీలోని కబెల్లా లిగురే గౌరవ పౌరసత్వం',
    ],
    scienceTitle: 'సహజ యోగపై శాస్త్రీయ పరిశోధన',
    science:
      'MRI, EEG, క్లినికల్ ట్రయల్స్ వంటి పరిశోధనలు సహజ యోగ ధ్యానం ఏకాగ్రత, భావోద్వేగ నియంత్రణ, కరుణ, స్వీయ నియంత్రణకు సంబంధించిన మెదడు భాగాలను మెరుగుపరుస్తుందని చూపించాయి. ఆస్తమా, ఎపిలెప్సీ, ADHD, డిప్రెషన్ నిర్వహణలో కూడా సానుకూల ఫలితాలు లభించాయి.',
    ctaTitle: 'మీరు స్వయంగా అనుభవించండి',
    ctaBody:
      'సహజ యోగ అంతరశాంతి, స్వీయ సాక్షాత్కారానికి ప్రత్యక్ష అనుభవమయిన మార్గాన్ని అందిస్తుంది. ఇది అందరికీ ఉచితంగా లభిస్తుంది.',
    ctaButton: 'మీ ప్రయాణాన్ని ప్రారంభించండి',
    ctaSecondary: 'కేంద్రాన్ని సందర్శించండి',
  },
} as const;

export default function AboutSahajaYogaPage() {
  const locale = getRequestLocale();
  const copy = content[locale];

  return (
    <main className="bg-[color:var(--bg)]">
      <SeoJsonLd
        json={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: copy.title,
            description: copy.intro,
          },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_color-mix(in_srgb,var(--accent-200)_55%,transparent),_transparent_45%)]" />
        <div className="relative mx-auto max-w-[1200px] px-[var(--gutter)] py-[clamp(64px,8vh,96px)] text-center">
          <p className="eyebrow">{copy.eyebrow}</p>
          <MaskedReveal
            as="h1"
            delay={60}
            text={copy.title}
            className="mx-auto mt-5 max-w-4xl text-[clamp(36px,5vw,56px)] font-display leading-[1.05] tracking-[-0.02em] text-[color:var(--ink)]"
          />
          <p className="mx-auto mt-6 max-w-3xl text-[17px] leading-[1.8] text-[color:var(--muted)] md:text-lg">
            {copy.intro}
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/meditate" className="btn btn-primary">
              {copy.ctaButton}
            </Link>
            <Link href="/centers" className="btn btn-secondary">
              {copy.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      {/* What is Sahaja Yoga */}
      <section className="py-[clamp(56px,7vh,80px)]">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-[var(--gutter)] lg:grid-cols-2">
          <Reveal variant="slide-left">
            <div>
                            <h2 className="mt-4 text-[clamp(26px,3vw,34px)] font-display leading-[1.2] tracking-[-0.01em] text-[color:var(--ink)]">
                {copy.whatTitle}
              </h2>
              <div className="mt-6 space-y-4">
                {copy.what.map((paragraph) => (
                  <p key={paragraph} className="text-[15.5px] leading-[1.8] text-[color:var(--muted)]">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal variant="scale" className="relative">
            <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-[color:var(--accent-200)]/50 blur-3xl" />
            <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[color:var(--border)] shadow-panel">
              <Image
                src="/sahaja5.jpg"
                alt="What is Sahaja Yoga"
                width={600}
                height={420}
                className="aspect-[10/7] w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* First meditation video */}
      <section className="py-[clamp(56px,7vh,80px)]">
        <div className="mx-auto max-w-5xl px-[var(--gutter)]">
          <div className="mb-10 text-center">
            <div className="mb-5 flex items-center justify-center gap-2">
              <div className="h-[2px] w-12 bg-[color:var(--accent)]" />
              <div className="h-1.5 w-1.5 rotate-45 bg-[color:var(--accent)]" />
              <div className="h-[2px] w-12 bg-[color:var(--accent)]" />
            </div>
            <h2 className="text-[clamp(24px,2.8vw,32px)] font-display leading-[1.2] text-[color:var(--ink)]">
              {copy.firstMeditation}
            </h2>
          </div>
          <Reveal>
            <div className="youtube-container overflow-hidden rounded-[var(--radius-xl)] border border-[color:var(--border)] shadow-panel">
              <iframe
                src="https://www.youtube.com/embed/hcSJrufqdq0"
                title={copy.firstMeditation}
                allowFullScreen
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* How different */}
      <section className="py-[clamp(56px,7vh,80px)] bg-[color:var(--surface-2)]">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-[var(--gutter)] lg:grid-cols-2">
          <Reveal variant="scale" className="order-2 lg:order-1">
            <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[color:var(--border)] shadow-panel">
              <Image
                src="/sahaja2.jpg"
                alt="How Sahaja Yoga is different"
                width={600}
                height={420}
                className="aspect-[10/7] w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal variant="slide-right" className="order-1 lg:order-2">
            <div>
                            <h2 className="mt-4 text-[clamp(26px,3vw,34px)] font-display leading-[1.2] tracking-[-0.01em] text-[color:var(--ink)]">
                {copy.differentTitle}
              </h2>
              <ul className="mt-6 space-y-4">
                {copy.different.map((paragraph) => (
                  <li key={paragraph} className="flex items-start gap-3 text-[15.5px] leading-[1.8] text-[color:var(--muted)]">
                    <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rotate-45 bg-[color:var(--accent)]" aria-hidden />
                    <span>{paragraph}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Origins */}
      <section className="py-[clamp(56px,7vh,80px)]">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-[var(--gutter)] lg:grid-cols-2">
          <Reveal variant="slide-left">
            <div>
                            <h2 className="mt-4 text-[clamp(26px,3vw,34px)] font-display leading-[1.2] tracking-[-0.01em] text-[color:var(--ink)]">
                {copy.originsTitle}
              </h2>
              <div className="mt-6 space-y-4">
                {copy.origins.map((paragraph) => (
                  <p key={paragraph} className="text-[15.5px] leading-[1.8] text-[color:var(--muted)]">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal variant="scale">
            <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[color:var(--border)] shadow-panel">
              <Image
                src="/sahaja3.jpg"
                alt="Shri Mataji Nirmala Devi"
                width={600}
                height={420}
                className="aspect-[10/7] w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-[clamp(56px,7vh,80px)] bg-[color:var(--surface-2)]">
        <div className="mx-auto max-w-[1200px] px-[var(--gutter)]">
          <div className="mb-12 text-center">
                        <h2 className="mx-auto mt-4 max-w-2xl text-[clamp(26px,3vw,34px)] font-display leading-[1.2] tracking-[-0.01em] text-[color:var(--ink)]">
              {copy.benefitsTitle}
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {copy.benefits.map((benefit, index) => (
              <Reveal key={benefit.title} delay={index * 80}>
                <div className="group h-full rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-panel">
                  <div className="h-1.5 w-10 rotate-0 rounded-full bg-[color:var(--accent)] transition-all duration-300 group-hover:w-14" />
                  <h3 className="mt-5 text-[19px] font-semibold leading-snug text-[color:var(--ink)]">
                    {benefit.title}
                  </h3>
                  <p className="mt-3 text-[14.5px] leading-[1.75] text-[color:var(--muted)]">{benefit.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Awards + Science */}
      <section className="py-[clamp(56px,7vh,80px)]">
        <div className="mx-auto grid max-w-[1200px] gap-8 px-[var(--gutter)] lg:grid-cols-2">
          <Reveal variant="slide-left">
            <div className="h-full rounded-[var(--radius-xl)] border border-[color:var(--border)] bg-[color:var(--surface)] p-8 shadow-card md:p-10">
              <p className="eyebrow">{copy.awardsTitle}</p>
              <h2 className="mt-4 text-[clamp(24px,2.6vw,30px)] font-display leading-[1.2] text-[color:var(--ink)]">{copy.awardsTitle}</h2>
              <ul className="mt-6 space-y-4">
                {copy.awards.map((award) => (
                  <li key={award} className="flex items-start gap-3 text-[15px] leading-relaxed text-[color:var(--muted)]">
                    <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rotate-45 bg-[color:var(--accent)]" aria-hidden />
                    <span>{award}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal variant="slide-right" delay={100}>
            <div className="flex h-full flex-col justify-center rounded-[var(--radius-xl)] border border-[color:var(--border)] bg-[linear-gradient(135deg,var(--surface),var(--surface-2))] p-8 shadow-card md:p-10">
                            <h2 className="mt-4 text-[clamp(26px,3vw,34px)] font-display leading-[1.2] tracking-[-0.01em] text-[color:var(--ink)]">
                {copy.scienceTitle}
              </h2>
              <p className="mt-6 text-[15.5px] leading-[1.8] text-[color:var(--muted)]">{copy.science}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-[clamp(72px,9vh,104px)]">
        <Reveal>
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[var(--radius-xl)] px-[var(--gutter)] py-16 text-center">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--primary-700),var(--primary-600))]" />
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[color:var(--accent)]/25 blur-3xl" />
            <div className="relative">
              <h2 className="text-[clamp(28px,3.4vw,38px)] font-display leading-[1.15] text-white">
                {copy.ctaTitle}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[15.5px] leading-[1.8] text-white/85">{copy.ctaBody}</p>
              <div className="mt-8 flex justify-center gap-3">
                <Link href="/meditate" className="btn bg-white text-[color:var(--primary-700)] hover:bg-[color:var(--surface-2)]">
                  {copy.ctaButton}
                </Link>
                <Link
                  href="/seeker-registration"
                  className="btn border border-white/35 bg-white/10 text-white hover:bg-white/20"
                >
                  {copy.ctaSecondary}
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
