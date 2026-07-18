import { NextRequest, NextResponse } from "next/server";
import { getToken, encode } from "next-auth/jwt";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No active session." },
        { status: 401 }
      );
    }

    // Re-encode token matching signature as NextAuth
    const encodedToken = await encode({
      token,
      secret: process.env.NEXTAUTH_SECRET!,
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return NextResponse.json(
      {
        success: true,
        token: encodedToken,
        user: token.user || {
          id: token.sub || token.id,
          name: token.name,
          email: token.email,
          avatar: token.picture,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Mobile session error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
