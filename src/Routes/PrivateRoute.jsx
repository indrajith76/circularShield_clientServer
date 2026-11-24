
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthProvider";


const PrivateRoute = () => {

  const {
    user,
    profile,
    loading,
    profileError,
  } = useAuth();


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

      <div className="min-h-screen flex flex-col items-center justify-center gap-4">

        <p>
          {profileError || "User profile is unavailable."}
        </p>

        <NavigateToLogin />

      </div>
    );
  }


  return <Outlet />;
};


const NavigateToLogin = () => {

  const { logOut } = useAuth();

  const handleLogout = async () => {

    try {
      await logOut();
    } catch {
      alert("Unable to log out. Please try again.");
    }
  };

  return (

    <button
      className="btn btn-primary"
      onClick={handleLogout}
    >
      Return to Login
    </button>

  );
};


export default PrivateRoute;
