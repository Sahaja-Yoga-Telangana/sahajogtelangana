import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Meditation Centers in Hyderabad & Telangana — Sahaja Yoga',
  description: 'Find Sahaja Yoga meditation centers in Hyderabad and across Telangana. Explore free meditation classes, weekly timings, center locations, and local contact details.',
  path: '/centers',
  keywords: [
    'meditation centers Hyderabad',
    'meditation classes in Hyderabad',
    'free meditation classes in Hyderabad',
    'Sahaja Yoga centers',
    'free meditation Hyderabad',
    'guided meditation Telangana',
  ],
});

export default function CentersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
