import { format, isSameDay } from 'date-fns';
import { Locale } from '@/lib/i18n';

export type AppEvent = {
  _id: string;
  title: string;
  description: string;
  date: string | Date;
  endDate?: string | Date | null;
  time: string;
  location: string;
  googleMapLink?: string;
  contactDetails?: string;
  priceBelow12?: number;
  price12To24?: number;
  price25AndAbove?: number;
  image?: string;
  qrImage?: string;
  isActive?: boolean;
  subscriberNotificationSentAt?: string | Date | null;
};

function formatEventDate(value: Date, locale: Locale = 'en') {
  return new Intl.DateTimeFormat(locale === 'te' ? 'te-IN' : 'en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(value);
}

function formatEventMonthDay(value: Date, locale: Locale = 'en') {
  return new Intl.DateTimeFormat(locale === 'te' ? 'te-IN' : 'en-US', {
    month: 'short',
    day: '2-digit',
  }).format(value);
}

export function getEventDateLabel(date: string | Date, endDate?: string | Date | null, locale: Locale = 'en') {
  const start = new Date(date);
  const end = endDate ? new Date(endDate) : null;

  if (!end || Number.isNaN(end.getTime()) || isSameDay(start, end)) {
    return formatEventDate(start, locale);
  }

  if (start.getFullYear() === end.getFullYear()) {
    if (start.getMonth() === end.getMonth()) {
      return `${formatEventMonthDay(start, locale)} - ${new Intl.DateTimeFormat(locale === 'te' ? 'te-IN' : 'en-US', {
        day: '2-digit',
        year: 'numeric',
      }).format(end)}`;
    }

    return `${formatEventMonthDay(start, locale)} - ${formatEventDate(end, locale)}`;
  }

  return `${formatEventDate(start, locale)} - ${formatEventDate(end, locale)}`;
}

export function getEventExcerpt(description: string, maxLength = 130) {
  if (description.length <= maxLength) {
    return description;
  }

  return `${description.slice(0, maxLength).trimEnd()}...`;
}

export function normalizeEventPayload<T extends { date: string | Date; endDate?: string | Date | null }>(event: T): T {
  const normalized = { ...event };
  const startDate = new Date(normalized.date);

  if (normalized.endDate) {
    const endDate = new Date(normalized.endDate);
    if (!Number.isNaN(endDate.getTime()) && endDate < startDate) {
      normalized.endDate = normalized.date;
    }
  }

  return normalized;
}
