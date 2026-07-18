import { getServerSession } from "next-auth";
import { authOptions, CustomSession, CustomUser } from "@/app/api/auth/[...nextauth]/options";
import { connect } from "@/database/mongo.config";
import { User } from "@/models/User";
import { headers } from "next/headers";
import { decode } from "next-auth/jwt";

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
  let tokenStr: string | null = null;
  try {
    const reqHeaders = headers();
    const authHeader = reqHeaders.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      tokenStr = authHeader.substring(7);
    }
  } catch (error) {
    // Suppress console/headers error when context isn't a request handler (e.g. build time static pages)
  }

  let session: CustomSession | null = null;

  if (tokenStr) {
    try {
      const decoded = await decode({
        token: tokenStr,
        secret: process.env.NEXTAUTH_SECRET!,
      });
      if (decoded && decoded.email) {
        session = {
          user: {
            id: (decoded.id as string) || (decoded.sub as string) || null,
            name: (decoded.name as string) || null,
            email: (decoded.email as string) || null,
            role: (decoded.role as string) || "User",
            avatar: (decoded.picture as string) || null,
          },
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        };
      }
    } catch (error) {
      console.error("Error decoding Authorization Bearer token:", error);
    }
  }

  if (!session) {
    session = (await getServerSession(authOptions)) as CustomSession | null;
  }

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

