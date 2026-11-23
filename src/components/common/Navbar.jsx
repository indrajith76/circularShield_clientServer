import { useState } from 'react';
import { useNavigate, NavLink, Link } from 'react-router-dom';
import {
  Menu,
  Search,
  SearchCode,
  Bell,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  X,
  LogIn,
  User,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import BrandLogo from './BrandLogo';
import { useAuth } from '../../context/AuthContext';

export const Navbar = ({ onOpenMobile, searchQuery = '', onSearchChange }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const mockNotifications = [
    {
      id: 1,
      title: 'High-Risk Alert Flagged',
      text: 'New Railway Ministry fake admit card syndicate detected.',
      time: '12m ago',
      type: 'critical',
    },
    {
      id: 2,
      title: 'Verification Complete',
      text: 'BrainStation 23 recruitment batch verified as legitimate.',
      time: '1h ago',
      type: 'verified',
    },
    {
      id: 3,
      title: 'Whistleblower Report Updated',
      text: 'Telegram data-entry deposit scheme marked as Confirmed Scam.',
      time: '3h ago',
      type: 'alert',
    },
  ];

  const handleLogout = () => {
    setShowUserDropdown(false);
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          type="button"
          onClick={onOpenMobile}
          className="w-10 h-10 flex items-center justify-center rounded-xl text-[#182B36] hover:bg-[#F1F5F8] lg:hidden transition-colors cursor-pointer shrink-0"
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>

        {/* Brand Logo visible on mobile/tablet when sidebar is collapsed */}
        <div className="lg:hidden flex items-center">
          <BrandLogo size="sm" showTagline={false} />
        </div>

        {/* Global Quick Search */}
        <div className="relative w-full max-w-md hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search circulars, companies, or safety tips..."
            className="w-full bg-[#F8FAFC] text-[#182B36] text-xs sm:text-sm pl-9 pr-4 py-2 rounded-xl border border-[#E2E8F0] focus:bg-white focus:border-[#087F70] focus:ring-2 focus:ring-[#087F70]/20 outline-none transition-all placeholder-[#94A3B8]"
          />
        </div>
      </div>

      {/* Right: Quick Action, Alerts, Status & User Auth */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Quick Action: Scan Circular */}
        <Button
          variant="secondary"
          size="sm"
          leftIcon={SearchCode}
          onClick={() => navigate('/analyze')}
          className="hidden sm:inline-flex shadow-xs"
        >
          Check Job Circular
        </Button>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserDropdown(false);
            }}
            className="p-2 rounded-xl text-[#64748B] hover:text-[#182B36] hover:bg-[#F1F5F8] transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#DC4B4B] ring-2 ring-white"></span>
          </button>

          {/* Notifications Dropdown Popover */}
          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
                aria-hidden="true"
              />
              <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-sm sm:w-96 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-4 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F8]">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#182B36]">
                      Security Bulletins
                    </h4>
                    <Badge variant="suspicious" size="sm">
                      3 New
                    </Badge>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 text-[#94A3B8] hover:text-[#182B36] rounded-lg"
                    aria-label="Close notifications"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="divide-y divide-[#F1F5F8] max-h-72 overflow-y-auto">
                  {mockNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="py-3 px-1 hover:bg-[#F8FAFC] rounded-xl transition-colors text-left"
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 shrink-0">
                          {notif.type === 'critical' ? (
                            <ShieldAlert size={16} className="text-[#DC4B4B]" />
                          ) : notif.type === 'verified' ? (
                            <ShieldCheck size={16} className="text-[#16A36A]" />
                          ) : (
                            <AlertTriangle size={16} className="text-[#D99A28]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-semibold text-[#182B36] truncate">
                              {notif.title}
                            </p>
                            <span className="text-[10px] text-[#94A3B8] shrink-0">
                              {notif.time}
                            </span>
                          </div>
                          <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed line-clamp-2">
                            {notif.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#F1F5F8] text-center">
                  <NavLink
                    to="/alerts"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs font-semibold text-[#087F70] hover:underline"
                  >
                    View All Scam Alerts & Tactics &rarr;
                  </NavLink>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Auth Display / Profile Dropdown */}
        {isAuthenticated && user ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowUserDropdown(!showUserDropdown);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
            >
              <div className="text-left hidden md:block">
                <p className="text-xs font-bold text-[#182B36] group-hover:text-[#087F70] transition-colors line-clamp-1">
                  {user.name}
                </p>
                <p className="text-[10px] text-[#64748B] capitalize">
                  {user.role?.split('/')[0]?.trim() || 'Verified Member'}
                </p>
              </div>

              <div className="w-8 h-8 rounded-lg bg-[#087F70] text-white flex items-center justify-center font-bold text-xs ring-2 ring-emerald-500/20 overflow-hidden shrink-0">
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
              <ChevronDown size={14} className="text-[#94A3B8] hidden sm:block" />
            </button>

            {/* User Dropdown Menu */}
            {showUserDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserDropdown(false)}
                  aria-hidden="true"
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="p-2 border-b border-[#F1F5F8] mb-2">
                  <p className="text-xs font-bold text-[#182B36] truncate">{user.name}</p>
                  <p className="text-[11px] text-[#64748B] truncate">{user.email}</p>
                  <div className="mt-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#16A36A] border border-[#A7F3D0]">
                      {user.role}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <Link
                    to="/profile"
                    onClick={() => setShowUserDropdown(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#182B36] hover:bg-[#F8FAFC] hover:text-[#087F70] transition-colors"
                  >
                    <User size={15} />
                    <span>My Account & Settings</span>
                  </Link>

                  <Link
                    to="/dashboard"
                    onClick={() => setShowUserDropdown(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#182B36] hover:bg-[#F8FAFC] hover:text-[#087F70] transition-colors"
                  >
                    <ShieldCheck size={15} />
                    <span>Threat Dashboard</span>
                  </Link>
                </div>

                <div className="pt-2 mt-2 border-t border-[#F1F5F8]">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#DC4B4B] hover:bg-[#FEF2F2] transition-colors cursor-pointer"
                  >
                    <LogOut size={15} />
                    <span>Sign Out of Account</span>
                  </button>
                </div>
              </div>
            </>
          )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button
                variant="outline"
                size="sm"
                leftIcon={LogIn}
                className="text-xs h-9 px-3"
              >
                Sign In
              </Button>
            </Link>
            <Link to="/register" className="hidden sm:inline-block">
              <Button
                variant="primary"
                size="sm"
                className="text-xs h-9 px-3 font-semibold"
              >
                Create Account
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
