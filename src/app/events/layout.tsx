import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Sahaja Yoga Events',
  description: 'Member events and registrations for Sahaja Yoga Telangana.',
  path: '/events',
  noindex: true,
});

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
