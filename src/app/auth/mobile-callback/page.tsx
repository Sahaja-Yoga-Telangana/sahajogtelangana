"use client";

import { useEffect, useState } from "react";

export default function MobileCallbackPage() {
  const [status, setStatus] = useState("Authenticating...");

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch("/api/auth/mobile-session");
        const data = await res.json();

        if (res.ok && data.success && data.token) {
          setStatus("Success! Redirecting back to the app...");
          // Deep link redirect to app scheme sytelangana://
          const userStr = encodeURIComponent(JSON.stringify(data.user));
          window.location.href = `sytelangana://auth-callback?token=${data.token}&user=${userStr}`;
        } else {
          console.error("Session verification failed:", data);
          setStatus("Failed to authenticate session.");
          window.location.href = `sytelangana://auth-callback?error=${encodeURIComponent(
            data.message || "Failed to authenticate session"
          )}`;
        }
      } catch (err) {
        console.error("Error fetching session:", err);
        setStatus("An error occurred during authentication.");
        window.location.href = `sytelangana://auth-callback?error=${encodeURIComponent(
          "An error occurred during authentication"
        )}`;
      }
    }

    // Give it a brief moment for cookie to settle on callback redirect
    const timer = setTimeout(fetchSession, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-100 p-6">
      <div className="w-12 h-12 border-4 border-t-saffron border-zinc-800 rounded-full animate-spin mb-6"></div>
      <h1 className="text-xl font-medium tracking-tight mb-2">Connecting to App</h1>
      <p className="text-zinc-500 text-sm font-light text-center">{status}</p>
    </div>
  );
}
