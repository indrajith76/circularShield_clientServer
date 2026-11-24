
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import logo from "../assets/c_logo1.png";

export const Navbar = ({
  onOpenSidebar,
  title = "CircularShield",
  isAdmin = false,
}) => {
  const { user, profile } = useAuth();

  const displayName =
    profile?.name || user?.displayName || "User";

  const dashboardPath = isAdmin
    ? "/admin/dashboard"
    : "/dashboard";

  return (
    <header className="sticky top-0 z-30 bg-[#F4F7FA]/90 backdrop-blur-md border-b border-[#E2E8F0] px-4 sm:px-8 py-3.5 flex items-center justify-between">

      <div className="flex items-center gap-3">

        {/* Mobile Hamburger Menu */}
        <button
          type="button"
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-lg text-[#0F172A] hover:bg-[#E2E8F0] transition-colors"
          aria-label="Open Sidebar"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Brand Logo */}
        <Link
          to={dashboardPath}
          className="flex items-center gap-2.5"
        >
          <img
            src={logo}
            alt="CircularShield"
            className="h-11 sm:h-12 w-auto max-w-[150px] object-contain shrink-0"
          />

          <h2 className="text-sm font-semibold text-[#0F172A] hidden sm:block">
            {title}
          </h2>
        </Link>

      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">

        {/* Quick Analyze - Normal Users Only */}
        {user && !isAdmin && (
          <Link
            to="/analyze"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#087F70] text-white text-xs font-semibold hover:bg-[#066559] transition-colors shadow-xs"
          >
            Quick Analyze
          </Link>
        )}

        {/* Logged-in User Information */}
        {user ? (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#CBD5E1] text-[#0F172A] shadow-xs">

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-[#087F70] text-white flex items-center justify-center text-xs font-bold shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>

            {/* Name and Role */}
            <div className="hidden sm:block">

              <p className="text-xs font-semibold max-w-[150px] truncate">
                {displayName}
              </p>

              <p className="text-[10px] text-[#64748B]">
                {isAdmin ? "Administrator" : "User"}
              </p>

            </div>

          </div>
        ) : (
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#CBD5E1] text-[#0F172A] text-xs font-semibold hover:bg-[#F8FAFC] transition-colors shadow-xs"
          >
            Sign In
          </Link>
        )}

      </div>

    </header>
  );
};

export default Navbar;
