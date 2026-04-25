import type { MetadataRoute } from 'next';
import { shouldAllowIndexing, site } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  const base = site.url || '';
  if (!shouldAllowIndexing) {
    return {
      rules: [
        {
          userAgent: '*',
          disallow: '/',
        },
      ],
    };
  }

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
