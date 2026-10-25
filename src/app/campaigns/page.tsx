"use client";

import { CAMPAIGNS } from "@/lib/seed";
import { CampaignCard } from "@/components/CampaignCard";

export default function CampaignsPage() {
  return (
    <div>
      <div className="text-[12.5px] text-muted leading-relaxed bg-ladder/[0.06] border border-line border-l-[3px] border-l-ladder rounded-r-xl px-3.5 py-3 mb-3.5">
        Official awareness campaigns and notices posted by verified government bodies. Read-only — this is where authorities
        speak to residents.
      </div>
      {CAMPAIGNS.map((c, i) => (
        <CampaignCard key={i} campaign={c} />
      ))}
    </div>
  );
}
