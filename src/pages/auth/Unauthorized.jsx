import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home, Lock, LogIn } from 'lucide-react';
import Button from '../../components/ui/Button';
import BrandLogo from '../../components/common/BrandLogo';
import { useAuth } from '../../context/AuthContext';

export const Unauthorized = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const isNormalUser = user?.systemRole === 'USER';
  const isAdminUser = user?.systemRole === 'ADMIN';

  const reason = location.state?.reason || 'You do not have the required role privileges to access this area.';

  const handleReturnDashboard = () => {
    if (isAdminUser) {
      navigate('/admin/dashboard');
    } else if (isNormalUser) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  const handleSwitchAccount = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#F7F9FA] text-[#182B36] flex flex-col items-center justify-center p-4 sm:p-6 font-sans antialiased">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-[#E2E8F0] shadow-xl p-8 sm:p-10 text-center space-y-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex justify-center">
          <BrandLogo size="md" showTagline={false} href="/" />
        </div>

        {/* Security Shield Warning Icon */}
        <div className="relative mx-auto w-20 h-20 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center text-[#DC4B4B] shadow-xs">
          <ShieldAlert size={44} />
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-[#102C3A] text-white flex items-center justify-center border-2 border-white">
            <Lock size={14} />
          </div>
        </div>

        {/* Heading & Notice */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FEF2F2] text-[#DC4B4B] border border-[#FECACA]">
            HTTP 403 Forbidden
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102C3A] tracking-tight">
            Unauthorized Access
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed max-w-md mx-auto">
            {reason}
          </p>
        </div>

        {/* Role Diagnostic Card */}
        {user && (
          <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs space-y-1.5 text-left">
            <div className="flex items-center justify-between">
              <span className="text-[#64748B]">Active Account:</span>
              <span className="font-semibold text-[#182B36] truncate max-w-[200px]">{user.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#64748B]">Assigned Role:</span>
              <span className="font-mono font-bold text-[#102C3A] bg-slate-200/60 px-2 py-0.5 rounded text-[11px]">
                {user.systemRole || 'PUBLIC_GUEST'}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
          <Button
            variant="outline"
            size="md"
            leftIcon={ArrowLeft}
            onClick={() => navigate(-1)}
            className="text-xs"
          >
            Go Back
          </Button>

          <Button
            variant="secondary"
            size="md"
            leftIcon={Home}
            onClick={handleReturnDashboard}
            className="text-xs font-semibold shadow-xs"
          >
            {isAdminUser ? 'Return to Admin Dashboard' : isNormalUser ? 'Return to User Dashboard' : 'Return to Home'}
          </Button>

          {isNormalUser && (
            <Button
              variant="subtle"
              size="md"
              leftIcon={LogIn}
              onClick={handleSwitchAccount}
              className="text-xs"
            >
              Sign In as Admin
            </Button>
          )}
        </div>

        {/* Security Audit Footer */}
        <div className="pt-4 border-t border-[#F1F5F8] text-[11px] text-[#94A3B8]">
          Security Notice: Unauthorized access attempts are monitored and recorded.
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
