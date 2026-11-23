import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/c_logo1.png';

export const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Branding Column (Matching PDF Page 4) */}
        <div className="text-white space-y-4 px-4 sm:px-6">
          <Link to="/dashboard" className="inline-block">
            <img
              src={logo}
              alt="CircularShield"
              className="h-24 sm:h-28 w-auto max-w-[260px] object-contain drop-shadow-lg shrink-0"
            />
            <h1 className="sr-only">CircularShield</h1>
          </Link>
          <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed max-w-sm">
            Verify a job circular before you apply. চাকরির বিজ্ঞপ্তি যাচাই করুন, প্রতারণা এড়ান।
          </p>
        </div>

        {/* Right Auth Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10">
          {/* Mode Switcher Pills */}
          <div className="flex items-center gap-2 mb-6 p-1 bg-[#F1F5F9] rounded-xl w-fit">
            <Link
              to="/login"
              className="px-5 py-2 rounded-lg text-xs font-bold text-[#64748B] hover:text-[#0F172A] transition-colors"
            >
              Login
            </Link>
            <button
              type="button"
              className="px-5 py-2 rounded-lg text-xs font-bold bg-[#0F172A] text-white shadow-xs cursor-default"
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#182B36] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Shafiqur Rahman"
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#182B36] focus:outline-none focus:ring-2 focus:ring-[#087F70]/20 focus:border-[#087F70] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#182B36] mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#182B36] focus:outline-none focus:ring-2 focus:ring-[#087F70]/20 focus:border-[#087F70] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#182B36] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#182B36] focus:outline-none focus:ring-2 focus:ring-[#087F70]/20 focus:border-[#087F70] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#64748B] hover:text-[#182B36]"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#182B36] mb-1.5">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#182B36] focus:outline-none focus:ring-2 focus:ring-[#087F70]/20 focus:border-[#087F70] transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-[#087F70] text-white text-sm font-semibold hover:bg-[#066559] transition-colors shadow-xs cursor-pointer text-center mt-2"
            >
              Create Account
            </button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="text-xs text-[#64748B] hover:text-[#0F172A] font-medium"
              >
                Already have an account? Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

