import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const calculateStrength = (pwd) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score += 25;
    if (/[A-Z]/.test(pwd)) score += 25;
    if (/[0-9]/.test(pwd)) score += 25;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 25;
    return score;
  };

  const strength = calculateStrength(password);

  const validate = () => {
    const errs = {};
    if (!password) {
      errs.password = 'New password is required.';
    } else if (password.length < 8) {
      errs.password = 'Password must be at least 8 characters long.';
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Confirmation password is required.';
    } else if (confirmPassword !== password) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) return;

    setIsLoading(true);
    try {
      await resetPassword(password);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setApiError(err.message || 'Unable to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create New Password"
      subtitle="Your new password must be at least 8 characters and include a combination of numbers and letters."
      badgeText="Password Reset"
    >
      <div className="space-y-5">
        {isSuccess ? (
          <div className="py-6 space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#ECFDF5] text-[#16A36A] flex items-center justify-center mx-auto shadow-2xs">
              <CheckCircle2 size={32} />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-[#182B36]">
                Password Reset Successfully!
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Your new password has been saved. Redirecting you to login...
              </p>
            </div>

            <div className="pt-2">
              <Link to="/login">
                <Button variant="secondary" size="md" rightIcon={ArrowRight}>
                  Go to Login
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {apiError && (
              <div className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-2.5 text-xs text-[#DC4B4B] animate-in fade-in duration-150">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span className="font-medium">{apiError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Input
                label="New Password"
                type="password"
                placeholder="Minimum 8 characters"
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

              {password && (
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                    <span>Password Strength:</span>
                    <span className="font-bold text-[#182B36]">
                      {strength < 50 ? 'Weak' : strength < 75 ? 'Good' : 'Strong'}
                    </span>
                  </div>
                  <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        strength < 50
                          ? 'bg-[#DC4B4B]'
                          : strength < 75
                          ? 'bg-[#D99A28]'
                          : 'bg-[#16A36A]'
                      }`}
                      style={{ width: `${strength}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Re-enter your new password"
              leftIcon={Lock}
              showPasswordToggle={true}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) {
                  setErrors((prev) => ({ ...prev, confirmPassword: null }));
                }
              }}
              error={errors.confirmPassword}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              rightIcon={ArrowRight}
              className="w-full text-sm font-semibold shadow-xs"
            >
              Update Password
            </Button>

            <div className="pt-2 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#087F70] transition-colors"
              >
                <ArrowLeft size={14} />
                <span>Back to Login</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
