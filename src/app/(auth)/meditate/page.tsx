import type { Metadata } from 'next';
import Image from 'next/image';
import type { IconType } from 'react-icons';
import { FiArrowRight, FiBookOpen, FiHeadphones, FiSmartphone } from 'react-icons/fi';
import SeoJsonLd from '@/components/SeoJsonLd';
import { absoluteUrl, pageMetadata } from '@/lib/seo';
import { getRequestLocale } from '@/lib/serverLocale';

const content = {
  en: {
    heroEyebrow: 'Beginner-friendly daily practice',
    heroTitle: 'A calm daily meditation practice that fits into 10 minutes.',
    heroBody:
      'Start with a simple Sahaja Yoga meditation routine, stay grounded with balancing guidance, and deepen your experience with guided sessions and the 21-day meditation path.',
    need: 'What you need: a quiet corner, a chair or floor cushion, and a few undisturbed minutes.',
    rhythm: 'Best rhythm: morning or evening. If you miss a day, continue gently the next day.',
    start: 'Start Meditation Steps',
    guide: 'Download Meditation Guide (PDF)',
    online: 'Guided Online Meditation',
    featureCards: [
      ['Download Meditation & Balancing Guide', 'Keep a simple reference with meditation steps and balancing techniques for home practice.', 'Download Guide'],
      ['Join Guided Online Meditation', 'Experience live and recorded guided meditations to deepen your practice.', 'Start Guided Meditation'],
      ['21 Days Meditation Path', 'Deepen your meditation experience through a structured 21-day journey in the We Meditate app.', ''],
    ],
    stepsHeader: ['Daily Meditation', '10 simple steps to settle into meditation', 'Follow the flow gently. Each step is short, structured, and easy to return to, so the practice feels calm rather than complicated.'],
    steps: [
      ['Prepare your space', 'Choose a quiet place where you can sit undisturbed for 10 minutes.'],
      ['Sit comfortably', 'Remove your shoes and sit on a chair or on the floor in a natural posture.'],
      ['Open your hands', 'Rest both hands on your lap with palms facing upward and soften your shoulders.'],
      ['Settle the breath', 'Take a few deep breaths, then allow your breathing to return to normal.'],
      ['Use affirmations gently', 'If it helps, use simple affirmations softly without forcing the experience.'],
      ['Lift attention upward', 'Keep your attention above the head and let thoughts pass without following them.'],
      ['Release mental activity', 'If thoughts continue, say inwardly: not this thought, or I forgive everyone.'],
      ['Notice the cool breeze', 'Observe any gentle cool sensation on the hands or above the fontanel area.'],
      ['Rest in stillness', 'When the attention settles, leave it there and enjoy the silence.'],
      ['Practice every day', 'Meditate daily for 10 minutes to deepen and stabilize the experience.'],
    ],
    subtleHeader: ['Subtle Balance', 'Balance the subtle system and return to the present', 'Thoughts often move toward the past or the future. These balancing techniques help you settle back into the center and support a steadier meditation.'],
    left: ['Left-side balancing', 'When emotions feel heavy', 'Hold the left hand toward a candle with the palm facing upward.', 'Place the right hand naturally toward the earth.', 'Use this when you feel lethargic, nostalgic, lonely, or over-focused on the past.'],
    right: ['Right-side balancing', 'When the mind feels overactive', 'Hold the right hand toward a candle with the palm facing upward.', 'Bend the left arm with fingers pointing upward and the palm facing backward.', 'Use this when you feel tense, over-planned, rushed, aggressive, or caught in future thinking.'],
    stores: ['Download on App Store', 'Get it on Google Play'],
  },
  te: {
    heroEyebrow: 'ప్రారంభికులకు అనువైన నిత్య సాధన',
    heroTitle: '10 నిమిషాల్లో సరిపోయే ప్రశాంతమైన నిత్య ధ్యాన సాధన.',
    heroBody: 'సరళమైన సహజ యోగ ధ్యానంతో ప్రారంభించి, సమతుల్యత మార్గదర్శకంతో స్థిరపడుతూ, మార్గదర్శిత సెషన్లు మరియు 21 రోజుల ధ్యాన మార్గంతో మీ అనుభవాన్ని మరింత లోతుగా చేసుకోండి.',
    need: 'మీకు కావలసింది: నిశ్శబ్దమైన మూల, కుర్చీ లేదా నేలపై కుషన్, మరియు కొద్దిసేపు అంతరాయం లేకుండా ఉండే సమయం.',
    rhythm: 'సరైన సమయం: ఉదయం లేదా సాయంత్రం. ఒక రోజు మిస్ అయితే, మరుసటి రోజు మృదువుగా తిరిగి ప్రారంభించండి.',
    start: 'ధ్యాన దశలను ప్రారంభించండి',
    guide: 'ధ్యాన మార్గదర్శిని డౌన్‌లోడ్ చేయండి (PDF)',
    online: 'ఆన్‌లైన్ మార్గదర్శిత ధ్యానం',
    featureCards: [
      ['ధ్యానం & బ్యాలెన్సింగ్ గైడ్ డౌన్‌లోడ్ చేయండి', 'ఇంటి వద్ద సాధన కోసం ధ్యాన దశలు, బ్యాలెన్సింగ్ పద్ధతులతో కూడిన సరళ గైడ్‌ను ఉపయోగించండి.', 'గైడ్ డౌన్‌లోడ్ చేయండి'],
      ['ఆన్‌లైన్ మార్గదర్శిత ధ్యానంలో చేరండి', 'మార్గదర్శిత ప్రత్యక్ష మరియు రికార్డ్ చేయబడిన ధ్యానాలతో మీ సాధనను లోతుగా చేయండి.', 'మార్గదర్శిత ధ్యానం ప్రారంభించండి'],
      ['21 రోజుల ధ్యాన మార్గం', 'We Meditate యాప్‌లో రూపొందించిన 21 రోజుల ప్రణాళిక ద్వారా మీ ధ్యానాన్ని మరింత లోతుగా అనుభవించండి.', ''],
    ],
    stepsHeader: ['నిత్య ధ్యానం', 'ధ్యానంలో స్థిరపడేందుకు 10 సులభ దశలు', 'మృదువుగా ప్రవాహాన్ని అనుసరించండి. ప్రతి దశ చిన్నది, స్పష్టమైనది, మళ్లీ మళ్లీ సులభంగా ఆచరించదగినది.'],
    steps: [
      ['మీ స్థలాన్ని సిద్ధం చేసుకోండి', '10 నిమిషాలు అంతరాయం లేకుండా కూర్చునే ప్రశాంత ప్రదేశాన్ని ఎంచుకోండి.'],
      ['సౌకర్యంగా కూర్చోండి', 'చెప్పులు తీసి, కుర్చీపై లేదా నేలపై సహజమైన భంగిమలో కూర్చోండి.'],
      ['చేతులను తెరవండి', 'రెండు చేతులను ఒడిలో అరచేతులు పైకి ఉండేలా ఉంచి భుజాలను సడలించండి.'],
      ['శ్వాసను స్థిరపరచండి', 'కొన్ని లోతైన శ్వాసలు తీసుకుని ఆపై శ్వాసను సహజ స్థితికి వదలండి.'],
      ['ఆఫర్మేషన్లు మృదువుగా వాడండి', 'అవసరమైతే బలవంతం చేయకుండా సరళమైన ఆఫర్మేషన్లను మృదువుగా చెప్పండి.'],
      ['ధ్యాసను పైకి తీసుకెళ్ళండి', 'తలపై భాగంపై ధ్యాస ఉంచి ఆలోచనలు వచ్చినా వాటిని అనుసరించకుండా విడిచేయండి.'],
      ['మానసిక చలనం విడదీయండి', 'ఆలోచనలు కొనసాగితే మనసులోనే: ఈ ఆలోచన కాదు, లేదా నేను అందరినీ క్షమిస్తున్నాను అని చెప్పండి.'],
      ['చల్లని గాలి గమనించండి', 'చేతులపై లేదా తలపై మృదువైన చల్లని అనుభూతి ఉందో గమనించండి.'],
      ['నిశ్చలతలో నిలిచి ఉండండి', 'ధ్యాస స్థిరపడినప్పుడు అదే స్థితిలో ఉండి ఆ నిశ్శబ్దాన్ని ఆస్వాదించండి.'],
      ['ప్రతి రోజు సాధన చేయండి', 'ధ్యాన అనుభవం లోతుగా, స్థిరంగా మారేందుకు ప్రతి రోజు 10 నిమిషాలు సాధన చేయండి.'],
    ],
    subtleHeader: ['సూక్ష్మ సమతుల్యత', 'సూక్ష్మ వ్యవస్థను సమతుల్యం చేసి వర్తమానానికి తిరిగి రండి', 'ఆలోచనలు గతం లేదా భవిష్యత్తు వైపు కదులుతుంటాయి. ఈ బ్యాలెన్సింగ్ పద్ధతులు మిమ్మల్ని మళ్లీ మధ్యలోకి తీసుకురావడంలో సహాయపడతాయి.'],
    left: ['ఎడమ వైపు బ్యాలెన్సింగ్', 'భావోద్వేగాలు భారంగా అనిపించినప్పుడు', 'ఎడమ చేయిని అరచేతి పైకి ఉంచి దీపానికి ఎదురుగా పట్టండి.', 'కుడి చేయిని సహజంగా భూమి వైపు ఉంచండి.', 'నిస్సత్తువ, గతస్మరణ, ఒంటరితనం, లేదా గతంపై ఎక్కువ ధ్యాస ఉన్నప్పుడు ఇది సహాయపడుతుంది.'],
    right: ['కుడి వైపు బ్యాలెన్సింగ్', 'మనసు అతిగా క్రియాశీలంగా ఉన్నప్పుడు', 'కుడి చేయిని అరచేతి పైకి ఉంచి దీపానికి ఎదురుగా పట్టండి.', 'ఎడమ చేయిని మడిచి వేళ్లు పైకి, అరచేతి వెనక్కి ఉండేలా ఉంచండి.', 'తీవ్ర ఒత్తిడి, అతిగా ప్రణాళిక, తొందర, దూకుడు, లేదా భవిష్యత్ ఆలోచనల్లో ఇరుక్కున్నప్పుడు ఇది ఉపయోగపడుతుంది.'],
    stores: ['యాప్ స్టోర్‌లో డౌన్‌లోడ్ చేయండి', 'గూగుల్ ప్లేలో పొందండి'],
  },
} as const;

const heroButtonBase = 'inline-flex min-h-[52px] items-center justify-center whitespace-nowrap rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ease-out shadow-sm';
const heroButtonVariants = {
  primary: `${heroButtonBase} bg-[color:var(--primary)] text-white hover:-translate-y-0.5 hover:bg-[color:var(--primary-600)] hover:shadow-soft`,
  secondary: `${heroButtonBase} border border-[color:var(--border)] bg-[color:var(--surface)]/92 text-[color:var(--ink)] hover:-translate-y-0.5 hover:bg-[color:var(--surface-2)] hover:shadow-soft`,
  tertiary: `${heroButtonBase} border border-[color:var(--focus)] bg-[color:var(--surface-2)]/72 text-[color:var(--ink)] hover:-translate-y-0.5 hover:bg-[color:var(--surface)]/92 hover:shadow-soft`,
};

export const metadata: Metadata = pageMetadata({
  title: 'Simple Daily Sahaja Yoga Meditation',
  description: 'A beginner-friendly 10-minute Sahaja Yoga meditation routine with daily steps, balancing techniques, and guided online resources.',
  path: '/meditate',
  image: '/meditate-hero.png',
});

function SectionHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--muted)]">{eyebrow}</p><h2 className="mt-4 text-2xl font-semibold tracking-tight text-[color:var(--ink)] md:text-3xl">{title}</h2><p className="mt-4 text-sm leading-7 text-[color:var(--muted)] md:text-base md:leading-8">{description}</p></div>;
}

function FeatureCard({ title, description, href, label, icon: Icon, stores }: { title: string; description: string; href?: string; label?: string; icon: IconType; stores?: Array<{ href: string; label: string }>; }) {
  return <article className="group h-full rounded-[28px] border border-[color:var(--border)] bg-[linear-gradient(135deg,_color-mix(in_srgb,var(--surface)_94%,transparent),_color-mix(in_srgb,var(--surface-2)_72%,transparent))] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft md:p-8"><div className="flex h-full flex-col"><div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[color:var(--border)] bg-[linear-gradient(135deg,_color-mix(in_srgb,var(--surface)_96%,transparent),_color-mix(in_srgb,var(--surface-2)_88%,transparent))] text-[color:var(--primary)] shadow-sm dark:text-[color:var(--accent)]"><Icon className="h-5 w-5" aria-hidden="true" /></div><h3 className="mt-6 text-xl font-semibold text-[color:var(--ink)] md:text-2xl">{title}</h3><p className="mt-3 text-sm leading-7 text-[color:var(--muted)] md:text-base">{description}</p>{stores ? <div className="mt-6 flex flex-wrap gap-3">{stores.map((store) => <a key={store.label} href={store.href} target="_blank" rel="noopener noreferrer" className={heroButtonVariants.secondary}>{store.label}</a>)}</div> : <div className="mt-6 flex flex-wrap gap-3"><a href={href} target="_blank" rel="noopener noreferrer" className={heroButtonVariants.primary}><span>{label}</span><FiArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></a></div>}</div></article>;
}

export default function MeditatePage() {
  const locale = getRequestLocale();
  const copy = content[locale];
  const featureCards = [
    { title: copy.featureCards[0][0], description: copy.featureCards[0][1], href: '/Meditation-and-Balancing-Guide.pdf', label: copy.featureCards[0][2], icon: FiBookOpen },
    { title: copy.featureCards[1][0], description: copy.featureCards[1][1], href: 'https://wemeditate.com/meditations', label: copy.featureCards[1][2], icon: FiHeadphones },
    { title: copy.featureCards[2][0], description: copy.featureCards[2][1], icon: FiSmartphone, stores: [{ href: 'https://apps.apple.com/in/app/we-meditate/id6465684494', label: copy.stores[0] }, { href: 'https://play.google.com/store/apps/details?id=co.wemeditate.sahajaapp&pcampaignid=web_share', label: copy.stores[1] }] },
  ];

  return (
    <main className="bg-[color:var(--bg)]">
      <SeoJsonLd json={[{ '@context': 'https://schema.org', '@type': 'WebPage', name: copy.heroTitle, url: absoluteUrl('/meditate'), description: copy.heroBody }]} />
      <section className="relative overflow-hidden"><div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_color-mix(in_srgb,var(--accent-200)_55%,transparent),_transparent_42%),linear-gradient(180deg,_color-mix(in_srgb,var(--surface-2)_76%,transparent),_var(--bg)_58%,_var(--bg))]" /><div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24"><div><p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--muted)]">{copy.heroEyebrow}</p><h1 className="mt-5 text-4xl font-semibold tracking-tight text-[color:var(--ink)] md:text-5xl lg:text-6xl">{copy.heroTitle}</h1><p className="mt-6 max-w-2xl text-base leading-8 text-[color:var(--muted)] md:text-lg">{copy.heroBody}</p><div className="mt-8 grid gap-3 text-sm text-[color:var(--muted)] sm:grid-cols-2"><div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)]/80 px-4 py-4 backdrop-blur-sm">{copy.need}</div><div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)]/80 px-4 py-4 backdrop-blur-sm">{copy.rhythm}</div></div><div className="mt-8 flex flex-wrap gap-3"><a href="#daily-steps" className={heroButtonVariants.primary}>{copy.start}</a><a href="/Meditation-and-Balancing-Guide.pdf" target="_blank" rel="noopener noreferrer" className={heroButtonVariants.secondary}>{copy.guide}</a><a href="https://wemeditate.com/meditations" target="_blank" rel="noopener noreferrer" className={heroButtonVariants.tertiary}>{copy.online}</a></div></div><div className="relative mx-auto w-full max-w-[460px]"><div className="absolute inset-6 rounded-[32px] bg-[radial-gradient(circle_at_top,_color-mix(in_srgb,var(--accent)_28%,transparent),_transparent_58%)] blur-2xl" /><div className="relative overflow-hidden rounded-[32px] border border-[color:var(--border)] bg-[color:var(--surface)]/76 p-3 shadow-soft backdrop-blur-sm"><Image src="/meditate-hero.png" alt="Calm meditation illustration" width={1200} height={850} className="h-auto w-full rounded-[24px] object-cover" priority /></div></div></div></section>
      <section className="py-16"><div className="mx-auto max-w-6xl px-6 lg:px-8"><div className="grid gap-6 lg:grid-cols-3">{featureCards.map((card) => <FeatureCard key={card.title} {...card} />)}</div></div></section>
      <section id="daily-steps" className="scroll-mt-24 py-16"><div className="mx-auto max-w-6xl px-6 lg:px-8"><div className="rounded-[32px] border border-[color:var(--border)] bg-[linear-gradient(180deg,_color-mix(in_srgb,var(--surface)_86%,transparent),_color-mix(in_srgb,var(--surface-2)_92%,transparent))] p-6 shadow-sm md:p-10"><SectionHeader eyebrow={copy.stepsHeader[0]} title={copy.stepsHeader[1]} description={copy.stepsHeader[2]} /><div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{copy.steps.map((step, index) => <article key={step[0]} className="group rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)]/86 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--focus)] hover:shadow-soft md:p-6"><div className="flex items-start gap-4"><span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent-200)] text-sm font-semibold text-[color:var(--ink)]">{String(index + 1).padStart(2, '0')}</span><div><h3 className="text-lg font-semibold text-[color:var(--ink)]">{step[0]}</h3><p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">{step[1]}</p></div></div></article>)}</div></div></div></section>
      <section className="py-16"><div className="mx-auto max-w-6xl px-6 lg:px-8"><div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start"><div className="rounded-[32px] border border-[color:var(--border)] bg-[linear-gradient(135deg,_color-mix(in_srgb,var(--surface)_94%,transparent),_color-mix(in_srgb,var(--surface-2)_90%,transparent))] p-6 shadow-sm md:p-8"><SectionHeader eyebrow={copy.subtleHeader[0]} title={copy.subtleHeader[1]} description={copy.subtleHeader[2]} /></div><div className="overflow-hidden rounded-[32px] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-soft md:p-5"><Image src="/subtle-system.png" alt="Nadis and chakras subtle system diagram" width={1800} height={1800} className="h-auto w-full rounded-[24px] bg-[color:var(--surface)]/80" /></div></div><div className="mt-8 grid gap-6 lg:grid-cols-2"><article className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft md:p-8"><div className="inline-flex rounded-full border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">{copy.left[0]}</div><div className="mx-auto mt-6 max-w-xs rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-2)] p-2"><Image src="/balancing-left.png" alt="Left side balancing posture" width={800} height={1500} className="h-auto w-full rounded-[18px] object-contain" /></div><h3 className="mt-5 text-2xl font-semibold text-[color:var(--ink)]">{copy.left[1]}</h3><ul className="mt-5 space-y-3 text-sm leading-7 text-[color:var(--muted)] md:text-base"><li>• {copy.left[2]}</li><li>• {copy.left[3]}</li><li>• {copy.left[4]}</li></ul></article><article className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft md:p-8"><div className="inline-flex rounded-full border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">{copy.right[0]}</div><div className="mx-auto mt-6 max-w-xs rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-2)] p-2"><Image src="/balancing-right.png" alt="Right side balancing posture" width={800} height={1500} className="h-auto w-full rounded-[18px] object-contain" /></div><h3 className="mt-5 text-2xl font-semibold text-[color:var(--ink)]">{copy.right[1]}</h3><ul className="mt-5 space-y-3 text-sm leading-7 text-[color:var(--muted)] md:text-base"><li>• {copy.right[2]}</li><li>• {copy.right[3]}</li><li>• {copy.right[4]}</li></ul></article></div></div></section>
    </main>
  );
}
