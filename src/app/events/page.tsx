'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import EventCard from '@/components/events/EventCard';
import { AppEvent } from '@/lib/events';
import EventSubscriptionForm from '@/components/EventSubscriptionForm';
import { useTranslations } from '@/app/provider/localeProvider';

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
      <div className="flex min-h-screen items-center justify-center bg-[color:var(--bg)]">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-[color:var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_color-mix(in_srgb,var(--accent-200)_42%,transparent),_transparent_28%),linear-gradient(180deg,_color-mix(in_srgb,var(--surface)_82%,transparent),_var(--bg))] py-14">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <div className="rounded-[32px] border border-[color:var(--border)] bg-[color:var(--surface)]/80 px-6 py-10 shadow-soft backdrop-blur-sm md:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--muted)]">{t('events.eyebrow')}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--ink)] md:text-5xl">{t('events.title')}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[color:var(--muted)] md:text-base">
            {t('events.body')}
          </p>
        </div>

        <EventSubscriptionForm />

        {events.length === 0 ? (
          <div className="mt-10 rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-10 text-center text-sm text-[color:var(--muted)] shadow-soft">
            {t('events.empty')}
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
