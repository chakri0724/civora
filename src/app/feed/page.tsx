"use client";

import { useCivora } from "@/lib/store";
import { IssueCard } from "@/components/IssueCard";

export default function FeedPage() {
  const issues = useCivora((s) => s.issues);
  if (!issues.length) return <p className="text-muted italic text-center py-6 text-[13px]">No issues yet. Tap the “+” to raise one.</p>;
  return (
    <div>
      {issues.map((is) => (
        <IssueCard key={is.id} issue={is} />
      ))}
    </div>
  );
}
