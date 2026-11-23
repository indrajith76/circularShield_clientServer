import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingScreen from '../ui/LoadingScreen';

/**
 * AdminRoute: Restricts access strictly to authenticated operators with the ADMIN role
 */
export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, isUser, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen message="Authenticating SecOps clearance..." />;
  }

  // If unauthenticated, redirect to dedicated Admin Login portal
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If a normal USER attempts to open an admin route: block access, never reveal admin data
  if (isUser) {
    return (
      <Navigate
        to="/unauthorized"
        state={{
          reason: 'Access Restricted: Administrative clearance required. Candidate and employer accounts are not permitted in the SecOps Administrative Console.',
        }}
        replace
      />
    );
  }

  // If ADMIN verified
  if (isAdmin) {
    return children ? children : <Outlet />;
  }

  return <Navigate to="/admin/login" state={{ from: location }} replace />;
};

export default AdminRoute;
