import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Meditation Centers in Hyderabad & Telangana — Sahaja Yoga',
  description: 'Find Sahaja Yoga meditation centers in Hyderabad and across Telangana. Free classes, schedules, and contact details for local sessions.',
  path: '/centers',
  keywords: [
    'meditation centers Hyderabad',
    'Sahaja Yoga centers',
    'free meditation Hyderabad',
    'guided meditation Telangana',
  ],
});

export default function CentersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
