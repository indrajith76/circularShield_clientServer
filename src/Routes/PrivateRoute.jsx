
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const PrivateRoute = () => {
  const { user, profile, loading, logOut } = useAuth();

  const location = useLocation();

  // Authentication loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F7FA]">
        <span className="loading loading-spinner loading-lg text-[#087F70]" />
      </div>
    );
  }

  // User is not logged in
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // MongoDB profile is missing
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl border text-center space-y-4">
          <h2 className="text-xl font-bold text-red-600">
            Profile Unavailable
          </h2>

          <p className="text-sm text-[#64748B]">
            Unable to retrieve your account profile.
            Please log in again.
          </p>

          <button
            onClick={logOut}
            className="px-5 py-2 rounded-xl bg-[#087F70] text-white"
          >
            Log Out
          </button>
        </div>
      </div>
    );
  }

  // Suspended account
  if (profile.status === "suspended") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl border text-center space-y-4">
          <h2 className="text-xl font-bold text-red-600">
            Account Suspended
          </h2>

          <p className="text-sm text-[#64748B]">
            Your account has been suspended.
            Please contact the administrator.
          </p>

          <button
            onClick={logOut}
            className="px-5 py-2 rounded-xl bg-[#087F70] text-white"
          >
            Log Out
          </button>
        </div>
      </div>
    );
  }

  // Allow authenticated users
  return <Outlet />;
};

export default PrivateRoute;
