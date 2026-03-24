import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Shri Mataji Nirmala Devi — Founder of Sahaja Yoga',
  description: 'Learn about Shri Mataji Nirmala Devi, founder of Sahaja Yoga, and her role in bringing free meditation to Hyderabad and Telangana.',
  path: '/shri-mataji',
  keywords: [
    'Shri Mataji Nirmala Devi',
    'founder of Sahaja Yoga',
    'Sahaja Yoga history',
  ],
});

export default function ShriMatajiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
