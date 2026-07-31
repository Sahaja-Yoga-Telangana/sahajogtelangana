import {
  SNOOZE_DEFAULT_DAYS,
  SNOOZE_MAX_DAYS,
  SNOOZE_MIN_DAYS,
  TERMINAL_STATUSES,
} from "@/constants/snooze";

export function isTerminalStatus(status: string): boolean {
  return TERMINAL_STATUSES.includes(status);
}

export function clampSnoozeDays(days: number | undefined | null): number {
  if (!Number.isFinite(days)) return SNOOZE_DEFAULT_DAYS;
  const rounded = Math.round(days as number);
  if (rounded < SNOOZE_MIN_DAYS) return SNOOZE_MIN_DAYS;
  if (rounded > SNOOZE_MAX_DAYS) return SNOOZE_MAX_DAYS;
  return rounded;
}

export function computeSnoozedUntil(now: Date, days: number | undefined | null): Date {
  return new Date(now.getTime() + clampSnoozeDays(days) * 24 * 60 * 60 * 1000);
}
