import { describe, it, expect } from "vitest";
import {
  isTerminalStatus,
  clampSnoozeDays,
  computeSnoozedUntil,
} from "@/lib/seeker-snooze";
import {
  SNOOZE_DEFAULT_DAYS,
  SNOOZE_MIN_DAYS,
  SNOOZE_MAX_DAYS,
} from "@/constants/snooze";

const DAY_MS = 24 * 60 * 60 * 1000;

describe("isTerminalStatus", () => {
  it("flags Converted and Dormant as terminal", () => {
    expect(isTerminalStatus("Converted")).toBe(true);
    expect(isTerminalStatus("Dormant")).toBe(true);
  });

  it("keeps actionable statuses non-terminal", () => {
    expect(isTerminalStatus("New")).toBe(false);
    expect(isTerminalStatus("Contacted")).toBe(false);
    expect(isTerminalStatus("Follow-up scheduled")).toBe(false);
  });
});

describe("clampSnoozeDays", () => {
  it("uses the default when no days are provided", () => {
    expect(clampSnoozeDays(undefined)).toBe(SNOOZE_DEFAULT_DAYS);
    expect(clampSnoozeDays(null)).toBe(SNOOZE_DEFAULT_DAYS);
    expect(clampSnoozeDays(NaN)).toBe(SNOOZE_DEFAULT_DAYS);
  });

  it("rounds fractional values", () => {
    expect(clampSnoozeDays(3.5)).toBe(4);
  });

  it("clamps below the minimum", () => {
    expect(clampSnoozeDays(0)).toBe(SNOOZE_MIN_DAYS);
    expect(clampSnoozeDays(-3)).toBe(SNOOZE_MIN_DAYS);
  });

  it("clamps above the maximum", () => {
    expect(clampSnoozeDays(60)).toBe(SNOOZE_MAX_DAYS);
  });
});

describe("computeSnoozedUntil", () => {
  it("computes the release date N days from now", () => {
    const now = new Date("2026-08-01T10:00:00Z");
    const until = computeSnoozedUntil(now, 4);
    expect(until.getTime()).toBe(now.getTime() + 4 * DAY_MS);
  });

  it("defaults to the default duration", () => {
    const now = new Date("2026-08-01T10:00:00Z");
    const until = computeSnoozedUntil(now, undefined);
    expect(until.getTime()).toBe(now.getTime() + SNOOZE_DEFAULT_DAYS * DAY_MS);
  });
});
