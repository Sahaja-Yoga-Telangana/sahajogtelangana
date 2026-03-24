import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'School Meditation Programs in Hyderabad — Sahaja Yoga',
  description: 'Free meditation programs for schools in Hyderabad and Telangana. Guided, age-appropriate sessions that support focus and emotional balance.',
  path: '/school-programs',
  keywords: [
    'school meditation programs Hyderabad',
    'student meditation Hyderabad',
    'free meditation programs for schools',
  ],
});

export default function SchoolProgramsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
