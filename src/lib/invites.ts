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
  return !!invite.expiresAt && invite.expiresAt.getTime() < Date.now();
}
