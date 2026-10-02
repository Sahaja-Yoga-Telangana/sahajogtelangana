import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const TARGET_URL =
  "https://script.google.com/macros/s/AKfycbzBlc9r_bZiyFBdU4JXiB1V70ga2bk2EvRdk6XC3NnAbkuqINh1odDfWk7nB5CzxFXpDA/exec";

export async function GET(request: NextRequest) {
  try {
    const res = await fetch(TARGET_URL, {
      redirect: "follow",
      headers: {
        "User-Agent": request.headers.get("user-agent") || "Mozilla/5.0",
      },
    });

    const rawHtml = await res.text();
    const googleOrigin = "https://script.google.com";

    // Rewrite Google-hosted relative asset paths to absolute URLs
    const html = rawHtml
      .replace(/(src|href)="\/static\//g, `$1="${googleOrigin}/static/`)
      .replace(/(src|href)="\/macros\//g, `$1="${googleOrigin}/macros/`);

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=300",
        // Strip any frame-blocking headers from upstream
        "X-Frame-Options": "SAMEORIGIN",
        "Content-Security-Policy": "frame-ancestors 'self'",
      },
    });
  } catch (err) {
    console.error("Tour proxy error:", err);
    return new NextResponse("Unable to load schedule. Please open in a new tab.", {
      status: 502,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
