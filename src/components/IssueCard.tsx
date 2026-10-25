"use client";

import Link from "next/link";
import type { Issue } from "@/lib/types";
import { fmtAge } from "@/lib/format";
import { effectiveSeverity } from "@/lib/severity";
import { SeverityPill, StatusPill, CatPill, ReporterBadge } from "./Pills";
import { Clock } from "./Clock";

function PhotoStrip({ photos }: { photos: string[] }) {
  if (!photos.length) return null;
  return (
    <div className="flex gap-2 my-3 overflow-x-auto no-scrollbar pb-0.5">
      {photos.map((p, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={i} src={p} alt="" className="h-[74px] w-auto rounded-[10px] border border-line shrink-0 object-cover" />
      ))}
    </div>
  );
}

function PhotoCount({ n }: { n: number }) {
  if (!n) return null;
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-muted font-semibold">
      <svg viewBox="0 0 24 24" className="w-3 h-3" stroke="currentColor" fill="none" strokeWidth={2}>
        <rect x="4" y="5" width="16" height="14" rx="2" />
        <path d="M4 15l4-4 3 3 4-5 5 6" />
      </svg>
      {n}
    </span>
  );
}

export function IssueCard({ issue }: { issue: Issue }) {
  return (
    <Link href={`/issue/${issue.id}`} className="block">
      <article className="bg-card border border-line rounded-2xl p-[15px] mb-[13px] shadow-sm active:scale-[0.992] transition-transform">
        <div className="flex justify-between gap-2.5 items-start mb-2.5">
          <div>
            <h3 className="text-[15.5px] font-bold leading-snug m-0">{issue.title}</h3>
            <div className="text-[11px] text-muted mt-1 flex gap-1.5 flex-wrap items-center">
              <SeverityPill sev={effectiveSeverity(issue)} />
              <CatPill cat={issue.cat} />
              <ReporterBadge verified={issue.reporterVerified} />
              <PhotoCount n={issue.photos.length} />
            </div>
          </div>
          <StatusPill issue={issue} />
        </div>
        <PhotoStrip photos={issue.photos} />
        <Clock issue={issue} />
        <div className="text-[10.5px] text-muted text-center mt-0.5">
          Tap to see full issue & escalation trail → · filed {fmtAge(Date.now() - issue.filed)} ago
        </div>
      </article>
    </Link>
  );
}
