import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock,
  ArrowRight,
  UserPlus,
  Zap,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';

export default function LoginRequiredModal({
  isOpen,
  onClose,
  destination = '/dashboard',
  featureTitle = 'Protected Platform Feature',
  reason,
}) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isDemoLoggingIn, setIsDemoLoggingIn] = useState(false);
  const [demoError, setDemoError] = useState('');

  const defaultReason =
    `Signing in allows you to save your checked jobs, track reported scams, and protect your personal scan history.`;

  const handleGoToLogin = () => {
    onClose();
    navigate('/login', { state: { from: { pathname: destination } } });
  };

  const handleGoToRegister = () => {
    onClose();
    navigate('/register', { state: { from: { pathname: destination } } });
  };

  const handleInstantDemoLogin = async () => {
    setDemoError('');
    setIsDemoLoggingIn(true);
    try {
      await login('shafiq.rahman@gmail.com', 'CandidateSafe2026!', 'seeker');
      onClose();
      navigate(destination, { replace: true });
    } catch (err) {
      setDemoError(err.message || 'Failed to authenticate demo session.');
    } finally {
      setIsDemoLoggingIn(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      maxWidth="max-w-lg"
    >
      <div className="space-y-5 -mt-2">
        {/* Top Icon & Badge Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#087F70]/10 border border-[#087F70]/20 flex items-center justify-center text-[#087F70] shadow-xs">
              <Lock size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-[#102C3A]">
                  Please Sign In to Continue
                </h3>
              </div>
              <p className="text-xs text-[#64748B]">
                Log in with your free account to access this tool
              </p>
            </div>
          </div>

          <Badge variant="warning" size="sm">
            Sign-In Required
          </Badge>
        </div>

        {/* Feature Pill */}
        <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between text-xs">
          <span className="text-[#64748B] font-medium">Selected Feature:</span>
          <span className="font-bold text-[#102C3A] truncate max-w-[240px]">
            {featureTitle}
          </span>
        </div>

        {/* Clear Explanation of Why Login is Required */}
        <div className="space-y-1.5 text-xs">
          <p className="font-bold text-[#182B36]">Why do I need to sign in?</p>
          <p className="text-[#64748B] leading-relaxed">
            {reason || defaultReason}
          </p>
        </div>

        {/* Key Feature Benefits */}
        <div className="p-3.5 rounded-xl bg-[#ECFDF5]/60 border border-[#A7F3D0] space-y-2 text-xs">
          <p className="font-bold text-[#065F46] flex items-center gap-1.5">
            <CheckCircle2 size={15} className="text-[#16A36A]" />
            <span>Unlocked with your free account:</span>
          </p>
          <ul className="space-y-1.5 text-[#047857] pl-5 list-disc text-[11px] sm:text-xs">
            <li>Instant safety rating (0–100) and clear warning signs for any job circular</li>
            <li>Report suspicious recruiters demanding money or bKash/Nagad payments</li>
            <li>Save your previously checked jobs and download printable safety reports</li>
          </ul>
        </div>

        {demoError && (
          <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-2 text-xs text-[#DC4B4B]">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{demoError}</span>
          </div>
        )}

        {/* Primary Action Buttons */}
        <div className="space-y-2 pt-1">
          <Button
            type="button"
            variant="primary"
            size="md"
            rightIcon={ArrowRight}
            onClick={handleGoToLogin}
            className="w-full text-xs font-semibold justify-center shadow-xs"
          >
            Sign In to Continue
          </Button>

          <Button
            type="button"
            variant="outline"
            size="md"
            leftIcon={UserPlus}
            onClick={handleGoToRegister}
            className="w-full text-xs font-semibold justify-center text-[#182B36]"
          >
            Create a Free Account
          </Button>

          {/* Quick 1-Click Instant Demo Login for Testing */}
          <div className="pt-2 border-t border-[#F1F5F8]">
            <button
              type="button"
              onClick={handleInstantDemoLogin}
              disabled={isDemoLoggingIn}
              className="w-full py-2 px-3 rounded-xl bg-[#087F70]/10 hover:bg-[#087F70]/20 text-[#087F70] border border-[#087F70]/30 flex items-center justify-center gap-2 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Zap size={14} className="text-[#087F70]" />
              <span>
                {isDemoLoggingIn ? 'Signing in demo session...' : '1-Click Instant Demo Login (Proceed to Feature)'}
              </span>
            </button>
          </div>
        </div>

        {/* Dismiss as Guest */}
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-[#64748B] hover:text-[#182B36] font-medium transition-colors cursor-pointer"
          >
            Cancel and continue browsing as guest
          </button>
        </div>
      </div>
    </Modal>
  );
}
