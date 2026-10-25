"use client";

import Link from "next/link";
import { useCivora } from "@/lib/store";
import { LADDER } from "@/lib/ladder";
import { HISTORY, medianDays, effectiveSeverity } from "@/lib/severity";
import { SeverityPill, CatPill } from "@/components/Pills";

export default function BoardPage() {
  const issues = useCivora((s) => s.issues);

  const stats = LADDER.map(() => ({ reached: 0, resolved: 0, past: 0 }));
  issues.forEach((is) =>
    is.rungs.forEach((rg, i) => {
      if (rg.reachedAt != null) {
        stats[i].reached++;
        if (rg.resolvedAt != null) stats[i].resolved++;
      }
      if (i < is.level) stats[i].past++;
    })
  );

  const maxMed = Math.max(...Object.keys(HISTORY).map((c) => medianDays(c) ?? 0));
  const open = issues
    .filter((is) => is.status === "escalated")
    .sort((a, b) => effectiveSeverity(b) - effectiveSeverity(a));

  return (
    <div>
      <div className="bg-card border border-line rounded-2xl p-[15px] mb-3.5 shadow-sm">
        {LADDER.map((r, i) => {
          const s = stats[i];
          const rate = s.reached ? Math.round((100 * s.resolved) / s.reached) : null;
          const color = rate == null ? "#e4e0cf" : rate >= 60 ? "#3f7d54" : rate >= 30 ? "#e8a13a" : "#c0492e";
          return (
            <div key={i} className="flex items-center gap-3 py-3 border-b border-line last:border-0">
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-bold leading-tight">{r.role}</div>
                <div className="text-[10.5px] text-muted uppercase tracking-wide mt-0.5">{r.sub}</div>
                <div className="text-[10.5px] text-muted mt-0.5">
                  {s.reached} reached · {s.resolved} resolved
                  {s.past > 0 && (
                    <>
                      {" · "}
                      <b className="text-escalate">{s.past} escalated past</b>
                    </>
                  )}
                </div>
              </div>
              <div className="text-right w-[74px] shrink-0">
                <div className="text-sm font-extrabold" style={{ color }}>
                  {rate == null ? "—" : `${rate}%`}
                </div>
                {rate != null && (
                  <div className="h-[7px] rounded-full bg-line overflow-hidden mt-1">
                    <div className="h-full rounded-full" style={{ width: `${rate}%`, background: color }} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[9.5px] tracking-widest uppercase text-muted font-bold mx-1 mt-[18px] mb-2">
        Typical resolution time — from resolved cases
      </p>
      <div className="bg-card border border-line rounded-2xl p-[15px] mb-3.5 shadow-sm">
        {Object.keys(HISTORY).map((c) => {
          const med = medianDays(c) ?? 0;
          const n = HISTORY[c].length;
          const w = maxMed ? Math.round((100 * med) / maxMed) : 0;
          const color = med <= 5 ? "#3f7d54" : med <= 15 ? "#e8a13a" : "#c0492e";
          return (
            <div key={c} className="flex items-center gap-3 py-3 border-b border-line last:border-0">
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-bold leading-tight">{c}</div>
                <div className="text-[10.5px] text-muted mt-0.5">median of {n} resolved cases</div>
              </div>
              <div className="text-right w-24 shrink-0">
                <div className="text-sm font-extrabold" style={{ color }}>
                  ~{med}d
                </div>
                <div className="h-[7px] rounded-full bg-line overflow-hidden mt-1">
                  <div className="h-full rounded-full" style={{ width: `${w}%`, background: color }} />
                </div>
              </div>
            </div>
          );
        })}
        <div className="text-[11.5px] text-muted mt-2.5">
          Observed from past resolved issues — a track record, <b>not a prediction or promise</b>.
        </div>
      </div>

      <p className="text-[9.5px] tracking-widest uppercase text-muted font-bold mx-1 mt-[18px] mb-2">
        Escalated & unresolved — tap to open
      </p>
      {open.length === 0 ? (
        <p className="text-muted italic text-center py-6 text-[13px]">
          Nothing escalated right now. Only credible issues reach an authority.
        </p>
      ) : (
        open.map((is) => (
          <Link key={is.id} href={`/issue/${is.id}`} className="block">
            <div className="bg-card border border-line rounded-2xl px-3.5 py-3 mb-[13px] shadow-sm active:scale-[0.992]">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold leading-snug">{is.title}</h3>
                  <div className="text-[11px] text-muted mt-1 flex gap-1.5 items-center">
                    <SeverityPill sev={effectiveSeverity(is)} />
                    <CatPill cat={is.cat} />
                    <span>{is.ward}</span>
                  </div>
                </div>
                <span className="text-[10px] uppercase tracking-wide font-bold px-2.5 py-1 rounded-full bg-escalate/15 text-escalate whitespace-nowrap">
                  with {LADDER[is.level].role.split(" ")[0]}…
                </span>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
