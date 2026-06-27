import { getServerSession } from "next-auth";
import { authOptions, CustomSession } from "@/app/api/auth/[...nextauth]/options";
import { connect } from "@/database/mongo.config";
import { User } from "@/models/User";
import jwt from "jsonwebtoken";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function normalizeEmail(value?: string | null) {
  return String(value || "").trim().toLowerCase();
}

export function exactEmailMatch(value?: string | null) {
  return new RegExp(`^${escapeRegex(String(value || "").trim())}$`, "i");
}

export async function getRequiredSession() {
  const session = (await getServerSession(authOptions)) as CustomSession | null;
  if (!session?.user?.email) {
    return session;
  }

  if (!session.user.id) {
    await connect();
    const user = (await User.findOne({ email: exactEmailMatch(session.user.email) }, { _id: 1, role: 1 }).lean()) as any;
    if (user) {
      session.user.id = String(user._id);
      session.user.role = session.user.role || user.role || "User";
    }
  }

  return session;
}

export async function requireAdminSession() {
  const session = await getRequiredSession();
  if (!session || session.user?.role !== "Admin") {
    return null;
  }

  return session;
}

// ============================================================
// Mobile JWT Auth Helpers
// ============================================================

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "supersecret";
const JWT_EXPIRY = "30d";

export function signMobileToken(payload: { id: string; email: string; name?: string | null; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

export function verifyMobileToken(token: string): { id: string; email: string; name?: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch {
    return null;
  }
}

/**
 * Get authenticated user from either NextAuth session cookie OR mobile Bearer token.
 * Returns null if neither is valid.
 */
export async function getSessionFromRequest(request: Request): Promise<{ id: string; email: string; name?: string; role: string } | null> {
  // Try cookie-based session first (web)
  const session = await getRequiredSession();
  if (session?.user?.email && session.user.id) {
    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name || undefined,
      role: session.user.role || "User",
    };
  }

  // Try Bearer token (mobile)
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const decoded = verifyMobileToken(token);
    if (decoded) return decoded;
  }

  return null;
}
