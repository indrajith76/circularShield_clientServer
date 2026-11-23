import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  FileCheck,
  ShieldAlert,
} from 'lucide-react';
import BrandLogo from '../components/common/BrandLogo';

/**
 * Minimal Split-Screen Auth Layout
 * Left: Brand showcase & security metrics on Deep Navy (#102C3A)
 * Right: Clean form on Pure White (#FFFFFF)
 * Mobile: Single-column clean layout
 */
export const AuthLayout = ({
  children,
  title,
  subtitle,
  badgeText = 'Secure Portal',
}) => {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white text-[#182B36] font-sans antialiased">
      {/* LEFT COLUMN: Brand Illustration & Showcase (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-5/12 bg-[#102C3A] text-white flex-col justify-between p-10 xl:p-14 relative overflow-hidden border-r border-[#1D4355]">
        {/* Ambient Glows */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#087F70]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#0066FF]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top: Brand Logo */}
        <div className="relative z-10">
          <BrandLogo variant="white" size="lg" showTagline={true} href="/" />
        </div>

        {/* Center: Hero Verification Showcase & Badges */}
        <div className="relative z-10 space-y-6 my-auto py-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#087F70]/25 text-[#00E5C9] border border-[#087F70]/40 text-xs font-semibold">
            <ShieldCheck size={16} />
            <span>{badgeText}</span>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl xl:text-3xl font-extrabold text-white tracking-tight leading-snug">
              Protecting Bangladesh's Job Seekers from Syndicated Recruitment Fraud
            </h2>
            <p className="text-xs xl:text-sm text-slate-300 leading-relaxed max-w-md">
              Access the national circular surveillance platform to screen employment notices, authenticate company credentials, and report extortion attempts.
            </p>
          </div>

          {/* Interactive Feature Visual Card */}
          <div className="p-5 rounded-2xl bg-[#0A1C25]/90 border border-[#1D4355] shadow-lg space-y-3.5 max-w-md">
            <div className="flex items-center justify-between pb-3 border-b border-[#1D4355]">
              <span className="text-xs font-mono text-slate-400">
                Threat Engine Telemetry
              </span>
              <span className="text-[11px] text-[#00E5C9] font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A36A] animate-pulse" />
                Live Radar
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#102C3A]/60 border border-[#1D4355]">
                <div className="flex items-center gap-2 text-slate-300">
                  <FileCheck size={16} className="text-[#087F70]" />
                  <span>Circulars Screened</span>
                </div>
                <span className="font-bold text-white">14,850+</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-[#102C3A]/60 border border-[#1D4355]">
                <div className="flex items-center gap-2 text-slate-300">
                  <ShieldAlert size={16} className="text-[#DC4B4B]" />
                  <span>Fraud Rings Blocked</span>
                </div>
                <span className="font-bold text-[#DC4B4B]">3,840+</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-[#102C3A]/60 border border-[#1D4355]">
                <div className="flex items-center gap-2 text-slate-300">
                  <ShieldCheck size={16} className="text-[#16A36A]" />
                  <span>Savings Protected</span>
                </div>
                <span className="font-bold text-[#00E5C9]">৳1.84+ Crore</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Security Guarantees */}
        <div className="relative z-10 pt-6 border-t border-[#1D4355] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Lock size={14} className="text-[#00E5C9]" />
            <span>256-Bit TLS Encryption</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-[#16A36A]" />
            <span>Zero-Knowledge Vault</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Authentication Form */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 overflow-y-auto">
        {/* Top Header Row with Back Link */}
        <div className="flex items-center justify-between w-full max-w-md mx-auto mb-6 sm:mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#087F70] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Return to Home</span>
          </Link>
          <div className="lg:hidden">
            <BrandLogo size="sm" showTagline={false} href="/" />
          </div>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md mx-auto my-auto py-4 space-y-6 animate-in fade-in duration-200">
          {/* Form Header */}
          <div className="space-y-1.5 text-left">
            {title && (
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102C3A] tracking-tight">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form Content */}
          {children}
        </div>

        {/* Footer Note */}
        <div className="w-full max-w-md mx-auto mt-6 pt-4 border-t border-[#F1F5F8] text-center text-xs text-[#94A3B8]">
          <p>
            CircularShield is a non-profit public interest verification platform.
            <br />
            Protected by end-to-end security protocols.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
