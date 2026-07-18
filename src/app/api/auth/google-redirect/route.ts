import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const callbackUrl = req.nextUrl.searchParams.get("callbackUrl") || "/";
  const baseUrl = req.nextUrl.origin;

  try {
    const csrfRes = await fetch(`${baseUrl}/api/auth/csrf`);
    const csrfCookies = csrfRes.headers.get("set-cookie") || "";
    const { csrfToken } = await csrfRes.json();

    const signInRes = await fetch(`${baseUrl}/api/auth/signin/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: csrfCookies,
      },
      body: new URLSearchParams({
        csrfToken,
        callbackUrl,
        json: "true",
      }),
    });

    if (!signInRes.ok) {
      console.error("Sign-in request failed:", await signInRes.text());
      return NextResponse.redirect(
        `${baseUrl}/auth/mobile-callback?error=${encodeURIComponent("Failed to initiate Google sign-in")}`
      );
    }

    const { url: googleAuthUrl } = await signInRes.json();

    if (!googleAuthUrl) {
      return NextResponse.redirect(
        `${baseUrl}/auth/mobile-callback?error=${encodeURIComponent("No authorization URL returned")}`
      );
    }

    const googleUrl = new URL(googleAuthUrl);
    googleUrl.searchParams.set("prompt", "select_account");

    const response = NextResponse.redirect(googleUrl.toString());

    if (csrfCookies) {
      response.headers.set("set-cookie", csrfCookies);
    }

    return response;
  } catch (error) {
    console.error("Google redirect error:", error);
    return NextResponse.redirect(
      `${baseUrl}/auth/mobile-callback?error=${encodeURIComponent("Internal server error")}`
    );
  }
}
