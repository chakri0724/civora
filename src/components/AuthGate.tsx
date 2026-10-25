"use client";

import { useRef, useState } from "react";
import { useCivora } from "@/lib/store";
import { LogoMark } from "./Logo";

export function AuthGate({ onClose }: { onClose: () => void }) {
  const setUser = useCivora((s) => s.setUser);
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [pendingPhone, setPendingPhone] = useState("");
  const [demoCode, setDemoCode] = useState("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState(false);
  const boxes = useRef<(HTMLInputElement | null)[]>([]);

  function sendCode() {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setDemoCode(code);
    setPendingPhone(phone);
    setStep("otp");
  }

  function verify() {
    if (otp.join("") === demoCode) {
      setUser({ verified: true, phone: pendingPhone });
      onClose();
    } else {
      setError(true);
      setOtp(["", "", "", "", "", ""]);
      boxes.current[0]?.focus();
    }
  }

  return (
    <div className="absolute inset-0 z-[70] bg-paper flex flex-col justify-center px-6">
      <div className="flex items-center gap-3 justify-center mb-1.5">
        <LogoMark size={52} />
        <span className="text-4xl font-extrabold tracking-tight text-ink">
          Civora<span className="text-escalate">.</span>
        </span>
      </div>
      <div className="text-center text-muted text-[13px] mb-8 leading-relaxed">
        Verify your number once.
        <br />
        Only verified residents can raise issues — it keeps fakes out.
      </div>

      {step === "phone" ? (
        <div>
          <h2 className="text-lg font-bold mb-1.5">Enter your mobile number</h2>
          <p className="text-[13px] text-muted mb-4 leading-relaxed">
            We&apos;ll text a one-time code. Your number stays private and is never shown on public issues.
          </p>
          <div className="flex items-center bg-card border border-line rounded-[13px] px-3.5 mb-3.5">
            <span className="text-base font-semibold pr-2.5 border-r border-line mr-2.5">+91</span>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              placeholder="98XXXXXXXX"
              className="border-0 bg-transparent text-[17px] py-3.5 flex-1 outline-none"
            />
          </div>
          <button
            disabled={phone.length !== 10}
            onClick={sendCode}
            className="w-full bg-ink text-paper text-[15px] font-bold py-3.5 rounded-[14px] mb-3 disabled:opacity-45 active:scale-[0.985]"
          >
            Send code
          </button>
          <div onClick={onClose} className="text-center text-[13px] text-verify font-semibold cursor-pointer py-1.5">
            Explore without signing in (read-only)
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-bold mb-1.5">Enter the 6-digit code</h2>
          <p className="text-[13px] text-muted mb-4">
            Sent to <b>+91 {pendingPhone}</b>.{" "}
            <span onClick={() => setStep("phone")} className="text-verify font-semibold cursor-pointer">
              Change
            </span>
          </p>
          <div className="text-[11.5px] text-[#8a6a1f] bg-amber/10 rounded-[10px] px-3.5 py-3 leading-relaxed mb-4">
            Demo: no real SMS is sent. Your code is <b className="text-[15px] tracking-[0.14em]">{demoCode}</b>
          </div>
          <div className="flex gap-2.5 mb-4 justify-between">
            {otp.map((v, i) => (
              <input
                key={i}
                ref={(el) => {
                  boxes.current[i] = el;
                }}
                maxLength={1}
                inputMode="numeric"
                value={v}
                onChange={(e) => {
                  const d = e.target.value.replace(/\D/g, "");
                  const next = [...otp];
                  next[i] = d;
                  setOtp(next);
                  setError(false);
                  if (d && i < 5) boxes.current[i + 1]?.focus();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !otp[i] && i > 0) boxes.current[i - 1]?.focus();
                }}
                className={`w-full text-center text-[22px] font-bold py-3.5 bg-card border rounded-xl outline-none ${
                  error ? "border-escalate" : "border-line focus:border-verify"
                }`}
              />
            ))}
          </div>
          <button
            onClick={verify}
            className="w-full bg-ink text-paper text-[15px] font-bold py-3.5 rounded-[14px] mb-3 active:scale-[0.985]"
          >
            Verify & continue
          </button>
          <div onClick={sendCode} className="text-center text-[13px] text-verify font-semibold cursor-pointer py-1.5">
            Resend code
          </div>
        </div>
      )}
    </div>
  );
}
