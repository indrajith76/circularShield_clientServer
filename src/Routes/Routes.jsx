import { createBrowserRouter, Navigate } from 'react-router-dom';
import Main from '../Layout/Main';
import Dashboard from '../pages/Dashboard';
import AnalyzeCircular from '../pages/AnalyzeCircular';
import AnalysisResult from '../pages/AnalysisResult';
import Organizations from '../pages/Organizations';
import ReportScam from '../pages/ReportScam';
import AnalysisHistory from '../pages/AnalysisHistory';
import SafetyTips from '../pages/SafetyTips';
import AdminDashboard from '../pages/AdminDashboard';
import Login from '../pages/Login';
import Register from '../pages/Register';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/analyze',
        element: <AnalyzeCircular />,
      },
      {
        path: '/analysis-result',
        element: <AnalysisResult />,
      },
      {
        path: '/organizations',
        element: <Organizations />,
      },
      {
        path: '/report-scam',
        element: <ReportScam />,
      },
      {
        path: '/history',
        element: <AnalysisHistory />,
      },
      {
        path: '/safety-tips',
        element: <SafetyTips />,
      },
      {
        path: '/admin',
        element: <AdminDashboard />,
      },
      {
        path: '/admin/dashboard',
        element: <AdminDashboard />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);

export default router;
