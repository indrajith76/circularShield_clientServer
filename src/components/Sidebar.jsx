import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/c_logo1.png';

export const Sidebar = ({ isOpen, onClose, isAdmin = false, onToggleRole }) => {
  const location = useLocation();

  const userNavItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Analyze Circular', path: '/analyze' },
    { label: 'Analysis History', path: '/history' },
    { label: 'Organizations', path: '/organizations' },
    { label: 'Report a Scam', path: '/report-scam' },
    { label: 'Safety Tips', path: '/safety-tips' },
  ];

  const adminNavItems = [
    { label: 'Admin Dashboard', path: '/admin' },
    { label: 'User Management', path: '/admin' },
    { label: 'Scam Reports', path: '/admin' },
    { label: 'Organizations', path: '/admin' },
    { label: 'Safety Tips', path: '/admin' },
    { label: 'Detection Stats', path: '/admin' },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  const isActive = (path) => {
    if (path === '/dashboard' && (location.pathname === '/' || location.pathname === '/dashboard')) {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-[#0F172A] text-white flex flex-col justify-between z-50 transition-transform duration-200 ease-in-out lg:translate-x-0 border-r border-[#1E293B] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Brand Logo */}
          <Link
            to="/dashboard"
            className="flex items-center mb-8"
            onClick={onClose}
          >
            <img
              src={logo}
              alt="CircularShield"
              className="h-16 w-auto max-w-[200px] object-contain drop-shadow-md shrink-0"
            />
          </Link>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {navItems.map((item, index) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={`${item.label}-${index}`}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? 'bg-[#1E293B] text-white shadow-xs font-semibold'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile / Portal Toggle & Logout */}
        <div className="p-6 border-t border-[#1E293B] space-y-3">
          {onToggleRole && (
            <button
              type="button"
              onClick={onToggleRole}
              className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-[#A7F3D0] bg-[#1E293B] hover:bg-[#334155] transition-colors"
            >
              Switch to {isAdmin ? 'User Portal' : 'Admin Portal'}
            </button>
          )}

          <div className="flex items-center justify-between text-xs text-[#94A3B8]">
            <Link to="/login" className="hover:text-white transition-colors">
              Profile · Logout
            </Link>
            <span className="text-[10px] text-[#64748B] uppercase tracking-wider">
              {isAdmin ? 'Admin' : 'User'}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

