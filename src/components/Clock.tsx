"use client";

import { useEffect, useState } from "react";
import type { Issue } from "@/lib/types";
import { LADDER, SEV_NAME } from "@/lib/ladder";
import { countdown, credOk, rungMs } from "@/lib/credibility";
import { effectiveSeverity } from "@/lib/severity";
import { fmtAge } from "@/lib/format";
import { METOO_THRESHOLD } from "@/lib/ladder";

export function Clock({ issue }: { issue: Issue }) {
  // re-render every second for the countdown
  const [, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  let cls = "bg-amber/10 text-ink";
  let dot = "bg-amber";
  let text: React.ReactNode;

  if (issue.status === "resolved") {
    cls = "bg-resolved/10 text-resolved";
    dot = "bg-resolved";
    text = <>Resolved at {LADDER[issue.level].role}</>;
  } else if (issue.govResponse === "no_funds") {
    cls = "bg-muted/10 text-muted";
    dot = "bg-muted";
    text = <>Ladder paused — authority reported no funds. Community funding underway (above).</>;
  } else if (!credOk(issue)) {
    const need: string[] = [];
    if (!issue.reporterVerified) need.push("verified reporter");
    if (issue.photos.length < 1) need.push("a photo");
    const short = METOO_THRESHOLD - issue.metoo;
    if (short > 0) need.push(`${short} more “me too”`);
    cls = "bg-muted/10 text-muted";
    dot = "bg-muted";
    text = <>Held — won&apos;t escalate yet. Needs: {need.join(", ")}.</>;
  } else if (issue.level >= LADDER.length - 1) {
    cls = "bg-escalate/10 text-escalate";
    dot = "bg-escalate";
    text = <>Top rung — nowhere higher. Escalated {issue.level}×</>;
  } else {
    const cd = countdown(issue) ?? 0;
    const hot = cd < rungMs(issue) * 0.35;
    if (hot) {
      cls = "bg-escalate/10 text-escalate";
      dot = "bg-escalate";
    }
    text = (
      <>
        {SEV_NAME[effectiveSeverity(issue)]} pace — escalates to {LADDER[issue.level + 1].role} in {fmtAge(cd)}
      </>
    );
  }

  const animate = issue.status !== "resolved" && issue.govResponse !== "no_funds";
  return (
    <div className={`flex items-center gap-2 text-xs font-semibold my-3 px-3 py-2.5 rounded-xl ${cls}`}>
      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${dot} ${animate ? "ring-pulse" : ""}`} />
      <span>{text}</span>
    </div>
  );
}
