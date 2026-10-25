"use client";

import type { Issue } from "@/lib/types";
import { fmtINR } from "@/lib/format";
import { medianDays } from "@/lib/severity";
import { useCivora } from "@/lib/store";

export function FundingPanel({ issue }: { issue: Issue }) {
  const user = useCivora((s) => s.user);
  const markNoFunds = useCivora((s) => s.markNoFunds);
  const pledge = useCivora((s) => s.pledge);
  const canAct = user.verified;

  if (issue.status === "resolved") return null;

  if (issue.govResponse !== "no_funds") {
    if (issue.status === "escalated" && canAct) {
      return (
        <div className="my-3 p-3 rounded-xl bg-paper border border-dashed border-line">
          <div className="text-[11px] font-bold uppercase tracking-wide text-muted mb-2.5">Authority response</div>
          <div className="text-[11.5px] text-muted leading-relaxed mb-2.5">
            If the authority replies that it acknowledges the issue but has <b>no funds</b>, the community can step in as a last resort.
          </div>
          <button
            onClick={() => markNoFunds(issue.id)}
            className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-line bg-card text-ink active:scale-[0.98]"
          >
            Record: authority replied “no funds available”
          </button>
        </div>
      );
    }
    return null;
  }

  const pct = issue.fundGoal ? Math.min(100, Math.round((100 * issue.fundRaised) / issue.fundGoal)) : 0;
  const funded = issue.fundRaised >= issue.fundGoal;
  const barColor = funded ? "bg-resolved" : "bg-ladder";
  const txtColor = funded ? "text-resolved" : "text-ladder";

  return (
    <div className="my-3 p-3 rounded-xl bg-ladder/5 border border-ladder">
      <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wide text-muted mb-2.5">
        <span>Community funding — last resort</span>
        <span className={`font-extrabold ${txtColor}`}>{funded ? "FUNDED" : `${pct}%`}</span>
      </div>
      <div className="text-[11.5px] text-muted leading-relaxed mb-2.5">
        Escalated to the top; the authority acknowledged it but reported <b>no budget</b>. The community is funding the fix,
        carried out by a vetted partner with the required permissions.
      </div>
      <div className="h-3 rounded-full bg-line overflow-hidden mb-2">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between text-[11.5px] text-muted mb-3">
        <b className={txtColor}>{fmtINR(issue.fundRaised)} raised</b>
        <span>goal {fmtINR(issue.fundGoal)}</span>
      </div>
      <div className="text-[11.5px] text-ink font-semibold mb-1.5">Executed by {issue.fundPartner}</div>
      <div className="text-[11.5px] text-ink font-semibold mb-3">Every rupee & completion proof shown publicly</div>
      {funded ? (
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-2.5 rounded-xl bg-resolved/10 text-resolved">
          <span className="w-2.5 h-2.5 rounded-full bg-resolved" /> Goal met — partner notified to begin work
        </div>
      ) : canAct ? (
        <button
          onClick={() => pledge(issue.id)}
          className="w-full text-white bg-ladder font-bold text-[15px] py-3.5 rounded-xl active:scale-[0.99]"
        >
          Pledge support (demo — no real payment)
        </button>
      ) : (
        <div className="text-[10.5px] text-muted text-center">Verify your number to pledge.</div>
      )}
      <div className="text-[11.5px] text-muted italic mt-2.5">
        Demo only: no money is collected. In production, funds are handled by a licensed partner/NGO with escrow, refunds and
        audit — never by this app.
      </div>
    </div>
  );
}

export function ResolutionNote({ issue }: { issue: Issue }) {
  const med = medianDays(issue.cat);
  if (issue.status === "resolved") {
    let took = "—";
    if (issue.histDays != null) took = `~${issue.histDays} days`;
    else if (issue.resolvedMs != null) took = `${Math.round(issue.resolvedMs / 1000)}s (this demo session)`;
    let cmp = "";
    if (issue.histDays != null && med != null) {
      cmp =
        issue.histDays < med
          ? ` — faster than the ~${med}-day median for ${issue.cat}`
          : issue.histDays > med
            ? ` — slower than the ~${med}-day median for ${issue.cat}`
            : ` — about the ~${med}-day median for ${issue.cat}`;
    }
    return (
      <div className="my-3 p-3 rounded-xl bg-resolved/[0.07] border border-resolved">
        <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wide text-muted mb-1.5">
          <span>Resolution time</span>
          <span className="text-resolved font-extrabold">{took}</span>
        </div>
        <div className="text-[11.5px] text-muted leading-relaxed">
          Time from filing to resolved{cmp}. Shown as observed fact, after the fact.
        </div>
      </div>
    );
  }
  if (med != null) {
    return (
      <div className="my-3 p-3 rounded-xl bg-paper border border-line">
        <div className="text-[11px] font-bold uppercase tracking-wide text-muted mb-1.5">For your awareness</div>
        <div className="text-[11.5px] text-muted leading-relaxed">
          Past <b>{issue.cat}</b> issues in this area were resolved in a <b>median of ~{med} days</b> (historical). This is{" "}
          <b>not a promise</b> — it&apos;s what similar issues have taken. The escalation clock below is the part we control.
        </div>
      </div>
    );
  }
  return null;
}
