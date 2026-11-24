
import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthProvider";
import logo from "../assets/c_logo1.png";

export const Sidebar = ({
  isOpen,
  onClose,
  isAdmin = false,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, profile, logOut } = useAuth();

  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  const displayName =
    profile?.name || user?.displayName || "User";

  const email =
    profile?.email || user?.email || "";

  const dashboardPath = isAdmin
    ? "/admin/dashboard"
    : "/dashboard";

  // Normal User Navigation
  const userNavItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      label: "Analyze Circular",
      path: "/analyze",
    },
    {
      label: "Analysis History",
      path: "/history",
    },
    {
      label: "Organizations",
      path: "/organizations",
    },
    {
      label: "Report a Scam",
      path: "/report-scam",
    },
    {
      label: "Safety Tips",
      path: "/safety-tips",
    },
  ];

  // Admin Navigation
  const adminNavItems = [
    {
      label: "Admin Dashboard",
      path: "/admin/dashboard",
    },
    {
      label: "User Management",
      path: "/admin/users",
    },
    {
      label: "Scam Reports",
      path: "/admin/scam-reports",
    },
    {
      label: "Organizations",
      path: "/admin/organizations",
    },
    {
      label: "Safety Tips",
      path: "/admin/safety-tips",
    },
    {
      label: "Detection Stats",
      path: "/admin/detection-stats",
    },
  ];

  // Select navigation based on account role
  const navItems = isAdmin
    ? adminNavItems
    : userNavItems;

  // Active Navigation
  const isActive = (path) => {
    if (
      path === "/dashboard" &&
      (
        location.pathname === "/" ||
        location.pathname === "/dashboard"
      )
    ) {
      return true;
    }

    if (
      path === "/admin/dashboard" &&
      (
        location.pathname === "/admin" ||
        location.pathname === "/admin/dashboard"
      )
    ) {
      return true;
    }

    return location.pathname === path;
  };

  // Firebase Logout
  const handleLogout = async () => {
    setLoggingOut(true);
    setError("");

    try {
      await logOut();

      onClose?.();

      navigate("/login", {
        replace: true,
      });

    } catch (err) {
      console.error("Logout failed:", err);

      setError(
        "Unable to log out. Please try again."
      );

    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-[#0F172A] text-white flex flex-col justify-between z-50 transition-transform duration-200 ease-in-out lg:translate-x-0 border-r border-[#1E293B] ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        <div className="p-6 flex-1 overflow-y-auto">

          {/* Brand Logo */}
          <Link
            to={dashboardPath}
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

            {navItems.map((item) => {
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? "bg-[#1E293B] text-white shadow-xs font-semibold"
                      : "text-[#94A3B8] hover:text-white hover:bg-[#1E293B]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

          </nav>

        </div>

        {/* Bottom Profile and Logout */}
        <div className="p-6 border-t border-[#1E293B] space-y-3">

          {/* User Profile */}
          <div className="flex items-center gap-3">

            {/* Profile Avatar */}
            <div className="w-9 h-9 rounded-full bg-[#087F70] flex items-center justify-center text-sm font-bold shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>

            {/* Profile Information */}
            <div className="min-w-0 flex-1">

              <p className="text-sm font-semibold text-white truncate">
                {displayName}
              </p>

              <p className="text-[11px] text-[#94A3B8] truncate">
                {email}
              </p>

            </div>

          </div>

          {/* Logout Error */}
          {error && (
            <p
              role="alert"
              className="text-xs text-red-400"
            >
              {error}
            </p>
          )}

          {/* Logout and Role */}
          <div className="flex items-center justify-between text-xs text-[#94A3B8]">

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            >
              {loggingOut
                ? "Logging out..."
                : "Logout"}
            </button>

            <span className="text-[10px] text-[#64748B] uppercase tracking-wider">
              {isAdmin ? "Admin" : "User"}
            </span>

          </div>

        </div>

      </aside>
    </>
  );
};

export default Sidebar;
