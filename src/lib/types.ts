// Pure domain types — no React/Next imports. Portable to React Native.

export type Severity = 1 | 2 | 3 | 4; // Low, Moderate, High, Critical

export type IssueStatus = "open" | "escalated" | "resolved";

export type GovResponse = null | "no_funds";

export interface Rung {
  reachedAt: number | null;
  resolvedAt: number | null;
}

export interface Issue {
  id: number;
  title: string;
  cat: string;
  ward: string;
  city: string;
  desc: string;
  photos: string[]; // data URLs in the prototype; storage URLs in production
  declaredSev: Severity;
  reporterVerified: boolean;
  filed: number;
  level: number; // current rung index
  status: IssueStatus;
  metoo: number;
  histDays: number | null; // seeded historical resolution time
  resolvedMs: number | null; // measured this session
  govResponse: GovResponse;
  fundGoal: number;
  fundRaised: number;
  fundPartner: string | null;
  lastTick: number | null;
  rungs: Rung[];
}

export interface Campaign {
  type: "health" | "safety" | "deadline" | "civic" | "env";
  authority: string;
  title: string;
  when: string;
  body: string;
  cta: { label: string; action: "report" | "info" };
}

export interface AuthorityRung {
  role: string;
  sub: string;
}

export interface User {
  verified: boolean;
  phone: string | null;
}
