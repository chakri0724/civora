import type { Issue } from "@/lib/types";
import { SEV_NAME } from "@/lib/ladder";
import { credChecks } from "@/lib/credibility";
import { systemSeverity, effectiveSeverity, severityReason } from "@/lib/severity";
import type { Severity } from "@/lib/types";

function Check({ on, children }: { on: boolean; children: React.ReactNode }) {
  return (
    <div className={`flex items-center gap-2 text-xs ${on ? "text-ink font-semibold" : "text-muted"}`}>
      <div
        className={`w-4 h-4 rounded-[5px] border-[1.5px] shrink-0 flex items-center justify-center ${
          on ? "bg-resolved border-resolved" : "border-line"
        }`}
      >
        {on && (
          <svg viewBox="0 0 24 24" className="w-2.5 h-2.5" stroke="#fff" fill="none" strokeWidth={3}>
            <path d="M4 12l5 5L20 6" />
          </svg>
        )}
      </div>
      {children}
    </div>
  );
}

export function CredibilityCheck({ issue }: { issue: Issue }) {
  const c = credChecks(issue);
  return (
    <div className="my-3 p-3 rounded-xl bg-paper border border-line">
      <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wide text-muted mb-2.5">
        <span>Credibility check</span>
        <span className={`font-extrabold ${c.ready ? "text-resolved" : "text-muted"}`}>
          {c.ready ? "CLEARED — can escalate" : "HELD"}
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        <Check on={c.verified}>Reporter verified by phone</Check>
        <Check on={c.hasPhoto}>At least one photo attached</Check>
        <Check on={c.confirmed}>
          {c.metooHave}/{c.metooNeed} residents confirmed (“me too”)
        </Check>
      </div>
    </div>
  );
}

const SEV_TEXT: Record<Severity, string> = {
  1: "text-sev-low",
  2: "text-sev-mod",
  3: "text-sev-high",
  4: "text-sev-crit",
};
const SEV_BORDER: Record<Severity, string> = {
  1: "border-sev-low",
  2: "border-sev-mod",
  3: "border-sev-high",
  4: "border-sev-crit",
};

function Cell({ label, sev, strong }: { label: string; sev: Severity; strong?: boolean }) {
  return (
    <div className={`flex-1 text-center py-2.5 px-1 rounded-[10px] bg-card border ${strong ? SEV_BORDER[sev] + " border-2" : "border-line"}`}>
      <div className="text-[9px] tracking-wide uppercase text-muted font-bold mb-1.5">{label}</div>
      <div className={`text-xs font-extrabold ${SEV_TEXT[sev]}`}>{SEV_NAME[sev]}</div>
    </div>
  );
}

export function SeverityPanel({ issue }: { issue: Issue }) {
  const sys = systemSeverity(issue);
  const eff = effectiveSeverity(issue);
  return (
    <div className="my-3 p-3 rounded-xl bg-paper border border-line">
      <div className="flex gap-2 mb-2.5">
        <Cell label="You marked" sev={issue.declaredSev} />
        <Cell label="System reads" sev={sys} />
        <Cell label="Effective" sev={eff} strong />
      </div>
      <div className="text-[11.5px] text-muted leading-relaxed">
        {severityReason(issue)} <b className="text-ink">{SEV_NAME[eff]}</b> pace sets the escalation deadline per rung.
      </div>
    </div>
  );
}
