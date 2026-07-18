"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function GoogleRedirectContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  useEffect(() => {
    async function initiateGoogleSignIn() {
      try {
        const csrfRes = await fetch("/api/auth/csrf");
        const { csrfToken } = await csrfRes.json();

        const signInRes = await fetch("/api/auth/signin/google", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          credentials: "include",
          body: new URLSearchParams({
            csrfToken,
            callbackUrl,
            json: "true",
          }),
        });

        const { url } = await signInRes.json();
        if (!url) throw new Error("No authorization URL returned");

        const googleUrl = new URL(url);
        googleUrl.searchParams.set("prompt", "select_account");
        window.location.href = googleUrl.toString();
      } catch (err) {
        console.error("Google redirect error:", err);
        const baseUrl = window.location.origin;
        window.location.href = `${baseUrl}/auth/mobile-callback?error=${encodeURIComponent("Failed to initiate Google sign-in")}`;
      }
    }

    initiateGoogleSignIn();
  }, [callbackUrl]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-100 p-6">
      <div className="w-12 h-12 border-4 border-t-saffron border-zinc-800 rounded-full animate-spin mb-6" />
      <p className="text-zinc-400 text-sm font-light">Redirecting to Google...</p>
    </div>
  );
}

export default function GoogleRedirectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-100 p-6">
        <div className="w-12 h-12 border-4 border-t-saffron border-zinc-800 rounded-full animate-spin mb-6" />
        <p className="text-zinc-400 text-sm font-light">Loading...</p>
      </div>
    }>
      <GoogleRedirectContent />
    </Suspense>
  );
}
