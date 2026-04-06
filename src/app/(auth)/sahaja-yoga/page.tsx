import Image from 'next/image';
import { getRequestLocale } from '@/lib/serverLocale';

const content = {
  en: {
    badge: 'Meditation • Self-Realization • Inner Peace',
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
  },
  te: {
    badge: 'ధ్యానం • స్వీయ సాక్షాత్కారం • అంతరశాంతి',
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
  },
} as const;

export default function AboutSahajaYogaPage() {
  const locale = getRequestLocale();
  const copy = content[locale];

  return (
    <main className="bg-[color:var(--bg)]">
      <section className="max-w-6xl mx-auto px-6 py-28 text-center">
        <span className="inline-block mb-4 px-4 py-1 rounded-full bg-[color:var(--accent-200)]/60 text-[color:var(--ink)] text-base font-medium">
          {copy.badge}
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-[color:var(--ink)] tracking-tight">{copy.title}</h1>
        <p className="mt-8 text-lg text-[color:var(--muted)] max-w-4xl mx-auto leading-relaxed">{copy.intro}</p>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-28 grid md:grid-cols-2 gap-14 items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-[color:var(--ink)] mb-6">{copy.whatTitle}</h2>
          {copy.what.map((paragraph) => (
            <p key={paragraph} className="text-[color:var(--muted)] leading-relaxed mb-5">{paragraph}</p>
          ))}
        </div>
        <div className="relative rounded-3xl overflow-hidden shadow-soft">
          <Image src="/sahaja5.jpg" alt="What is Sahaja Yoga" width={600} height={420} className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-28">
        <h2 className="text-2xl md:text-3xl font-semibold text-center text-[color:var(--ink)] mb-10">{copy.firstMeditation}</h2>
        <div className="youtube-container rounded-3xl shadow-soft overflow-hidden ring-1 ring-black/5">
          <iframe src="https://www.youtube.com/embed/hcSJrufqdq0" title={copy.firstMeditation} allowFullScreen />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-28">
        <div className="bg-[color:var(--surface)] backdrop-blur rounded-3xl p-10 md:p-14 shadow-soft grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-[color:var(--ink)] mb-6">{copy.differentTitle}</h2>
            {copy.different.map((paragraph) => (
              <p key={paragraph} className="text-[color:var(--muted)] leading-relaxed mb-5">{paragraph}</p>
            ))}
          </div>
          <Image src="/sahaja2.jpg" alt="How Sahaja Yoga is different" width={600} height={420} className="rounded-2xl shadow-md" />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-28 grid md:grid-cols-2 gap-14 items-center">
        <Image src="/sahaja3.jpg" alt="Shri Mataji Nirmala Devi" width={600} height={420} className="rounded-3xl shadow-soft" />
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-[color:var(--ink)] mb-6">{copy.originsTitle}</h2>
          {copy.origins.map((paragraph) => (
            <p key={paragraph} className="mt-4 text-[color:var(--muted)] leading-relaxed">{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-28">
        <h2 className="text-2xl md:text-3xl font-semibold text-center text-[color:var(--ink)] mb-12">{copy.benefitsTitle}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {copy.benefits.map((benefit) => (
            <BenefitCard key={benefit.title} title={benefit.title} text={benefit.text} />
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-28">
        <h2 className="text-2xl md:text-3xl font-semibold text-center text-[color:var(--ink)] mb-8">{copy.awardsTitle}</h2>
        <div className="bg-[color:var(--surface)] rounded-2xl p-8 shadow-soft border border-gray-100">
          <ul className="space-y-3 text-[color:var(--muted)] leading-relaxed">
            {copy.awards.map((award) => <li key={award}>• {award}</li>)}
          </ul>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-28">
        <h2 className="text-2xl md:text-3xl font-semibold text-center text-[color:var(--ink)] mb-6">{copy.scienceTitle}</h2>
        <p className="text-[color:var(--muted)] leading-relaxed text-center max-w-4xl mx-auto">{copy.science}</p>
      </section>

      <section className="text-center pb-32 px-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-[color:var(--ink)] mb-4">{copy.ctaTitle}</h2>
        <p className="text-[color:var(--muted)] max-w-2xl mx-auto leading-relaxed">{copy.ctaBody}</p>
      </section>
    </main>
  );
}

function BenefitCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="bg-[color:var(--surface)] rounded-2xl p-7 shadow-soft border border-gray-100 hover:shadow-md transition">
      <h3 className="text-lg font-semibold text-[color:var(--ink)]">{title}</h3>
      <p className="mt-4 text-[color:var(--muted)] text-base leading-relaxed">{text}</p>
    </div>
  );
}
