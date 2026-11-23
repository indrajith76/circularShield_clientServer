import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingScreen from '../ui/LoadingScreen';

/**
 * PublicRoute restricts pages like /login, /register, and /forgot-password
 * from being accessed by users who are already logged in.
 *
 * If authenticated:
 * - ADMIN -> redirected to /admin/dashboard
 * - USER  -> redirected to /dashboard
 * If not authenticated:
 * - renders children normally
 */
export default function PublicRoute({ children }) {
  const { user, isLoading, isAdmin, isUser } = useAuth();

  if (isLoading) {
    return <LoadingScreen message="Checking session credentials..." />;
  }

  if (user) {
    if (isAdmin) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (isUser) {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
