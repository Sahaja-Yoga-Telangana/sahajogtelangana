"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "@/app/provider/localeProvider";

const WIDGET_STYLESHEET_ID = "sycenters-widget-styles";
const WIDGET_RUNTIME_ID = "sycenters-widget-runtime";
const WIDGET_POLYFILLS_ID = "sycenters-widget-polyfills";
const WIDGET_MAIN_ID = "sycenters-widget-main";

type CentersWidgetEmbedProps = {
  color?: string;
  scope?: string;
  defaultLanguage?: string;
  gmapsApiKey?: string;
  className?: string;
};

declare global {
  interface Window {
    __syCentersWidgetReady?: boolean;
    __syCentersWidgetLoading?: Promise<void>;
  }
}

function getWidgetLanguage(locale: string) {
  switch (locale) {
    case "te":
      return "en";
    default:
      return "en";
  }
}

function ensureStylesheet() {
  if (document.getElementById(WIDGET_STYLESHEET_ID)) {
    return;
  }

  const link = document.createElement("link");
  link.id = WIDGET_STYLESHEET_ID;
  link.rel = "stylesheet";
  link.href = "https://widget.sycenters.org/styles.css";
  document.head.appendChild(link);
}

function loadScriptSequentially(id: string, src: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(id) as HTMLScriptElement | null;
    if (existing) {
      if ((existing as any).dataset.loaded === "true") {
        resolve();
        return;
      }

      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.type = "module";
    (script as any).dataset.loaded = "false";
    script.addEventListener("load", () => {
      (script as any).dataset.loaded = "true";
      resolve();
    }, { once: true });
    script.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), { once: true });
    document.body.appendChild(script);
  });
}

async function ensureWidgetScripts() {
  if (window.__syCentersWidgetReady) {
    return;
  }

  if (window.__syCentersWidgetLoading) {
    await window.__syCentersWidgetLoading;
    return;
  }

  window.__syCentersWidgetLoading = (async () => {
    await loadScriptSequentially(WIDGET_RUNTIME_ID, "https://widget.sycenters.org/runtime.js");
    await loadScriptSequentially(WIDGET_POLYFILLS_ID, "https://widget.sycenters.org/polyfills.js");
    await loadScriptSequentially(WIDGET_MAIN_ID, "https://widget.sycenters.org/main.js");
    window.__syCentersWidgetReady = true;
  })();

  await window.__syCentersWidgetLoading;
}

export default function CentersWidgetEmbed({
  color = process.env.NEXT_PUBLIC_SYCENTERS_WIDGET_COLOR || "#6C5A4A",
  scope = process.env.NEXT_PUBLIC_SYCENTERS_WIDGET_SCOPE || "",
  defaultLanguage,
  gmapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  className = "",
}: CentersWidgetEmbedProps) {
  const { locale } = useLocale();
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState("");
  const widgetLanguage = defaultLanguage || getWidgetLanguage(locale);
  const widgetKey = useMemo(
    () => `${color}|${scope}|${gmapsApiKey}|${widgetLanguage}`,
    [color, scope, gmapsApiKey, widgetLanguage]
  );

  useEffect(() => {
    let cancelled = false;

    ensureStylesheet();

    if (!gmapsApiKey) {
      setReady(false);
      return;
    }

    const initialize = async () => {
      // Let React commit <syc-widget> before the Angular bundle tries to bootstrap.
      await new Promise((resolve) => window.requestAnimationFrame(() => resolve(null)));
      await ensureWidgetScripts();
      if (!cancelled) {
        setReady(true);
      }
    };

    initialize().catch((error) => {
      console.error("Failed to initialize SYCenters widget:", error);
      if (!cancelled) {
        setLoadError("Unable to load the live center finder right now.");
      }
    });

    return () => {
      cancelled = true;
    };
  }, [gmapsApiKey]);

  if (!gmapsApiKey) {
    return (
      <div className={`rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 text-sm leading-7 text-[color:var(--muted)] ${className}`}>
        Add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` to enable the live SYCenters widget on this page.
      </div>
    );
  }

  if (loadError) {
    return (
      <div className={`rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 text-sm leading-7 text-[color:var(--muted)] ${className}`}>
        {loadError}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="relative min-h-[520px]">
        {!ready ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-2)]/88 px-6 text-sm text-[color:var(--muted)]">
            Loading live center finder...
          </div>
        ) : null}
        <div key={widgetKey} className={ready ? "" : "opacity-0"}>
          {/* eslint-disable-next-line react/no-unknown-property */}
          <syc-widget
            color={color}
            scope={scope}
            gmapsApiKey={gmapsApiKey}
            defaultLanguage={widgetLanguage}
          />
        </div>
      </div>
    </div>
  );
}
