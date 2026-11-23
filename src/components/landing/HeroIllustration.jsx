import { ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

/**
 * HeroIllustration: Professional interactive SVG + HTML visual
 * representing document verification, heuristic threat screening, and job safety.
 */
export const HeroIllustration = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none select-none">
      {/* Ambient Glows */}
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-[#087F70]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-[#0066FF]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Verification Dashboard Card */}
      <div className="relative bg-white rounded-3xl border border-[#CBD5E1] shadow-xl p-5 sm:p-7 space-y-4">
        {/* Card Header Bar */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#F1F5F8]">
          <div className="flex items-center gap-2.5">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#EF4444]/80" />
              <span className="w-3 h-3 rounded-full bg-[#F59E0B]/80" />
              <span className="w-3 h-3 rounded-full bg-[#10B981]/80" />
            </div>
            <span className="text-xs font-mono font-medium text-[#64748B] pl-2 border-l border-[#E2E8F0]">
              shield-threat-engine // live-scan
            </span>
          </div>
          <span className="text-[11px] font-semibold text-[#087F70] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#A7F3D0] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A36A] animate-pulse" />
            Vigilance Active
          </span>
        </div>

        {/* Document Inspection Panel */}
        <div className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#102C3A] text-white flex items-center justify-center shadow-xs">
                <FileText size={20} className="text-[#00E5C9]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#182B36]">
                  Govt Project Assistant — Notice 2026-BD
                </p>
                <p className="text-[11px] text-[#64748B]">
                  Source: Scraped Viral Social Ad • Target: 350 Vacancies
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#DC4B4B] bg-[#FEF2F2] border border-[#FECACA] px-2 py-0.5 rounded-md">
              94% Fraud Risk
            </span>
          </div>

          {/* Scanned Indicators Checklist */}
          <div className="space-y-2 pt-1 text-xs">
            <div className="p-2 rounded-xl bg-white border border-[#FECACA] flex items-center justify-between text-[#DC4B4B]">
              <span className="flex items-center gap-2 font-medium">
                <ShieldAlert size={15} />
                <span>bKash Personal Fee Demanded (৳450)</span>
              </span>
              <span className="font-mono text-[10px] font-bold">+45% Risk</span>
            </div>

            <div className="p-2 rounded-xl bg-white border border-[#FECACA] flex items-center justify-between text-[#DC4B4B]">
              <span className="flex items-center gap-2 font-medium">
                <AlertTriangle size={15} />
                <span>Free Gmail Used (@gmail.com)</span>
              </span>
              <span className="font-mono text-[10px] font-bold">+25% Risk</span>
            </div>

            <div className="p-2 rounded-xl bg-white border border-[#A7F3D0] flex items-center justify-between text-[#16A36A]">
              <span className="flex items-center gap-2 font-medium">
                <CheckCircle2 size={15} />
                <span>Physical Office Check: False Address</span>
              </span>
              <span className="font-mono text-[10px] font-bold">Unverified</span>
            </div>
          </div>
        </div>

        {/* Counter-Example: Verified Enterprise Badge */}
        <div className="p-3 bg-[#ECFDF5] rounded-2xl border border-[#A7F3D0] flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#16A36A] text-white flex items-center justify-center shrink-0 shadow-2xs">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="font-bold text-[#102C3A]">
                BrainStation 23 PLC — Software Engineer
              </p>
              <p className="text-[11px] text-[#087F70]">
                Corporate Domain Verified: @brainstation-23.com (0% Fees)
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#16A36A] bg-white px-2.5 py-1 rounded-lg border border-[#A7F3D0] shrink-0">
            Verified Safe
          </span>
        </div>
      </div>

      {/* Floating Pill: Threat Blocked */}
      <div className="absolute -bottom-4 left-1 sm:-left-6 bg-[#102C3A] text-white px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl shadow-xl border border-[#1D4355] flex items-center gap-2.5 sm:gap-3">
        <div className="w-7 h-7 rounded-lg bg-[#DC4B4B] flex items-center justify-center shrink-0">
          <ShieldAlert size={16} />
        </div>
        <div>
          <p className="text-[11px] sm:text-xs font-bold leading-tight">Fake Admit Card Scam</p>
          <p className="text-[9px] sm:text-[10px] text-slate-300">৳2,500 Extortion Blocked</p>
        </div>
      </div>

      {/* Floating Pill: 100% Free Verification */}
      <div className="absolute -top-4 right-1 sm:-right-6 bg-white px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl shadow-lg border border-[#E2E8F0] flex items-center gap-2 sm:gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-[#087F70] text-white flex items-center justify-center shrink-0">
          <ShieldCheck size={16} />
        </div>
        <div>
          <p className="text-[11px] sm:text-xs font-bold text-[#102C3A] leading-tight">
            Accredited Security
          </p>
          <p className="text-[9px] sm:text-[10px] text-[#16A36A] font-semibold">
            Public Watchdog Initiative
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroIllustration;
