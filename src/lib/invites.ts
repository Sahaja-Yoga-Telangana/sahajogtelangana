import crypto from "crypto";

export const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
export const MAX_ACTIVE_INVITES = 5;

export function generateInviteToken(): string {
  return crypto.randomBytes(24).toString("hex");
}

export function hashInviteToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function isInviteExpired(invite: { expiresAt?: Date | null }): boolean {
  // Legacy invites created before the expiry system have no expiresAt and never
  // auto-delete; treat them as expired so they don't linger as "active" forever.
  if (!invite?.expiresAt) return true;
  return invite.expiresAt.getTime() < Date.now();
}
