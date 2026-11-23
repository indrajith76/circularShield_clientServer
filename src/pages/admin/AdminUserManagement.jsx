import { useState } from 'react';
import {
  Users,
  Search,
  UserPlus,
  CheckCircle2,
  X,
  Mail,
  Phone,
  Eye,
  Edit,
  Lock,
  Unlock,
  AlertTriangle,
  RotateCcw,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Input, { Select } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, EmptyState } from '../../components/ui/Table';
import { formatDate, formatRelativeTime } from '../../utils/formatters';
import { ADMIN_RECENT_USERS } from '../../data/adminMockData';
import { useMockData } from '../../context/useMockData';

export const AdminUserManagement = () => {
  const {
    users: storeUsers,
    addUser,
    updateUser,
    toggleUserStatus,
    deleteUser,
  } = useMockData();
  const users = storeUsers || ADMIN_RECENT_USERS;

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionToast, setActionToast] = useState('');

  // Add User Modal
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Candidate / Job Seeker',
  });

  // Edit User Modal
  const [editingUser, setEditingUser] = useState(null);

  // Deactivate confirmation modal
  const [userToToggleStatus, setUserToToggleStatus] = useState(null);

  // Delete User Confirmation Modal
  const [userToDelete, setUserToDelete] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Filter logic
  const filteredUsers = users.filter((u) => {
    const query = searchQuery.trim().toLowerCase();
    const matchQuery =
      !query ||
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.id.toLowerCase().includes(query) ||
      (u.phone && u.phone.toLowerCase().includes(query));

    const matchRole =
      roleFilter === 'all' ||
      (roleFilter === 'candidate' && u.role.includes('Candidate')) ||
      (roleFilter === 'employer' && u.role.includes('Employer')) ||
      (roleFilter === 'analyst' && u.role.includes('Analyst'));

    const matchStatus =
      statusFilter === 'all' || u.status === statusFilter;

    return matchQuery && matchRole && matchStatus;
  });

  // Activate / Deactivate Handler
  const handleConfirmToggleStatus = () => {
    if (!userToToggleStatus) return;
    const targetId = userToToggleStatus.id;
    const isCurrentlyActive = userToToggleStatus.status === 'active';
    const newStatus = isCurrentlyActive ? 'deactivated' : 'active';

    if (toggleUserStatus) {
      toggleUserStatus(targetId);
    }

    setActionToast(
      `User ${userToToggleStatus.name} has been ${
        newStatus === 'active' ? 'activated' : 'deactivated'
      }.`
    );
    setUserToToggleStatus(null);
    setTimeout(() => setActionToast(''), 4000);
  };

  // Add User Handler
  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUserData.name.trim() || !newUserData.email.trim()) return;

    if (addUser) {
      addUser(newUserData);
    }
    setIsAddUserModalOpen(false);
    setNewUserData({ name: '', email: '', phone: '', role: 'Candidate / Job Seeker' });
    setActionToast(`User account for ${newUserData.name} created successfully.`);
    setTimeout(() => setActionToast(''), 4000);
  };

  // Edit User Handler
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingUser) return;

    if (updateUser) {
      updateUser(editingUser.id, editingUser);
    }
    setActionToast(`User details for ${editingUser.name} updated.`);
    setEditingUser(null);
    setTimeout(() => setActionToast(''), 4000);
  };

  // Delete User Handler
  const handleDeleteUser = () => {
    if (!userToDelete) return;
    if (deleteUser) {
      deleteUser(userToDelete.id);
    }
    setActionToast(`User account ${userToDelete.name} (${userToDelete.id}) permanently purged.`);
    setUserToDelete(null);
    setTimeout(() => setActionToast(''), 4000);
  };

  // Pagination calculation
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        breadcrumbs={[
          { label: 'Admin', to: '/admin/dashboard' },
          { label: 'User Management' },
        ]}
        title="User Management"
        subtitle="Review, audit, manage account roles, and activate or deactivate registered citizen and employer accounts."
        actions={
          <Button
            variant="secondary"
            size="md"
            leftIcon={UserPlus}
            onClick={() => setIsAddUserModalOpen(true)}
          >
            Create User Account
          </Button>
        }
      />

      {/* Action Notification Toast */}
      {actionToast && (
        <div className="p-3.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-between text-xs font-semibold text-[#16A36A] animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{actionToast}</span>
          </div>
          <button onClick={() => setActionToast('')} className="p-1 hover:bg-[#D1FAE5] rounded cursor-pointer">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Search and Filters Bar */}
      <Card className="p-4 bg-white border border-[#E2E8F0] shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6">
            <Input
              placeholder="Search by full name, email, phone, or user ID..."
              leftIcon={Search}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              clearable
            />
          </div>
          <div className="sm:col-span-3">
            <Select
              options={[
                { value: 'all', label: 'All Roles' },
                { value: 'candidate', label: 'Candidate / Job Seeker' },
                { value: 'employer', label: 'Verified Employer' },
                { value: 'analyst', label: 'Whistleblower Analyst' },
              ]}
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="sm:col-span-3">
            <Select
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'active', label: 'Active Accounts' },
                { value: 'deactivated', label: 'Deactivated / Suspended' },
              ]}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </Card>

      {/* Results Header Counter */}
      <div className="flex items-center justify-between text-xs text-[#64748B] px-1">
        <span>
          Showing <strong className="text-[#102C3A]">{filteredUsers.length}</strong> of{' '}
          <strong className="text-[#102C3A]">{users.length}</strong> registered users
        </span>
        {(searchQuery || roleFilter !== 'all' || statusFilter !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setRoleFilter('all');
              setStatusFilter('all');
            }}
            className="text-[#087F70] hover:underline cursor-pointer flex items-center gap-1 font-medium"
          >
            <RotateCcw size={12} />
            Reset Filters
          </button>
        )}
      </div>

      {/* Users Data Table (Desktop) & Stacked Cards (Mobile) */}
      <Card className="bg-white border-[#E2E8F0] shadow-sm overflow-hidden">
        {/* Desktop / Tablet Table */}
        <div className="hidden sm:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Information</TableHead>
                <TableHead>Account Role</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead>User Activity</TableHead>
                <TableHead>Account Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <EmptyState
                      icon={Users}
                      title="No users found"
                      description="No registered user account matched your search criteria or role filters."
                      action={
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSearchQuery('');
                            setRoleFilter('all');
                            setStatusFilter('all');
                            setCurrentPage(1);
                          }}
                        >
                          Clear Filters
                        </Button>
                      }
                    />
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user) => (
                  <TableRow key={user.id} className="group">
                    {/* User Info */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-xl object-cover border border-[#E2E8F0] shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-xs sm:text-sm text-[#102C3A] group-hover:text-[#087F70] transition-colors truncate">
                            {user.name}
                          </p>
                          <p className="text-[11px] text-[#64748B] flex items-center gap-1 truncate">
                            <Mail size={11} className="shrink-0" />
                            <span>{user.email}</span>
                          </p>
                          <span className="font-mono text-[10px] text-[#087F70] font-semibold">
                            {user.id}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Role */}
                    <TableCell>
                      <span className="text-xs font-semibold text-[#102C3A] block truncate max-w-[150px]">
                        {user.role}
                      </span>
                    </TableCell>

                    {/* Joined Date */}
                    <TableCell>
                      <div className="text-xs text-[#102C3A]">
                        {formatDate(user.joinedDate)}
                      </div>
                      <div className="text-[11px] text-[#94A3B8]">
                        {formatRelativeTime(user.joinedDate)}
                      </div>
                    </TableCell>

                    {/* Telemetry */}
                    <TableCell>
                      <div className="text-xs space-y-0.5">
                        <span className="text-[#64748B] block">
                          Scans: <strong className="text-[#087F70]">{user.scansCount || 0}</strong>
                        </span>
                        <span className="text-[#64748B] block">
                          Reports: <strong className="text-[#DC4B4B]">{user.reportsCount || 0}</strong>
                        </span>
                      </div>
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell>
                      {user.status === 'active' ? (
                        <Badge variant="verified" size="sm" showDot>
                          ACTIVE
                        </Badge>
                      ) : (
                        <Badge variant="suspicious" size="sm" showDot>
                          DEACTIVATED
                        </Badge>
                      )}
                    </TableCell>

                    {/* Action Controls */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Details */}
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={Eye}
                          onClick={() => setSelectedUser(user)}
                        >
                          View
                        </Button>

                        {/* Edit User */}
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={Edit}
                          onClick={() => setEditingUser(user)}
                        >
                          Edit
                        </Button>

                        {/* Activate / Deactivate Toggle */}
                        <Button
                          variant="outline"
                          size="sm"
                          className={
                            user.status === 'active'
                              ? 'text-[#DC4B4B] hover:bg-[#FEF2F2] hover:border-[#FECACA]'
                              : 'text-[#16A36A] hover:bg-[#ECFDF5] hover:border-[#A7F3D0]'
                          }
                          leftIcon={user.status === 'active' ? Lock : Unlock}
                          onClick={() => setUserToToggleStatus(user)}
                        >
                          {user.status === 'active' ? 'Deactivate' : 'Activate'}
                        </Button>

                        {/* Delete User */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#DC4B4B] hover:bg-[#FEF2F2]"
                          onClick={() => setUserToDelete(user)}
                          title="Delete User Account"
                        >
                          <Trash2 size={15} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Stacked Cards (Zero Horizontal Scroll) */}
        <div className="sm:hidden divide-y divide-[#F1F5F8]">
          {filteredUsers.length === 0 ? (
            <div className="p-6 text-center">
              <EmptyState
                icon={Users}
                title="No users found"
                description="No registered user account matched your search criteria or role filters."
                action={
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('');
                      setRoleFilter('all');
                      setStatusFilter('all');
                      setCurrentPage(1);
                    }}
                  >
                    Clear Filters
                  </Button>
                }
              />
            </div>
          ) : (
            paginatedUsers.map((user) => (
              <div key={user.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-xl object-cover border border-[#E2E8F0] shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm text-[#102C3A] truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-[#64748B] truncate">
                        {user.email}
                      </p>
                      <span className="font-mono text-[10px] text-[#087F70] font-semibold">
                        {user.id} • {user.role}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={user.status === 'active' ? 'verified' : 'suspicious'}
                    size="sm"
                    showDot
                  >
                    {user.status === 'active' ? 'ACTIVE' : 'DEACTIVATED'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-[#F8FAFC] text-[#64748B]">
                  <span>Joined {formatDate(user.joinedDate)}</span>
                  <span>
                    Scans: <strong className="text-[#087F70]">{user.scansCount || 0}</strong> • Reports: <strong className="text-[#DC4B4B]">{user.reportsCount || 0}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={Eye}
                    onClick={() => setSelectedUser(user)}
                    className="flex-1 justify-center text-xs h-8.5 font-semibold"
                  >
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={Edit}
                    onClick={() => setEditingUser(user)}
                    className="flex-1 justify-center text-xs h-8.5 font-semibold"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-8.5 px-3 ${
                      user.status === 'active'
                        ? 'text-[#DC4B4B] hover:bg-[#FEF2F2] hover:border-[#FECACA]'
                        : 'text-[#16A36A] hover:bg-[#ECFDF5] hover:border-[#A7F3D0]'
                    }`}
                    leftIcon={user.status === 'active' ? Lock : Unlock}
                    onClick={() => setUserToToggleStatus(user)}
                    title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8.5 px-3 text-[#DC4B4B] hover:bg-[#FEF2F2] hover:border-[#FECACA]"
                    onClick={() => setUserToDelete(user)}
                    title="Delete Account"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[#F1F5F8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-[#F8FAFC]">
            <span className="text-[#64748B]">
              Showing <strong>{filteredUsers.length === 0 ? 0 : startIndex + 1}</strong> to{' '}
              <strong>{Math.min(startIndex + ITEMS_PER_PAGE, filteredUsers.length)}</strong> of{' '}
              <strong>{filteredUsers.length}</strong> users
            </span>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="h-8 px-2"
              >
                <ChevronLeft size={16} />
                <span className="hidden sm:inline ml-1">Previous</span>
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCurrentPage(num)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    safePage === num
                      ? 'bg-[#087F70] text-white shadow-xs'
                      : 'bg-white border border-[#CBD5E1] text-[#475569] hover:bg-[#F1F5F8]'
                  }`}
                >
                  {num}
                </button>
              ))}

              <Button
                variant="outline"
                size="sm"
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="h-8 px-2"
              >
                <span className="hidden sm:inline mr-1">Next</span>
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* VIEW USER DETAILS MODAL */}
      {selectedUser && (
        <Modal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          title={`User Dossier: ${selectedUser.name}`}
          description={`ID: ${selectedUser.id} • Registered on ${formatDate(selectedUser.joinedDate)}`}
          footer={
            <div className="flex items-center justify-between w-full">
              <Button
                variant={selectedUser.status === 'active' ? 'danger' : 'secondary'}
                size="sm"
                onClick={() => {
                  const target = selectedUser;
                  setSelectedUser(null);
                  setUserToToggleStatus(target);
                }}
              >
                {selectedUser.status === 'active' ? 'Deactivate User' : 'Activate User'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedUser(null)}
              >
                Close Dossier
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            {/* Header profile card */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-[#087F70]"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-base text-[#102C3A]">
                    {selectedUser.name}
                  </h4>
                  {selectedUser.status === 'active' ? (
                    <Badge variant="verified" size="sm" showDot>
                      ACTIVE
                    </Badge>
                  ) : (
                    <Badge variant="suspicious" size="sm" showDot>
                      DEACTIVATED
                    </Badge>
                  )}
                </div>
                <p className="text-[#64748B] flex items-center gap-1.5">
                  <Mail size={13} />
                  <span>{selectedUser.email}</span>
                </p>
                <p className="text-[#64748B] flex items-center gap-1.5">
                  <Phone size={13} />
                  <span>{selectedUser.phone || '+880 1712-345678'}</span>
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 p-3.5 bg-white rounded-xl border border-[#E2E8F0] text-center">
              <div>
                <span className="text-[#94A3B8] block">Total Scans Run</span>
                <span className="text-base font-extrabold text-[#087F70]">
                  {selectedUser.scansCount || 0}
                </span>
              </div>
              <div>
                <span className="text-[#94A3B8] block">Scams Reported</span>
                <span className="text-base font-extrabold text-[#DC4B4B]">
                  {selectedUser.reportsCount || 0}
                </span>
              </div>
              <div>
                <span className="text-[#94A3B8] block">Account Trust</span>
                <span className="text-base font-extrabold text-[#16A36A]">100%</span>
              </div>
            </div>

            {/* System Info */}
            <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-1.5">
              <span className="font-bold text-[#102C3A] block">Security & Permissions:</span>
              <p className="text-[#64748B]">
                Role Assignment: <strong className="text-[#102C3A]">{selectedUser.role}</strong>
              </p>
              <p className="text-[#64748B]">
                Two-Factor Authentication: <strong className="text-[#16A36A]">Active (SMS Protected)</strong>
              </p>
              <p className="text-[#64748B]">
                Member Since: {formatDate(selectedUser.joinedDate)}
              </p>
            </div>
          </div>
        </Modal>
      )}

      {/* ACTIVATE / DEACTIVATE CONFIRMATION MODAL */}
      {userToToggleStatus && (
        <Modal
          isOpen={!!userToToggleStatus}
          onClose={() => setUserToToggleStatus(null)}
          title={
            userToToggleStatus.status === 'active'
              ? 'Deactivate User Account'
              : 'Reactivate User Account'
          }
          description={`User: ${userToToggleStatus.name} (${userToToggleStatus.email})`}
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUserToToggleStatus(null)}
              >
                Cancel
              </Button>
              <Button
                variant={userToToggleStatus.status === 'active' ? 'danger' : 'secondary'}
                size="sm"
                onClick={handleConfirmToggleStatus}
              >
                {userToToggleStatus.status === 'active'
                  ? 'Confirm Deactivation'
                  : 'Confirm Activation'}
              </Button>
            </div>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-3">
              <AlertTriangle size={20} className="text-[#DC4B4B] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-[#DC4B4B]">
                  {userToToggleStatus.status === 'active'
                    ? 'Security Suspension Warning'
                    : 'Account Reactivation'}
                </p>
                <p className="text-[#64748B] leading-relaxed">
                  {userToToggleStatus.status === 'active'
                    ? 'Deactivating this user will revoke their active sessions and prevent them from submitting circular scans or accessing their history.'
                    : 'Reactivating this user will restore their full access to scan circulars and submit whistleblower reports.'}
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* CREATE NEW USER MODAL */}
      {isAddUserModalOpen && (
        <Modal
          isOpen={isAddUserModalOpen}
          onClose={() => setIsAddUserModalOpen(false)}
          title="Create New User Account"
          description="Provision a new candidate, verified employer, or security analyst account."
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddUserModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleAddUser}
              >
                Create Account
              </Button>
            </div>
          }
        >
          <form onSubmit={handleAddUser} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="e.g. Nusrat Jahan Rimi"
              value={newUserData.name}
              onChange={(e) =>
                setNewUserData({ ...newUserData, name: e.target.value })
              }
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. nusrat@organization.com"
              value={newUserData.email}
              onChange={(e) =>
                setNewUserData({ ...newUserData, email: e.target.value })
              }
              required
            />
            <Input
              label="Phone Number"
              placeholder="e.g. +880 1712-345678"
              value={newUserData.phone}
              onChange={(e) =>
                setNewUserData({ ...newUserData, phone: e.target.value })
              }
            />
            <Select
              label="Account Role & Permission Tier"
              options={[
                { value: 'Candidate / Job Seeker', label: 'Candidate / Job Seeker' },
                { value: 'Verified Employer', label: 'Verified Employer' },
                { value: 'Whistleblower Analyst', label: 'Whistleblower Analyst' },
              ]}
              value={newUserData.role}
              onChange={(e) =>
                setNewUserData({ ...newUserData, role: e.target.value })
              }
            />
          </form>
        </Modal>
      )}

      {/* EDIT USER MODAL */}
      {editingUser && (
        <Modal
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          title={`Edit User: ${editingUser.name}`}
          description={`User ID: ${editingUser.id}`}
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingUser(null)}
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSaveEdit}
              >
                Save Changes
              </Button>
            </div>
          }
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <Input
              label="Full Name"
              value={editingUser.name}
              onChange={(e) =>
                setEditingUser({ ...editingUser, name: e.target.value })
              }
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={editingUser.email}
              onChange={(e) =>
                setEditingUser({ ...editingUser, email: e.target.value })
              }
              required
            />
            <Input
              label="Phone Number"
              value={editingUser.phone || ''}
              onChange={(e) =>
                setEditingUser({ ...editingUser, phone: e.target.value })
              }
            />
            <Select
              label="Account Role"
              options={[
                { value: 'Candidate / Job Seeker', label: 'Candidate / Job Seeker' },
                { value: 'Verified Employer', label: 'Verified Employer' },
                { value: 'Whistleblower Analyst', label: 'Whistleblower Analyst' },
              ]}
              value={editingUser.role}
              onChange={(e) =>
                setEditingUser({ ...editingUser, role: e.target.value })
              }
            />
          </form>
        </Modal>
      )}

      {/* DELETE USER CONFIRMATION MODAL */}
      {userToDelete && (
        <Modal
          isOpen={!!userToDelete}
          onClose={() => setUserToDelete(null)}
          title={`Confirm User Deletion: ${userToDelete.name}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs text-[#182B36]">
            <div className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-2.5 text-[#DC4B4B]">
              <AlertTriangle size={20} className="shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold block">Irreversible Action Warning:</span>
                Are you sure you want to delete user <strong className="font-mono">{userToDelete.id}</strong> ({userToDelete.name})? This will permanently remove their account, scan history, and submitted scam reports.
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
              <p className="text-[11px] text-[#64748B]">User Account Details:</p>
              <p className="font-bold text-[#102C3A]">{userToDelete.name} ({userToDelete.email})</p>
              <p className="text-[11px] text-[#64748B]">Role: {userToDelete.role}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setUserToDelete(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteUser}>
                Permanently Delete User
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminUserManagement;
