import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Contact Sahaja Yoga Telangana — Hyderabad Meditation Classes',
  description: 'Contact Sahaja Yoga Telangana for free meditation classes in Hyderabad. Enquire about centers, events, school programs, or corporate sessions.',
  path: '/contact-us',
  keywords: [
    'contact Sahaja Yoga Hyderabad',
    'meditation classes Hyderabad contact',
    'free meditation Telangana',
  ],
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
