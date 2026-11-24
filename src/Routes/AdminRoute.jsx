
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const AdminRoute = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-[#087F70]"></span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!profile) {
    return (
      <div className="p-8 text-center text-red-600">
        User profile not found. Please log in again.
      </div>
    );
  }

  if (profile.role === "user") {
    return <Navigate to="/dashboard" replace />;
  }

  if (profile.role !== "admin") {
    return (
      <div className="p-8 text-center text-red-600">
        Administrator access required.
      </div>
    );
  }

  return <Outlet />;
};

export default AdminRoute;
