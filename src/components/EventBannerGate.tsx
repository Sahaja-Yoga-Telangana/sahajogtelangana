'use client';

import EventBanner from '@/components/EventBanner';
import { AppEvent } from '@/lib/events';

export default function EventBannerGate({
  show,
  initialEvents = [],
}: {
  show: boolean;
  initialEvents?: AppEvent[];
}) {
  if (!show) return null;
  return <EventBanner initialEvents={initialEvents} />;
}
