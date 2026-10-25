"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useCivora } from "@/lib/store";
import { requestAuth } from "@/components/AppShell";
import { fmtAge } from "@/lib/format";
import { effectiveSeverity } from "@/lib/severity";
import { SeverityPill, StatusPill, CatPill, ReporterBadge } from "@/components/Pills";
import { SeverityPanel, CredibilityCheck } from "@/components/CredibilitySeverity";
import { FundingPanel, ResolutionNote } from "@/components/FundingPanel";
import { EscalationLadder } from "@/components/EscalationLadder";
import { Clock } from "@/components/Clock";

export default function IssueDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const issue = useCivora((s) => s.issues.find((i) => i.id === id));
  const user = useCivora((s) => s.user);
  const metoo = useCivora((s) => s.metoo);
  const flagFake = useCivora((s) => s.flagFake);
  const resolve = useCivora((s) => s.resolve);
  const [lightbox, setLightbox] = useState<string | null>(null);

  if (!issue) return <p className="text-muted italic text-center py-6 text-[13px]">Issue not found.</p>;
  const canAct = user.verified;

  return (
    <div>
      <div className="bg-card border border-line rounded-2xl p-[15px] mb-[13px] shadow-sm">
        <div className="flex justify-between gap-2.5 items-start">
          <div>
            <h3 className="text-lg font-bold leading-snug m-0">{issue.title}</h3>
            <div className="text-[11px] text-muted mt-1 flex gap-1.5 flex-wrap items-center">
              <SeverityPill sev={effectiveSeverity(issue)} />
              <CatPill cat={issue.cat} />
              <ReporterBadge verified={issue.reporterVerified} />
              <span>
                {issue.ward}, {issue.city}
              </span>
              <span>· filed {fmtAge(Date.now() - issue.filed)} ago</span>
            </div>
          </div>
          <StatusPill issue={issue} />
        </div>

        <div className="text-[9.5px] tracking-widest uppercase text-muted font-bold mt-3 mb-2.5">Photo evidence</div>
        {issue.photos.length ? (
          <div className="flex flex-col gap-2.5 mb-4">
            {issue.photos.map((p, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={p}
                alt={`evidence ${i + 1}`}
                onClick={() => setLightbox(p)}
                className="h-[150px] w-full object-cover rounded-[10px] border border-line cursor-zoom-in"
              />
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted italic mb-4">
            No photos attached — this issue cannot escalate until a photo is added.
          </div>
        )}

        <div className="text-[9.5px] tracking-widest uppercase text-muted font-bold mb-2.5">Reported details</div>
        <div className="text-sm text-[#33342c] leading-relaxed mb-3.5">
          {issue.desc || <span className="text-muted italic">No description given.</span>}
        </div>

        <div className="text-[9.5px] tracking-widest uppercase text-muted font-bold">Severity assessment</div>
        <SeverityPanel issue={issue} />
        <ResolutionNote issue={issue} />
        <FundingPanel issue={issue} />
        <CredibilityCheck issue={issue} />
        <Clock issue={issue} />

        <div className="flex gap-2 items-center flex-wrap">
          <span className="text-[11px] text-muted mr-auto">{issue.metoo} said “me too”</span>
          {canAct && (
            <button onClick={() => metoo(issue.id)} className="text-xs font-bold px-3.5 py-2.5 rounded-xl border border-line bg-card text-ink active:scale-95">
              + Me too
            </button>
          )}
          {canAct && (
            <button onClick={() => flagFake(issue.id)} className="text-xs font-bold px-3.5 py-2.5 rounded-xl border border-line bg-card text-muted active:scale-95">
              Not real
            </button>
          )}
          {canAct && issue.status !== "resolved" && (
            <button onClick={() => resolve(issue.id)} className="text-xs font-bold px-3.5 py-2.5 rounded-xl border border-resolved text-resolved bg-card active:scale-95">
              Resolved
            </button>
          )}
        </div>
        {!canAct && (
          <div
            onClick={() => requestAuth()}
            className="text-[10.5px] text-muted text-center mt-2.5 underline cursor-pointer"
          >
            Verify your number to confirm or resolve issues.
          </div>
        )}
      </div>

      <div className="bg-card border border-line rounded-2xl p-[15px] mb-[13px] shadow-sm">
        <EscalationLadder issue={issue} />
      </div>

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="absolute inset-0 bg-[#0d0d0b]/95 z-[80] flex items-center justify-center p-5"
        >
          <button className="absolute top-11 right-5 w-10 h-10 rounded-full bg-white/15 text-white text-2xl">×</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox} alt="" className="max-w-full max-h-[82%] rounded-xl" />
        </div>
      )}
    </div>
  );
}
