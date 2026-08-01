import { FiExternalLink } from 'react-icons/fi';
import { getDailyTalk } from '@/lib/dailyTalk';

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
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="rounded-[32px] border border-[color:var(--border)] bg-[linear-gradient(135deg,_color-mix(in_srgb,var(--surface)_94%,transparent),_color-mix(in_srgb,var(--surface-2)_90%,transparent))] p-6 shadow-sm md:p-10">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--muted)]">{eyebrow}</p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[color:var(--ink)] md:text-3xl">{title}</h2>
            <p className="mt-4 text-sm leading-7 text-[color:var(--muted)] md:text-base md:leading-8">{description}</p>
          </div>
          <div className="mt-8 overflow-hidden rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-2 shadow-soft md:p-3">
            <div className="aspect-video w-full overflow-hidden rounded-[22px]">
              <iframe
                src={embedUrl}
                title={talk.talk.title}
                className="h-full w-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold leading-7 text-[color:var(--ink)] md:text-xl">{talk.talk.title}</h3>
              <p className="mt-1 text-sm text-[color:var(--muted)]">
                {[talk.talk.date, talk.talk.country, talk.talk.durationMinutes ? `${talk.talk.durationMinutes} min` : null].filter(Boolean).join(' · ')}
              </p>
            </div>
            <a
              href={talk.talk.webUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center justify-center whitespace-nowrap rounded-full border border-[color:var(--border)] bg-[color:var(--surface)]/92 px-6 py-3 text-sm font-semibold text-[color:var(--ink)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[color:var(--surface-2)] hover:shadow-soft"
            >
              <span>Full talk</span>
              <FiExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
