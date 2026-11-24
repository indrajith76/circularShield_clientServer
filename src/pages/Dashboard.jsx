import { Link } from 'react-router-dom';

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* 1. Header with greeting and quick CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
            স্বাগতম / Welcome back
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Check a circular before you apply.
          </p>
        </div>

        <Link
          to="/analyze"
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#087F70] text-white text-sm font-semibold hover:bg-[#066559] transition-colors shadow-xs"
        >
          Quick Analyze
        </Link>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <span className="text-xs font-medium text-[#64748B]">Total Analyzed</span>
          <div className="text-3xl font-extrabold text-[#0F172A] mt-2">48</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <span className="text-xs font-medium text-[#64748B]">Verified</span>
          <div className="text-3xl font-extrabold text-[#16A36A] mt-2">19</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <span className="text-xs font-medium text-[#64748B]">Suspicious</span>
          <div className="text-3xl font-extrabold text-[#DC4B4B] mt-2">21</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <span className="text-xs font-medium text-[#64748B]">Unverified</span>
          <div className="text-3xl font-extrabold text-[#D99A28] mt-2">8</div>
        </div>
      </div>

      {/* 3. Main Content: History & Scam Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Analysis History & Mini Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-6">
          <h2 className="text-base font-bold text-[#0F172A]">
            Recent Analysis History
          </h2>

          <div className="divide-y divide-[#F1F5F8]">
            <div className="py-3.5 flex items-center justify-between gap-4 first:pt-0">
              <div>
                <p className="text-sm font-semibold text-[#0F172A]">Officer – Trainee (Bank)</p>
                <p className="text-xs text-[#64748B] mt-0.5">Image · 21 Nov</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide bg-[#ECFDF5] text-[#16A36A]">
                VERIFIED
              </span>
            </div>

            <div className="py-3.5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#0F172A]">Data Entry – Work from Home</p>
                <p className="text-xs text-[#64748B] mt-0.5">Text · 20 Nov</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide bg-[#FEF2F2] text-[#DC4B4B]">
                SUSPICIOUS
              </span>
            </div>

            <div className="py-3.5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#0F172A]">Sales Executive</p>
                <p className="text-xs text-[#64748B] mt-0.5">PDF · 18 Nov</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide bg-[#FFFBEB] text-[#D99A28]">
                UNVERIFIED
              </span>
            </div>
          </div>

          {/* Mini Analysis Statistics Bar Graphic */}
          <div className="pt-4 border-t border-[#F1F5F8]">
            <h3 className="text-xs font-bold text-[#0F172A] mb-4">
              Analysis Statistics
            </h3>
            <div className="flex items-end gap-3 h-24">
              <div className="w-10 bg-[#16A36A] rounded-t-md h-16" title="Verified: 19" />
              <div className="w-10 bg-[#991B1B] rounded-t-md h-24" title="Suspicious: 21" />
              <div className="w-10 bg-[#A16207] rounded-t-md h-10" title="Unverified: 8" />
            </div>
          </div>
        </div>

        {/* Right Column: Recent Scam Alerts */}
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#0F172A]">
            Recent Scam Alerts
          </h2>

          <div className="space-y-4 text-xs text-[#334155] leading-relaxed">
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <p>Fake bank circular asking for a registration fee via personal bKash.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <p>Shortened application links reported in Facebook groups.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <p>“১০০% চাকরি নিশ্চিত” guarantee posts rising this week.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

