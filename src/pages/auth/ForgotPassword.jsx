import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

export const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const validate = () => {
    if (!email.trim()) {
      setError('Please provide your registered email address.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please provide a valid email format.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await forgotPassword(email);
      setSubmittedEmail(email);
      setIsSubmitted(true);
    } catch (err) {
      setError(err.message || 'Unable to process request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Your Password"
      subtitle="Enter the email address registered with your account and we will send you instructions to reset your password."
      badgeText="Password Help"
    >
      <div className="space-y-5">
        {isSubmitted ? (
          <div className="py-6 space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#ECFDF5] text-[#16A36A] flex items-center justify-center mx-auto shadow-2xs">
              <CheckCircle2 size={32} />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-[#182B36]">
                Check Your Email
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed max-w-sm mx-auto">
                We've sent password reset instructions to{' '}
                <strong className="text-[#182B36] font-semibold">{submittedEmail}</strong>.
                Please check your inbox or spam folder.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#475569] space-y-2">
              <p className="font-semibold text-[#182B36]">
                For instant testing in this demo:
              </p>
              <Link
                to="/reset-password"
                className="inline-flex items-center gap-1.5 font-bold text-[#087F70] hover:underline"
              >
                <span>Click here to open the Reset Password screen directly</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="pt-2">
              <Link to="/login">
                <Button variant="outline" size="md" leftIcon={ArrowLeft}>
                  Back to Login
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-2.5 text-xs text-[#DC4B4B] animate-in fade-in duration-150">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <Input
              label="Registered Email Address"
              type="email"
              placeholder="e.g. shafiq.rahman@gmail.com"
              leftIcon={Mail}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              helperText="We will send a single-use authorization token to this address."
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
              Send Reset Link
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

export default ForgotPassword;
