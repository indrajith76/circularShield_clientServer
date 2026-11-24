import { useState } from 'react';

export const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');

  const users = [
    {
      id: 'USR-1001',
      name: 'Tanvir Hossain',
      email: 'tanvir.admin@circularshield.com',
      role: 'Admin',
      status: 'Active',
      joined: '12 Jan 2026',
      analysesCount: 142,
    },
    {
      id: 'USR-1002',
      name: 'Nusrat Jahan',
      email: 'nusrat.j@example.com',
      role: 'User',
      status: 'Active',
      joined: '04 Feb 2026',
      analysesCount: 28,
    },
    {
      id: 'USR-1003',
      name: 'Rafiqul Islam',
      email: 'rafiqul.mod@circularshield.com',
      role: 'Moderator',
      status: 'Active',
      joined: '18 Jan 2026',
      analysesCount: 95,
    },
    {
      id: 'USR-1004',
      name: 'Sakib Chowdhury',
      email: 'sakib.scam.test@tempmail.com',
      role: 'User',
      status: 'Suspended',
      joined: '15 Feb 2026',
      analysesCount: 4,
    },
    {
      id: 'USR-1005',
      name: 'Farhana Akter',
      email: 'farhana.akter@gmail.com',
      role: 'User',
      status: 'Active',
      joined: '22 Feb 2026',
      analysesCount: 12,
    },
  ];

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'All' || u.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
            User Management
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Manage registered accounts, assigned roles, and access statuses.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#087F70] text-white text-xs font-semibold hover:bg-[#066559] transition-colors shadow-xs cursor-pointer"
        >
          + Add New User
        </button>
      </div>

      {/* 2. Metric Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <span className="text-xs font-medium text-[#64748B]">Total Users</span>
          <div className="text-2xl font-bold text-[#0F172A] mt-2">1,248</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <span className="text-xs font-medium text-[#64748B]">Active Accounts</span>
          <div className="text-2xl font-bold text-[#0F172A] mt-2">1,180</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <span className="text-xs font-medium text-[#64748B]">Moderators & Admins</span>
          <div className="text-2xl font-bold text-[#0F172A] mt-2">18</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <span className="text-xs font-medium text-[#64748B]">Suspended</span>
          <div className="text-2xl font-bold text-[#DC2626] mt-2">26</div>
        </div>
      </div>

      {/* 3. Search and Role Filters */}
      <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-xs text-[#0F172A] focus:outline-hidden focus:border-[#087F70] focus:bg-white transition-colors"
          />
          <svg
            className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['All', 'Admin', 'Moderator', 'User'].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setSelectedRole(role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedRole === role
                  ? 'bg-[#0F172A] text-white shadow-xs'
                  : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Users Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] font-bold border-b border-[#E2E8F0]">
              <tr>
                <th className="py-3.5 px-6">User</th>
                <th className="py-3.5 px-6">Role</th>
                <th className="py-3.5 px-6">Joined Date</th>
                <th className="py-3.5 px-6">Analyses</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F8]">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-bold text-[#0F172A]">{user.name}</p>
                    <p className="text-[#64748B] text-xs mt-0.5">{user.email}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-semibold text-[11px] ${
                        user.role === 'Admin'
                          ? 'bg-[#EDE9FE] text-[#6D28D9]'
                          : user.role === 'Moderator'
                          ? 'bg-[#E0F2FE] text-[#0369A1]'
                          : 'bg-[#F1F5F9] text-[#475569]'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-[#64748B]">{user.joined}</td>
                  <td className="py-4 px-6 font-semibold text-[#0F172A]">{user.analysesCount}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-semibold text-[11px] ${
                        user.status === 'Active'
                          ? 'bg-[#ECFDF5] text-[#087F70]'
                          : 'bg-[#FEF2F2] text-[#DC2626]'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      type="button"
                      className="px-2.5 py-1 rounded-lg border border-[#CBD5E1] text-[#0F172A] hover:bg-[#F1F5F9] font-medium transition-colors cursor-pointer"
                    >
                      Edit Role
                    </button>
                    <button
                      type="button"
                      className="px-2.5 py-1 rounded-lg text-[#DC2626] hover:bg-[#FEF2F2] font-medium transition-colors cursor-pointer"
                    >
                      {user.status === 'Active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="py-3 px-6 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
          <span>Showing 1 to 5 of 1,248 users</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-1 rounded-lg border border-[#CBD5E1] bg-white text-[#64748B] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
            >
              Previous
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded-lg border border-[#CBD5E1] bg-white text-[#64748B] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
