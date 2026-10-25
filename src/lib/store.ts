"use client";

import { create } from "zustand";
import type { Issue, Severity, User } from "./types";
import { LADDER } from "./ladder";
import { buildSeed } from "./seed";
import { credOk, escalateStep } from "./credibility";

const FUND_GOAL_BY_CAT: Record<string, number> = {
  "Roads & potholes": 180000,
  "Water supply": 120000,
  "Sanitation & garbage": 90000,
  Streetlights: 40000,
  "Drainage / flooding": 250000,
  "Public safety": 150000,
};

export interface NewIssueInput {
  title: string;
  cat: string;
  declaredSev: Severity;
  desc: string;
  photos: string[];
}

interface CivoraState {
  issues: Issue[];
  user: User;
  idSeq: number;
  setUser: (u: User) => void;
  fileIssue: (input: NewIssueInput) => void;
  metoo: (id: number) => void;
  resolve: (id: number) => void;
  flagFake: (id: number) => void;
  markNoFunds: (id: number) => void;
  pledge: (id: number) => void;
  tick: () => void;
}

const seeded = buildSeed(Date.now());

export const useCivora = create<CivoraState>((set, get) => ({
  issues: seeded,
  user: { verified: false, phone: null },
  idSeq: seeded.length + 1,

  setUser: (u) => set({ user: u }),

  fileIssue: (input) =>
    set((s) => {
      const t = Date.now();
      const issue: Issue = {
        id: s.idSeq,
        title: input.title.trim() || "Untitled issue",
        cat: input.cat,
        ward: "Ward 42, Indiranagar",
        city: "Bengaluru",
        desc: input.desc.trim(),
        photos: input.photos.slice(),
        declaredSev: input.declaredSev,
        reporterVerified: true,
        filed: t,
        level: 0,
        status: "open",
        metoo: 0,
        histDays: null,
        resolvedMs: null,
        govResponse: null,
        fundGoal: 0,
        fundRaised: 0,
        fundPartner: null,
        lastTick: t,
        rungs: LADDER.map((_, i) => ({ reachedAt: i === 0 ? t : null, resolvedAt: null })),
      };
      return { issues: [issue, ...s.issues], idSeq: s.idSeq + 1 };
    }),

  metoo: (id) =>
    set((s) => ({
      issues: s.issues.map((is) => {
        if (is.id !== id) return is;
        const next = { ...is, metoo: is.metoo + 1 };
        if (next.status === "open" && credOk(next)) next.lastTick = Date.now();
        return next;
      }),
    })),

  resolve: (id) =>
    set((s) => ({
      issues: s.issues.map((is) => {
        if (is.id !== id) return is;
        const t = Date.now();
        const rungs = is.rungs.map((r, i) => (i === is.level ? { ...r, resolvedAt: t } : r));
        return { ...is, status: "resolved" as const, rungs, resolvedMs: t - is.filed, lastTick: null };
      }),
    })),

  flagFake: (id) =>
    set((s) => ({
      issues: s.issues.map((is) => (is.id === id ? { ...is, metoo: Math.max(0, is.metoo - 1) } : is)),
    })),

  markNoFunds: (id) =>
    set((s) => ({
      issues: s.issues.map((is) =>
        is.id === id
          ? {
              ...is,
              govResponse: "no_funds" as const,
              fundGoal: FUND_GOAL_BY_CAT[is.cat] ?? 100000,
              fundRaised: 0,
              fundPartner: "Namma Ward Foundation (verified 80G NGO)",
            }
          : is
      ),
    })),

  pledge: (id) =>
    set((s) => ({
      issues: s.issues.map((is) =>
        is.id === id && is.fundRaised < is.fundGoal
          ? { ...is, fundRaised: Math.min(is.fundGoal, is.fundRaised + Math.round(is.fundGoal * 0.12)) }
          : is
      ),
    })),

  tick: () => {
    const now = Date.now();
    const { issues } = get();
    let changed = false;
    const next = issues.map((is) => {
      const stepped = escalateStep(is, now, LADDER.length);
      if (stepped) {
        changed = true;
        return stepped;
      }
      return is;
    });
    if (changed) set({ issues: next });
  },
}));

export function getIssue(id: number): Issue | undefined {
  return useCivora.getState().issues.find((i) => i.id === id);
}
