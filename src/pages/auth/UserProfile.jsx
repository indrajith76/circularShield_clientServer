import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Bell,
  LogOut,
  Calendar,
  Camera,
  Upload,
  AlertTriangle,
  Check,
  Copy,
  KeyRound,
  Smartphone,
  Laptop,
  X,
  Shield,
} from 'lucide-react';

import PageHeader from '../../components/ui/PageHeader';
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../../components/ui/Card';
import Input, { Textarea } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Tabs from '../../components/ui/Tabs';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/formatters';

export const UserProfile = ({ defaultTab = 'personal' }) => {
  const navigate = useNavigate();
  const { user, updateProfile, changePassword, logout } = useAuth();
  const fileInputRef = useRef(null);

  // Active Tab State: 'personal' | 'security' | 'notifications'
  const [activeTab, setActiveTab] = useState(defaultTab);

  // ----------------------------------------------------
  // 1. Personal Information Form State
  // ----------------------------------------------------
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Shafiqur Rahman',
    email: user?.email || 'shafiq.rahman@gmail.com',
    phone: user?.phone || '+880 1712-345678',
    organization: user?.organization || 'Independent Professional',
    bio:
      user?.bio ||
      'Software engineer and citizen researcher focused on employment transparency and fair recruitment practices.',
    avatar:
      user?.avatar ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  });

  const [profileErrors, setProfileErrors] = useState({});
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [profileErrorMsg, setProfileErrorMsg] = useState('');

  // ----------------------------------------------------
  // 2. Security / Password Form State
  // ----------------------------------------------------
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [securityErrors, setSecurityErrors] = useState({});
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);
  const [securitySuccessMsg, setSecuritySuccessMsg] = useState('');
  const [securityErrorMsg, setSecurityErrorMsg] = useState('');

  // ----------------------------------------------------
  // 3. Notification Preferences State
  // ----------------------------------------------------
  const [notifications, setNotifications] = useState({
    emailAlertsEnabled: user?.emailAlertsEnabled ?? true,
    scamReportsUpdates: user?.scamReportsUpdates ?? true,
    weeklySurveillanceDigest: user?.weeklySurveillanceDigest ?? true,
    smsAlertsEnabled: user?.smsAlertsEnabled ?? false,
    pushNotificationsEnabled: user?.pushNotificationsEnabled ?? true,
  });

  const [isSavingNotifications, setIsSavingNotifications] = useState(false);
  const [notificationsSuccessMsg, setNotificationsSuccessMsg] = useState('');

  // ----------------------------------------------------
  // 4. Modal & UI State
  // ----------------------------------------------------
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Preset avatar choices
  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
  ];

  // ----------------------------------------------------
  // Validation Helpers
  // ----------------------------------------------------
  const validateProfile = () => {
    const errors = {};
    if (!profileData.name.trim()) {
      errors.name = 'Full name is required.';
    } else if (profileData.name.trim().length < 3) {
      errors.name = 'Full name must be at least 3 characters.';
    }

    if (!profileData.phone.trim()) {
      errors.phone = 'Phone number is required.';
    } else if (
      !/^[+]?[0-9\s-]{10,18}$/.test(profileData.phone.trim())
    ) {
      errors.phone = 'Enter a valid phone number format (e.g. +880 1712-345678).';
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateSecurity = () => {
    const errors = {};
    if (!securityData.currentPassword) {
      errors.currentPassword = 'Enter your current password.';
    }

    if (!securityData.newPassword) {
      errors.newPassword = 'New password is required.';
    } else if (securityData.newPassword.length < 8) {
      errors.newPassword = 'New password must be at least 8 characters.';
    } else if (
      !/[A-Z]/.test(securityData.newPassword) ||
      !/[0-9]/.test(securityData.newPassword)
    ) {
      errors.newPassword = 'Password must include at least 1 uppercase letter and 1 number.';
    }

    if (!securityData.confirmPassword) {
      errors.confirmPassword = 'Confirm your new password.';
    } else if (securityData.newPassword !== securityData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    setSecurityErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'None', color: '#CBD5E1' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (pass.length >= 12) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score: 25, label: 'Weak', color: '#DC4B4B' };
    if (score <= 4) return { score: 65, label: 'Good', color: '#D99A28' };
    return { score: 100, label: 'Strong', color: '#16A36A' };
  };

  const passwordStrength = getPasswordStrength(securityData.newPassword);

  // ----------------------------------------------------
  // Event Handlers
  // ----------------------------------------------------
  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setProfileErrorMsg('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setProfileErrorMsg('Image size exceeds 2MB limit. Please select a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProfileData((prev) => ({ ...prev, avatar: reader.result }));
      setProfileErrorMsg('');
      setProfileSuccessMsg('Photo selected! Click "Save Changes" to apply.');
    };
    reader.readAsDataURL(file);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSuccessMsg('');
    setProfileErrorMsg('');

    if (!validateProfile()) return;

    setIsSavingProfile(true);
    try {
      await updateProfile({
        name: profileData.name.trim(),
        phone: profileData.phone.trim(),
        organization: profileData.organization.trim(),
        bio: profileData.bio.trim(),
        avatar: profileData.avatar,
      });
      setProfileSuccessMsg('Profile information updated successfully!');
      setTimeout(() => setProfileSuccessMsg(''), 4000);
    } catch (err) {
      setProfileErrorMsg(err?.message || 'Failed to update profile.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    setSecuritySuccessMsg('');
    setSecurityErrorMsg('');

    if (!validateSecurity()) return;

    setIsSavingSecurity(true);
    try {
      await changePassword(
        securityData.currentPassword,
        securityData.newPassword
      );
      setSecuritySuccessMsg(
        'Password changed successfully! Next time you log in, please use your new password.'
      );
      setSecurityData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setSecurityErrors({});
      setTimeout(() => setSecuritySuccessMsg(''), 5000);
    } catch (err) {
      setSecurityErrorMsg(err?.message || 'Failed to update password.');
    } finally {
      setIsSavingSecurity(false);
    }
  };

  const handleNotificationsSubmit = async (e) => {
    e.preventDefault();
    setNotificationsSuccessMsg('');
    setIsSavingNotifications(true);

    try {
      await updateProfile(notifications);
      setNotificationsSuccessMsg('Notification preferences saved successfully!');
      setTimeout(() => setNotificationsSuccessMsg(''), 4000);
    } finally {
      setIsSavingNotifications(false);
    }
  };

  const handleCopyId = () => {
    const id = user?.id || 'USR-8910';
    navigator.clipboard?.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    logout();
    navigate('/login');
  };

  // Tab definitions
  const settingsTabs = [
    { id: 'personal', label: 'Personal Information', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Profile & Settings' },
        ]}
        title="Profile & Settings"
        subtitle="Manage your personal details, password security, and notification preferences."
        actions={
          <Button
            variant="outline"
            size="sm"
            leftIcon={LogOut}
            className="text-[#DC4B4B] hover:bg-[#FEF2F2] hover:border-[#FECACA]"
            onClick={() => setIsLogoutModalOpen(true)}
          >
            Sign Out
          </Button>
        }
      />

      {/* ==================================================== */}
      {/* PROFILE OVERVIEW BANNER (Required Display Fields)     */}
      {/* Displays: Profile Picture, Full Name, Email, Phone, */}
      {/* Account Role, Account Creation Date                  */}
      {/* ==================================================== */}
      <Card className="bg-gradient-to-br from-white via-white to-[#F0FDF9] border border-[#087F70]/20 shadow-xs">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Left: Avatar, Names & Core Info */}
            <div className="flex items-start sm:items-center gap-4 sm:gap-5">
              {/* Profile Picture Display */}
              <div className="relative group shrink-0">
                <img
                  src={
                    profileData.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                  }
                  alt={user?.name || 'User Profile Picture'}
                  className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl object-cover border-2 border-[#087F70] shadow-sm bg-white"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload New Photo"
                  className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-xl bg-[#102C3A] text-white hover:bg-[#087F70] transition-colors shadow-md cursor-pointer"
                >
                  <Camera size={14} />
                </button>
              </div>

              {/* Identity & Account Meta */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#102C3A]">
                    {user?.name || profileData.name}
                  </h3>
                  <Badge variant="verified" size="sm" showDot>
                    Verified Identity
                  </Badge>
                </div>

                {/* Email Address & Phone Number Display */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#64748B]">
                  <span className="flex items-center gap-1.5">
                    <Mail size={13} className="text-[#087F70]" />
                    <span className="font-medium text-[#102C3A]">
                      {user?.email || profileData.email}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone size={13} className="text-[#087F70]" />
                    <span className="font-medium text-[#102C3A]">
                      {user?.phone || profileData.phone}
                    </span>
                  </span>
                </div>

                {/* Account Role & Creation Date Display */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#94A3B8] pt-0.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#102C3A]/5 text-[#102C3A] font-semibold text-[11px]">
                    <Shield size={11} className="text-[#087F70]" />
                    Role: {user?.role || 'Candidate / Job Seeker'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    Account Created: {formatDate(user?.joinedDate || '2026-08-15T10:00:00Z')}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Quick Telemetry Stat Badges */}
            <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-[#E2E8F0] pt-4 md:pt-0 md:pl-6 w-full md:w-auto justify-around md:justify-start">
              <div className="text-center space-y-0.5">
                <p className="text-xl font-black text-[#102C3A]">
                  {user?.scanCount || 14}
                </p>
                <p className="text-[11px] text-[#64748B] font-medium">
                  Scans Run
                </p>
              </div>
              <div className="text-center space-y-0.5">
                <p className="text-xl font-black text-[#DC4B4B]">
                  {user?.reportedScamsCount || 2}
                </p>
                <p className="text-[11px] text-[#64748B] font-medium">
                  Scams Reported
                </p>
              </div>
              <div className="text-center space-y-0.5">
                <p className="text-xl font-black text-[#16A36A]">100%</p>
                <p className="text-[11px] text-[#64748B] font-medium">
                  Trust Rating
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hidden File Input for Avatar Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarFileChange}
        accept="image/png, image/jpeg, image/jpg, image/webp"
        className="hidden"
      />

      {/* ==================================================== */}
      {/* CLEAN TABBED SETTINGS LAYOUT (Required 3 Tabs)        */}
      {/* 1. Personal Information                              */}
      {/* 2. Security                                          */}
      {/* 3. Notifications                                     */}
      {/* ==================================================== */}
      <div className="border-b border-[#E2E8F0] pb-2">
        <Tabs
          tabs={settingsTabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {/* ==================================================== */}
      {/* TAB 1: PERSONAL INFORMATION (EDIT PROFILE)           */}
      {/* Features: Update Full Name, Phone, Profile Picture,  */}
      {/* Save Changes button with validation & feedback       */}
      {/* ==================================================== */}
      {activeTab === 'personal' && (
        <div className="space-y-6">
          {/* Feedback Messages */}
          {profileSuccessMsg && (
            <div className="p-4 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-between text-xs font-semibold text-[#16A36A] animate-in fade-in duration-150">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>{profileSuccessMsg}</span>
              </div>
              <button
                onClick={() => setProfileSuccessMsg('')}
                className="p-1 hover:bg-[#D1FAE5] rounded-md cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {profileErrorMsg && (
            <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-between text-xs font-semibold text-[#DC4B4B] animate-in fade-in duration-150">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="shrink-0" />
                <span>{profileErrorMsg}</span>
              </div>
              <button
                onClick={() => setProfileErrorMsg('')}
                className="p-1 hover:bg-[#FEE2E2] rounded-md cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <Card className="bg-white border-[#E2E8F0] shadow-sm">
            <CardHeader>
              <CardTitle>Personal Details & Profile Credentials</CardTitle>
              <CardDescription>
                Update your public candidate name, contact phone number, and verified profile picture.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-2xl">
                {/* Profile Picture Upload & Presets */}
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#102C3A]">
                        Profile Picture
                      </h4>
                      <p className="text-xs text-[#64748B]">
                        JPG, PNG, or WebP (max 2MB). Recommended square aspect ratio.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      leftIcon={Upload}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Upload Photo
                    </Button>
                  </div>

                  {/* Avatar Previews and Fast Picker */}
                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-[11px] text-[#94A3B8] font-medium">
                      Or select preset:
                    </span>
                    <div className="flex items-center gap-2">
                      {avatarPresets.map((presetUrl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setProfileData((prev) => ({
                              ...prev,
                              avatar: presetUrl,
                            }));
                            setProfileSuccessMsg('Preset chosen! Click Save Changes below.');
                          }}
                          className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-transform hover:scale-105 cursor-pointer ${
                            profileData.avatar === presetUrl
                              ? 'border-[#087F70] ring-2 ring-[#087F70]/30'
                              : 'border-[#E2E8F0] opacity-80 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={presetUrl}
                            alt={`Preset ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Name & Phone Fields (Required Editable Fields) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    leftIcon={User}
                    placeholder="e.g. Shafiqur Rahman"
                    value={profileData.name}
                    onChange={(e) => {
                      setProfileData({ ...profileData, name: e.target.value });
                      if (profileErrors.name) {
                        setProfileErrors({ ...profileErrors, name: '' });
                      }
                    }}
                    error={profileErrors.name}
                    required
                  />

                  <Input
                    label="Phone Number"
                    leftIcon={Phone}
                    placeholder="e.g. +880 1712-345678"
                    value={profileData.phone}
                    onChange={(e) => {
                      setProfileData({ ...profileData, phone: e.target.value });
                      if (profileErrors.phone) {
                        setProfileErrors({ ...profileErrors, phone: '' });
                      }
                    }}
                    error={profileErrors.phone}
                    helperText="Used for critical scam alerts and 2FA authentication."
                    required
                  />
                </div>

                {/* Email Address & Organization Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Input
                      label="Email Address (Primary Identity)"
                      type="email"
                      leftIcon={Mail}
                      value={profileData.email}
                      disabled
                      className="bg-[#F8FAFC] text-[#64748B] cursor-not-allowed"
                      helperText="Verified authentication identifier. Contact admin to change."
                    />
                  </div>

                  <Input
                    label="Affiliated Organization"
                    placeholder="e.g. Independent Professional"
                    value={profileData.organization}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        organization: e.target.value,
                      })
                    }
                    helperText="Displayed alongside whistleblower contributions."
                  />
                </div>

                {/* Bio / Vigilance Focus */}
                <Textarea
                  label="Profile Bio & Vigilance Focus"
                  rows={3}
                  value={profileData.bio}
                  onChange={(e) =>
                    setProfileData({ ...profileData, bio: e.target.value })
                  }
                  helperText="Brief summary of your professional background and domain of recruitment interest."
                />

                {/* Submit Button */}
                <div className="pt-2 flex items-center gap-3">
                  <Button
                    type="submit"
                    variant="secondary"
                    size="md"
                    isLoading={isSavingProfile}
                  >
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={() => {
                      setProfileData({
                        name: user?.name || '',
                        email: user?.email || '',
                        phone: user?.phone || '',
                        organization: user?.organization || '',
                        bio: user?.bio || '',
                        avatar: user?.avatar || avatarPresets[0],
                      });
                      setProfileErrors({});
                    }}
                  >
                    Discard Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 2: SECURITY SETTINGS                             */}
      {/* Features: Current Password, New Password, Confirm    */}
      {/* New Password, Change Password button, 2FA status     */}
      {/* ==================================================== */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Feedback Messages */}
          {securitySuccessMsg && (
            <div className="p-4 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-between text-xs font-semibold text-[#16A36A] animate-in fade-in duration-150">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>{securitySuccessMsg}</span>
              </div>
              <button
                onClick={() => setSecuritySuccessMsg('')}
                className="p-1 hover:bg-[#D1FAE5] rounded-md cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {securityErrorMsg && (
            <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-between text-xs font-semibold text-[#DC4B4B] animate-in fade-in duration-150">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="shrink-0" />
                <span>{securityErrorMsg}</span>
              </div>
              <button
                onClick={() => setSecurityErrorMsg('')}
                className="p-1 hover:bg-[#FEE2E2] rounded-md cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <Card className="bg-white border-[#E2E8F0] shadow-sm">
            <CardHeader>
              <CardTitle>Security & Password Management</CardTitle>
              <CardDescription>
                Ensure your account is protected against credential stuffing with a strong password and multi-factor defense.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 max-w-2xl">
              <form onSubmit={handleSecuritySubmit} className="space-y-4">
                {/* Current Password Field */}
                <Input
                  label="Current Password"
                  type="password"
                  leftIcon={KeyRound}
                  showPasswordToggle={true}
                  placeholder="Enter your existing password"
                  value={securityData.currentPassword}
                  onChange={(e) => {
                    setSecurityData({
                      ...securityData,
                      currentPassword: e.target.value,
                    });
                    if (securityErrors.currentPassword) {
                      setSecurityErrors({
                        ...securityErrors,
                        currentPassword: '',
                      });
                    }
                  }}
                  error={securityErrors.currentPassword}
                  required
                />

                {/* New Password & Confirm Password Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="New Password"
                    type="password"
                    leftIcon={Lock}
                    showPasswordToggle={true}
                    placeholder="Min 8 characters"
                    value={securityData.newPassword}
                    onChange={(e) => {
                      setSecurityData({
                        ...securityData,
                        newPassword: e.target.value,
                      });
                      if (securityErrors.newPassword) {
                        setSecurityErrors({
                          ...securityErrors,
                          newPassword: '',
                        });
                      }
                    }}
                    error={securityErrors.newPassword}
                    required
                  />

                  <Input
                    label="Confirm New Password"
                    type="password"
                    leftIcon={Lock}
                    showPasswordToggle={true}
                    placeholder="Re-enter new password"
                    value={securityData.confirmPassword}
                    onChange={(e) => {
                      setSecurityData({
                        ...securityData,
                        confirmPassword: e.target.value,
                      });
                      if (securityErrors.confirmPassword) {
                        setSecurityErrors({
                          ...securityErrors,
                          confirmPassword: '',
                        });
                      }
                    }}
                    error={securityErrors.confirmPassword}
                    required
                  />
                </div>

                {/* Password Strength Meter */}
                {securityData.newPassword && (
                  <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#64748B]">Password Strength:</span>
                      <span
                        className="font-bold"
                        style={{ color: passwordStrength.color }}
                      >
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
                      <div
                        className="h-full transition-all duration-300 rounded-full"
                        style={{
                          width: `${passwordStrength.score}%`,
                          backgroundColor: passwordStrength.color,
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-[#64748B]">
                      <span
                        className={`flex items-center gap-1 ${
                          securityData.newPassword.length >= 8
                            ? 'text-[#16A36A] font-medium'
                            : ''
                        }`}
                      >
                        <Check size={12} /> At least 8 characters
                      </span>
                      <span
                        className={`flex items-center gap-1 ${
                          /[A-Z]/.test(securityData.newPassword)
                            ? 'text-[#16A36A] font-medium'
                            : ''
                        }`}
                      >
                        <Check size={12} /> Uppercase letter
                      </span>
                      <span
                        className={`flex items-center gap-1 ${
                          /[0-9]/.test(securityData.newPassword)
                            ? 'text-[#16A36A] font-medium'
                            : ''
                        }`}
                      >
                        <Check size={12} /> Number (0-9)
                      </span>
                      <span
                        className={`flex items-center gap-1 ${
                          /[^A-Za-z0-9]/.test(securityData.newPassword)
                            ? 'text-[#16A36A] font-medium'
                            : ''
                        }`}
                      >
                        <Check size={12} /> Special symbol
                      </span>
                    </div>
                  </div>
                )}

                {/* Change Password Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isSavingSecurity}
                  >
                    Change Password
                  </Button>
                </div>
              </form>

              {/* Multi-Factor Authentication Section */}
              <div className="pt-6 border-t border-[#F1F5F8] space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-[#102C3A] flex items-center gap-1.5">
                      <ShieldCheck size={16} className="text-[#16A36A]" />
                      Two-Factor Authentication (2FA)
                    </h4>
                    <p className="text-xs text-[#64748B]">
                      Protect your account with SMS OTP verification or Authenticator App on untrusted devices.
                    </p>
                  </div>
                  <Badge variant="verified" size="sm">
                    Active (SMS Protected)
                  </Badge>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <Smartphone size={18} className="text-[#087F70]" />
                    <div>
                      <span className="font-semibold text-[#102C3A] block">
                        Registered SMS Gateway: {user?.phone || '+880 1712-345678'}
                      </span>
                      <span className="text-[#94A3B8]">
                        OTP dispatches sent exclusively for security-sensitive operations.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Sessions Overview */}
              <div className="pt-6 border-t border-[#F1F5F8] space-y-3">
                <h4 className="text-sm font-bold text-[#102C3A]">
                  Active Devices & Login Sessions
                </h4>
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <Laptop size={18} className="text-[#102C3A]" />
                    <div>
                      <p className="font-semibold text-[#102C3A]">
                        Current Browser • Windows 11 (Dhaka, Bangladesh)
                      </p>
                      <p className="text-[#94A3B8]">
                        IP: 103.205.71.x • Active Session (JWT Valid)
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-[#16A36A] px-2 py-0.5 rounded-full bg-[#16A36A]/10">
                    Online Now
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 3: NOTIFICATIONS & ACCOUNT SETTINGS              */}
      {/* Features: Notification preferences, Account info,    */}
      {/* Logout option in styled layout                       */}
      {/* ==================================================== */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          {/* Feedback Message */}
          {notificationsSuccessMsg && (
            <div className="p-4 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-between text-xs font-semibold text-[#16A36A] animate-in fade-in duration-150">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>{notificationsSuccessMsg}</span>
              </div>
              <button
                onClick={() => setNotificationsSuccessMsg('')}
                className="p-1 hover:bg-[#D1FAE5] rounded-md cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* 1. Notification Preferences Card */}
          <Card className="bg-white border-[#E2E8F0] shadow-sm">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure when and through which channels CircularShield delivers threat intelligence and scan updates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNotificationsSubmit} className="space-y-4 max-w-2xl">
                <div className="space-y-3">
                  {/* Option 1: Scam Bulletins */}
                  <label className="flex items-start gap-3.5 p-3.5 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.emailAlertsEnabled}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          emailAlertsEnabled: e.target.checked,
                        })
                      }
                      className="mt-1 w-4 h-4 rounded text-[#087F70] focus:ring-[#087F70] border-[#CBD5E1] cursor-pointer"
                    />
                    <div className="space-y-0.5 text-xs">
                      <span className="font-bold text-[#102C3A] block">
                        High-Risk Recruitment Scam Bulletins (Email)
                      </span>
                      <p className="text-[#64748B] leading-relaxed">
                        Receive immediate alerts whenever a viral job scam or fraudulent organization clone is neutralized.
                      </p>
                    </div>
                  </label>

                  {/* Option 2: Whistleblower Updates */}
                  <label className="flex items-start gap-3.5 p-3.5 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.scamReportsUpdates}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          scamReportsUpdates: e.target.checked,
                        })
                      }
                      className="mt-1 w-4 h-4 rounded text-[#087F70] focus:ring-[#087F70] border-[#CBD5E1] cursor-pointer"
                    />
                    <div className="space-y-0.5 text-xs">
                      <span className="font-bold text-[#102C3A] block">
                        Whistleblower & Scam Report Status Updates
                      </span>
                      <p className="text-[#64748B] leading-relaxed">
                        Receive notifications when submitted reports receive community verification or law enforcement reviews.
                      </p>
                    </div>
                  </label>

                  {/* Option 3: Weekly Surveillance Digest */}
                  <label className="flex items-start gap-3.5 p-3.5 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.weeklySurveillanceDigest}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          weeklySurveillanceDigest: e.target.checked,
                        })
                      }
                      className="mt-1 w-4 h-4 rounded text-[#087F70] focus:ring-[#087F70] border-[#CBD5E1] cursor-pointer"
                    />
                    <div className="space-y-0.5 text-xs">
                      <span className="font-bold text-[#102C3A] block">
                        Weekly Job Safety Digest
                      </span>
                      <p className="text-[#64748B] leading-relaxed">
                        A weekly email with verified safe job opportunities and recent scam warnings in Bangladesh.
                      </p>
                    </div>
                  </label>

                  {/* Option 4: SMS Threat Alerts */}
                  <label className="flex items-start gap-3.5 p-3.5 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.smsAlertsEnabled}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          smsAlertsEnabled: e.target.checked,
                        })
                      }
                      className="mt-1 w-4 h-4 rounded text-[#087F70] focus:ring-[#087F70] border-[#CBD5E1] cursor-pointer"
                    />
                    <div className="space-y-0.5 text-xs">
                      <span className="font-bold text-[#102C3A] block">
                        Critical SMS Threat Dispatches (Emergency Only)
                      </span>
                      <p className="text-[#64748B] leading-relaxed">
                        Direct SMS alerts for widespread bKash/Nagad recruitment fraud syndicates demanding immediate attention.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="secondary"
                    size="md"
                    isLoading={isSavingNotifications}
                  >
                    Save Notification Preferences
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* 2. Account Information Card */}
          <Card className="bg-white border-[#E2E8F0] shadow-sm">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                System telemetry, security tokens, and subscription tier specifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Account ID with Copy Button */}
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                  <div>
                    <span className="text-[#94A3B8] block">Account ID</span>
                    <span className="font-mono font-bold text-[#102C3A] text-sm">
                      {user?.id || 'USR-8910'}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    leftIcon={copiedId ? Check : Copy}
                    onClick={handleCopyId}
                    className="text-[#087F70]"
                  >
                    {copiedId ? 'Copied' : 'Copy'}
                  </Button>
                </div>

                {/* Account Status */}
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[#94A3B8] block">Account Status</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-[#16A36A]" />
                    <span className="font-bold text-[#16A36A]">
                      Active & Verified
                    </span>
                  </div>
                </div>

                {/* Account Role */}
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[#94A3B8] block">Membership Tier</span>
                  <span className="font-bold text-[#102C3A] block mt-0.5">
                    Standard Citizen Researcher
                  </span>
                </div>

                {/* Registration Date */}
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[#94A3B8] block">Member Since</span>
                  <span className="font-bold text-[#102C3A] block mt-0.5">
                    {formatDate(user?.joinedDate || '2026-08-15T10:00:00Z')}
                  </span>
                </div>
              </div>

              {/* Data & Privacy notice */}
              <div className="p-3.5 rounded-xl bg-[#F0FDF9] border border-[#087F70]/20 text-xs text-[#065C51] flex items-start gap-2.5">
                <ShieldCheck size={18} className="shrink-0 mt-0.5 text-[#087F70]" />
                <p className="leading-relaxed">
                  Your scanning history and submitted whistleblower filings are encrypted client-side using JWT credential hashing and token isolation. CircularShield does not sell personal browsing data.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 3. Account Logout Option / Danger Zone */}
          <Card className="bg-white border-[#FECACA] shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#DC4B4B] flex items-center gap-2">
                <AlertTriangle size={18} />
                Session Management & Sign Out
              </CardTitle>
              <CardDescription>
                Terminating your authenticated session will clear local JWT tokens and require password re-entry.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 max-w-2xl">
              <p className="text-xs text-[#64748B] leading-relaxed">
                When you sign out, your saved profile preferences will remain securely stored on your device, but active background surveillance sync will pause.
              </p>
              <div>
                <Button
                  variant="danger"
                  size="md"
                  leftIcon={LogOut}
                  onClick={() => setIsLogoutModalOpen(true)}
                >
                  Sign Out of CircularShield
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ==================================================== */}
      {/* LOGOUT CONFIRMATION MODAL                            */}
      {/* ==================================================== */}
      {isLogoutModalOpen && (
        <Modal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          title="Sign Out of CircularShield"
          description="Are you sure you want to end your current session?"
          footer={
            <div className="flex items-center justify-end gap-3 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLogoutModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                leftIcon={LogOut}
                onClick={handleConfirmLogout}
              >
                Confirm Sign Out
              </Button>
            </div>
          }
        >
          <div className="space-y-3 text-xs text-[#64748B]">
            <div className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#DC4B4B]/10 text-[#DC4B4B] shrink-0">
                <AlertTriangle size={18} />
              </div>
              <p className="text-xs text-[#102C3A] leading-relaxed">
                You are currently signed in as{' '}
                <strong className="text-[#102C3A]">{user?.name}</strong> (
                {user?.email}). Signing out will end your current session on this device.
              </p>
            </div>
            <p>
              You can sign back in at any time to check job notices, view previously checked jobs, and track your scam reports.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UserProfile;
