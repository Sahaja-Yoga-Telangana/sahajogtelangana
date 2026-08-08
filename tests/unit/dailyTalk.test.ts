import { describe, it, expect } from "vitest";
import {
  buildDailyTalk,
  hashSeed,
  istDateKey,
  mediaUrl,
  pickIndex,
} from "@/lib/dailyTalk";

describe("daily talk helpers", () => {
  it("formats the IST calendar date as YYYY-MM-DD", () => {
    expect(istDateKey(new Date("2026-08-01T10:00:00Z"))).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("hashes deterministically", () => {
    expect(hashSeed("2026-08-01")).toBe(hashSeed("2026-08-01"));
    expect(hashSeed("2026-08-01")).not.toBe(hashSeed("2026-08-02"));
  });

  it("picks a stable index within bounds for a given date", () => {
    const poolLength = 1033;
    const idx = pickIndex(poolLength, "2026-08-01");
    expect(idx).toBe(pickIndex(poolLength, "2026-08-01"));
    expect(idx).toBeGreaterThanOrEqual(0);
    expect(idx).toBeLessThan(poolLength);
  });

  it("picks different talks on different dates (over a week)", () => {
    const poolLength = 1033;
    const dates = ["2026-08-01", "2026-08-02", "2026-08-03", "2026-08-04", "2026-08-05", "2026-08-06", "2026-08-07"];
    const indices = new Set(dates.map((d) => pickIndex(poolLength, d)));
    expect(indices.size).toBeGreaterThan(1);
  });

  it("throws on an empty pool", () => {
    expect(() => pickIndex(0, "2026-08-01")).toThrow("empty");
  });

  it("maps the talk detail into the response shape", () => {
    const item = {
      id: 6713,
      title: "What do we have to become after the human stage?",
      date: "1980-09-21",
      duration_talk: 94,
      url: "/api/talk/6713",
      web_url: "https://learnsahajayoga.org/post/6713",
    };
    const detail = {
      title: "Longer Detail Title",
      year: "1980",
      country: "France",
      spoken_languages: ["English"],
      web_url: "https://learnsahajayoga.org/post/6713",
      content_markdown: "# Talk",
      media: {
        soundcloud: [{ url: "https://w.soundcloud.com/player/?url=sc" }],
        vimeo: [{ url: "https://player.vimeo.com/video/1?h=abc" }],
      },
    };
    const talk = buildDailyTalk("2026-08-01", item, detail);
    expect(talk.date).toBe("2026-08-01");
    expect(talk.talk.id).toBe(6713);
    expect(talk.talk.title).toBe("Longer Detail Title");
    expect(talk.talk.durationMinutes).toBe(94);
    expect(talk.talk.country).toBe("France");
    expect(talk.talk.spokenLanguages).toEqual(["English"]);
    expect(talk.talk.soundcloudUrl).toContain("soundcloud");
    expect(talk.talk.vimeoUrl).toContain("vimeo");
  });

  it("falls back to list values and null media when the detail is sparse", () => {
    const item = {
      id: 274,
      title: "Press Conference and Interview",
      date: "1981-01-01",
      duration_talk: 61,
      url: "/api/talk/274",
      web_url: "https://learnsahajayoga.org/post/274",
    };
    const talk = buildDailyTalk("2026-08-02", item, {});
    expect(talk.talk.title).toBe("Press Conference and Interview");
    expect(talk.talk.year).toBe("1981");
    expect(talk.talk.durationMinutes).toBe(61);
    expect(talk.talk.soundcloudUrl).toBeNull();
    expect(talk.talk.vimeoUrl).toBeNull();
  });

  it("mediaUrl returns the first entry or null", () => {
    const detail = { media: { soundcloud: [{ url: "https://sc.example" }] } };
    expect(mediaUrl(detail, "soundcloud")).toBe("https://sc.example");
    expect(mediaUrl(detail, "vimeo")).toBeNull();
    expect(mediaUrl({}, "soundcloud")).toBeNull();
  });
});
