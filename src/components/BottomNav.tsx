"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    href: "/feed",
    label: "Feed",
    icon: (
      <>
        <path d="M3 10.5 12 4l9 6.5" />
        <path d="M5 9.5V20h14V9.5" />
        <path d="M9.5 20v-6h5v6" />
      </>
    ),
  },
  {
    href: "/campaigns",
    label: "Campaigns",
    icon: (
      <>
        <path d="M3 11l16-6v14L3 13z" />
        <path d="M8 12v6l3 1" />
      </>
    ),
  },
];

const rightTab = {
  href: "/board",
  label: "Board",
  icon: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
};

export function BottomNav() {
  const pathname = usePathname();
  const active = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <nav className="absolute bottom-0 left-0 right-0 h-16 bg-card/95 backdrop-blur border-t border-line flex z-50 pb-1.5">
      {tabs.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold pt-2 ${
            active(t.href) ? "text-escalate" : "text-muted"
          }`}
        >
          <svg viewBox="0 0 24 24" className="w-[23px] h-[23px]" stroke="currentColor" fill="none" strokeWidth={1.9}>
            {t.icon}
          </svg>
          {t.label}
        </Link>
      ))}

      <Link href="/report" className="relative -top-3.5 w-[58px] flex flex-col items-center">
        <span className="w-14 h-14 rounded-full bg-ink text-paper flex items-center justify-center shadow-lg active:scale-95">
          <svg viewBox="0 0 24 24" className="w-[26px] h-[26px]" stroke="currentColor" fill="none" strokeWidth={2.4}>
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
        <span className="text-[10px] font-bold text-ink mt-0.5">Report</span>
      </Link>

      <Link
        href={rightTab.href}
        className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold pt-2 ${
          active(rightTab.href) ? "text-escalate" : "text-muted"
        }`}
      >
        <svg viewBox="0 0 24 24" className="w-[23px] h-[23px]" stroke="currentColor" fill="none" strokeWidth={1.9}>
          {rightTab.icon}
        </svg>
        {rightTab.label}
      </Link>
    </nav>
  );
}
