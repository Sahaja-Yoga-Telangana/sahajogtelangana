'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { FiCalendar } from 'react-icons/fi';
import EventCard from '@/components/events/EventCard';
import SeekerRegistrationDownloads from '@/components/events/SeekerRegistrationDownloads';
import { AppEvent } from '@/lib/events';
import EventSubscriptionForm from '@/components/EventSubscriptionForm';
import { useTranslations } from '@/app/provider/localeProvider';
import EmptyState from '@/components/EmptyState';

export default function EventsPage() {
  const { status } = useSession();
  const t = useTranslations();
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;

    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events?limit=24');
        const data = await response.json();
        if (data?.status === 200) {
          setEvents(data.data);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, [status]);

  if (status === 'loading' || loadingEvents) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_color-mix(in_srgb,var(--accent-200)_42%,transparent),_transparent_28%),linear-gradient(180deg,_color-mix(in_srgb,var(--surface)_82%,transparent),_var(--bg))] py-14">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
          <div className="rounded-[32px] border border-[color:var(--border)] bg-[color:color-mix(in_srgb,var(--surface)_80%,transparent)] px-6 py-10 shadow-soft backdrop-blur-sm md:px-10 animate-pulse">
            <div className="h-4 w-24 rounded-full bg-[color:var(--border)]" />
            <div className="mt-6 h-10 w-72 rounded-lg bg-[color:var(--border)]" />
            <div className="mt-4 h-4 w-full max-w-2xl rounded bg-[color:var(--border)]" />
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-[28px] border border-[color:var(--border)] bg-[color:color-mix(in_srgb,var(--surface)_80%,transparent)] p-5 animate-pulse">
                <div className="aspect-[4/3] w-full rounded-2xl bg-[color:var(--border)]" />
                <div className="mt-4 space-y-3">
                  <div className="h-4 w-3/4 rounded bg-[color:var(--border)]" />
                  <div className="h-3 w-1/2 rounded bg-[color:var(--border)]" />
                  <div className="h-3 w-full rounded bg-[color:var(--border)]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_color-mix(in_srgb,var(--accent-200)_42%,transparent),_transparent_28%),linear-gradient(180deg,_color-mix(in_srgb,var(--surface)_82%,transparent),_var(--bg))] py-14">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <div className="rounded-[32px] border border-[color:var(--border)] bg-[color:color-mix(in_srgb,var(--surface)_80%,transparent)] px-6 py-10 shadow-soft backdrop-blur-sm md:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--muted)]">{t('events.eyebrow')}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--ink)] md:text-5xl">{t('events.title')}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[color:var(--muted)] md:text-base">
            {t('events.body')}
          </p>
        </div>

        <EventSubscriptionForm />

        {events.length === 0 ? (
          <EmptyState
            icon={<FiCalendar className="w-7 h-7 text-[color:var(--muted)]" />}
            title={t('events.empty')}
            message="Check back later for upcoming programs and events."
          />
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {events.map((event) => (
              <div key={event._id} className="flex h-full flex-col gap-3">
                <EventCard event={event} />
                <div className="flex flex-col gap-2 rounded-[20px] border border-[color:var(--border)] bg-[color:color-mix(in_srgb,var(--surface)_88%,transparent)] p-3 shadow-soft">
                  <SeekerRegistrationDownloads event={event} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
