'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import EventCard from '@/components/events/EventCard';
import { AppEvent } from '@/lib/events';
import EventSubscriptionForm from '@/components/EventSubscriptionForm';

export default function EventsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      toast.error('Please log in to view events.');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;

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

  if (status === 'loading' || (status === 'authenticated' && loadingEvents)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[color:var(--bg)]">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-[color:var(--primary)]" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_color-mix(in_srgb,var(--accent-200)_42%,transparent),_transparent_28%),linear-gradient(180deg,_color-mix(in_srgb,var(--surface)_82%,transparent),_var(--bg))] py-14">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <div className="rounded-[32px] border border-[color:var(--border)] bg-[color:var(--surface)]/80 px-6 py-10 shadow-soft backdrop-blur-sm md:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--muted)]">Events</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--ink)] md:text-5xl">Meditation events and collective gatherings</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[color:var(--muted)] md:text-base">
            Explore upcoming events, public meditation programs, and collective gatherings. Each listing is designed to make the next step clear and easy.
          </p>
        </div>

        <EventSubscriptionForm />

        {events.length === 0 ? (
          <div className="mt-10 rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-10 text-center text-sm text-[color:var(--muted)] shadow-soft">
            No events available at the moment.
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
