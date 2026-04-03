import { getServerSession } from "next-auth";
import { authOptions, CustomSession } from "@/app/api/auth/[...nextauth]/options";
import { connect } from "@/database/mongo.config";
import { User } from "@/models/User";

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
