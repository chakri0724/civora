export function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="1.5" y="1.5" width="45" height="45" rx="12" fill="#2b4a6f" />
      <path d="M13 34.5h7.5" stroke="#f6f4ec" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M17 27h9.5" stroke="#f6f4ec" strokeWidth="3.4" strokeLinecap="round" opacity=".82" />
      <path d="M21 19.5h9.5" stroke="#f6f4ec" strokeWidth="3.4" strokeLinecap="round" opacity=".64" />
      <circle cx="32.5" cy="14" r="5" fill="#c0492e" />
      <circle cx="32.5" cy="14" r="1.8" fill="#f6f4ec" />
    </svg>
  );
}

export function Wordmark({ markSize = 30, textClass = "text-[26px]" }: { markSize?: number; textClass?: string }) {
  return (
    <div className="flex items-center gap-2">
      <LogoMark size={markSize} />
      <span className={`font-extrabold tracking-tight text-ink ${textClass}`}>
        Civora<span className="text-escalate">.</span>
      </span>
    </div>
  );
}
