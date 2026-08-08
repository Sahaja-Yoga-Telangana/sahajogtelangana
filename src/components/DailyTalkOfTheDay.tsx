import { FiExternalLink } from 'react-icons/fi';
import { getDailyTalk } from '@/lib/dailyTalk';
import Reveal from '@/components/motion/Reveal';

export default async function DailyTalkOfTheDay({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  let talk;
  try {
    talk = await getDailyTalk();
  } catch (error) {
    console.error('[DailyTalkOfTheDay] failed to load talk', error);
    return null;
  }

  const embedUrl = talk.talk.vimeoUrl ?? talk.talk.soundcloudUrl;
  if (!embedUrl) return null;

  return (
    <section className="py-[clamp(56px,7vh,80px)]">
      <div className="mx-auto max-w-[1200px] px-[var(--gutter)]">
        <div className="rounded-[var(--radius-xl)] border border-[color:var(--border)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--surface)_94%,transparent),color-mix(in_srgb,var(--surface-2)_90%,transparent))] p-6 shadow-card md:p-10">
          <Reveal>
            <div className="max-w-3xl">
              <p className="eyebrow">{eyebrow}</p>
              <h2 className="mt-4 font-display text-[clamp(24px,2.8vw,32px)] leading-[1.2] tracking-[-0.01em] text-[color:var(--ink)]">
                {title}
              </h2>
              <p className="mt-4 text-[15.5px] leading-[1.8] text-[color:var(--muted)]">{description}</p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-8 overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] p-2 shadow-soft md:p-3">
              <div className="aspect-video w-full overflow-hidden rounded-[var(--radius-md)]">
                <iframe
                  src={embedUrl}
                  title={talk.talk.title}
                  className="h-full w-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </Reveal>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-lg font-medium leading-7 text-[color:var(--ink)] md:text-xl">{talk.talk.title}</h3>
              <p className="mt-1 text-sm text-[color:var(--muted)]">
                {[talk.talk.date, talk.talk.country, talk.talk.durationMinutes ? `${talk.talk.durationMinutes} min` : null].filter(Boolean).join(' · ')}
              </p>
            </div>
            <a
              href={talk.talk.webUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
            >
              <span>Full talk</span>
              <FiExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
