import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, LogIn, User } from 'lucide-react';
import BrandLogo from '../common/BrandLogo';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useAuthModal } from '../../context/AuthModalContext';

export const LandingNavbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { openAuthModal } = useAuthModal();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Organizations', href: '/organizations', isRoute: true },
    { label: 'Safety Tips', href: '/safety-tips', isRoute: true },
  ];

  const handleLinkClick = (link) => {
    setMobileMenuOpen(false);
    if (link.isRoute) {
      navigate(link.href);
    } else {
      const element = document.querySelector(link.href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handlePlatformHubClick = () => {
    if (isAdmin) {
      navigate('/admin/dashboard');
    } else if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      openAuthModal({
        destination: '/dashboard',
        featureTitle: 'User Dashboard',
        reason: 'Viewing your dashboard, saved job checks, and scam reports requires signing in to your free account.',
      });
    }
  };

  const handleAnalyzeClick = () => {
    if (isAuthenticated) {
      navigate('/analyze');
    } else {
      openAuthModal({
        destination: '/analyze',
        featureTitle: 'Check Job Circular',
        reason: 'Checking job notices for payment scams, fake company websites, and recruiter fraud requires signing in.',
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-[#E2E8F0]'
          : 'bg-white border-b border-[#F1F5F8]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <BrandLogo size="md" showTagline={true} href="/" />

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#475569]">
          {navLinks.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => handleLinkClick(link)}
              className="hover:text-[#087F70] transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
          <button
            type="button"
            onClick={handlePlatformHubClick}
            className="hover:text-[#087F70] transition-colors flex items-center gap-1.5 cursor-pointer font-medium text-sm text-[#475569]"
          >
            <span>{isAdmin ? 'Admin Console' : 'Dashboard'}</span>
            <span className="text-[10px] bg-[#ECFDF5] text-[#16A36A] px-2 py-0.5 rounded-full font-bold border border-[#A7F3D0]">
              Live
            </span>
          </button>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {isAuthenticated && user ? (
            <Link to={isAdmin ? '/admin/dashboard' : '/profile'}>
              <Button
                variant="outline"
                size="sm"
                leftIcon={User}
                className="text-xs h-9.5 px-3.5 font-semibold text-[#182B36]"
              >
                {user.name.split(' ')[0]}
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={LogIn}
                className="text-xs h-9.5 px-3.5 font-semibold text-[#182B36]"
              >
                Login
              </Button>
            </Link>
          )}

          <Button
            variant="secondary"
            size="sm"
            rightIcon={ArrowRight}
            onClick={handleAnalyzeClick}
            className="text-xs h-9.5 px-4 font-semibold shadow-xs"
          >
            Check Job Circular
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-10 h-10 flex items-center justify-center rounded-xl text-[#182B36] hover:bg-[#F1F5F8] lg:hidden cursor-pointer shrink-0"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E2E8F0] px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => handleLinkClick(link)}
                className="text-left py-2 px-3 text-sm font-medium text-[#182B36] hover:bg-[#F1F5F8] rounded-lg transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                handlePlatformHubClick();
              }}
              className="flex items-center justify-between w-full py-2 px-3 text-sm font-semibold text-[#087F70] hover:bg-[#F1F5F8] rounded-lg transition-colors cursor-pointer text-left"
            >
              <span>{isAdmin ? 'Admin Console' : 'Platform Dashboard'}</span>
              <span className="text-[10px] bg-[#ECFDF5] text-[#16A36A] px-2 py-0.5 rounded-full font-bold">
                Live
              </span>
            </button>
          </nav>

          <div className="pt-3 border-t border-[#E2E8F0] flex flex-col gap-2">
            {isAuthenticated && user ? (
              <Link
                to={isAdmin ? '/admin/dashboard' : '/profile'}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button variant="outline" size="sm" className="w-full text-xs font-semibold">
                  Signed in as {user.name}
                </Button>
              </Link>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full text-xs font-semibold">
                  Sign In to User Portal
                </Button>
              </Link>
            )}

            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setMobileMenuOpen(false);
                handleAnalyzeClick();
              }}
              className="w-full text-xs font-semibold"
            >
              Check Job Circular
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingNavbar;
