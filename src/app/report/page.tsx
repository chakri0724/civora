"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCivora } from "@/lib/store";
import { requestAuth } from "@/components/AppShell";
import { CATEGORIES, SEV_CADENCE_DAYS, SEV_NAME } from "@/lib/ladder";
import { medianDays, HISTORY } from "@/lib/severity";
import type { Severity } from "@/lib/types";

export default function ReportPage() {
  const router = useRouter();
  const user = useCivora((s) => s.user);
  const fileIssue = useCivora((s) => s.fileIssue);

  const [title, setTitle] = useState("");
  const [cat, setCat] = useState<string>(CATEGORIES[0]);
  const [sev, setSev] = useState<Severity>(2);
  const [desc, setDesc] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    Array.from(files).forEach((f) => {
      if (!f.type.startsWith("image/")) return;
      const r = new FileReader();
      r.onload = (e) => setPhotos((p) => [...p, e.target?.result as string]);
      r.readAsDataURL(f);
    });
  }

  function submit() {
    if (!user.verified) {
      requestAuth();
      return;
    }
    fileIssue({ title, cat, declaredSev: sev, desc, photos });
    setTitle("");
    setDesc("");
    setPhotos([]);
    setSev(2);
    router.push("/feed");
  }

  const days = SEV_CADENCE_DAYS[sev];
  const med = medianDays(cat);
  const n = (HISTORY[cat] ?? []).length;

  return (
    <div className="bg-card border border-line rounded-2xl p-[15px] shadow-sm">
      <div className="flex items-center gap-2.5 bg-ladder/[0.07] border border-dashed border-ladder rounded-xl px-3.5 py-3 mb-3.5 text-[13px] text-ladder font-semibold">
        <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M12 21s-7-6.3-7-11a7 7 0 1 1 14 0c0 4.7-7 11-7 11z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
        Ward 42, Indiranagar · Bengaluru
      </div>

      <label className="block text-[11px] uppercase tracking-wide text-muted font-bold mb-1.5">Photo evidence — needed to escalate</label>
      <div className="flex gap-2.5 mb-1">
        <label className="flex-1 border-[1.5px] border-dashed border-line bg-paper rounded-xl py-4 px-2.5 flex flex-col items-center gap-1.5 text-muted text-xs font-semibold active:border-ladder cursor-pointer">
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.9}>
            <path d="M4 8h3l1.5-2h7L17 8h3v11H4z" />
            <circle cx="12" cy="13" r="3.2" />
          </svg>
          Take photo
          <input type="file" accept="image/*" capture="environment" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        </label>
        <label className="flex-1 border-[1.5px] border-dashed border-line bg-paper rounded-xl py-4 px-2.5 flex flex-col items-center gap-1.5 text-muted text-xs font-semibold active:border-ladder cursor-pointer">
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.9}>
            <rect x="4" y="5" width="16" height="14" rx="2" />
            <path d="M4 15l4-4 3 3 4-5 5 6" />
          </svg>
          Upload
          <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        </label>
      </div>
      {photos.length > 0 && (
        <div className="flex gap-2 flex-wrap mt-2.5">
          {photos.map((src, i) => (
            <div key={i} className="relative w-[70px] h-[70px] rounded-xl overflow-hidden border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`attachment ${i + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={() => setPhotos((p) => p.filter((_, j) => j !== i))}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-ink/70 text-white text-[13px] flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3.5">
        <label className="block text-[11px] uppercase tracking-wide text-muted font-bold mb-1.5">What&apos;s wrong</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Streetlight out on 4th Cross"
          className="w-full text-base bg-paper border border-line rounded-xl px-3 py-3 outline-none focus:border-ladder"
        />
      </div>

      <div className="mt-3.5">
        <label className="block text-[11px] uppercase tracking-wide text-muted font-bold mb-1.5">Category</label>
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="w-full text-base bg-paper border border-line rounded-xl px-3 py-3 outline-none focus:border-ladder">
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="mt-3.5">
        <label className="block text-[11px] uppercase tracking-wide text-muted font-bold mb-1.5">How severe is it? (your view)</label>
        <select
          value={sev}
          onChange={(e) => setSev(Number(e.target.value) as Severity)}
          className="w-full text-base bg-paper border border-line rounded-xl px-3 py-3 outline-none focus:border-ladder"
        >
          <option value={1}>Low — minor, no urgency</option>
          <option value={2}>Moderate — affects daily life</option>
          <option value={3}>High — unsafe or many affected</option>
          <option value={4}>Critical — danger to life / large-scale</option>
        </select>
      </div>

      <div className="mt-3.5">
        <label className="block text-[11px] uppercase tracking-wide text-muted font-bold mb-1.5">Details</label>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="What's wrong and since when?"
          className="w-full text-base bg-paper border border-line rounded-xl px-3 py-3 outline-none focus:border-ladder resize-none min-h-[66px]"
        />
      </div>

      <div className="my-3.5 p-3 rounded-xl bg-paper border border-line">
        <div className="text-[11px] font-bold uppercase tracking-wide text-muted mb-2.5">What happens after you file</div>
        <div className="text-[11.5px] text-muted leading-relaxed mb-2">
          At <b className="text-ink">{SEV_NAME[sev]}</b> severity, if nobody acts it moves up to the next authority about every{" "}
          <b className="text-ink">
            {days} day{days > 1 ? "s" : ""}
          </b>
          . That&apos;s the escalation schedule — something we control and keep.
        </div>
        {med != null && (
          <div className="text-[11.5px] text-muted leading-relaxed">
            For reference, past <b className="text-ink">{cat}</b> issues in this area were resolved in a{" "}
            <b className="text-ink">median of ~{med} days</b> (from {n} resolved cases). Historical — <b>not a guarantee</b>.
          </div>
        )}
      </div>

      <button
        onClick={submit}
        className="w-full bg-ink text-paper text-[15px] font-bold py-3.5 rounded-[14px] active:scale-[0.985] active:bg-escalate"
      >
        {user.verified ? "File issue" : "Verify your number to file"}
      </button>

      <div className="text-[11px] text-[#8a6a1f] mt-3 px-3 py-2.5 bg-amber/10 rounded-[10px] leading-snug">
        <b>Anti-abuse:</b> an issue is filed right away, but it won&apos;t escalate until it clears the credibility check —
        verified reporter + a photo + at least 3 “me too” confirmations. Higher severity → shorter deadline per rung.
      </div>
    </div>
  );
}
