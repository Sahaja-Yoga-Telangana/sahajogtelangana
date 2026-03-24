'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Slider from 'react-slick';
import { FiArrowRight, FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';
import { AppEvent, getEventDateLabel, getEventExcerpt } from '@/lib/events';

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
              Join collective meditations, musical events, and public programs presented with a cleaner, more visual event experience.
            </p>
          </div>
        </div>

        <Slider {...sliderSettings}>
          {events.map((event) => (
            <div key={event._id} className="px-2 pb-4">
              <HomeEventCard event={event} />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}

function HomeEventCard({ event }: { event: AppEvent }) {
  const hasRemoteImage = !!event.image && /^https?:\/\//.test(event.image);
  const isFreeEntry =
    (event.priceBelow12 ?? 1000) === 0 &&
    (event.price12To24 ?? 1800) === 0 &&
    (event.price25AndAbove ?? 2600) === 0;

  return (
    <Link
      href={`/register-event/${event._id}`}
      className="group block overflow-hidden rounded-[32px] border border-[color:var(--border)] bg-[color:var(--surface)] shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(16,16,16,0.12)]"
    >
      <div className="grid gap-0 md:grid-cols-[0.95fr_1.05fr]">
        <div className="relative min-h-[260px] overflow-hidden bg-[linear-gradient(160deg,_color-mix(in_srgb,var(--accent-200)_72%,transparent),_color-mix(in_srgb,var(--surface-2)_86%,transparent),_color-mix(in_srgb,var(--surface)_88%,transparent))]">
          {event.image ? (
            <Image
              src={event.image}
              alt={event.title}
              width={960}
              height={720}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized={hasRemoteImage}
            />
          ) : (
            <div className="flex h-full items-center justify-center p-8">
              <div className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface)]/84 px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--primary)]">
                Sahaja Yoga Event
              </div>
            </div>
          )}

          {isFreeEntry ? (
            <div className="absolute left-4 top-4 z-10 inline-flex items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)]/96 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--primary)] shadow-[0_10px_24px_rgba(0,0,0,0.18)] backdrop-blur-sm">
              Free Entry
            </div>
          ) : null}

          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/10 to-transparent md:hidden" />
        </div>

        <div className="flex flex-col p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-3 text-sm text-[color:var(--muted)]">
            <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--surface-2)] px-3 py-1.5">
              <FiCalendar className="h-4 w-4" aria-hidden="true" />
              {getEventDateLabel(event.date, event.endDate)}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] px-3 py-1.5">
              <FiClock className="h-4 w-4" aria-hidden="true" />
              {event.time}
            </span>
          </div>

          <h3 className="mt-5 text-2xl font-semibold tracking-tight text-[color:var(--ink)] md:text-3xl">{event.title}</h3>
          <p className="mt-4 text-sm leading-7 text-[color:var(--muted)] md:text-base">
            {getEventExcerpt(event.description, 220)}
          </p>

          <div className="mt-5 flex items-start gap-2 text-sm leading-7 text-[color:var(--muted)] md:text-base">
            <FiMapPin className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{event.location}</span>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <span className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-[color:var(--primary)] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-300 group-hover:bg-[color:var(--primary-600)]">
              Register Now
            </span>
            <FiArrowRight className="h-5 w-5 text-[color:var(--primary)] transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </div>
        </div>
      </div>
    </Link>
  );
}
