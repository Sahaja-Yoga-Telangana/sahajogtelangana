"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function MobileCallbackContent() {
  const [status, setStatus] = useState("Authenticating...");
  const searchParams = useSearchParams();

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch("/api/auth/mobile-session");
        const data = await res.json();

        // Get the redirect_uri from the URL search params, fallback to default scheme
        const rawRedirectUri = searchParams.get("redirect_uri") || "sytelangana://auth-callback";
        
        // Deep link url should append query params correctly
        const urlConnector = rawRedirectUri.includes("?") ? "&" : "?";

        if (res.ok && data.success && data.token) {
          setStatus("Success! Redirecting back to the app...");
          const userStr = encodeURIComponent(JSON.stringify(data.user));
          window.location.href = `${rawRedirectUri}${urlConnector}token=${data.token}&user=${userStr}`;
        } else {
          console.error("Session verification failed:", data);
          setStatus("Failed to authenticate session.");
          window.location.href = `${rawRedirectUri}${urlConnector}error=${encodeURIComponent(
            data.message || "Failed to authenticate session"
          )}`;
        }
      } catch (err) {
        console.error("Error fetching session:", err);
        setStatus("An error occurred during authentication.");
        const rawRedirectUri = searchParams.get("redirect_uri") || "sytelangana://auth-callback";
        const urlConnector = rawRedirectUri.includes("?") ? "&" : "?";
        window.location.href = `${rawRedirectUri}${urlConnector}error=${encodeURIComponent(
          "An error occurred during authentication"
        )}`;
      }
    }

    // Give it a brief moment for cookie to settle on callback redirect
    const timer = setTimeout(fetchSession, 800);
    return () => clearTimeout(timer);
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-100 p-6">
      <div className="w-12 h-12 border-4 border-t-saffron border-zinc-800 rounded-full animate-spin mb-6"></div>
      <h1 className="text-xl font-medium tracking-tight mb-2">Connecting to App</h1>
      <p className="text-zinc-500 text-sm font-light text-center">{status}</p>
    </div>
  );
}

export default function MobileCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-100 p-6">
        <div className="w-12 h-12 border-4 border-t-saffron border-zinc-800 rounded-full animate-spin mb-6"></div>
        <h1 className="text-xl font-medium tracking-tight mb-2">Connecting to App</h1>
        <p className="text-zinc-500 text-sm font-light text-center">Loading callback...</p>
      </div>
    }>
      <MobileCallbackContent />
    </Suspense>
  );
}
