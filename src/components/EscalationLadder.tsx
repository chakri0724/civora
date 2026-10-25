import type { Issue } from "@/lib/types";
import { LADDER } from "@/lib/ladder";
import { credOk } from "@/lib/credibility";
import { fmtAge } from "@/lib/format";

export function EscalationLadder({ issue }: { issue: Issue }) {
  return (
    <div>
      <div className="text-[9.5px] tracking-widest uppercase text-muted font-bold mb-2.5">Escalation trail</div>
      <div>
        {LADDER.map((r, i) => {
          const rg = issue.rungs[i];
          let state: "done" | "current" | "pending" = "pending";
          let stamp: string | null = null;
          if (rg.resolvedAt) {
            state = "done";
            stamp = "✓ resolved here";
          } else if (i < issue.level) {
            state = "done";
            stamp = "→ escalated past · no action";
          } else if (i === issue.level) {
            state = issue.status === "resolved" ? "done" : "current";
            stamp =
              issue.status === "resolved"
                ? "✓ resolved here"
                : credOk(issue)
                  ? `● with them · ${fmtAge(Date.now() - (rg.reachedAt ?? Date.now()))}`
                  : "● filed · awaiting credibility";
          }
          const nodeCls =
            state === "done"
              ? "bg-resolved border-resolved"
              : state === "current"
                ? "bg-escalate border-escalate shadow-[0_0_0_4px_rgba(192,73,46,0.16)]"
                : "bg-card border-line";
          const roleCls = state === "pending" ? "text-muted font-normal" : "text-ink font-semibold";
          const stampCls = state === "done" ? "text-resolved" : "text-escalate";
          return (
            <div key={i} className="flex gap-2.5 items-start pb-3 last:pb-0">
              <div className="flex flex-col items-center w-3.5 shrink-0">
                <div className={`w-3 h-3 rounded-full border-2 mt-0.5 ${nodeCls}`} />
                {i < LADDER.length - 1 && (
                  <div className={`w-0.5 flex-1 min-h-[12px] mt-0.5 ${state === "done" ? "bg-resolved" : "bg-line"}`} />
                )}
              </div>
              <div>
                <div className={`text-[13px] leading-tight ${roleCls}`}>{r.role}</div>
                <div className="text-[10.5px] text-muted mt-0.5">{r.sub}</div>
                {stamp && <div className={`text-[10.5px] mt-0.5 font-semibold ${stampCls}`}>{stamp}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
