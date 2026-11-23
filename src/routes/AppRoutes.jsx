import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { AuthModalProvider } from '../context/AuthModalContext';
import { MockDataProvider } from '../context/MockDataContext.jsx';
import useCirculars from '../hooks/useCirculars';

// Layouts
import DashboardLayout from '../layouts/DashboardLayout';
import AdminLayout from '../layouts/AdminLayout';

// Route Guards
import ProtectedRoute from '../components/auth/ProtectedRoute';
import AdminRoute from '../components/auth/AdminRoute';
import PublicRoute from '../components/auth/PublicRoute';

// Public & Error Pages
import LandingPage from '../pages/LandingPage';
import Unauthorized from '../pages/auth/Unauthorized';
import SessionExpired from '../pages/auth/SessionExpired';
import NotFound from '../pages/NotFound';

// Authentication Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import AdminLogin from '../pages/admin/AdminLogin';

// User Portal Pages
import Dashboard from '../pages/Dashboard';
import CircularScanner from '../pages/CircularScanner';
import OrganizationVerification from '../pages/OrganizationVerification';
import ReportScam from '../pages/ReportScam';
import MyActivity from '../pages/MyActivity';
import ScamAlerts from '../pages/ScamAlerts';
import AnalysisResult from '../pages/AnalysisResult';
import Analysis from '../pages/Analysis';
import UserProfile from '../pages/auth/UserProfile';

// Admin Portal Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUserManagement from '../pages/admin/AdminUserManagement';
import AdminOrganizationManagement from '../pages/admin/AdminOrganizationManagement';
import AdminReportManagement from '../pages/admin/AdminReportManagement';
import AdminSafetyTipsManagement from '../pages/admin/AdminSafetyTipsManagement';
import AdminDetectionStats from '../pages/admin/AdminDetectionStats';
import AdminVerificationQueue from '../pages/admin/AdminVerificationQueue';
import AdminSettings from '../pages/admin/AdminSettings';
import AdminActivityLog from '../pages/admin/AdminActivityLog';

const AppRoutesContent = () => {
  const {
    circulars,
    scamReports,
    searchQuery,
    setSearchQuery,
    addScannedCircular,
    submitScamReport,
  } = useCirculars();

  return (
    <AuthProvider>
      <BrowserRouter>
        <AuthModalProvider>
          <Routes>
            {/* ========================================================= */}
            {/* 1. PUBLIC ROUTES (Accessible without authentication)       */}
            {/* ========================================================= */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/features" element={<LandingPage />} />
            <Route path="/how-it-works" element={<LandingPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/session-expired" element={<SessionExpired />} />

            {/* Public Auth Suite: If already logged in, redirected to dashboard */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              }
            />
            <Route
              path="/reset-password"
              element={
                <PublicRoute>
                  <ResetPassword />
                </PublicRoute>
              }
            />

            {/* Dedicated Admin Login Gateway (No public registration) */}
            <Route
              path="/admin/login"
              element={
                <PublicRoute>
                  <AdminLogin />
                </PublicRoute>
              }
            />

            {/* Publicly Accessible Information Pages (with full UI navigation) */}
            <Route
              element={
                <DashboardLayout
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
              }
            >
              <Route path="/organizations" element={<OrganizationVerification />} />
              <Route path="/organizations/:id" element={<OrganizationVerification />} />
              <Route path="/verify-org" element={<OrganizationVerification />} />
              <Route path="/verify-org/:id" element={<OrganizationVerification />} />
              <Route path="/safety-tips" element={<ScamAlerts />} />
              <Route path="/safety-tips/:articleId" element={<ScamAlerts />} />
              <Route path="/safety-guide" element={<ScamAlerts />} />
              <Route path="/safety-guide/:articleId" element={<ScamAlerts />} />
              <Route path="/alerts" element={<ScamAlerts />} />
              <Route path="/alerts/:articleId" element={<ScamAlerts />} />
              <Route path="/safety" element={<ScamAlerts />} />
              <Route path="/safety/:articleId" element={<ScamAlerts />} />
            </Route>

            {/* ========================================================= */}
            {/* 2. PROTECTED USER PORTAL ROUTES (Role: USER only)         */}
            {/* ========================================================= */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                  />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Circular Analysis (Standard & Alias) */}
              <Route
                path="/analyze"
                element={<CircularScanner onSaveScanned={addScannedCircular} />}
              />
              <Route
                path="/scanner"
                element={<CircularScanner onSaveScanned={addScannedCircular} />}
              />

              {/* Job Circular Analysis (Backend-ready module) */}
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/analyze-new" element={<Analysis />} />

              {/* Analysis Results */}
              <Route path="/analysis-result" element={<AnalysisResult />} />
              <Route path="/analysis-result/:id" element={<AnalysisResult />} />
              <Route path="/result" element={<AnalysisResult />} />
              <Route path="/result/:id" element={<AnalysisResult />} />
              <Route path="/analysis" element={<AnalysisResult />} />
              <Route path="/analysis/:id" element={<AnalysisResult />} />

              {/* Whistleblower Scam Reporting */}
              <Route
                path="/report-scam"
                element={
                  <ReportScam
                    scamReports={scamReports}
                    onSubmitReport={submitScamReport}
                  />
                }
              />
              <Route
                path="/report"
                element={
                  <ReportScam
                    scamReports={scamReports}
                    onSubmitReport={submitScamReport}
                  />
                }
              />

              {/* My Activity (Analysis History & My Reports Combined) */}
              <Route
                path="/my-activity"
                element={<MyActivity circulars={circulars} />}
              />
              <Route
                path="/history"
                element={<MyActivity circulars={circulars} defaultTab="history" />}
              />
              <Route
                path="/circulars"
                element={<MyActivity circulars={circulars} defaultTab="history" />}
              />
              <Route
                path="/my-reports"
                element={<MyActivity circulars={circulars} defaultTab="reports" />}
              />

              {/* User Profile & Account Settings */}
              <Route path="/profile" element={<UserProfile defaultTab="personal" />} />
              <Route path="/settings" element={<UserProfile defaultTab="security" />} />
            </Route>

            {/* ========================================================= */}
            {/* 3. PROTECTED ADMIN PORTAL ROUTES (Role: ADMIN only)       */}
            {/* ========================================================= */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUserManagement />} />
              <Route path="organizations" element={<AdminOrganizationManagement />} />
              <Route path="verification" element={<AdminVerificationQueue />} />
              <Route path="reports" element={<AdminReportManagement />} />
              <Route path="safety-tips" element={<AdminSafetyTipsManagement />} />
              <Route path="statistics" element={<AdminDetectionStats />} />
              <Route path="stats" element={<AdminDetectionStats />} />
              <Route path="activity" element={<AdminActivityLog />} />
              <Route path="logs" element={<AdminActivityLog />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* ========================================================= */}
            {/* 4. CATCH-ALL (404 NOT FOUND)                              */}
            {/* ========================================================= */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthModalProvider>
      </BrowserRouter>
    </AuthProvider>
  );
};

export const AppRoutes = () => (
  <MockDataProvider>
    <AppRoutesContent />
  </MockDataProvider>
);

export default AppRoutes;
