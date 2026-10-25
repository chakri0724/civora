import type { Issue, Severity } from "./types";
import { SEV_NAME } from "./ladder";
import { median } from "./format";

const clamp = (v: number): Severity => Math.max(1, Math.min(4, v)) as Severity;

const CAT_SEV: Record<string, Severity> = {
  "Public safety": 3,
  "Water supply": 3,
  "Drainage / flooding": 2,
  "Sanitation & garbage": 2,
  "Roads & potholes": 2,
  Streetlights: 1,
};

const RISK_WORDS = [
  "child", "children", "school", "accident", "injur", "death", "die", "collapse",
  "sewage", "fire", "hospital", "elderly", "electric", "live wire", "drown", "gas leak", "flood",
];

// Observed resolution history from PAST resolved cases (days). Historical fact, never a promise.
// In production, computed from resolved_at - created_at per category/ward.
export const HISTORY: Record<string, number[]> = {
  "Roads & potholes": [9, 14, 21, 7, 33, 11, 18, 12, 26, 15],
  "Water supply": [3, 5, 2, 8, 4, 6, 3, 11, 5],
  "Sanitation & garbage": [6, 9, 4, 12, 7, 15, 8, 5, 10, 9, 6],
  Streetlights: [2, 4, 3, 6, 2, 5, 3],
  "Drainage / flooding": [18, 25, 12, 30, 22, 16, 40],
  "Public safety": [1, 2, 4, 1, 3, 2, 5],
};

export function medianDays(cat: string): number | null {
  return median(HISTORY[cat] ?? []);
}

export function keywordHits(issue: Issue): string[] {
  const t = `${issue.title} ${issue.desc}`.toLowerCase();
  return RISK_WORDS.filter((w) => t.includes(w));
}

function corroborationBump(issue: Issue): number {
  return issue.metoo >= 30 ? 2 : issue.metoo >= 10 ? 1 : 0;
}

// Objective severity computed from category + risk words + corroboration.
export function systemSeverity(issue: Issue): Severity {
  const base = CAT_SEV[issue.cat] ?? 2;
  const kw = keywordHits(issue).length > 0 ? 1 : 0;
  return clamp(base + kw + corroborationBump(issue));
}

// "Declared by the person, decided by corroboration."
// A lone high claim runs at the system rating until residents confirm it.
export function effectiveSeverity(issue: Issue): Severity {
  const sys = systemSeverity(issue);
  if (issue.declaredSev <= sys) return sys; // severity can't be understated
  const allowance = 1 + corroborationBump(issue);
  return clamp(Math.min(issue.declaredSev, sys + allowance));
}

export function severityReason(issue: Issue): string {
  const sys = systemSeverity(issue);
  const eff = effectiveSeverity(issue);
  const kw = keywordHits(issue);
  const bits: string[] = [];
  bits.push(`Category “${issue.cat}” sets a base of ${SEV_NAME[CAT_SEV[issue.cat] ?? 2]}.`);
  if (kw.length) bits.push(`Risk words detected (${kw.slice(0, 3).join(", ")}) raised it.`);
  if (corroborationBump(issue) > 0) bits.push(`${issue.metoo} confirmations pushed it up.`);
  if (issue.declaredSev > sys && eff < issue.declaredSev)
    bits.push(`You marked ${SEV_NAME[issue.declaredSev]}, but that needs more resident confirmations — running at ${SEV_NAME[eff]} for now.`);
  else if (issue.declaredSev > sys && eff === issue.declaredSev)
    bits.push(`Your ${SEV_NAME[issue.declaredSev]} rating is confirmed by residents.`);
  else if (issue.declaredSev < sys)
    bits.push(`You marked ${SEV_NAME[issue.declaredSev]}, but the system holds it at ${SEV_NAME[eff]} — severity isn't understated here.`);
  return bits.join(" ");
}
