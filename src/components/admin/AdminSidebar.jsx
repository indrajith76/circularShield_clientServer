import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  AlertOctagon,
  ShieldCheck,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Globe,
} from 'lucide-react';
import BrandLogo from '../common/BrandLogo';
import { useAuth } from '../../context/AuthContext';

export const AdminSidebar = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const adminNavItems = [
    {
      to: '/admin/dashboard',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null,
      exact: true,
    },
    {
      to: '/admin/users',
      label: 'Users',
      icon: Users,
      badge: null,
    },
    {
      to: '/admin/organizations',
      label: 'Organizations',
      icon: Building2,
      badge: null,
    },
    {
      to: '/admin/reports',
      label: 'Scam Reports',
      icon: AlertOctagon,
      badge: null,
    },
    {
      to: '/admin/verification',
      label: 'Verification',
      icon: ShieldCheck,
      badge: null,
    },
    {
      to: '/admin/safety-tips',
      label: 'Safety Content',
      icon: BookOpen,
      badge: null,
    },
    {
      to: '/admin/statistics',
      label: 'Statistics',
      icon: BarChart3,
      badge: null,
    },
    {
      to: '/admin/settings',
      label: 'Settings',
      icon: Settings,
      badge: null,
    },
  ];

  const handleAdminLogout = () => {
    onCloseMobile?.();
    logout();
    navigate('/admin/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-[#0A1922]/70 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Admin Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#0D1F2D] text-white border-r border-[#1B3245] shadow-2xl transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:w-20' : 'lg:w-72'
        } ${
          isMobileOpen
            ? 'translate-x-0 w-72'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header: Logo & Collapse Button */}
        <div className="h-18 px-4 flex items-center justify-between border-b border-[#1B3245] shrink-0">
          <div className="flex items-center gap-2.5 overflow-hidden">
            {!isCollapsed ? (
              <div className="flex items-center gap-2">
                <BrandLogo size="md" variant="white" showTagline={false} href="/admin/dashboard" />
                <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-md bg-[#DC4B4B] text-white">
                  Admin
                </span>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-[#087F70] flex items-center justify-center font-black text-white text-base shadow-sm mx-auto">
                CS
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Expand Admin Sidebar' : 'Collapse Sidebar'}
            className="hidden lg:flex p-1.5 rounded-xl text-[#94A3B8] hover:text-white hover:bg-[#1B3245] transition-colors cursor-pointer"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-[#94A3B8] hover:text-white hover:bg-[#1B3245] lg:hidden transition-colors cursor-pointer"
            aria-label="Close admin menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Admin Console Pill Indicator */}
        {!isCollapsed && (
          <div className="px-4 py-2.5 bg-[#09151F] border-b border-[#1B3245] flex items-center justify-between text-[11px] text-[#94A3B8]">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#16A36A] animate-pulse" />
              SecOps Threat Engine Active
            </span>
            <span className="text-[#087F70] font-mono font-bold">v2.6-SEC</span>
          </div>
        )}

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-[#1B3245]">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                onClick={onCloseMobile}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-[#087F70] text-white shadow-md font-semibold'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#1B3245]/70'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`
                }
              >
                <Icon
                  size={20}
                  className="shrink-0 transition-transform group-hover:scale-105"
                />

                {!isCollapsed && (
                  <div className="flex items-center justify-between flex-1 truncate">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-2 ${
                          item.badgeVariant === 'danger'
                            ? 'bg-[#DC4B4B] text-white'
                            : item.badgeVariant === 'warning'
                            ? 'bg-[#D99A28] text-[#102C3A]'
                            : 'bg-[#1B3245] text-[#CBD5E1]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Section: Portal Switcher & Logout */}
        <div className="p-3 border-t border-[#1B3245] bg-[#09151F] space-y-2 shrink-0">
          {/* Public Portal Shortcut */}
          <button
            type="button"
            onClick={() => {
              onCloseMobile?.();
              navigate('/');
            }}
            title={isCollapsed ? 'View Public Platform' : undefined}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-[#112435] hover:bg-[#1B3245] hover:text-white transition-colors cursor-pointer ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
          >
            <Globe size={16} className="shrink-0 text-[#00E5C9]" />
            {!isCollapsed && <span className="truncate">Public Platform</span>}
          </button>

          {/* Admin Operator Profile & Logout */}
          <div
            className={`flex items-center justify-between gap-2 p-2 rounded-xl bg-[#112435] ${
              isCollapsed ? 'flex-col' : ''
            }`}
          >
            {!isCollapsed ? (
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#DC4B4B] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  ADM
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">
                    {user?.name || 'SecOps Admin'}
                  </p>
                  <p className="text-[10px] text-[#94A3B8] truncate">
                    Superuser Access
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-[#DC4B4B] text-white flex items-center justify-center font-bold text-xs shrink-0">
                A
              </div>
            )}

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleAdminLogout}
              title="Sign Out of Admin Console"
              className="p-1.5 rounded-lg text-[#DC4B4B] hover:text-white hover:bg-[#DC4B4B] transition-colors cursor-pointer"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
