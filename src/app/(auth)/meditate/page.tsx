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
    stepsHeader: ['Balancing Our Channels', 'Clear the subtle system through three guided balancing steps', 'Use these three simple balancing practices to settle the left, right, and central channels before meditation.'],
    stepsMatajiNote: 'Practice these balancing steps in front of Shri Mataji with gentle attention and sincerity.',
    steps: [
      ['Clearing the left channel', 'Cleaning the left channel helps remove the tendency to become over-emotional and dwell in the past.', '/meditation-steps/1.png', 'Keep the left hand on the lap, and the right hand on the earth. Keep your attention on the left palm.', 'Affirmation: Mother please clear my left channel and remove all negativities through Mother Earth.'],
      ['Clearing the right channel', 'Cleaning the right side helps reduce over-planning, mental strain, and stressed thoughts.', '/meditation-steps/2.png', 'Keep the right hand on the lap, and bend the left arm toward the sky. Keep your attention on the right palm.', 'Affirmation: Mother please clear my right channel and remove all negativities through Sky element.'],
      ['Clearing the central channel', 'Once both channels are cleansed, it becomes easier to remain in meditation and settle into the center.', '/meditation-steps/3.png', 'Keep both hands on the lap and place your attention on the top of the head, the Sahasrara.', 'Affirmation: Mother please give us the state of thoughtless awareness and let us be in joy.'],
    ],
    subtleHeader: ['Subtle Balance', 'Understand the subtle system', 'The subtle system image below shows the channels and chakras that support meditation, balance, and inner ascent.'],
    subtleChannels: [
      ['Left Channel', 'The left channel governs our emotions, desires, and our connection with the past. By balancing this channel we can remove any weight from our past which is holding us back, allowing us to feel motivated and to believe in ourselves.'],
      ['Right Channel', 'The right channel corresponds to all of our thoughts, actions and our connection with the future. By cleansing this channel we can calm down our thoughts and remove any worries about the future.'],
      ['Central Channel', 'The central channel is the path of balance and ascent. When we raise our Kundalini through this channel we are guided towards a higher awareness which facilitates our spiritual evolution and allows us to reach a blissful state which is beyond our mental understanding.'],
    ],
    resourcesHeader: ['Practice Resources', 'Continue with guided support and home practice', 'Use these resources to keep your meditation consistent, go deeper with guided sessions, and stay connected to the practice day by day.'],
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
    stepsHeader: ['మన నాళాల సమతుల్యత', 'మూడు మార్గదర్శిత దశలతో సూక్ష్మ వ్యవస్థను శుభ్రపరచండి', 'ధ్యానం ముందు ఎడమ, కుడి, మధ్య నాళాలను సమతుల్యం చేసేందుకు ఈ మూడు సులభమైన పద్ధతులను ఉపయోగించండి.'],
    stepsMatajiNote: 'ఈ బ్యాలెన్సింగ్ దశలను శ్రీమాతాజీ ముందు మృదువైన ధ్యాసతో, హృదయపూర్వకంగా ఆచరించండి.',
    steps: [
      ['ఎడమ నాళం శుభ్రపరచడం', 'ఎడమ నాళాన్ని శుభ్రపరచడం వల్ల అధిక భావోద్వేగం మరియు గతంలోనే ఉండిపోవడం తగ్గుతుంది.', '/meditation-steps/1.png', 'ఎడమ చేయిని ఒడిలో ఉంచి, కుడి చేయిని భూమి వైపు ఉంచండి. ఎడమ అరపై ధ్యాస ఉంచండి.', 'ఆఫర్మేషన్: మాతాజీ, దయచేసి నా ఎడమ నాళాన్ని శుభ్రపరచి మాతృభూమి ద్వారా అన్ని ప్రతికూలతలను తొలగించండి.'],
      ['కుడి నాళం శుభ్రపరచడం', 'కుడి వైపు శుభ్రపరచడం వల్ల అధిక ప్రణాళిక, ఒత్తిడిగల ఆలోచనలు తగ్గుతాయి.', '/meditation-steps/2.png', 'కుడి చేయిని ఒడిలో ఉంచి, ఎడమ చేయిని పైకి వంచి ఆకాశం వైపు ఉంచండి. కుడి అరపై ధ్యాస ఉంచండి.', 'ఆఫర్మేషన్: మాతాజీ, దయచేసి నా కుడి నాళాన్ని శుభ్రపరచి ఆకాశ తత్వం ద్వారా అన్ని ప్రతికూలతలను తొలగించండి.'],
      ['మధ్య నాళం శుభ్రపరచడం', 'ఈ రెండు నాళాలు శుభ్రమైన తర్వాత ధ్యాన స్థితిలో ఉండటం మరింత సులభమవుతుంది.', '/meditation-steps/3.png', 'రెండు చేతులను ఒడిలో ఉంచి, మీ ధ్యాసను తల పైభాగమైన సహస్రారంపై ఉంచండి.', 'ఆఫర్మేషన్: మాతాజీ, దయచేసి మాకు నిర్విచార చైతన్య స్థితిని ప్రసాదించి ఆనందంలో నిలిపించండి.'],
    ],
    subtleHeader: ['సూక్ష్మ సమతుల్యత', 'సూక్ష్మ వ్యవస్థను అర్థం చేసుకోండి', 'క్రింద ఉన్న సూక్ష్మ వ్యవస్థ చిత్రం ధ్యానం, సమతుల్యత, మరియు అంతరారూఢికి మద్దతు ఇచ్చే నాళాలు మరియు చక్రాలను చూపిస్తుంది.'],
    subtleChannels: [
      ['ఎడమ నాళం', 'ఎడమ నాళం మన భావోద్వేగాలు, కోరికలు, మరియు గతంతో ఉన్న అనుబంధాన్ని నియంత్రిస్తుంది. ఈ నాళాన్ని సమతుల్యం చేయడం ద్వారా మనల్ని వెనక్కి లాగుతున్న గతభారాన్ని తొలగించి, మళ్లీ ఉత్సాహంతో ముందుకు సాగేందుకు, మనపై నమ్మకం పెంచుకునేందుకు సహాయపడుతుంది.'],
      ['కుడి నాళం', 'కుడి నాళం మన ఆలోచనలు, చర్యలు, మరియు భవిష్యత్తుతో ఉన్న అనుబంధాన్ని సూచిస్తుంది. ఈ నాళాన్ని శుభ్రపరచడం ద్వారా ఆలోచనలను ప్రశాంతపరచి, భవిష్యత్తుపై ఉన్న ఆందోళనలను తగ్గించవచ్చు.'],
      ['మధ్య నాళం', 'మధ్య నాళం సమతుల్యత మరియు ఆరూఢి మార్గం. ఈ నాళం ద్వారా మన కుండలిని ఆరూఢి చెందినప్పుడు, అది మనల్ని ఉన్నతమైన చైతన్య స్థితికి నడిపిస్తుంది. అది ఆధ్యాత్మిక వికాసాన్ని సులభతరం చేసి, మనసుకు అతీతమైన ఆనంద స్థితికి చేరుస్తుంది.'],
    ],
    resourcesHeader: ['సాధన వనరులు', 'మార్గదర్శిత సహాయం మరియు ఇంటి సాధనతో కొనసాగండి', 'మీ ధ్యానాన్ని నియమితంగా కొనసాగించడానికి, మార్గదర్శిత సెషన్లతో లోతుగా అనుభవించడానికి, మరియు రోజువారీ సాధనతో అనుసంధానంగా ఉండడానికి ఈ వనరులను ఉపయోగించండి.'],
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
      <section className="relative overflow-hidden"><div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_color-mix(in_srgb,var(--accent-200)_55%,transparent),_transparent_42%),linear-gradient(180deg,_color-mix(in_srgb,var(--surface-2)_76%,transparent),_var(--bg)_58%,_var(--bg))]" /><div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24"><div><p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--muted)]">{copy.heroEyebrow}</p><h1 className="mt-5 text-4xl font-semibold tracking-tight text-[color:var(--ink)] md:text-5xl lg:text-6xl">{copy.heroTitle}</h1><p className="mt-6 max-w-2xl text-base leading-8 text-[color:var(--muted)] md:text-lg">{copy.heroBody}</p><div className="mt-8 grid gap-3 text-sm text-[color:var(--muted)] sm:grid-cols-2"><div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)]/80 px-4 py-4 backdrop-blur-sm">{copy.need}</div><div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)]/80 px-4 py-4 backdrop-blur-sm">{copy.rhythm}</div></div></div><div className="relative mx-auto w-full max-w-[460px]"><div className="absolute inset-6 rounded-[32px] bg-[radial-gradient(circle_at_top,_color-mix(in_srgb,var(--accent)_28%,transparent),_transparent_58%)] blur-2xl" /><div className="relative overflow-hidden rounded-[32px] border border-[color:var(--border)] bg-[color:var(--surface)]/76 p-3 shadow-soft backdrop-blur-sm"><Image src="/meditate-hero.png" alt="Calm meditation illustration" width={1200} height={850} className="h-auto w-full rounded-[24px] object-cover" priority /></div></div></div></section>
      <section className="py-16"><div className="mx-auto max-w-6xl px-6 lg:px-8"><div className="rounded-[32px] border border-[color:var(--border)] bg-[linear-gradient(135deg,_color-mix(in_srgb,var(--surface)_94%,transparent),_color-mix(in_srgb,var(--surface-2)_90%,transparent))] p-6 shadow-sm md:p-8"><div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start"><div><SectionHeader eyebrow={copy.subtleHeader[0]} title={copy.subtleHeader[1]} description={copy.subtleHeader[2]} /><div className="mt-8 space-y-6">{copy.subtleChannels.map((channel) => <div key={channel[0]} className="border-t border-[color:var(--border)] pt-6 first:border-t-0 first:pt-0"><h3 className="text-2xl font-semibold text-[color:var(--ink)]">{channel[0]}</h3><p className="mt-3 text-sm leading-7 text-[color:var(--muted)] md:text-base">{channel[1]}</p></div>)}</div></div><div className="overflow-hidden rounded-[32px] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-soft md:p-5"><Image src="/subtle-system.png" alt="Nadis and chakras subtle system diagram" width={1800} height={1800} className="h-auto w-full rounded-[24px] bg-[color:var(--surface)]/80" /></div></div></div></div></section>
      <section id="daily-steps" className="scroll-mt-24 py-16"><div className="mx-auto max-w-6xl px-6 lg:px-8"><div className="rounded-[36px] border border-[color:var(--border)] bg-[linear-gradient(180deg,_color-mix(in_srgb,var(--surface)_90%,transparent),_color-mix(in_srgb,var(--surface-2)_96%,transparent))] p-6 shadow-sm md:p-10"><div className="grid gap-6 lg:grid-cols-[1fr_290px] lg:items-center xl:grid-cols-[1fr_340px]"><div><SectionHeader eyebrow={copy.stepsHeader[0]} title={copy.stepsHeader[1]} description={copy.stepsHeader[2]} /><p className="mt-5 max-w-2xl rounded-[20px] border border-[color:var(--border)] bg-[color:var(--surface)]/86 px-4 py-3 text-sm leading-7 text-[color:var(--muted)] md:text-base">{copy.stepsMatajiNote}</p></div><div className="mx-auto w-full max-w-[220px] sm:max-w-[240px] lg:max-w-[280px] xl:max-w-[320px]"><div className="overflow-hidden rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-2 shadow-soft"><Image src="/maaa-with-hand.jpg" alt="Shri Mataji portrait for meditation practice" width={900} height={1200} className="h-auto w-full rounded-[22px] object-cover" /></div></div></div><div className="mt-10 grid gap-6 lg:grid-cols-3">{copy.steps.map((step, index) => <article key={step[0]} className="group overflow-hidden rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)]/92 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"><div className="border-b border-[color:var(--border)] bg-[linear-gradient(180deg,_color-mix(in_srgb,var(--surface-2)_94%,transparent),_color-mix(in_srgb,var(--surface)_96%,transparent))] p-4"><div className="flex items-center gap-3"><span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[color:var(--primary)] text-sm font-semibold text-white">{String(index + 1).padStart(2, '0')}</span><div><h3 className="text-xl font-semibold text-[color:var(--ink)]">{step[0]}</h3></div></div></div><div className="p-4 md:p-5"><div className="overflow-hidden rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-2)]/72 p-3"><Image src={step[2]} alt={step[0]} width={900} height={900} className="h-auto w-full rounded-[18px] object-contain" /></div><p className="mt-5 text-sm leading-7 text-[color:var(--muted)] md:text-base">{step[1]}</p><div className="mt-5 rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface-2)]/70 p-4"><p className="text-sm leading-7 text-[color:var(--ink)] md:text-base">{step[3]}</p><p className="mt-4 rounded-2xl bg-[color:var(--primary)] px-4 py-3 text-sm font-medium leading-7 text-white shadow-sm md:text-base">{step[4]}</p></div></div></article>)}</div></div></div></section>
      <section className="py-16"><div className="mx-auto max-w-6xl px-6 lg:px-8"><div className="rounded-[32px] border border-[color:var(--border)] bg-[linear-gradient(180deg,_color-mix(in_srgb,var(--surface)_88%,transparent),_color-mix(in_srgb,var(--surface-2)_95%,transparent))] p-6 shadow-sm md:p-10"><SectionHeader eyebrow={copy.resourcesHeader[0]} title={copy.resourcesHeader[1]} description={copy.resourcesHeader[2]} /><div className="mt-10 grid gap-6 lg:grid-cols-3">{featureCards.map((card) => <FeatureCard key={card.title} {...card} />)}</div></div></div></section>
    </main>
  );
}
