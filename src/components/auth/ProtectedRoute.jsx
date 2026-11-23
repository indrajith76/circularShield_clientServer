import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingScreen from '../ui/LoadingScreen';

/**
 * ProtectedRoute: Restricts access strictly to authenticated normal users (role: 'USER')
 */
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isUser, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen message="Verifying user session..." />;
  }

  // If not authenticated, redirect to /login and save current requested location
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated as ADMIN, prevent accessing user portal routes directly or route to admin dashboard
  if (isAdmin) {
    return (
      <Navigate
        to="/unauthorized"
        state={{
          reason: 'You are signed in with an Administrator session. To access candidate/employer portal features, please sign in with a standard user account.',
        }}
        replace
      />
    );
  }

  // If user role is verified
  if (isUser) {
    return children ? children : <Outlet />;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;
