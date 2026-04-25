import type { MetadataRoute } from 'next';
import { site } from '@/lib/seo';

async function getEvents() {
  try {
    const baseUrl = (process.env.APP_URL || site.url).replace(/\/$/, '');
    const res = await fetch(`${baseUrl}/api/events`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) return [];

    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.APP_URL || site.url).replace(/\/$/, '');

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/meditation-hyderabad`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/meditate`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/events`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/centers`, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/contact-us`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${base}/sahaja-yoga`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${base}/shri-mataji`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${base}/school-programs`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${base}/corporate-register`, changeFrequency: 'yearly', priority: 0.5 },
  ];

  const events = await getEvents();

  const eventUrls: MetadataRoute.Sitemap = events.map((e: any) => ({
    url: `${base}/register-event/${e._id}`,
    lastModified: e.updatedAt ? new Date(e.updatedAt) : undefined,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticUrls, ...eventUrls];
}
