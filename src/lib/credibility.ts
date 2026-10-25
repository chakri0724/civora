import type { Issue } from "./types";
import { BASE_RUNG_MS, METOO_THRESHOLD, SEV_SPEED } from "./ladder";
import { effectiveSeverity } from "./severity";

// An issue only escalates once it is credible:
// verified reporter + at least one photo + minimum resident confirmations.
export function credOk(issue: Issue): boolean {
  return issue.reporterVerified && issue.photos.length >= 1 && issue.metoo >= METOO_THRESHOLD;
}

export interface CredChecks {
  verified: boolean;
  hasPhoto: boolean;
  confirmed: boolean;
  ready: boolean;
  metooHave: number;
  metooNeed: number;
}

export function credChecks(issue: Issue): CredChecks {
  const verified = issue.reporterVerified;
  const hasPhoto = issue.photos.length >= 1;
  const confirmed = issue.metoo >= METOO_THRESHOLD;
  return {
    verified,
    hasPhoto,
    confirmed,
    ready: verified && hasPhoto && confirmed,
    metooHave: Math.min(issue.metoo, METOO_THRESHOLD),
    metooNeed: METOO_THRESHOLD,
  };
}

// Escalation deadline per rung, scaled by effective severity.
export function rungMs(issue: Issue): number {
  return BASE_RUNG_MS * SEV_SPEED[effectiveSeverity(issue)];
}

export function countdown(issue: Issue): number | null {
  if (issue.status === "resolved" || issue.lastTick == null) return null;
  return Math.max(0, rungMs(issue) - (Date.now() - issue.lastTick));
}

// The core escalation step, pure over a single issue. Returns a new issue if it changed.
// In production this runs server-side on a schedule (pg_cron / edge function).
export function escalateStep(issue: Issue, now: number, ladderLength: number): Issue | null {
  if (issue.status === "resolved") return null;
  if (issue.govResponse === "no_funds") return { ...issue, lastTick: now }; // funding mode pauses ladder
  if (!credOk(issue)) return { ...issue, lastTick: now }; // held until credible
  if (now - (issue.lastTick ?? now) < rungMs(issue)) return null;
  if (issue.level < ladderLength - 1) {
    const level = issue.level + 1;
    const rungs = issue.rungs.map((r, i) => (i === level ? { ...r, reachedAt: now } : r));
    return { ...issue, level, rungs, lastTick: now, status: "escalated" };
  }
  return { ...issue, lastTick: now }; // at top rung
}
