export const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#102C3A] tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          Platform overview and moderation.
        </p>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <span className="text-xs font-medium text-[#64748B]">Total Users</span>
          <div className="text-2xl font-bold text-[#102C3A] mt-2">—</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <span className="text-xs font-medium text-[#64748B]">Circulars Analyzed</span>
          <div className="text-2xl font-bold text-[#102C3A] mt-2">—</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <span className="text-xs font-medium text-[#64748B]">Pending Reports</span>
          <div className="text-2xl font-bold text-[#102C3A] mt-2">—</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <span className="text-xs font-medium text-[#64748B]">Orgs to Verify</span>
          <div className="text-2xl font-bold text-[#102C3A] mt-2">—</div>
        </div>
      </div>

      {/* 3. Two Queues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Scam Reports Queue */}
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-5">
          <h2 className="text-sm font-bold text-[#102C3A]">
            Scam Reports Queue
          </h2>

          <div className="divide-y divide-[#F1F5F8]">
            <div className="py-3.5 first:pt-0 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-[#102C3A]">Fake bKash number</p>
                <p className="text-xs text-[#64748B] mt-0.5">Evidence: 2 files</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FFFBEB] text-[#D99A28]">
                Pending
              </span>
            </div>

            <div className="py-3.5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-[#102C3A]">Fake company page</p>
                <p className="text-xs text-[#64748B] mt-0.5">Evidence: 1 file</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FFFBEB] text-[#D99A28]">
                Pending
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              className="px-5 py-2 rounded-xl bg-[#087F70] text-white text-xs font-semibold hover:bg-[#066559] transition-colors shadow-xs cursor-pointer"
            >
              Approve
            </button>
            <button
              type="button"
              className="px-5 py-2 rounded-xl bg-[#991B1B] text-white text-xs font-semibold hover:bg-[#7F1D1D] transition-colors shadow-xs cursor-pointer"
            >
              Reject
            </button>
          </div>
        </div>

        {/* Right Column: Organization Verification */}
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-5">
          <h2 className="text-sm font-bold text-[#102C3A]">
            Organization Verification
          </h2>

          <div className="divide-y divide-[#F1F5F8]">
            <div className="py-3.5 first:pt-0 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-[#102C3A]">Demo Trading Co.</p>
                <p className="text-xs text-[#64748B] mt-0.5">Website + email domain submitted</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FFFBEB] text-[#D99A28]">
                Review
              </span>
            </div>

            <div className="py-3.5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-[#102C3A]">Example Tech Ltd.</p>
                <p className="text-xs text-[#64748B] mt-0.5">Career page confirmed</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#ECFDF5] text-[#16A36A]">
                Verified
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              className="px-5 py-2 rounded-xl bg-[#087F70] text-white text-xs font-semibold hover:bg-[#066559] transition-colors shadow-xs cursor-pointer"
            >
              Verify Organization
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
