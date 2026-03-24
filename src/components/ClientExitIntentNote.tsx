"use client";

import dynamic from "next/dynamic";

const ExitIntentNote = dynamic(() => import("@/components/ExitIntentNote"), {
  ssr: false,
  loading: () => null,
});

export default function ClientExitIntentNote() {
  return <ExitIntentNote />;
}
