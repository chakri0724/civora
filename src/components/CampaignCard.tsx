"use client";

import { useRouter } from "next/navigation";
import type { Campaign } from "@/lib/types";

const TYPE_LABEL: Record<Campaign["type"], string> = {
  health: "Health",
  safety: "Safety",
  deadline: "Deadline",
  civic: "Civic duty",
  env: "Environment",
};
const TYPE_BG: Record<Campaign["type"], string> = {
  health: "bg-resolved",
  safety: "bg-escalate",
  deadline: "bg-[#c8973a]",
  civic: "bg-ladder",
  env: "bg-[#2f8f8f]",
};

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const router = useRouter();
  return (
    <article className="bg-card border border-line border-t-[3px] border-t-ladder rounded-2xl p-[15px] mb-[13px] shadow-sm">
      <div className="flex items-center gap-1.5 text-[10.5px] font-extrabold text-ladder mb-2.5">
        <span className="w-5 h-5 rounded-full bg-ladder flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" className="w-3 h-3" stroke="#fff" fill="none" strokeWidth={2}>
            <path d="M12 3l7 3v5c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </span>
        Official <span className="text-muted font-semibold">· {campaign.authority}</span>
        <span className={`ml-auto text-[9.5px] uppercase tracking-wide font-extrabold px-2.5 py-[3px] rounded-full text-white ${TYPE_BG[campaign.type]}`}>
          {TYPE_LABEL[campaign.type]}
        </span>
      </div>
      <h3 className="text-base font-bold mt-2.5 mb-1 leading-snug">{campaign.title}</h3>
      <div className="text-[11px] text-muted font-semibold flex items-center gap-1.5 mb-3">
        <svg viewBox="0 0 24 24" className="w-3 h-3" stroke="currentColor" fill="none" strokeWidth={2}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 9h18M8 3v4M16 3v4" />
        </svg>
        {campaign.when}
      </div>
      <p className="text-sm text-[#33342c] leading-relaxed mb-3">{campaign.body}</p>
      <button
        onClick={() => campaign.cta.action === "report" && router.push("/report")}
        className={`w-full text-[12.5px] font-bold px-4 py-2.5 rounded-xl border border-ladder active:scale-[0.98] ${
          campaign.cta.action === "info" ? "bg-card text-ladder" : "bg-ladder text-paper"
        }`}
      >
        {campaign.cta.label}
      </button>
    </article>
  );
}
