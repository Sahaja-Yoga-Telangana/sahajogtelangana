import type { Metadata } from 'next';
import Image from 'next/image';
import type { IconType } from 'react-icons';
import { FiArrowRight, FiBookOpen, FiHeadphones, FiSmartphone } from 'react-icons/fi';
import SeoJsonLd from '@/components/SeoJsonLd';
import { absoluteUrl, pageMetadata } from '@/lib/seo';

const dailySteps = [
  {
    title: 'Prepare your space',
    description: 'Choose a quiet place where you can sit undisturbed for 10 minutes.',
  },
  {
    title: 'Sit comfortably',
    description: 'Remove your shoes and sit on a chair or on the floor in a natural posture.',
  },
  {
    title: 'Open your hands',
    description: 'Rest both hands on your lap with palms facing upward and soften your shoulders.',
  },
  {
    title: 'Settle the breath',
    description: 'Take a few deep breaths, then allow your breathing to return to normal.',
  },
  {
    title: 'Use affirmations gently',
    description: 'If it helps, use simple affirmations softly without forcing the experience.',
  },
  {
    title: 'Lift attention upward',
    description: 'Keep your attention above the head and let thoughts pass without following them.',
  },
  {
    title: 'Release mental activity',
    description: 'If thoughts continue, say inwardly: not this thought, or I forgive everyone.',
  },
  {
    title: 'Notice the cool breeze',
    description: 'Observe any gentle cool sensation on the hands or above the fontanel area.',
  },
  {
    title: 'Rest in stillness',
    description: 'When the attention settles, leave it there and enjoy the silence.',
  },
  {
    title: 'Practice every day',
    description: 'Meditate daily for 10 minutes to deepen and stabilize the experience.',
  },
];

const featureCards = [
  {
    title: 'Download Meditation & Balancing Guide',
    description: 'Keep a simple reference with meditation steps and balancing techniques for home practice.',
    href: '/Meditation-and-Balancing-Guide.pdf',
    label: 'Download Guide',
    icon: FiBookOpen,
    variant: 'primary' as const,
    download: 'Meditation-and-Balancing-Guide.pdf',
  },
  {
    title: 'Join Guided Online Meditation',
    description: 'Experience live and recorded guided meditations to deepen your practice.',
    href: 'https://wemeditate.com/meditations',
    label: 'Start Guided Meditation',
    icon: FiHeadphones,
    variant: 'secondary' as const,
  },
  {
    title: '21 Days Meditation Path',
    description: 'Deepen your meditation experience through a structured 21-day journey in the We Meditate app.',
    icon: FiSmartphone,
    stores: [
      {
        href: 'https://apps.apple.com/in/app/we-meditate/id6465684494',
        label: 'Download on App Store',
      },
      {
        href: 'https://play.google.com/store/apps/details?id=co.wemeditate.sahajaapp&pcampaignid=web_share',
        label: 'Get it on Google Play',
      },
    ],
  },
];

const heroButtonBase =
  'inline-flex min-h-[52px] items-center justify-center whitespace-nowrap rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ease-out shadow-sm';

const heroButtonVariants = {
  primary:
    `${heroButtonBase} bg-[color:var(--primary)] text-white hover:-translate-y-0.5 hover:bg-[color:var(--primary-600)] hover:shadow-soft`,
  secondary:
    `${heroButtonBase} border border-[color:var(--border)] bg-[color:var(--surface)]/92 text-[color:var(--ink)] hover:-translate-y-0.5 hover:bg-[color:var(--surface-2)] hover:shadow-soft`,
  tertiary:
    `${heroButtonBase} border border-[color:var(--focus)] bg-[color:var(--surface-2)]/72 text-[color:var(--ink)] hover:-translate-y-0.5 hover:bg-[color:var(--surface)]/92 hover:shadow-soft`,
};

export const metadata: Metadata = pageMetadata({
  title: 'Simple Daily Sahaja Yoga Meditation',
  description:
    'A beginner-friendly 10-minute Sahaja Yoga meditation routine with daily steps, balancing techniques, and guided online resources.',
  path: '/meditate',
  image: '/meditate-hero.png',
  keywords: [
    'Sahaja Yoga meditation steps',
    'daily meditation for beginners',
    '10 minute meditation',
    'guided meditation online',
    'meditation balancing techniques',
    'Sahaja Yoga Telangana',
  ],
});

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--muted)]">{eyebrow}</p>
      <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[color:var(--ink)] md:text-3xl">{title}</h2>
      <p className="mt-4 text-sm leading-7 text-[color:var(--muted)] md:text-base md:leading-8">{description}</p>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  href,
  label,
  icon: Icon,
  variant,
  download,
  stores,
}: {
  title: string;
  description: string;
  href?: string;
  label?: string;
  icon: IconType;
  variant?: 'primary' | 'secondary';
  download?: string;
  stores?: Array<{ href: string; label: string }>;
}) {
  return (
    <article className="group h-full rounded-[28px] border border-[color:var(--border)] bg-[linear-gradient(135deg,_color-mix(in_srgb,var(--surface)_94%,transparent),_color-mix(in_srgb,var(--surface-2)_72%,transparent))] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft md:p-8">
      <div className="flex h-full flex-col">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[color:var(--border)] bg-[linear-gradient(135deg,_color-mix(in_srgb,var(--surface)_96%,transparent),_color-mix(in_srgb,var(--surface-2)_88%,transparent))] text-[color:var(--primary)] shadow-sm dark:text-[color:var(--accent)]">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <h3 className="mt-6 text-xl font-semibold text-[color:var(--ink)] md:text-2xl">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-[color:var(--muted)] md:text-base">{description}</p>

        {stores ? (
          <div className="mt-6 flex flex-wrap gap-3">
            {stores.map((store) => (
              <a
                key={store.label}
                href={store.href}
                target="_blank"
                rel="noopener noreferrer"
                className={heroButtonVariants.secondary}
              >
                {store.label}
              </a>
            ))}
          </div>
        ) : (
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              download={download}
              className={variant === 'primary' ? heroButtonVariants.primary : heroButtonVariants.secondary}
            >
              <span>{label}</span>
              <FiArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        )}
      </div>
    </article>
  );
}

export default function MeditatePage() {
  return (
    <main className="bg-[color:var(--bg)]">
      <SeoJsonLd
        json={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Simple Daily Sahaja Yoga Meditation',
            url: absoluteUrl('/meditate'),
            description:
              'A 10-minute daily Sahaja Yoga meditation practice with balancing techniques and guided resources for beginners.',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'Daily Meditation – 10 Simple Steps',
            description:
              'A beginner-friendly Sahaja Yoga meditation routine to practice every day for 10 minutes.',
            totalTime: 'PT10M',
            step: dailySteps.map((step, index) => ({
              '@type': 'HowToStep',
              position: index + 1,
              name: step.title,
              text: step.description,
            })),
          },
        ]}
      />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_color-mix(in_srgb,var(--accent-200)_55%,transparent),_transparent_42%),linear-gradient(180deg,_color-mix(in_srgb,var(--surface-2)_76%,transparent),_var(--bg)_58%,_var(--bg))]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--border)] to-transparent" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--muted)]">
              Beginner-friendly daily practice
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-[color:var(--ink)] md:text-5xl lg:text-6xl">
              A calm daily meditation practice that fits into 10 minutes.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[color:var(--muted)] md:text-lg">
              Start with a simple Sahaja Yoga meditation routine, stay grounded with balancing guidance, and deepen your experience with guided sessions and the 21-day meditation path.
            </p>

            <div className="mt-8 grid gap-3 text-sm text-[color:var(--muted)] sm:grid-cols-2">
              <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)]/80 px-4 py-4 backdrop-blur-sm">
                What you need: a quiet corner, a chair or floor cushion, and a few undisturbed minutes.
              </div>
              <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)]/80 px-4 py-4 backdrop-blur-sm">
                Best rhythm: morning or evening. If you miss a day, continue gently the next day.
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#daily-steps" aria-label="Go to daily meditation steps" className={heroButtonVariants.primary}>
                Start Meditation Steps
              </a>
              <a
                href="/Meditation-and-Balancing-Guide.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download="Meditation-and-Balancing-Guide.pdf"
                aria-label="Download Meditation and Balancing Guide PDF"
                className={heroButtonVariants.secondary}
              >
                Download Meditation Guide (PDF)
              </a>
              <a
                href="https://wemeditate.com/meditations"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open guided online meditation"
                className={heroButtonVariants.tertiary}
              >
                Guided Online Meditation
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[460px]">
            <div className="absolute inset-6 rounded-[32px] bg-[radial-gradient(circle_at_top,_color-mix(in_srgb,var(--accent)_28%,transparent),_transparent_58%)] blur-2xl" />
            <div className="relative overflow-hidden rounded-[32px] border border-[color:var(--border)] bg-[color:var(--surface)]/76 p-3 shadow-soft backdrop-blur-sm">
              <Image
                src="/meditate-hero.png"
                alt="Calm meditation illustration"
                width={1200}
                height={850}
                className="h-auto w-full rounded-[24px] object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {featureCards.map((card) => (
              <FeatureCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </section>

      <section id="daily-steps" className="scroll-mt-24 py-16">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="rounded-[32px] border border-[color:var(--border)] bg-[linear-gradient(180deg,_color-mix(in_srgb,var(--surface)_86%,transparent),_color-mix(in_srgb,var(--surface-2)_92%,transparent))] p-6 shadow-sm md:p-10">
            <SectionHeader
              eyebrow="Daily Meditation"
              title="10 simple steps to settle into meditation"
              description="Follow the flow gently. Each step is short, structured, and easy to return to, so the practice feels calm rather than complicated."
            />

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {dailySteps.map((step, index) => (
                <article
                  key={step.title}
                  className="group rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)]/86 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--focus)] hover:shadow-soft md:p-6"
                >
                  <div className="flex items-start gap-4">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent-200)] text-sm font-semibold text-[color:var(--ink)]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-[color:var(--ink)]">{step.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">{step.description}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
            <div className="rounded-[32px] border border-[color:var(--border)] bg-[linear-gradient(135deg,_color-mix(in_srgb,var(--surface)_94%,transparent),_color-mix(in_srgb,var(--surface-2)_90%,transparent))] p-6 shadow-sm md:p-8">
              <SectionHeader
                eyebrow="Subtle Balance"
                title="Balance the subtle system and return to the present"
                description="Thoughts often move toward the past or the future. These balancing techniques help you settle back into the center and support a steadier meditation."
              />
              <div className="mt-6 space-y-3 text-sm text-[color:var(--muted)]">
                <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)]/80 px-4 py-4">
                  If you feel heavy, sleepy, or emotional, try left-side balancing.
                </div>
                <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)]/80 px-4 py-4">
                  If you feel overactive, tense, or rushed, try right-side balancing.
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[32px] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-soft md:p-5">
              <Image
                src="/subtle-system.png"
                alt="Nadis and chakras subtle system diagram"
                width={1800}
                height={1800}
                className="h-auto w-full rounded-[24px] bg-[color:var(--surface)]/80"
              />
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <article className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft md:p-8">
              <div className="inline-flex rounded-full border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">
                Left-side balancing
              </div>
              <div className="mx-auto mt-6 max-w-xs rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-2)] p-2">
                <Image
                  src="/balancing-left.png"
                  alt="Left side balancing posture"
                  width={800}
                  height={1500}
                  className="h-auto w-full rounded-[18px] object-contain"
                />
              </div>
              <h3 className="mt-5 text-2xl font-semibold text-[color:var(--ink)]">When emotions feel heavy</h3>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-[color:var(--muted)] md:text-base">
                <li>• Hold the left hand toward a candle with the palm facing upward.</li>
                <li>• Place the right hand naturally toward the earth.</li>
                <li>• Use this when you feel lethargic, nostalgic, lonely, or over-focused on the past.</li>
              </ul>
            </article>

            <article className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft md:p-8">
              <div className="inline-flex rounded-full border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">
                Right-side balancing
              </div>
              <div className="mx-auto mt-6 max-w-xs rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-2)] p-2">
                <Image
                  src="/balancing-right.png"
                  alt="Right side balancing posture"
                  width={800}
                  height={1500}
                  className="h-auto w-full rounded-[18px] object-contain"
                />
              </div>
              <h3 className="mt-5 text-2xl font-semibold text-[color:var(--ink)]">When the mind feels overactive</h3>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-[color:var(--muted)] md:text-base">
                <li>Hold the right hand toward a candle with the palm facing upward.</li>
                <li>Bend the left arm with fingers pointing upward and the palm facing backward.</li>
                <li>Use this when you feel tense, over-planned, rushed, aggressive, or caught in future thinking.</li>
              </ul>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
