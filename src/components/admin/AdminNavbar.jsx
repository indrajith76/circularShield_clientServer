import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  ShieldAlert,
  ChevronDown,
  Settings,
  LogOut,
  History,
  Globe,
  ExternalLink,
} from 'lucide-react';
import BrandLogo from '../common/BrandLogo';
import { useAuth } from '../../context/AuthContext';

export const AdminNavbar = ({
  onOpenMobile,
  searchQuery,
  onSearchChange,
}) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const mockAdminNotifications = [
    {
      id: 1,
      title: 'Mass Phishing Campaign Flagged',
      detail: 'Over 85 reports regarding fake Postal Department admit cards.',
      time: '10m ago',
      unread: true,
      type: 'critical',
    },
    {
      id: 2,
      title: 'New Organization Verification Request',
      detail: 'Chaldal Limited submitted trade license and BASIS documents.',
      time: '45m ago',
      unread: true,
      type: 'info',
    },
    {
      id: 3,
      title: 'Syndicate Wallet Blacklisted',
      detail: 'bKash wallet 01799-XXXXXX added to national surveillance filter.',
      time: '2h ago',
      unread: false,
      type: 'success',
    },
  ];

  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="sticky top-0 z-30 h-18 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile Drawer Trigger & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          type="button"
          onClick={onOpenMobile}
          className="w-10 h-10 flex items-center justify-center rounded-xl text-[#102C3A] hover:bg-[#F1F5F8] lg:hidden transition-colors cursor-pointer shrink-0"
          aria-label="Open Admin Menu"
        >
          <Menu size={22} />
        </button>

        {/* Mobile brand indicator */}
        <div className="lg:hidden flex items-center gap-1.5">
          <BrandLogo size="sm" showTagline={false} />
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#DC4B4B] text-white">
            ADMIN
          </span>
        </div>

        {/* Admin Quick Search */}
        <div className="relative w-full max-w-md hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={searchQuery || ''}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search users, circular IDs, or fraud reports..."
            className="w-full bg-[#F8FAFC] text-[#102C3A] text-xs sm:text-sm pl-9 pr-4 py-2 rounded-xl border border-[#E2E8F0] focus:bg-white focus:border-[#087F70] focus:ring-2 focus:ring-[#087F70]/20 outline-none transition-all placeholder-[#94A3B8]"
          />
        </div>
      </div>

      {/* Right Controls: Telemetry, Alert Bell, Switch to App & Profile */}
      <div className="flex items-center gap-3">
        {/* System Health Status Pill (Desktop) */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F0FDF9] border border-[#A7F3D0] text-[11px] text-[#065C51]">
          <span className="w-2 h-2 rounded-full bg-[#16A36A]" />
          <span className="font-bold">Threat Shield: ACTIVE</span>
          <span className="text-[#94A3B8]">•</span>
          <span>Detection Latency: 42ms</span>
        </div>

        {/* Switch to User Portal Button */}
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#087F70] bg-[#087F70]/10 hover:bg-[#087F70]/20 transition-colors cursor-pointer"
        >
          <ExternalLink size={13} />
          <span>User Portal</span>
        </button>

        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            title="Admin Alerts"
            className="relative p-2 rounded-xl text-[#64748B] hover:text-[#102C3A] hover:bg-[#F1F5F8] transition-colors cursor-pointer"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#DC4B4B] border-2 border-white" />
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
                aria-hidden="true"
              />
              <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-sm sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F8]">
                  <div className="flex items-center gap-2">
                    <ShieldAlert size={16} className="text-[#DC4B4B]" />
                    <h4 className="font-bold text-xs sm:text-sm text-[#102C3A]">
                      Admin Threat Intelligence Feed
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DC4B4B]/10 text-[#DC4B4B]">
                    3 Active
                  </span>
                </div>

                <div className="divide-y divide-[#F1F5F8] max-h-72 overflow-y-auto py-2 space-y-2 text-xs">
                  {mockAdminNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="pt-2 pb-1 space-y-1 hover:bg-[#F8FAFC] p-2 rounded-xl cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#102C3A]">
                          {notif.title}
                        </span>
                        <span className="text-[10px] text-[#94A3B8]">
                          {notif.time}
                        </span>
                      </div>
                      <p className="text-[#64748B] leading-relaxed">
                        {notif.detail}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#F1F5F8] text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNotifications(false);
                      navigate('/admin/reports');
                    }}
                    className="text-xs font-bold text-[#087F70] hover:underline cursor-pointer"
                  >
                    View All Scam Reports Queue &rarr;
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Admin Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#F1F5F8] transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-[#102C3A] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              AD
            </div>
            <div className="hidden sm:block text-left text-xs">
              <span className="font-bold text-[#102C3A] block leading-tight">
                Super Administrator
              </span>
              <span className="text-[10px] text-[#087F70] font-medium block">
                Security Operations
              </span>
            </div>
            <ChevronDown size={14} className="text-[#94A3B8] hidden sm:block" />
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
                aria-hidden="true"
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-xs">
                <div className="p-2.5 border-b border-[#F1F5F8] space-y-0.5">
                  <p className="font-bold text-[#102C3A]">Super Administrator</p>
                  <p className="text-[11px] text-[#64748B] truncate">
                    admin@circularshield.security
                  </p>
                </div>

                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/admin/settings');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#475569] hover:bg-[#F8FAFC] hover:text-[#102C3A] transition-colors cursor-pointer"
                  >
                    <Settings size={15} />
                    <span>Admin Settings</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/admin/activity');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#475569] hover:bg-[#F8FAFC] hover:text-[#102C3A] transition-colors cursor-pointer"
                  >
                    <History size={15} />
                    <span>Admin Activity Log</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#087F70] hover:bg-[#F0FDF9] transition-colors cursor-pointer"
                  >
                    <Globe size={15} />
                    <span>Public Platform</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-[#F1F5F8]">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#DC4B4B] hover:bg-[#FEF2F2] transition-colors font-medium cursor-pointer"
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
