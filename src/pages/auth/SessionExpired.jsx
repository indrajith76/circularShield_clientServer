import { useNavigate } from 'react-router-dom';
import { Clock, LogIn, Home } from 'lucide-react';
import Button from '../../components/ui/Button';
import BrandLogo from '../../components/common/BrandLogo';

export const SessionExpired = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F9FA] text-[#182B36] flex flex-col items-center justify-center p-4 sm:p-6 font-sans antialiased">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#E2E8F0] shadow-xl p-8 sm:p-10 text-center space-y-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex justify-center">
          <BrandLogo size="md" showTagline={false} href="/" />
        </div>

        {/* Expired Clock Icon */}
        <div className="w-18 h-18 mx-auto rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center text-[#D99A28] shadow-xs">
          <Clock size={40} />
        </div>

        {/* Heading & Notice */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
            Session Timeout
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102C3A] tracking-tight">
            Session Expired
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
            Your authenticated security session has timed out or was terminated for your protection. Please sign in again to resume your work.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
          <Button
            variant="outline"
            size="md"
            leftIcon={Home}
            onClick={() => navigate('/')}
            className="text-xs"
          >
            Public Home
          </Button>

          <Button
            variant="secondary"
            size="md"
            leftIcon={LogIn}
            onClick={() => navigate('/login')}
            className="text-xs font-semibold shadow-xs"
          >
            User Sign In
          </Button>

          <Button
            variant="subtle"
            size="md"
            leftIcon={LogIn}
            onClick={() => navigate('/admin/login')}
            className="text-xs"
          >
            Admin Sign In
          </Button>
        </div>

        <div className="pt-4 border-t border-[#F1F5F8] text-[11px] text-[#94A3B8]">
          Protected by CircularShield End-to-End Cryptographic Session Guard.
        </div>
      </div>
    </div>
  );
};

export default SessionExpired;
