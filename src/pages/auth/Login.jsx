import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

const getFeatureName = (pathname) => {
  if (!pathname) return null;
  if (pathname.startsWith('/analyze') || pathname.startsWith('/scanner')) return 'Check Job Circular';
  if (pathname.startsWith('/report-scam') || pathname.startsWith('/report')) return 'Report a Scam';
  if (pathname.startsWith('/my-reports')) return 'My Scam Reports';
  if (pathname.startsWith('/my-activity')) return 'My Activity';
  if (pathname.startsWith('/history') || pathname.startsWith('/circulars')) return 'Previously Checked Jobs';
  if (pathname.startsWith('/profile')) return 'Profile & Settings';
  if (pathname.startsWith('/settings')) return 'Security Settings';
  if (pathname.startsWith('/dashboard')) return 'Dashboard';
  return 'Selected Feature';
};

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [role, setRole] = useState('seeker');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Validation & async state
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');

  const targetPath = location.state?.from?.pathname;
  const requestedFeature = getFeatureName(targetPath);

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDemoFill = (selectedRole) => {
    setRole(selectedRole);
    setApiError('');
    setApiSuccess('');
    setErrors({});

    if (selectedRole === 'employer') {
      setEmail('recruiter@brainstation-23.com');
      setPassword('EmployerSecure2026!');
    } else if (selectedRole === 'officer') {
      setEmail('analyst@circularshield.org');
      setPassword('AnalystAudit2026!');
    } else {
      setEmail('shafiq.rahman@gmail.com');
      setPassword('CandidateSafe2026!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setApiSuccess('');

    if (!validate()) return;

    setIsLoading(true);
    try {
      await login(email, password, role);
      setApiSuccess('Signed in successfully! Redirecting...');

      // Redirect back to requested protected user route or fallback to /dashboard
      const destination = targetPath || '/dashboard';
      setTimeout(() => {
        navigate(destination, { replace: true });
      }, 700);
    } catch (err) {
      setApiError(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your CircularShield account to access verification tools and surveillance reports."
      badgeText="Identity Verification Gateway"
    >
      <div className="space-y-5">
        {/* Protected Destination Notice Banner */}
        {requestedFeature && (
          <div className="p-3.5 rounded-xl bg-[#F0FDF9] border border-[#A7F3D0] flex items-start gap-2.5 text-xs text-[#065F46] animate-in fade-in duration-150">
            <Lock size={16} className="text-[#087F70] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#102C3A]">Authentication Required: </span>
              <span>
                Please sign in to access <strong className="text-[#087F70] font-semibold">{requestedFeature}</strong>. You will be redirected immediately upon authentication.
              </span>
            </div>
          </div>
        )}

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#F1F5F8] rounded-xl border border-[#E2E8EC]">
          <button
            type="button"
            onClick={() => handleDemoFill('seeker')}
            className={`py-2 px-1 text-xs font-semibold rounded-lg transition-all cursor-pointer truncate ${
              role === 'seeker'
                ? 'bg-white text-[#102C3A] shadow-xs'
                : 'text-[#64748B] hover:text-[#182B36]'
            }`}
          >
            Job Seeker
          </button>
          <button
            type="button"
            onClick={() => handleDemoFill('employer')}
            className={`py-2 px-1 text-xs font-semibold rounded-lg transition-all cursor-pointer truncate ${
              role === 'employer'
                ? 'bg-white text-[#102C3A] shadow-xs'
                : 'text-[#64748B] hover:text-[#182B36]'
            }`}
          >
            Employer
          </button>
          <button
            type="button"
            onClick={() => handleDemoFill('officer')}
            className={`py-2 px-1 text-xs font-semibold rounded-lg transition-all cursor-pointer truncate ${
              role === 'officer'
                ? 'bg-white text-[#102C3A] shadow-xs'
                : 'text-[#64748B] hover:text-[#182B36]'
            }`}
          >
            Analyst
          </button>
        </div>

        {/* Global Error Banner */}
        {apiError && (
          <div className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-2.5 text-xs text-[#DC4B4B] animate-in fade-in duration-150">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span className="font-medium">{apiError}</span>
          </div>
        )}

        {/* Global Success Banner */}
        {apiSuccess && (
          <div className="p-3.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-start gap-2.5 text-xs text-[#16A36A] animate-in fade-in duration-150">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
            <span className="font-medium">{apiSuccess}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. shafiq.rahman@gmail.com"
            leftIcon={Mail}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
            }}
            error={errors.email}
            required
          />

          <div className="space-y-1">
            <Input
              label="Password"
              type="password"
              placeholder="••••••••••••"
              leftIcon={Lock}
              showPasswordToggle={true}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
              }}
              error={errors.password}
              required
            />

            <div className="flex items-center justify-between text-xs pt-1.5">
              <label className="flex items-center gap-2 text-[#475569] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#CBD5E1] text-[#087F70] focus:ring-[#087F70]"
                />
                <span>Remember me</span>
              </label>

              <Link
                to="/forgot-password"
                className="font-semibold text-[#087F70] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            rightIcon={ArrowRight}
            className="w-full text-sm font-semibold shadow-xs"
          >
            Login to Account
          </Button>
        </form>

        {/* Demo Quick-Fill Bar */}
        <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center text-xs text-[#64748B]">
          <span>Testing? </span>
          <button
            type="button"
            onClick={() => handleDemoFill(role)}
            className="font-semibold text-[#087F70] hover:underline cursor-pointer"
          >
            Click to auto-fill demo credentials
          </button>
        </div>

        {/* Link to Registration with preserved location state */}
        <div className="pt-2 text-center text-xs text-[#64748B]">
          <span>Don't have an account yet? </span>
          <Link
            to="/register"
            state={location.state}
            className="font-bold text-[#087F70] hover:underline"
          >
            Create an Account &rarr;
          </Link>
        </div>

        {/* Link to Admin Portal */}
        <div className="pt-3 border-t border-[#E2E8F0] text-center">
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#DC4B4B] transition-colors"
          >
            <ShieldAlert size={14} className="text-[#DC4B4B]" />
            <span>SecOps Administrator? Sign in to Admin Console &rarr;</span>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
