'use client';

import dynamic from 'next/dynamic';

const EventBanner = dynamic(() => import('@/components/EventBanner'), {
  ssr: false,
  loading: () => null,
});

export default function EventBannerGate({ show }: { show: boolean }) {
  if (!show) return null;
  return <EventBanner />;
}
