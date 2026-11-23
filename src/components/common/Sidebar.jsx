import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  SearchCode,
  Building2,
  AlertOctagon,
  History,
  ShieldCheck,
  User,
  LogOut,
  X,
  ShieldAlert,
  LogIn,
  Globe,
  Lock,
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import { useAuth } from '../../context/AuthContext';
import { useAuthModal } from '../../context/AuthModalContext';

export const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { openAuthModal } = useAuthModal();

  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      isPublic: false,
    },
    {
      to: '/analyze',
      label: 'Check Job Circular',
      icon: SearchCode,
      badge: null,
      isPublic: false,
    },
    {
      to: '/organizations',
      label: 'Organizations',
      icon: Building2,
      badge: null,
      isPublic: true,
    },
    {
      to: '/report-scam',
      label: 'Report a Scam',
      icon: AlertOctagon,
      badge: null,
      isPublic: false,
    },
    {
      to: '/my-activity',
      label: 'My Activity',
      icon: History,
      badge: null,
      isPublic: false,
    },
    {
      to: '/safety-tips',
      label: 'Safety Guide',
      icon: ShieldCheck,
      badge: null,
      isPublic: true,
    },
    {
      to: '/profile',
      label: 'Profile & Settings',
      icon: User,
      badge: null,
      isPublic: false,
    },
  ];

  const handleLogout = () => {
    onCloseMobile?.();
    logout();
    navigate('/');
  };

  const handleItemClick = (e, item) => {
    onCloseMobile?.();
    if (!isAuthenticated && !item.isPublic) {
      e.preventDefault();
      openAuthModal({
        destination: item.to,
        featureTitle: item.label,
        reason: `Access to ${item.label} requires an authenticated CircularShield account to maintain data integrity and security audit logs.`,
      });
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-[#102C3A]/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#102C3A] text-white flex flex-col border-r border-[#1D4355] transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Unified Brand Logo & Mobile Close Button */}
        <div className="h-20 px-5 flex items-center justify-between border-b border-[#1D4355]/80 shrink-0">
          <div onClick={onCloseMobile}>
            <BrandLogo
              variant="white"
              size="md"
              showTagline={true}
              href={isAuthenticated ? '/dashboard' : '/'}
            />
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white rounded-xl lg:hidden hover:bg-[#1D4355] transition-colors cursor-pointer"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Live System Status / Guest Mode Indicator */}
        <div className="px-5 py-3 bg-[#0A1C25]/60 border-b border-[#1D4355]/60">
          {isAuthenticated ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex rounded-full h-2 w-2 bg-[#16A36A]" />
                <span className="text-xs font-medium text-slate-300">
                  Threat Radar: Active
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#102C3A] border border-[#1D4355] text-[#00E5C9]">
                Live v2.6
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex rounded-full h-2 w-2 bg-[#D99A28] animate-pulse" />
                <span className="text-xs font-medium text-amber-200">
                  Public Guest Mode
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  openAuthModal({
                    destination: '/dashboard',
                    featureTitle: 'Citizen Platform Hub',
                  })
                }
                className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-[#087F70] text-white hover:bg-[#06675B] transition-colors cursor-pointer"
              >
                Sign In
              </button>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="flex items-center justify-between px-3 mb-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Platform Navigation
            </p>
            {!isAuthenticated && (
              <span className="text-[10px] text-slate-400 font-mono">
                Guest View
              </span>
            )}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isLocked = !isAuthenticated && !item.isPublic;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={(e) => handleItemClick(e, item)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#087F70] text-white shadow-xs font-semibold'
                      : isLocked
                      ? 'text-slate-400 hover:text-white hover:bg-[#1D4355]/40'
                      : 'text-slate-300 hover:text-white hover:bg-[#1D4355]/60'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className="shrink-0" />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {isLocked && (
                    <span title="Authentication Required">
                      <Lock size={12} className="text-slate-400" />
                    </span>
                  )}

                  {item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        item.badgeVariant === 'suspicious'
                          ? 'bg-[#DC4B4B]/20 text-[#DC4B4B] border border-[#DC4B4B]/30'
                          : item.badgeVariant === 'warning'
                          ? 'bg-[#D99A28]/20 text-[#D99A28] border border-[#D99A28]/30'
                          : 'bg-[#0A1C25] text-[#00E5C9] border border-[#1D4355]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              </NavLink>
            );
          })}

          {/* Public Landing Shortcut */}
          <div className="pt-4 mt-2 border-t border-[#1D4355]/60 space-y-1">
            <NavLink
              to="/"
              onClick={onCloseMobile}
              className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-[#1D4355]/60 transition-colors"
            >
              <Globe size={16} />
              <span>Public Landing Page</span>
            </NavLink>
          </div>
        </div>

        {/* Anti-Fraud Hotline & Emergency Card */}
        <div className="p-4 m-3 rounded-2xl bg-[#0A1C25]/80 border border-[#1D4355] space-y-2">
          <div className="flex items-center gap-2 text-[#D99A28]">
            <ShieldAlert size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">
              Scam Helpline
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Victim of money solicitation in job recruitment? Report to Cyber Police or call hotline.
          </p>
          <div className="pt-1 flex items-center justify-between">
            <span className="text-xs font-bold text-white bg-[#102C3A] px-2.5 py-1 rounded-lg border border-[#1D4355]">
              Dial: 999 / 01730336107
            </span>
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-[#1D4355] flex items-center justify-between shrink-0 bg-[#0A1C25]/40">
          {isAuthenticated && user ? (
            <div className="flex items-center justify-between w-full">
              <NavLink
                to="/profile"
                onClick={onCloseMobile}
                className="flex items-center gap-3 group hover:opacity-95 flex-1 min-w-0"
              >
                <div className="w-9 h-9 rounded-xl bg-[#087F70] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0 overflow-hidden">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    user.name?.charAt(0) || 'U'
                  )}
                </div>
                <div className="text-left min-w-0 flex-1">
                  <p className="text-xs font-semibold text-white leading-tight truncate group-hover:text-[#00E5C9] transition-colors">
                    {user.name}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {user.role}
                  </p>
                </div>
              </NavLink>

              <button
                type="button"
                onClick={handleLogout}
                title="Sign Out"
                className="p-1.5 text-slate-400 hover:text-[#DC4B4B] rounded-lg hover:bg-[#1D4355] transition-colors ml-2 cursor-pointer"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <button
                type="button"
                onClick={() =>
                  openAuthModal({
                    destination: '/dashboard',
                    featureTitle: 'Citizen Identity Verification Gateway',
                  })
                }
                className="flex items-center gap-3 group hover:opacity-95 text-left w-full cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-[#087F70] text-white flex items-center justify-center font-bold text-sm shadow-xs group-hover:scale-105 transition-transform">
                  <LogIn size={16} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-white leading-tight group-hover:text-[#00E5C9] transition-colors">
                    Sign In to Portal
                  </p>
                  <p className="text-[11px] text-slate-400">Unlock Full Threat Radar</p>
                </div>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
