"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCivora } from "@/lib/store";
import { AuthGate } from "./AuthGate";
import { BottomNav } from "./BottomNav";
import { Wordmark } from "./Logo";
import { VerifiedTick } from "./Pills";

const TITLES: Record<string, { title: string; sub: string }> = {
  "/feed": { title: "Nearby issues", sub: "Live in your ward — tap “+” to raise one." },
  "/report": { title: "Raise an issue", sub: "Reaches the lowest authority — then climbs if ignored." },
  "/board": { title: "Accountability", sub: "Who acts, and who lets it escalate past them." },
  "/campaigns": { title: "Government campaigns", sub: "Official notices & awareness drives from authorities." },
};

// Expose a way for pages to open the auth gate.
let openAuthExternal: (() => void) | null = null;
export function requestAuth() {
  openAuthExternal?.();
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useCivora((s) => s.user);
  const [showAuth, setShowAuth] = useState(true);
  openAuthExternal = () => setShowAuth(true);

  const isDetail = pathname.startsWith("/issue/");
  const head = TITLES[pathname] ?? { title: "Issue detail", sub: "Full report, photos and escalation trail." };
  const maskedPhone = user.phone ? `+91 ${user.phone.slice(0, 2)}XXXX${user.phone.slice(-2)}` : "";

  return (
    <div className="flex items-center justify-center min-h-screen py-5">
      <div className="w-[390px] max-w-full h-[800px] max-h-[96vh] bg-paper rounded-[44px] overflow-hidden relative flex flex-col shadow-[0_0_0_12px_#0d0d0b,0_0_0_14px_#34342f,0_30px_60px_-20px_rgba(0,0,0,0.6)]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150px] h-7 bg-[#0d0d0b] rounded-b-[18px] z-[60]" />

        {showAuth && <AuthGate onClose={() => setShowAuth(false)} />}

        <header className="pt-10 px-[18px] pb-3 bg-card border-b border-line shrink-0 relative z-10">
          <div className="flex items-center justify-between">
            <Wordmark markSize={30} />
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-verify">
              {user.verified ? (
                <>
                  <VerifiedTick size={15} />
                  <span>Verified · {maskedPhone}</span>
                </>
              ) : (
                <span className="text-muted">Read-only · not verified</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2.5 mt-3 mb-0.5">
            {isDetail && (
              <button onClick={() => router.back()} aria-label="Back" className="text-ink">
                <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" stroke="currentColor" fill="none" strokeWidth={2.2}>
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            )}
            <div>
              <h1 className="text-[19px] font-bold tracking-tight m-0">{head.title}</h1>
              <p className="text-[12.5px] text-muted m-0">{head.sub}</p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-3.5 pt-4 pb-[84px]">{children}</div>

        {!isDetail && <BottomNav />}
      </div>
    </div>
  );
}
