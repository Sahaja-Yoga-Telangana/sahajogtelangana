'use client';

import { useEffect, useState } from 'react';
import EventCard from '@/components/events/EventCard';
import SeekerRegistrationDownloads from '@/components/events/SeekerRegistrationDownloads';
import { AppEvent } from '@/lib/events';

export default function Events() {
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/events?limit=12');
        const data = await response.json();
        if (data?.status === 200 && data?.data?.length > 0) {
          setEvents(data.data);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="my-10 flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-[color:var(--primary)]" />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <section id="other-events" className="py-12">
        <div className="mx-auto max-w-6xl px-4 text-center md:px-6">
          <h2 className="text-3xl font-semibold text-[color:var(--ink)]">Upcoming Events</h2>
          <p className="mt-4 text-[color:var(--muted)]">No upcoming events at the moment. Please check back later.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="other-events" className="py-12">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-10 flex flex-col gap-3 text-center">
          <p className="eyebrow">Events</p>
          <h2 className="font-display text-[clamp(26px,3.2vw,36px)] leading-[1.15] tracking-[-0.015em] text-[color:var(--ink)]">
            More Events
          </h2>
          <p className="mx-auto max-w-md text-[color:var(--muted)]">
            Thoughtfully presented event cards with all the essentials up front.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {events.map((event) => (
            <div key={event._id} className="flex h-full flex-col gap-3">
              <EventCard event={event} />
              <div className="flex flex-col gap-2 rounded-[20px] border border-[color:var(--border)] bg-[color:var(--surface)]/88 p-3 shadow-soft">
                <SeekerRegistrationDownloads event={event} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
