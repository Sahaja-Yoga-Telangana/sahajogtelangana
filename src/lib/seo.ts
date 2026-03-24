import type { Metadata } from 'next';
import Env from '@/config/env';

export const site = {
  name: 'Sahaja Yoga Telangana',
  shortName: 'Sahaja Yoga',
  description: 'Official website of Sahaja Yoga Telangana: learn meditation, explore upcoming events, and connect with centers across Telangana.',
  url: Env.APP_URL || 'https://www.sahajayogatelangana.org',
  locale: 'en_IN',
  twitter: '@sahajayoga',
  ogImage: '/assets/images/sahaja.jpg',
  logo: '/assets/images/logo.svg',
  keywords: [
    'Sahaja Yoga',
    'Sahaja Yoga Telangana',
    'Sahaja Yoga Hyderabad',
    'meditation in Hyderabad',
    'free meditation classes in Hyderabad',
    'yoga classes Hyderabad',
    'meditation classes Telangana',
    'self realization meditation',
    'guided meditation Hyderabad',
    'free meditation sessions',
  ],
};

export function absoluteUrl(path: string = ''): string {
  const base = site.url?.replace(/\/$/, '') || '';
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

export function defaultMetadata(overrides?: Metadata): Metadata {
  const metadataBase = new URL(site.url);
  const base: Metadata = {
    metadataBase,
    applicationName: site.name,
    title: {
      default: `${site.name} — Meditation & Events` ,
      template: `%s | ${site.name}`,
    },
    description: site.description,
    keywords: site.keywords,
    alternates: {
      canonical: site.url,
    },
    openGraph: {
      type: 'website',
      locale: site.locale,
      url: site.url,
      siteName: site.name,
      title: `${site.name} — Meditation & Events`,
      description: site.description,
      images: [{ url: site.ogImage, width: 1200, height: 630, alt: site.name }],
    },
    twitter: {
      card: 'summary_large_image',
      site: site.twitter,
      creator: site.twitter,
      title: `${site.name} — Meditation & Events`,
      description: site.description,
      images: [site.ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: '/favicon.ico',
    },
  };
  return { ...base, ...overrides };
}

export function pageMetadata({
  title,
  description,
  path,
  image,
  noindex,
  keywords,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noindex?: boolean;
  keywords?: string[];
}): Metadata {
  const url = absoluteUrl(path || '');
  const ogImage = image || site.ogImage;
  return {
    title,
    description,
    keywords: keywords || site.keywords,
    alternates: { canonical: url },
    openGraph: {
      url,
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      siteName: site.name,
      type: 'website',
      locale: site.locale,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      site: site.twitter,
      creator: site.twitter,
    },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
  };
}
