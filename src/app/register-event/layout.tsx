import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Event Registration — Sahaja Yoga Telangana',
  description: 'Register for a Sahaja Yoga Telangana event.',
  path: '/register-event',
  noindex: true,
});

export default function RegisterEventLayout({ children }: { children: React.ReactNode }) {
  return children;
}
