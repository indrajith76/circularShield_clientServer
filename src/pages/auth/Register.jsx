import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
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

export const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  const targetPath = location.state?.from?.pathname;
  const requestedFeature = getFeatureName(targetPath);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');

  const calculatePasswordStrength = (pwd) => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (/[A-Z]/.test(pwd)) strength += 25;
    if (/[0-9]/.test(pwd)) strength += 25;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 25;
    return strength;
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email format.';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required.';
    } else if (!/^\+?[0-9\s-]{10,15}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmation password is required.';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and safety guidelines.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setApiSuccess('');

    if (!validate()) return;

    setIsLoading(true);
    try {
      await register({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phoneNumber,
        password: formData.password,
      });

      setApiSuccess('Account created successfully! Redirecting...');
      const destination = targetPath || '/dashboard';
      setTimeout(() => {
        navigate(destination, { replace: true });
      }, 700);
    } catch (err) {
      setApiError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Join CircularShield to verify job circulars, screen employer credentials, and safeguard your career."
      badgeText="Citizen Watchdog Registration"
    >
      <div className="space-y-5">
        {/* Protected Destination Notice Banner */}
        {requestedFeature && (
          <div className="p-3.5 rounded-xl bg-[#F0FDF9] border border-[#A7F3D0] flex items-start gap-2.5 text-xs text-[#065F46] animate-in fade-in duration-150">
            <Lock size={16} className="text-[#087F70] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#102C3A]">Destination Unlocked After Sign-Up: </span>
              <span>
                Registering your citizen account will immediately take you to <strong className="text-[#087F70] font-semibold">{requestedFeature}</strong>.
              </span>
            </div>
          </div>
        )}

        {/* Global Alerts */}
        {apiError && (
          <div className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-2.5 text-xs text-[#DC4B4B] animate-in fade-in duration-150">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span className="font-medium">{apiError}</span>
          </div>
        )}

        {apiSuccess && (
          <div className="p-3.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-start gap-2.5 text-xs text-[#16A36A] animate-in fade-in duration-150">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
            <span className="font-medium">{apiSuccess}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="e.g. Shafiqur Rahman"
            leftIcon={User}
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            error={errors.fullName}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. shafiq.rahman@gmail.com"
            leftIcon={Mail}
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={errors.email}
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            placeholder="e.g. +880 1712-345678"
            leftIcon={Phone}
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            error={errors.phoneNumber}
            required
          />

          <div className="space-y-1.5">
            <Input
              label="Password"
              type="password"
              placeholder="Minimum 8 characters"
              leftIcon={Lock}
              showPasswordToggle={true}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              error={errors.password}
              required
            />

            {/* Visual Password Strength Indicator */}
            {formData.password && (
              <div className="space-y-1 pt-1">
                <div className="h-1.5 w-full bg-[#E2E8EC] rounded-full overflow-hidden flex">
                  <div
                    className={`h-full transition-all duration-300 ${
                      passwordStrength <= 25
                        ? 'w-1/4 bg-[#DC4B4B]'
                        : passwordStrength <= 50
                        ? 'w-2/4 bg-[#D99A28]'
                        : passwordStrength <= 75
                        ? 'w-3/4 bg-[#087F70]'
                        : 'w-full bg-[#16A36A]'
                    }`}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-[#64748B]">
                  <span>Security Strength:</span>
                  <span className="font-semibold text-[#102C3A]">
                    {passwordStrength <= 25
                      ? 'Weak'
                      : passwordStrength <= 50
                      ? 'Fair'
                      : passwordStrength <= 75
                      ? 'Good'
                      : 'Strong (Recommended)'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Re-enter your password"
            leftIcon={Lock}
            showPasswordToggle={true}
            value={formData.confirmPassword}
            onChange={(e) =>
              handleInputChange('confirmPassword', e.target.value)
            }
            error={errors.confirmPassword}
            required
          />

          {/* Terms & Conditions Checkbox */}
          <div className="space-y-1 pt-1">
            <label className="flex items-start gap-2.5 text-xs text-[#475569] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) =>
                  handleInputChange('acceptTerms', e.target.checked)
                }
                className="mt-0.5 rounded border-[#CBD5E1] text-[#087F70] focus:ring-[#087F70]"
              />
              <span className="leading-relaxed">
                I accept the{' '}
                <span className="text-[#087F70] font-semibold hover:underline">
                  Terms of Service
                </span>{' '}
                and agree to adhere to the CircularShield verification and fair reporting guidelines.
              </span>
            </label>
            {errors.acceptTerms && (
              <p className="text-xs text-[#DC4B4B]">{errors.acceptTerms}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="secondary"
            size="lg"
            isLoading={isLoading}
            rightIcon={ArrowRight}
            className="w-full text-sm font-semibold shadow-xs"
          >
            Create Account
          </Button>
        </form>

        {/* Link to Login with preserved location state */}
        <div className="pt-2 text-center text-xs text-[#64748B]">
          <span>Already have an account? </span>
          <Link
            to="/login"
            state={location.state}
            className="font-bold text-[#087F70] hover:underline"
          >
            Sign In &rarr;
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Register;
