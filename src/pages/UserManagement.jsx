
import { useState, useEffect } from "react";

import { useAuth } from "../context/AuthProvider";

import {
  getAdminUsers,
  createAdminUser,
  updateAdminUserRole,
  updateAdminUserStatus,
} from "../services/adminUserApi";


// =====================================
// Configuration
// =====================================

const PAGE_LIMIT = 10;

const ROLE_FILTERS = [
  { label: "All", value: "all" },
  { label: "Admin", value: "admin" },
  { label: "User", value: "user" },
];

const ROLE_CONFIG = {
  admin: {
    label: "Admin",
    style: "bg-[#EDE9FE] text-[#6D28D9]",
  },

  user: {
    label: "User",
    style: "bg-[#F1F5F9] text-[#475569]",
  },
};

const STATUS_CONFIG = {
  active: {
    label: "Active",
    style: "bg-[#ECFDF5] text-[#087F70]",
  },

  suspended: {
    label: "Suspended",
    style: "bg-[#FEF2F2] text-[#DC2626]",
  },
};

const INITIAL_FORM = {
  name: "",
  email: "",
  password: "",
  role: "user",
};

const INITIAL_STATISTICS = {
  total_users: 0,
  active_accounts: 0,
  admin_accounts: 0,
  suspended_accounts: 0,
};

const INITIAL_PAGINATION = {
  page: 1,
  limit: PAGE_LIMIT,
  total_records: 0,
  total_pages: 1,
  has_next: false,
  has_previous: false,
};


// =====================================
// Format Date
// =====================================

const formatDate = (value) => {
  if (!value) return "—";

  const normalized =
    /(?:Z|[+-]\d{2}:\d{2})$/i.test(value)
      ? value
      : `${value}Z`;

  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};


// =====================================
// Main Component
// =====================================

export const UserManagement = () => {
  const { user: currentUser } = useAuth();


  // ===================================
  // 1. Filter States
  // ===================================

  const [searchTerm, setSearchTerm] = useState("");

  const [debouncedSearch, setDebouncedSearch] =
    useState("");

  const [selectedRole, setSelectedRole] =
    useState("all");

  const [selectedStatus, setSelectedStatus] =
    useState("all");


  // ===================================
  // 2. Data States
  // ===================================

  const [users, setUsers] = useState([]);

  const [statistics, setStatistics] =
    useState(INITIAL_STATISTICS);

  const [pagination, setPagination] =
    useState(INITIAL_PAGINATION);

  const [page, setPage] = useState(1);

  const [refreshKey, setRefreshKey] = useState(0);


  // ===================================
  // 3. Processing States
  // ===================================

  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [modalError, setModalError] = useState("");


  // ===================================
  // 4. Modal States
  // ===================================

  const [modal, setModal] = useState(null);

  const [selectedUser, setSelectedUser] =
    useState(null);

  const [newRole, setNewRole] = useState("user");

  const [newStatus, setNewStatus] =
    useState("suspended");

  const [formData, setFormData] =
    useState(INITIAL_FORM);

  const [showPassword, setShowPassword] =
    useState(false);


  const isBusy = loading || actionLoading;


  // ===================================
  // 5. Debounced Search
  // ===================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);

      setDebouncedSearch(
        searchTerm.trim()
      );
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);


  // ===================================
  // 6. Retrieve Users from Backend
  // ===================================

  useEffect(() => {
    if (!currentUser?.uid) {
      setUsers([]);
      setStatistics(INITIAL_STATISTICS);
      setPagination(INITIAL_PAGINATION);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    let active = true;

    const fetchUsers = async () => {
      setLoading(true);

      setError("");

      try {
        const response = await getAdminUsers(
          {
            search: debouncedSearch,

            role: selectedRole,

            status: selectedStatus,

            page,

            limit: PAGE_LIMIT,
          },
          controller.signal
        );

        if (!active) return;

        setUsers(response.users || []);

        setStatistics(
          response.statistics ||
          INITIAL_STATISTICS
        );

        setPagination(
          response.pagination ||
          INITIAL_PAGINATION
        );

        if (
          response.pagination?.page &&
          response.pagination.page !== page
        ) {
          setPage(response.pagination.page);
        }

      } catch (err) {
        if (
          !active ||
          err.name === "AbortError"
        ) {
          return;
        }

        setUsers([]);

        setError(
          err.message || "Unable to retrieve users."
        );

      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      active = false;

      controller.abort();
    };

  }, [
    currentUser?.uid,
    debouncedSearch,
    selectedRole,
    selectedStatus,
    page,
    refreshKey,
  ]);


  // ===================================
  // 7. Auto Dismiss Success Message
  // ===================================

  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      setSuccess("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [success]);


  // ===================================
  // 8. Refresh Users
  // ===================================

  const handleRefresh = () => {
    setError("");

    setRefreshKey(
      (previous) => previous + 1
    );
  };


  // ===================================
  // 9. Change Role Filter
  // ===================================

  const handleRoleFilter = (role) => {
    setSelectedRole(role);

    setPage(1);
  };


  // ===================================
  // 10. Change Status Filter
  // ===================================

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);

    setPage(1);
  };


  // ===================================
  // 11. Clear Filters
  // ===================================

  const handleClearFilters = () => {
    setSearchTerm("");

    setDebouncedSearch("");

    setSelectedRole("all");

    setSelectedStatus("all");

    setPage(1);
  };


  // ===================================
  // 12. Open Add User Modal
  // ===================================

  const openAddModal = () => {
    setFormData({ ...INITIAL_FORM });

    setShowPassword(false);

    setModalError("");

    setModal("add");
  };


  // ===================================
  // 13. Open Edit Role Modal
  // ===================================

  const openRoleModal = (targetUser) => {
    setSelectedUser(targetUser);

    setNewRole(targetUser.role);

    setModalError("");

    setModal("role");
  };


  // ===================================
  // 14. Open Status Modal
  // ===================================

  const openStatusModal = (targetUser) => {
    setSelectedUser(targetUser);

    setNewStatus(
      targetUser.status === "active"
        ? "suspended"
        : "active"
    );

    setModalError("");

    setModal("status");
  };


  // ===================================
  // 15. Close Modal
  // ===================================

  const closeModal = () => {
    if (actionLoading) return;

    resetModal();
  };


  const resetModal = () => {
    setModal(null);

    setSelectedUser(null);

    setModalError("");

    setFormData({ ...INITIAL_FORM });

    setShowPassword(false);
  };


  // ===================================
  // 16. Handle Form Input
  // ===================================

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  // ===================================
  // 17. Create New User
  // ===================================

  const handleCreateUser = async (event) => {
    event.preventDefault();

    if (actionLoading) return;

    setModalError("");

    if (!formData.name.trim()) {
      setModalError(
        "Please enter the user's name."
      );
      return;
    }

    if (!formData.email.trim()) {
      setModalError(
        "Please enter an email address."
      );
      return;
    }

    if (formData.password.length < 8) {
      setModalError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    setActionLoading(true);

    try {
      const response = await createAdminUser({
        ...formData,

        name: formData.name.trim(),

        email: formData.email.trim(),
      });

      setSuccess(
        response.message ||
        "New user created successfully."
      );

      resetModal();

      handleClearFilters();

      handleRefresh();

    } catch (err) {
      setModalError(
        err.message ||
        "Unable to create user."
      );

    } finally {
      setActionLoading(false);
    }
  };


  // ===================================
  // 18. Update User Role
  // ===================================

  const handleUpdateRole = async (event) => {
    event.preventDefault();

    if (
      !selectedUser ||
      actionLoading
    ) {
      return;
    }

    if (newRole === selectedUser.role) {
      closeModal();
      return;
    }

    setActionLoading(true);

    setModalError("");

    try {
      const response =
        await updateAdminUserRole(
          selectedUser.uid,
          newRole
        );

      setSuccess(
        response.message ||
        "User role updated successfully."
      );

      resetModal();

      handleRefresh();

    } catch (err) {
      setModalError(
        err.message ||
        "Unable to update user role."
      );

    } finally {
      setActionLoading(false);
    }
  };


  // ===================================
  // 19. Suspend or Activate User
  // ===================================

  const handleUpdateStatus = async () => {
    if (
      !selectedUser ||
      actionLoading
    ) {
      return;
    }

    setActionLoading(true);

    setModalError("");

    try {
      const response =
        await updateAdminUserStatus(
          selectedUser.uid,
          newStatus
        );

      setSuccess(
        response.message ||
        "Account status updated."
      );

      resetModal();

      handleRefresh();

    } catch (err) {
      setModalError(
        err.message ||
        "Unable to update account status."
      );

    } finally {
      setActionLoading(false);
    }
  };


  // ===================================
  // 20. Pagination Information
  // ===================================

  const firstRecord =
    pagination.total_records === 0
      ? 0
      : (
          (pagination.page - 1) *
          pagination.limit
        ) + 1;

  const lastRecord = Math.min(
    pagination.page * pagination.limit,
    pagination.total_records
  );


  // ===================================
  // 21. User Interface
  // ===================================

  return (
    <div className="space-y-6">

      {/* Page Header */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
            User Management
          </h1>

          <p className="text-sm text-[#64748B] mt-1">
            Manage registered accounts, assigned
            roles, and access statuses.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">

          <button
            type="button"
            disabled={isBusy}
            onClick={handleRefresh}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#475569] text-xs font-semibold hover:bg-[#F8FAFC] transition-colors cursor-pointer disabled:opacity-50"
          >
            <svg
              className={`w-4 h-4 ${
                loading ? "animate-spin" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v6h6M20 20v-6h-6M20 10A8 8 0 006 6l-2 4m0 4a8 8 0 0014 4l2-4"
              />
            </svg>

            Refresh
          </button>

          <button
            type="button"
            disabled={actionLoading}
            onClick={openAddModal}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#087F70] text-white text-xs font-semibold hover:bg-[#066559] transition-colors shadow-xs cursor-pointer disabled:opacity-50"
          >
            + Add New User
          </button>

        </div>

      </div>


      {/* Success Message */}

      {success && (
        <div
          role="status"
          className="flex items-center justify-between gap-3 rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] p-4 text-sm text-[#087F70]"
        >
          <span>{success}</span>

          <button
            type="button"
            onClick={() => setSuccess("")}
            className="font-bold cursor-pointer"
            aria-label="Dismiss success message"
          >
            ×
          </button>
        </div>
      )}


      {/* Metric Overview Cards */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <MetricCard
          title="Total Users"
          value={statistics.total_users}
          loading={loading}
          unavailable={Boolean(error)}
        />

        <MetricCard
          title="Active Accounts"
          value={statistics.active_accounts}
          loading={loading}
          unavailable={Boolean(error)}
          color="#087F70"
        />

        <MetricCard
          title="Admin Accounts"
          value={statistics.admin_accounts}
          loading={loading}
          unavailable={Boolean(error)}
          color="#6D28D9"
        />

        <MetricCard
          title="Suspended"
          value={statistics.suspended_accounts}
          loading={loading}
          unavailable={Boolean(error)}
          color="#DC2626"
        />

      </div>


      {/* Search and Filters */}

      <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-4">

        {/* Search Input */}

        <div className="relative w-full xl:w-80">

          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            maxLength={100}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-xs text-[#0F172A] focus:outline-none focus:border-[#087F70] focus:bg-white transition-colors"
          />

          <svg
            className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

        </div>


        <div className="flex flex-wrap items-center gap-3">

          {/* Role Filters */}

          <div className="flex items-center gap-2">

            {ROLE_FILTERS.map((role) => (
              <button
                key={role.value}
                type="button"
                onClick={() =>
                  handleRoleFilter(role.value)
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedRole === role.value
                    ? "bg-[#0F172A] text-white shadow-xs"
                    : "bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                {role.label}
              </button>
            ))}

          </div>


          {/* Status Filter */}

          <select
            aria-label="Filter by account status"
            value={selectedStatus}
            onChange={(event) =>
              handleStatusFilter(
                event.target.value
              )
            }
            className="px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-xs font-medium text-[#475569] focus:outline-none focus:border-[#087F70]"
          >
            <option value="all">
              All Statuses
            </option>

            <option value="active">
              Active
            </option>

            <option value="suspended">
              Suspended
            </option>
          </select>


          {/* Clear Filters */}

          <button
            type="button"
            onClick={handleClearFilters}
            className="text-xs font-semibold text-[#087F70] hover:underline cursor-pointer"
          >
            Clear
          </button>

        </div>

      </div>


      {/* Users Table */}

      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">

        {loading ? (

          <TableSkeleton />

        ) : error ? (

          <div className="p-12 text-center space-y-3">

            <p className="text-sm font-bold text-red-600">
              Unable to load users
            </p>

            <p className="text-xs text-[#64748B]">
              {error}
            </p>

            <button
              type="button"
              onClick={handleRefresh}
              className="px-4 py-2 rounded-xl bg-[#087F70] text-white text-xs font-semibold cursor-pointer"
            >
              Try Again
            </button>

          </div>

        ) : (

          <>

            <div className="overflow-x-auto">

              <table className="w-full text-left text-xs whitespace-nowrap">

                <thead className="bg-[#F8FAFC] text-[#64748B] font-bold border-b border-[#E2E8F0]">

                  <tr>
                    <th className="py-3.5 px-6">
                      User
                    </th>

                    <th className="py-3.5 px-6">
                      Role
                    </th>

                    <th className="py-3.5 px-6">
                      Joined Date
                    </th>

                    <th className="py-3.5 px-6">
                      Analyses
                    </th>

                    <th className="py-3.5 px-6">
                      Status
                    </th>

                    <th className="py-3.5 px-6 text-right">
                      Actions
                    </th>
                  </tr>

                </thead>


                <tbody className="divide-y divide-[#F1F5F8]">

                  {users.map((user) => {
                    const isCurrentUser =
                      user.uid === currentUser?.uid;

                    const isProtected =
                      isCurrentUser ||
                      user.role === "admin";

                    const roleConfig =
                      ROLE_CONFIG[user.role];

                    const statusConfig =
                      STATUS_CONFIG[user.status];

                    return (
                      <tr
                        key={user.uid}
                        className="hover:bg-[#F8FAFC] transition-colors"
                      >

                        {/* User Information */}

                        <td className="py-4 px-6">

                          <div className="flex items-center gap-3">

                            <div className="w-9 h-9 rounded-full bg-[#E6F4F1] text-[#087F70] flex items-center justify-center font-bold text-sm shrink-0">

                              {(user.name || user.email || "U")
                                .charAt(0)
                                .toUpperCase()}

                            </div>

                            <div>

                              <p className="font-bold text-[#0F172A]">

                                {user.name || "Unnamed User"}

                                {isCurrentUser && (
                                  <span className="ml-2 text-[10px] text-[#087F70]">
                                    (You)
                                  </span>
                                )}

                              </p>

                              <p className="text-[#64748B] text-xs mt-0.5">
                                {user.email}
                              </p>

                            </div>

                          </div>

                        </td>


                        {/* User Role */}

                        <td className="py-4 px-6">

                          <span
                            className={`px-2.5 py-0.5 rounded-full font-semibold text-[11px] ${
                              roleConfig?.style ||
                              "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {roleConfig?.label ||
                              user.role ||
                              "Unknown"}
                          </span>

                        </td>


                        {/* Joined Date */}

                        <td className="py-4 px-6 text-[#64748B]">

                          {formatDate(
                            user.created_at
                          )}

                        </td>


                        {/* Analyses Count */}

                        <td className="py-4 px-6 font-semibold text-[#0F172A]">

                          {Number(
                            user.analyses_count || 0
                          ).toLocaleString()}

                        </td>


                        {/* Account Status */}

                        <td className="py-4 px-6">

                          <span
                            className={`px-2.5 py-0.5 rounded-full font-semibold text-[11px] ${
                              statusConfig?.style ||
                              "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {statusConfig?.label ||
                              "Unknown"}
                          </span>

                        </td>


                        {/* Actions */}

                        <td className="py-4 px-6 text-right">

                          {isProtected ? (

                            <span className="text-[11px] text-[#94A3B8]">
                              Protected Account
                            </span>

                          ) : (

                            <div className="flex items-center justify-end gap-2">

                              <button
                                type="button"
                                disabled={
                                  actionLoading ||
                                  user.status !== "active"
                                }
                                onClick={() =>
                                  openRoleModal(user)
                                }
                                className="px-2.5 py-1.5 rounded-lg border border-[#CBD5E1] text-[#0F172A] hover:bg-[#F1F5F9] font-medium transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                Edit Role
                              </button>

                              <button
                                type="button"
                                disabled={actionLoading}
                                onClick={() =>
                                  openStatusModal(user)
                                }
                                className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50 ${
                                  user.status === "active"
                                    ? "text-[#DC2626] hover:bg-[#FEF2F2]"
                                    : "text-[#087F70] hover:bg-[#ECFDF5]"
                                }`}
                              >
                                {user.status === "active"
                                  ? "Suspend"
                                  : "Activate"}
                              </button>

                            </div>

                          )}

                        </td>

                      </tr>
                    );
                  })}


                  {/* Empty State */}

                  {users.length === 0 && (
                    <tr>

                      <td
                        colSpan={6}
                        className="py-16 px-6 text-center"
                      >

                        <p className="text-sm font-semibold text-[#0F172A]">
                          No users found
                        </p>

                        <p className="text-xs text-[#64748B] mt-2">
                          Try changing your search
                          or filter options.
                        </p>

                        <button
                          type="button"
                          onClick={handleClearFilters}
                          className="mt-4 text-xs font-semibold text-[#087F70] hover:underline cursor-pointer"
                        >
                          Clear Filters
                        </button>

                      </td>

                    </tr>
                  )}

                </tbody>

              </table>

            </div>


            {/* Pagination */}

            <div className="py-3 px-6 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 text-xs text-[#64748B]">

              <span>
                Showing {firstRecord} to {lastRecord} of{" "}
                {pagination.total_records.toLocaleString()} users
              </span>

              <div className="flex items-center gap-2">

                <button
                  type="button"
                  disabled={
                    !pagination.has_previous ||
                    isBusy
                  }
                  onClick={() =>
                    setPage((previous) =>
                      Math.max(1, previous - 1)
                    )
                  }
                  className="px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white text-[#64748B] hover:bg-[#F1F5F9] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <span className="px-2 font-medium">
                  {pagination.page} /{" "}
                  {pagination.total_pages}
                </span>

                <button
                  type="button"
                  disabled={
                    !pagination.has_next ||
                    isBusy
                  }
                  onClick={() =>
                    setPage(
                      (previous) => previous + 1
                    )
                  }
                  className="px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white text-[#64748B] hover:bg-[#F1F5F9] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>

              </div>

            </div>

          </>

        )}

      </div>


      {/* ================================= */}
      {/* Add New User Modal                */}
      {/* ================================= */}

      {modal === "add" && (

        <Modal
          title="Add New User"
          description="Create a new CircularShield account."
          onClose={closeModal}
          busy={actionLoading}
        >

          <form
            onSubmit={handleCreateUser}
            className="space-y-4"
          >

            <ModalError message={modalError} />


            {/* Full Name */}

            <div>

              <label
                htmlFor="new-user-name"
                className="block text-xs font-semibold text-[#475569] mb-2"
              >
                Full Name
              </label>

              <input
                id="new-user-name"
                type="text"
                name="name"
                required
                maxLength={100}
                disabled={actionLoading}
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter full name"
                className={inputClass}
              />

            </div>


            {/* Email Address */}

            <div>

              <label
                htmlFor="new-user-email"
                className="block text-xs font-semibold text-[#475569] mb-2"
              >
                Email Address
              </label>

              <input
                id="new-user-email"
                type="email"
                name="email"
                required
                maxLength={254}
                disabled={actionLoading}
                value={formData.email}
                onChange={handleInputChange}
                placeholder="user@example.com"
                className={inputClass}
              />

            </div>


            {/* Password */}

            <div>

              <label
                htmlFor="new-user-password"
                className="block text-xs font-semibold text-[#475569] mb-2"
              >
                Initial Password
              </label>

              <div className="relative">

                <input
                  id="new-user-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  required
                  minLength={8}
                  maxLength={128}
                  autoComplete="new-password"
                  disabled={actionLoading}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Minimum 8 characters"
                  className={`${inputClass} pr-16`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#087F70] cursor-pointer"
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

              <p className="text-[11px] text-[#64748B] mt-2">
                Share the initial password securely
                and ask the user to change it after login.
              </p>

            </div>


            {/* Account Role */}

            <div>

              <label
                htmlFor="new-user-role"
                className="block text-xs font-semibold text-[#475569] mb-2"
              >
                Account Role
              </label>

              <select
                id="new-user-role"
                name="role"
                disabled={actionLoading}
                value={formData.role}
                onChange={handleInputChange}
                className={inputClass}
              >
                <option value="user">
                  User
                </option>

                <option value="admin">
                  Administrator
                </option>
              </select>

            </div>


            {formData.role === "admin" && (
              <div className="p-3 rounded-xl bg-[#FFFBEB] border border-amber-200 text-xs text-amber-800">
                Administrator accounts have access
                to platform management and user data.
                Only assign this role to trusted staff.
              </div>
            )}


            {/* Modal Buttons */}

            <div className="flex items-center justify-end gap-3 pt-3">

              <button
                type="button"
                disabled={actionLoading}
                onClick={closeModal}
                className={cancelButtonClass}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={actionLoading}
                className={primaryButtonClass}
              >
                {actionLoading
                  ? "Creating User..."
                  : "Create User"}
              </button>

            </div>

          </form>

        </Modal>

      )}


      {/* ================================= */}
      {/* Edit Role Modal                   */}
      {/* ================================= */}

      {modal === "role" && selectedUser && (

        <Modal
          title="Edit User Role"
          description="Update the permissions of this account."
          onClose={closeModal}
          busy={actionLoading}
        >

          <form
            onSubmit={handleUpdateRole}
            className="space-y-4"
          >

            <ModalError message={modalError} />

            <UserSummary user={selectedUser} />

            <div>

              <label
                htmlFor="edit-user-role"
                className="block text-xs font-semibold text-[#475569] mb-2"
              >
                Select New Role
              </label>

              <select
                id="edit-user-role"
                value={newRole}
                disabled={actionLoading}
                onChange={(event) =>
                  setNewRole(event.target.value)
                }
                className={inputClass}
              >
                <option value="user">
                  User
                </option>

                <option value="admin">
                  Administrator
                </option>
              </select>

            </div>

            {newRole === "admin" && (
              <div className="p-3 rounded-xl bg-[#FFFBEB] border border-amber-200 text-xs text-amber-800">
                This will grant full administrator
                access. Existing administrator accounts
                are protected from role changes in this panel.
              </div>
            )}

            <div className="flex justify-end gap-3 pt-3">

              <button
                type="button"
                disabled={actionLoading}
                onClick={closeModal}
                className={cancelButtonClass}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  actionLoading ||
                  newRole === selectedUser.role
                }
                className={primaryButtonClass}
              >
                {actionLoading
                  ? "Updating..."
                  : "Update Role"}
              </button>

            </div>

          </form>

        </Modal>

      )}


      {/* ================================= */}
      {/* Suspend / Activate Modal          */}
      {/* ================================= */}

      {modal === "status" && selectedUser && (

        <Modal
          title={
            newStatus === "suspended"
              ? "Suspend Account"
              : "Activate Account"
          }
          description="Confirm the account status change."
          onClose={closeModal}
          busy={actionLoading}
        >

          <div className="space-y-4">

            <ModalError message={modalError} />

            <UserSummary user={selectedUser} />

            <div
              className={`rounded-xl border p-4 text-xs leading-relaxed ${
                newStatus === "suspended"
                  ? "bg-[#FEF2F2] border-red-200 text-red-700"
                  : "bg-[#ECFDF5] border-[#A7F3D0] text-[#087F70]"
              }`}
            >

              {newStatus === "suspended"
                ? "This user will no longer be able to log in or access protected CircularShield features. Their existing analysis history will not be deleted."
                : "This user will regain access to CircularShield and will be able to log in again."}

            </div>

            <div className="flex justify-end gap-3 pt-3">

              <button
                type="button"
                disabled={actionLoading}
                onClick={closeModal}
                className={cancelButtonClass}
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={handleUpdateStatus}
                className={`px-4 py-2.5 rounded-xl text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 ${
                  newStatus === "suspended"
                    ? "bg-[#DC2626] hover:bg-[#B91C1C]"
                    : "bg-[#087F70] hover:bg-[#066559]"
                }`}
              >

                {actionLoading
                  ? "Updating..."
                  : newStatus === "suspended"
                  ? "Suspend Account"
                  : "Activate Account"}

              </button>

            </div>

          </div>

        </Modal>

      )}

    </div>
  );
};


// =====================================
// Shared CSS Classes
// =====================================

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-sm text-[#0F172A] focus:outline-none focus:border-[#087F70] focus:bg-white transition-colors disabled:opacity-50";

const cancelButtonClass =
  "px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors cursor-pointer disabled:opacity-50";

const primaryButtonClass =
  "px-4 py-2.5 rounded-xl bg-[#087F70] text-white text-xs font-semibold hover:bg-[#066559] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";


// =====================================
// Metric Card Component
// =====================================

const MetricCard = ({
  title,
  value,
  loading,
  unavailable,
  color = "#0F172A",
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">

      <span className="text-xs font-medium text-[#64748B]">
        {title}
      </span>

      {loading ? (

        <div className="mt-3 w-20 h-7 rounded-lg bg-[#E2E8F0] animate-pulse" />

      ) : (

        <div
          className="text-2xl font-bold mt-2"
          style={{ color }}
        >
          {unavailable
            ? "—"
            : Number(value || 0).toLocaleString()}
        </div>

      )}

    </div>
  );
};


// =====================================
// Modal Component
// =====================================

const Modal = ({
  title,
  description,
  children,
  onClose,
  busy,
}) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === "Escape" &&
        !busy
      ) {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [busy, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-2xl border border-[#E2E8F0] shadow-xl p-6"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        <div className="flex items-start justify-between gap-4 mb-5">

          <div>

            <h2 className="text-lg font-bold text-[#0F172A]">
              {title}
            </h2>

            <p className="text-xs text-[#64748B] mt-1">
              {description}
            </p>

          </div>

          <button
            type="button"
            disabled={busy}
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer disabled:opacity-50"
          >
            ×
          </button>

        </div>

        {children}

      </div>

    </div>
  );
};


// =====================================
// Modal Error Component
// =====================================

const ModalError = ({ message }) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700"
    >
      {message}
    </div>
  );
};


// =====================================
// User Summary Component
// =====================================

const UserSummary = ({ user }) => {
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">

      <p className="text-sm font-bold text-[#0F172A]">
        {user.name}
      </p>

      <p className="text-xs text-[#64748B] mt-1">
        {user.email}
      </p>

      <p className="text-xs text-[#64748B] mt-2">
        Current role:{" "}
        <span className="font-semibold capitalize text-[#0F172A]">
          {user.role}
        </span>
      </p>

    </div>
  );
};


// =====================================
// Table Loading Skeleton
// =====================================

const TableSkeleton = () => {
  return (
    <div className="p-6 space-y-5 animate-pulse">

      <div className="h-5 w-36 bg-[#E2E8F0] rounded-lg" />

      {Array.from({ length: 5 }).map(
        (_, index) => (

          <div
            key={index}
            className="flex items-center justify-between gap-4 border-b border-[#F1F5F8] pb-4"
          >

            <div className="flex items-center gap-3">

              <div className="w-9 h-9 rounded-full bg-[#E2E8F0]" />

              <div className="space-y-2">

                <div className="h-3 w-28 bg-[#E2E8F0] rounded" />

                <div className="h-3 w-40 bg-[#F1F5F9] rounded" />

              </div>

            </div>

            <div className="hidden sm:block h-5 w-16 bg-[#E2E8F0] rounded-full" />

            <div className="hidden md:block h-3 w-20 bg-[#E2E8F0] rounded" />

            <div className="h-5 w-16 bg-[#E2E8F0] rounded-full" />

          </div>

        )
      )}

    </div>
  );
};


export default UserManagement;
