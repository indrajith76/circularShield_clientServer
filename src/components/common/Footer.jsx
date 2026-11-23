import { NavLink } from 'react-router-dom';
import BrandLogo from './BrandLogo';

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-[#E2E8F0] bg-white py-6 px-4 sm:px-6 text-xs text-[#64748B]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Unified Brand Identity Logo */}
        <div className="flex items-center gap-3">
          <BrandLogo size="md" showTagline={true} />
        </div>

        {/* Center: Quick Links */}
        <div className="flex items-center flex-wrap justify-center gap-5 text-xs font-medium">
          <NavLink to="/dashboard" className="hover:text-[#087F70] transition-colors">
            Dashboard
          </NavLink>
          <NavLink to="/analyze" className="hover:text-[#087F70] transition-colors">
            Check Job Circular
          </NavLink>
          <NavLink to="/my-activity" className="hover:text-[#087F70] transition-colors">
            Previously Checked Jobs
          </NavLink>
          <NavLink to="/organizations" className="hover:text-[#087F70] transition-colors">
            Organizations
          </NavLink>
          <NavLink to="/report-scam" className="hover:text-[#DC4B4B] transition-colors">
            Report a Scam
          </NavLink>
          <NavLink to="/login" className="hover:text-[#087F70] transition-colors">
            Login
          </NavLink>
        </div>

        {/* Right: Copyright & Mission statement */}
        <div className="text-center md:text-right text-[#94A3B8] space-y-0.5">
          <p className="text-[11px]">Non-profit public interest surveillance platform</p>
          <p>&copy; {new Date().getFullYear()} CircularShield. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
