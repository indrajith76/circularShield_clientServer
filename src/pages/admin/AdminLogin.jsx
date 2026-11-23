import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ShieldAlert,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Terminal,
  Activity,
  ArrowLeft,
} from 'lucide-react';
import BrandLogo from '../../components/common/BrandLogo';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { adminLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Administrator email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid administrator email address.';
    }

    if (!password) {
      newErrors.password = 'SecOps security key is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Passphrase must be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDemoFill = () => {
    setEmail('admin@circularshield.security');
    setPassword('AdminSecret2026!');
    setApiError('');
    setApiSuccess('');
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setApiSuccess('');

    if (!validate()) return;

    setIsLoading(true);
    try {
      await adminLogin(email, password);
      setApiSuccess('Security token authenticated. Initializing SecOps console...');

      // Redirect to the originally requested admin route or /admin/dashboard
      const destination = location.state?.from?.pathname || '/admin/dashboard';
      setTimeout(() => {
        navigate(destination, { replace: true });
      }, 700);
    } catch (err) {
      setApiError(err.message || 'Access denied: Invalid administrator credentials or revoked token.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-[#0A1922] text-slate-100 font-sans antialiased relative overflow-hidden">
      {/* Background Matrix & Radar Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-[#087F70]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-[#102C3A] rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <BrandLogo variant="white" size="md" showTagline={false} href="/" />
          <span className="hidden sm:inline-block text-xs font-mono px-2 py-0.5 rounded-md bg-[#102C3A] border border-[#1D4355] text-[#00E5C9]">
            SecOps Console v2.6
          </span>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Exit to Public Portal</span>
        </Link>
      </header>

      {/* Main Administrative Form Container */}
      <main className="relative z-10 w-full max-w-md mx-auto px-4 py-8 sm:py-12 flex-1 flex flex-col justify-center">
        <div className="bg-[#102C3A]/95 border border-[#1D4355] shadow-2xl rounded-2xl p-6 sm:p-8 backdrop-blur-md space-y-6">
          {/* Header Title & Badges */}
          <div className="space-y-2 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DC4B4B]/15 border border-[#DC4B4B]/30 text-[#F87171] text-xs font-mono font-semibold">
              <ShieldAlert size={14} />
              <span>RESTRICTED ACCESS PORTAL</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Security Operations Login
            </h1>
            <p className="text-xs text-slate-400">
              Administrative authentication gateway for platform operators, intelligence analysts, and audit compliance officers.
            </p>
          </div>

          {/* Security Monitoring Warning Banner */}
          <div className="p-3 rounded-xl bg-[#0F222C] border border-[#1E3A4B] text-[11px] text-slate-300 flex items-start gap-2.5">
            <Terminal size={16} className="text-[#00E5C9] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-semibold text-white">System Notice: </span>
              All administrative actions and login attempts are securely recorded for audit compliance.
            </div>
          </div>

          {/* Feedback Alerts */}
          {apiError && (
            <div className="p-3.5 rounded-xl bg-[#FEF2F2]/10 border border-[#DC4B4B]/50 flex items-start gap-2.5 text-xs text-[#F87171] animate-in fade-in duration-150">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span className="font-medium">{apiError}</span>
            </div>
          )}

          {apiSuccess && (
            <div className="p-3.5 rounded-xl bg-[#ECFDF5]/10 border border-[#16A36A]/50 flex items-start gap-2.5 text-xs text-[#34D399] animate-in fade-in duration-150">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              <span className="font-medium">{apiSuccess}</span>
            </div>
          )}

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                SecOps Administrator Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                  }}
                  placeholder="admin@circularshield.security"
                  className={`w-full pl-9 pr-3 py-2.5 bg-[#08151D] border text-xs text-white rounded-xl placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#087F70] transition-colors ${
                    errors.email ? 'border-[#DC4B4B]' : 'border-[#1D4355]'
                  }`}
                  required
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-[#F87171] font-medium">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                SecOps Security Passphrase
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                  }}
                  placeholder="••••••••••••"
                  className={`w-full pl-9 pr-3 py-2.5 bg-[#08151D] border text-xs text-white rounded-xl placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#087F70] transition-colors ${
                    errors.password ? 'border-[#DC4B4B]' : 'border-[#1D4355]'
                  }`}
                  required
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-[#F87171] font-medium">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#1D4355] bg-[#08151D] text-[#087F70] focus:ring-[#087F70]"
                />
                <span>Remember workstation</span>
              </label>

              <span className="text-[11px] text-slate-500">
                IP: 103.25.244.18 (Dhaka)
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              rightIcon={ArrowRight}
              className="w-full text-xs font-semibold bg-[#087F70] hover:bg-[#06675B] text-white shadow-lg shadow-[#087F70]/20"
            >
              Sign In to SecOps Console
            </Button>
          </form>

          {/* Quick Demo Credentials Fill Box */}
          <div className="p-3.5 rounded-xl bg-[#08151D] border border-[#1D4355] text-center space-y-1.5">
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <Activity size={14} className="text-[#00E5C9]" />
              <span>Demo Security Officer Credentials</span>
            </div>
            <button
              type="button"
              onClick={handleDemoFill}
              className="text-xs font-semibold text-[#00E5C9] hover:underline cursor-pointer"
            >
              Auto-fill Administrator (admin@circularshield.security)
            </button>
          </div>

          {/* Explicit Notice: No Public Admin Registration */}
          <div className="pt-2 text-center text-[11px] text-slate-400 border-t border-[#1D4355]/60">
            <span>Admin accounts are strictly provisioned by internal system administrators. </span>
            <span className="block mt-0.5 text-slate-400 font-mono">
              Public self-registration is disabled by policy.
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 gap-2">
        <p>&copy; {new Date().getFullYear()} CircularShield National Platform. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <span>Confidentiality Notice</span>
          <span>Security Protocol TLS 1.3</span>
          <Link to="/login" className="text-slate-400 hover:text-slate-200">
            User Sign In
          </Link>
        </div>
      </footer>
    </div>
  );
}
