import React from 'react';

type Props = { json: Record<string, any> | Record<string, any>[] };

export default function SeoJsonLd({ json }: Props) {
  const data = Array.isArray(json) ? json : [json];
  return (
    <script
      type="application/ld+json"
      // Using dangerouslySetInnerHTML is necessary to inline JSON-LD
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data.length === 1 ? data[0] : data) }}
      suppressHydrationWarning
    />
  );
}
