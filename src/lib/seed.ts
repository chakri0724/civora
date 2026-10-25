import type { Campaign, Issue, Rung, Severity } from "./types";
import { BASE_RUNG_MS, LADDER } from "./ladder";

function svgPhoto(bg: string, fg: string, label: string): string {
  const s = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='400' height='300' fill='${bg}'/><rect x='0' y='210' width='400' height='90' fill='${fg}' opacity='.4'/><circle cx='320' cy='70' r='40' fill='#fff' opacity='.5'/><text x='20' y='285' font-family='sans-serif' font-size='22' fill='#fff'>${label}</text></svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(s);
}

interface SeedInput {
  title: string;
  cat: string;
  ward: string;
  level: number;
  status: Issue["status"];
  metoo: number;
  ageMs: number;
  declaredSev: Severity;
  desc?: string;
  photos?: string[];
  rv?: boolean;
  histDays?: number | null;
  govResponse?: Issue["govResponse"];
  fundGoal?: number;
  fundRaised?: number;
  fundPartner?: string | null;
}

export function buildSeed(now: number): Issue[] {
  let idSeq = 1;
  const out: Issue[] = [];

  function seed(o: SeedInput) {
    const filed = now - o.ageMs;
    const rungs: Rung[] = LADDER.map((_, i) => {
      if (i < o.level) return { reachedAt: filed + i * BASE_RUNG_MS, resolvedAt: null };
      if (i === o.level)
        return {
          reachedAt: filed + i * BASE_RUNG_MS,
          resolvedAt: o.status === "resolved" ? filed + i * BASE_RUNG_MS + 3000 : null,
        };
      return { reachedAt: null, resolvedAt: null };
    });
    out.push({
      id: idSeq++,
      title: o.title,
      cat: o.cat,
      ward: o.ward,
      city: "Bengaluru",
      desc: o.desc ?? "",
      photos: o.photos ?? [],
      declaredSev: o.declaredSev,
      reporterVerified: o.rv !== false,
      filed,
      level: o.level,
      status: o.status,
      metoo: o.metoo,
      histDays: o.histDays ?? null,
      resolvedMs: null,
      govResponse: o.govResponse ?? null,
      fundGoal: o.fundGoal ?? 0,
      fundRaised: o.fundRaised ?? 0,
      fundPartner: o.fundPartner ?? null,
      lastTick: o.status === "resolved" ? null : filed + o.level * BASE_RUNG_MS,
      rungs,
    });
  }

  seed({
    title: "Live wire fallen near school gate", cat: "Public safety", ward: "Ward 42, Indiranagar",
    level: 1, status: "escalated", metoo: 38, ageMs: BASE_RUNG_MS + 3000, declaredSev: 4,
    desc: "An electric line snapped and is lying on the footpath right by the school gate where children walk. Extremely dangerous.",
    photos: [svgPhoto("#8b2e6f", "#4a1838", "Fallen wire")],
  });
  seed({
    title: "Overflowing garbage at market corner", cat: "Sanitation & garbage", ward: "Ward 18, Shivajinagar",
    level: 2, status: "escalated", metoo: 41, ageMs: BASE_RUNG_MS * 2 + 4000, declaredSev: 3,
    desc: "Bins by the vegetable market haven't been cleared in over a week. Spilling onto the road near the school gate.",
    photos: [svgPhoto("#6b7a4f", "#3a4227", "Garbage pile"), svgPhoto("#7a6a4f", "#42371f", "Blocked drain")],
  });
  seed({
    title: "Potholes flooding after every rain", cat: "Roads & potholes", ward: "Ward 42, Indiranagar",
    level: 1, status: "escalated", metoo: 23, ageMs: BASE_RUNG_MS + 5000, declaredSev: 3,
    desc: "Three deep potholes on 4th Cross fill with water; two-wheelers keep skidding. Reported twice with no response.",
    photos: [svgPhoto("#5a5f6b", "#2b2f37", "Pothole 4th Cross")],
  });
  seed({
    title: "Broken streetlight fixed", cat: "Streetlights", ward: "Ward 42, Indiranagar",
    level: 0, status: "resolved", metoo: 5, ageMs: 6000, declaredSev: 1, histDays: 3,
    desc: "Streetlight outside the park was out two weeks — fixed the day after filing.",
    photos: [svgPhoto("#3a3a4a", "#1a1a24", "Streetlight")],
  });
  seed({
    title: "Whole road is cursed, fix everything now!!", cat: "Roads & potholes", ward: "Ward 42, Indiranagar",
    level: 0, status: "open", metoo: 0, ageMs: 20000, rv: false, declaredSev: 4, desc: "No details.", photos: [],
  });
  seed({
    title: "Collapsed footbridge — only route to school", cat: "Public safety", ward: "Ward 18, Shivajinagar",
    level: 4, status: "escalated", metoo: 88, ageMs: BASE_RUNG_MS * 4 + 6000, declaredSev: 4,
    desc: "The pedestrian footbridge children use to cross to school has partly collapsed. Escalated all the way to the state ministry.",
    photos: [svgPhoto("#7a4f4f", "#421f1f", "Collapsed bridge")],
    govResponse: "no_funds", fundGoal: 150000, fundRaised: 96500,
    fundPartner: "Namma Ward Foundation (verified 80G NGO)",
  });

  return out;
}

export const CAMPAIGNS: Campaign[] = [
  {
    type: "health", authority: "BBMP Health Dept.", title: "Dengue prevention drive — clear standing water",
    when: "Active · Jun–Sep monsoon",
    body: "Cases are rising with the rains. Empty any containers, tyres, or pots holding water around your home weekly. Fogging is scheduled ward-wise; check timings at your ward office. Spotted a mosquito breeding site in public? Report it here.",
    cta: { label: "Report standing water near you", action: "report" },
  },
  {
    type: "deadline", authority: "BBMP Revenue Dept.", title: "Property tax — 5% rebate ends 30 April",
    when: "Deadline · 30 April",
    body: "Pay your 2025–26 property tax before 30 April to claim the 5% early-payment rebate. Payments accepted online and at all BBMP ward centres. Keep your PID/SAS number handy.",
    cta: { label: "How to pay (info)", action: "info" },
  },
  {
    type: "env", authority: "Govt. of Karnataka · Water Board", title: "Water conservation week — fix leaks, save litres",
    when: "14–21 March",
    body: "Bengaluru's reservoirs are below seasonal levels. Report public pipeline leaks, avoid using potable water for washing vehicles, and consider rainwater harvesting — mandatory for sites above 2,400 sq ft.",
    cta: { label: "Report a public water leak", action: "report" },
  },
  {
    type: "safety", authority: "Bengaluru Traffic Police", title: "School-zone safety fortnight",
    when: "1–15 August",
    body: "Slow to 25 km/h near marked school zones. Enforcement drives are on at peak hours. Damaged school-zone signage or missing speed breakers? Flag it so it can be escalated.",
    cta: { label: "Report a school-zone hazard", action: "report" },
  },
  {
    type: "civic", authority: "Election Commission · Karnataka", title: "Voter roll update — verify your details",
    when: "Rolling · verify anytime",
    body: "Check that your name, address and photo on the electoral roll are correct ahead of upcoming local body elections. New residents in the ward can apply to be added.",
    cta: { label: "Verify on the official portal (info)", action: "info" },
  },
];
