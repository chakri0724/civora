import type { AuthorityRung, Severity } from "./types";

// The escalation ladder. In production this is loaded per city from the DB.
export const LADDER: AuthorityRung[] = [
  { role: "Ward Officer", sub: "Ward 42 · BBMP" },
  { role: "Zonal Asst. Commissioner", sub: "East Zone · BBMP" },
  { role: "Municipal Commissioner", sub: "BBMP, Bengaluru" },
  { role: "District Collector", sub: "Bengaluru Urban" },
  { role: "State Urban Dev. Ministry", sub: "Govt. of Karnataka" },
  { role: "Union Ministry (MoHUA)", sub: "Govt. of India" },
];

// DEMO: sped-up base interval so escalation is visible in the prototype.
// PRODUCTION: replace with day-based SLAs enforced server-side (see README).
export const BASE_RUNG_MS = 14000;

export const METOO_THRESHOLD = 3;

export const SEV_NAME: Record<Severity, string> = {
  1: "Low",
  2: "Moderate",
  3: "High",
  4: "Critical",
};

// Severity -> escalation deadline multiplier (higher severity escalates faster).
export const SEV_SPEED: Record<Severity, number> = { 1: 1.6, 2: 1.15, 3: 0.8, 4: 0.5 };

// Real-world escalation cadence shown to users (days per rung if ignored). A promise we control.
export const SEV_CADENCE_DAYS: Record<Severity, number> = { 1: 10, 2: 6, 3: 3, 4: 1 };

export const CATEGORIES = [
  "Roads & potholes",
  "Water supply",
  "Sanitation & garbage",
  "Streetlights",
  "Drainage / flooding",
  "Public safety",
] as const;
