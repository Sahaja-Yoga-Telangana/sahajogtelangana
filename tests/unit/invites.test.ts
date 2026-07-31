import { describe, it, expect } from "vitest";
import {
  generateInviteToken,
  hashInviteToken,
  isInviteExpired,
  INVITE_TTL_MS,
} from "@/lib/invites";

describe("invite token helpers", () => {
  it("generates a 48-char hex token", () => {
    const token = generateInviteToken();
    expect(token).toMatch(/^[0-9a-f]{48}$/);
  });

  it("generates unique tokens", () => {
    const a = generateInviteToken();
    const b = generateInviteToken();
    expect(a).not.toBe(b);
  });

  it("hashes tokens deterministically and irreversibly", () => {
    const token = generateInviteToken();
    expect(hashInviteToken(token)).toBe(hashInviteToken(token));
    expect(hashInviteToken(token)).not.toBe(token);
    expect(hashInviteToken(token)).toMatch(/^[0-9a-f]{64}$/);
  });

  it("flags invites past their expiry", () => {
    expect(isInviteExpired({ expiresAt: new Date(Date.now() - 1000) })).toBe(true);
    expect(isInviteExpired({ expiresAt: new Date(Date.now() + INVITE_TTL_MS) })).toBe(false);
    expect(isInviteExpired({ expiresAt: null })).toBe(false);
    expect(isInviteExpired({})).toBe(false);
  });
});
