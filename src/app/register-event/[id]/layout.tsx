import type { Metadata } from 'next';
import { pageMetadata, absoluteUrl } from '@/lib/seo';
import SeoJsonLd from '@/components/SeoJsonLd';

async function getEvent(id: string) {
  try {
    const res = await fetch(`${absoluteUrl('')}/api/events/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    if (json?.status === 200) return json.data;
    return null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const ev = await getEvent(params.id);
  const title = ev?.title ? `${ev.title} — Register | Sahaja Yoga Telangana` : 'Register for Event | Sahaja Yoga Telangana';
  const desc = ev?.description || 'Register for Sahaja Yoga events. Join collective meditations, workshops, and special programs across Telangana.';
  const image = ev?.image || '/assets/images/sahaja.jpg';
  return pageMetadata({
    title,
    description: desc,
    path: `/register-event/${params.id}`,
    image,
  });
}

export default async function RegisterEventLayout({ children, params }: { children: React.ReactNode; params: { id: string } }) {
  const ev = await getEvent(params.id);
  const startDate = ev?.date ? new Date(ev.date).toISOString() : undefined;
  return (
    <>
      {ev && (
        <SeoJsonLd
          json={{
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: ev.title,
            description: ev.description,
            image: ev.image ? [ev.image] : undefined,
            startDate,
            eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
            eventStatus: 'https://schema.org/EventScheduled',
            location: ev.location
              ? {
                  '@type': 'Place',
                  name: ev.location,
                  address: {
                    '@type': 'PostalAddress',
                    addressLocality: ev.location,
                    addressRegion: 'Telangana',
                    addressCountry: 'IN',
                  },
                }
              : undefined,
            organizer: {
              '@type': 'Organization',
              name: 'Sahaja Yoga Telangana',
              url: absoluteUrl('/'),
            },
          }}
        />
      )}
      {children}
    </>
  );
}
