import type { MetadataRoute } from 'next';
import { site } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  const base = site.url || '';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/*'],
      },
    ],
    sitemap: base ? `${base}/sitemap.xml` : undefined,
  };
}
