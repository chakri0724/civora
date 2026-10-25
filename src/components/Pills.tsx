import type { Issue, Severity } from "@/lib/types";
import { SEV_NAME } from "@/lib/ladder";
import { effectiveSeverity } from "@/lib/severity";
import { credOk } from "@/lib/credibility";

const SEV_BG: Record<Severity, string> = {
  1: "bg-sev-low",
  2: "bg-sev-mod",
  3: "bg-sev-high",
  4: "bg-sev-crit",
};

export function SeverityPill({ sev }: { sev: Severity }) {
  return (
    <span className={`text-[9.5px] uppercase font-extrabold tracking-wide px-2 py-0.5 rounded-full text-white ${SEV_BG[sev]}`}>
      {SEV_NAME[sev]}
    </span>
  );
}

export function VerifiedTick({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#2f6f8f" aria-hidden>
      <path d="M12 2l2.4 1.8 3 .1 1 2.8 2.4 1.7-.9 2.9.9 2.9-2.4 1.7-1 2.8-3 .1L12 22l-2.4-1.8-3-.1-1-2.8L3.2 15l.9-2.9L3.2 9.2 5.6 7.5l1-2.8 3-.1z" />
      <path d="M8.5 12.5l2.2 2.2 4.3-4.6" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ReporterBadge({ verified }: { verified: boolean }) {
  if (verified)
    return (
      <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-verify">
        <VerifiedTick /> Verified
      </span>
    );
  return <span className="text-[9.5px] font-bold text-muted">Unverified</span>;
}

function statusLabel(is: Issue): string {
  if (is.status === "resolved") return "Resolved";
  if (is.govResponse === "no_funds") return is.fundRaised >= is.fundGoal ? "Funded" : "Funding";
  if (is.status === "escalated") return "Escalated";
  return credOk(is) ? "Awaiting" : "Unverified";
}

export function StatusPill({ issue }: { issue: Issue }) {
  const label = statusLabel(issue);
  const cls =
    issue.status === "resolved"
      ? "bg-resolved/20 text-resolved"
      : issue.govResponse === "no_funds"
        ? "bg-amber/20 text-[#a9701a]"
        : issue.status === "escalated"
          ? "bg-escalate/15 text-escalate"
          : credOk(issue)
            ? "bg-amber/20 text-[#a9701a]"
            : "bg-muted/20 text-muted";
  return (
    <span className={`text-[10px] uppercase tracking-wide font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${cls}`}>
      {label}
    </span>
  );
}

export function CatPill({ cat }: { cat: string }) {
  return (
    <span className="text-[9.5px] uppercase tracking-wide font-bold px-2 py-0.5 rounded-full bg-ladder/10 text-ladder">
      {cat}
    </span>
  );
}

export { effectiveSeverity };
