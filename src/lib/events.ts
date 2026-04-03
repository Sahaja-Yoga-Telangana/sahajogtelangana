import { format, isSameDay } from 'date-fns';

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

export function getEventDateLabel(date: string | Date, endDate?: string | Date | null) {
  const start = new Date(date);
  const end = endDate ? new Date(endDate) : null;

  if (!end || Number.isNaN(end.getTime()) || isSameDay(start, end)) {
    return format(start, 'MMM dd, yyyy');
  }

  if (start.getFullYear() === end.getFullYear()) {
    if (start.getMonth() === end.getMonth()) {
      return `${format(start, 'MMM dd')} - ${format(end, 'dd, yyyy')}`;
    }

    return `${format(start, 'MMM dd')} - ${format(end, 'MMM dd, yyyy')}`;
  }

  return `${format(start, 'MMM dd, yyyy')} - ${format(end, 'MMM dd, yyyy')}`;
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
