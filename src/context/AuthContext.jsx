/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const DEFAULT_MOCK_USER = {
  id: 'USR-8910',
  name: 'Shafiqur Rahman',
  email: 'shafiq.rahman@gmail.com',
  phone: '+880 1712-345678',
  systemRole: 'USER', // 'USER' | 'ADMIN'
  role: 'Candidate / Job Seeker',
  organization: 'Independent Professional',
  bio: 'Software engineer and citizen researcher focused on employment transparency and fair recruitment practices.',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  scanCount: 14,
  reportedScamsCount: 2,
  verifiedBadgesCount: 3,
  joinedDate: '2026-08-15T10:00:00Z',
  notificationsEnabled: true,
  emailAlertsEnabled: true,
  smsAlertsEnabled: false,
};

const DEFAULT_MOCK_ADMIN = {
  id: 'ADM-001',
  name: 'Super Administrator',
  email: 'admin@circularshield.security',
  phone: '+880 1700-999888',
  systemRole: 'ADMIN',
  role: 'Super Administrator',
  department: 'Security Operations & Threat Intelligence',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  joinedDate: '2026-01-01T00:00:00Z',
  accessLevel: 'Tier-1 Security Clearance',
};

export const AuthProvider = ({ children }) => {
  // Synchronous initialization from localStorage to prevent render cascading & UI flicker
  const [user, setUser] = useState(() => {
    try {
      const storedToken = localStorage.getItem('cs_auth_token');
      const storedUser = localStorage.getItem('cs_auth_user');
      if (storedToken && storedUser) {
        const parsed = JSON.parse(storedUser);
        const normalizedRole = parsed.systemRole || (parsed.role?.includes('Admin') ? 'ADMIN' : 'USER');
        return { ...parsed, systemRole: normalizedRole };
      }
    } catch {
      localStorage.removeItem('cs_auth_token');
      localStorage.removeItem('cs_auth_user');
    }
    return null;
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('cs_auth_token') || null;
    } catch {
      return null;
    }
  });

  const [isLoading] = useState(false);

  const isAuthenticated = Boolean(token && user);
  const isUser = Boolean(isAuthenticated && user?.systemRole === 'USER');
  const isAdmin = Boolean(isAuthenticated && user?.systemRole === 'ADMIN');

  // USER PORTAL LOGIN (/login)
  const login = async (email, password, roleType = 'seeker') => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!email || !password) {
      throw new Error('Please enter both email and password.');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    const mockToken = `cs_usr_jwt_${btoa(email)}_${Date.now()}`;
    const loggedUser = {
      ...DEFAULT_MOCK_USER,
      email,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      systemRole: 'USER',
      role: roleType === 'employer' ? 'Verified Employer' : roleType === 'officer' ? 'Whistleblower Analyst' : 'Candidate / Job Seeker',
    };

    localStorage.setItem('cs_auth_token', mockToken);
    localStorage.setItem('cs_auth_user', JSON.stringify(loggedUser));
    setToken(mockToken);
    setUser(loggedUser);

    return { user: loggedUser, token: mockToken };
  };

  // ADMIN PORTAL LOGIN (/admin/login)
  const adminLogin = async (email, password) => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (!email || !password) {
      throw new Error('Please provide both administrator email and access key.');
    }

    if (password.length < 6) {
      throw new Error('Invalid administrative credentials or insufficient security clearance.');
    }

    const mockToken = `cs_adm_jwt_${btoa(email)}_${Date.now()}`;
    const loggedAdmin = {
      ...DEFAULT_MOCK_ADMIN,
      email,
      name: email.includes('admin') ? 'Super Administrator' : email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      systemRole: 'ADMIN',
      role: 'Super Administrator',
    };

    localStorage.setItem('cs_auth_token', mockToken);
    localStorage.setItem('cs_auth_user', JSON.stringify(loggedAdmin));
    setToken(mockToken);
    setUser(loggedAdmin);

    return { user: loggedAdmin, token: mockToken };
  };

  // USER REGISTRATION (/register)
  const register = async ({ name, email, phone, password }) => {
    await new Promise((resolve) => setTimeout(resolve, 700));

    if (!name || !email || !password) {
      throw new Error('All required fields must be filled.');
    }

    const mockToken = `cs_usr_jwt_${btoa(email)}_${Date.now()}`;
    const newUser = {
      ...DEFAULT_MOCK_USER,
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      email,
      phone: phone || '+880 1700-000000',
      systemRole: 'USER',
      role: 'Candidate / Job Seeker',
      organization: 'Citizen Job Seeker',
      bio: 'New member safeguarding recruitment transparency on CircularShield.',
      joinedDate: new Date().toISOString(),
      scanCount: 0,
      reportedScamsCount: 0,
    };

    localStorage.setItem('cs_auth_token', mockToken);
    localStorage.setItem('cs_auth_user', JSON.stringify(newUser));
    setToken(mockToken);
    setUser(newUser);

    return { user: newUser, token: mockToken };
  };

  // LOGOUT
  const logout = useCallback(() => {
    localStorage.removeItem('cs_auth_user');
    localStorage.removeItem('cs_auth_token');
    setUser(null);
    setToken(null);
  }, []);

  // UPDATE PROFILE
  const updateProfile = async (updatedData) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    setUser((prev) => {
      const updated = { ...prev, ...updatedData };
      localStorage.setItem('cs_auth_user', JSON.stringify(updated));
      return updated;
    });
    return true;
  };

  // FORGOT PASSWORD
  const forgotPassword = async (email) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (!email || !email.includes('@')) {
      throw new Error('Please provide a valid registered email address.');
    }
    return { success: true, message: `Password reset instructions sent to ${email}` };
  };

  // RESET PASSWORD
  const resetPassword = async (newPassword) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (!newPassword || newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters long.');
    }
    return { success: true, message: 'Password has been updated successfully.' };
  };

  // CHANGE PASSWORD (Settings)
  const changePassword = async (currentPassword, newPassword) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (!currentPassword) {
      throw new Error('Please enter your current password.');
    }
    if (!newPassword || newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters long.');
    }
    return { success: true, message: 'Password updated successfully!' };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        isUser,
        isAdmin,
        login,
        adminLogin,
        register,
        logout,
        updateProfile,
        changePassword,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
