'use client';

import { useState, useEffect } from 'react';
import Slider from 'react-slick';
import EventCard from '@/components/events/EventCard';
import { AppEvent } from '@/lib/events';

export default function EventBanner() {
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/events?limit=8');
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

  const sliderSettings = {
    dots: true,
    infinite: events.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: events.length > 1,
    autoplaySpeed: 5000,
    arrows: false,
    adaptiveHeight: true,
  };

  if (loading) {
    return null;
  }

  if (events.length === 0) {
    return (
      <div id="events" className="bg-[color:var(--surface-2)] py-10">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-2xl font-semibold text-[color:var(--ink)]">Upcoming events</h2>
          <p className="mt-2 text-[color:var(--muted)]">Stay tuned for new meditation programs and collective sessions.</p>
        </div>
      </div>
    );
  }

  return (
    <section id="events" className="bg-[linear-gradient(180deg,_color-mix(in_srgb,var(--surface-2)_92%,transparent),_color-mix(in_srgb,var(--bg)_92%,transparent))] py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 flex flex-col gap-3 text-center md:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--muted)]">Sahaja Yoga Telangana</p>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <h2 className="text-3xl font-semibold tracking-tight text-[color:var(--ink)] md:text-4xl">Upcoming events</h2>
            <p className="max-w-2xl text-sm leading-7 text-[color:var(--muted)] md:text-base">
              Join collective meditations, pujas, and public programs presented with a cleaner, more visual event experience.
            </p>
          </div>
        </div>

        <Slider {...sliderSettings}>
          {events.map((event) => (
            <div key={event._id} className="px-2 pb-4">
              <EventCard event={event} />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
