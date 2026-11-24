
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthProvider";


const AdminRoute = () => {

  const { user, role, loading } = useAuth();


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


  if (role !== "admin") {

    return <Navigate to="/dashboard" replace />;

  }


  return <Outlet />;
};


export default AdminRoute;
