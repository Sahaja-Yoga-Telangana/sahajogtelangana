import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Corporate Meditation Programs in Hyderabad — Sahaja Yoga',
  description: 'Free Sahaja Yoga meditation programs for corporates in Hyderabad and Telangana. Reduce stress and improve focus with guided sessions.',
  path: '/corporate-register',
  keywords: [
    'corporate meditation programs Hyderabad',
    'workplace meditation Hyderabad',
    'free corporate wellness meditation',
  ],
});

export default function CorporateRegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
