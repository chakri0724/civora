"use client";

import { useEffect } from "react";
import { useCivora } from "@/lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  const tick = useCivora((s) => s.tick);

  // Escalation engine — runs every second in the prototype.
  // In production this logic lives server-side on a schedule; the client only reads.
  useEffect(() => {
    const id = setInterval(() => tick(), 1000);
    return () => clearInterval(id);
  }, [tick]);

  // Register the service worker for PWA/offline/installability.
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  return <>{children}</>;
}
