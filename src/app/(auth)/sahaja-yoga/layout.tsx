import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'What Is Sahaja Yoga Meditation? — Free Classes in Hyderabad',
  description: 'Learn what Sahaja Yoga meditation is, how self-realization works, and why classes are always free in Hyderabad and Telangana.',
  path: '/sahaja-yoga',
  keywords: [
    'what is Sahaja Yoga',
    'Sahaja Yoga meditation',
    'free meditation classes in Hyderabad',
    'self realization meditation',
  ],
});

export default function SahajaYogaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
