import { useState } from 'react';

export const AdminDetectionStats = () => {
  const [timeframe, setTimeframe] = useState('30d');

  const topScamTypes = [
    { type: 'Advance bKash / Nagad Fee', count: 248, percentage: 41 },
    { type: 'Fake Government Gazette Circular', count: 162, percentage: 27 },
    { type: 'WhatsApp / Telegram Task Scam', count: 118, percentage: 19 },
    { type: 'Impersonation of Corporate Brand', count: 78, percentage: 13 },
  ];

  const weeklyTrends = [
    { day: 'Mon', total: 64, scams: 9 },
    { day: 'Tue', total: 78, scams: 12 },
    { day: 'Wed', total: 95, scams: 18 },
    { day: 'Thu', total: 82, scams: 14 },
    { day: 'Fri', total: 110, scams: 24 },
    { day: 'Sat', total: 54, scams: 8 },
    { day: 'Sun', total: 42, scams: 5 },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
            Detection Stats & Accuracy Analytics
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            AI model scan metrics, fraud pattern detection rates, and system accuracy logs.
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-[#E2E8F0]/60 rounded-xl w-fit">
          {[
            { key: '7d', label: '7 Days' },
            { key: '30d', label: '30 Days' },
            { key: 'all', label: 'All Time' },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTimeframe(item.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                timeframe === item.key
                  ? 'bg-[#0F172A] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Key Performance Indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <span className="text-xs font-medium text-[#64748B]">Model Accuracy</span>
          <div className="text-2xl font-bold text-[#087F70] mt-2">98.4%</div>
          <p className="text-[11px] text-[#64748B] mt-1">+0.8% from last month</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <span className="text-xs font-medium text-[#64748B]">Scanned Circulars</span>
          <div className="text-2xl font-bold text-[#0F172A] mt-2">4,820</div>
          <p className="text-[11px] text-[#64748B] mt-1">PDF, Image & Text queries</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <span className="text-xs font-medium text-[#DC2626]">Scams Intercepted</span>
          <div className="text-2xl font-bold text-[#DC2626] mt-2">614</div>
          <p className="text-[11px] text-[#64748B] mt-1">12.7% scam ratio detected</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <span className="text-xs font-medium text-[#64748B]">False Positive Rate</span>
          <div className="text-2xl font-bold text-[#0F172A] mt-2">1.2%</div>
          <p className="text-[11px] text-[#087F70] mt-1">Within strict threshold (&lt;2%)</p>
        </div>
      </div>

      {/* 3. Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Weekly Scanning Volume & Scam Trends */}
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0F172A]">
              Weekly Scanning Activity & Flagged Scams
            </h2>
            <span className="text-xs font-medium text-[#64748B]">This Week</span>
          </div>

          <div className="space-y-3 pt-2">
            {weeklyTrends.map((w) => (
              <div key={w.day} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-[#0F172A]">{w.day}</span>
                  <span className="text-[#64748B]">
                    {w.total} scanned • <span className="text-[#DC2626] font-semibold">{w.scams} scams</span>
                  </span>
                </div>
                <div className="w-full bg-[#F1F5F9] rounded-full h-2.5 overflow-hidden flex">
                  <div
                    className="bg-[#087F70] h-full rounded-l-full"
                    style={{ width: `${((w.total - w.scams) / w.total) * 100}%` }}
                  />
                  <div
                    className="bg-[#DC2626] h-full rounded-r-full"
                    style={{ width: `${(w.scams / w.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-2 text-xs text-[#64748B]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#087F70]" />
              <span>Verified / Safe Circulars</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#DC2626]" />
              <span>Flagged Fraud / Suspicious</span>
            </div>
          </div>
        </div>

        {/* Right: Top Detected Fraud Types */}
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0F172A]">
              Top Detected Fraud Categories
            </h2>
            <span className="text-xs font-medium text-[#64748B]">Distribution</span>
          </div>

          <div className="space-y-4 pt-2">
            {topScamTypes.map((item) => (
              <div key={item.type} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-[#0F172A]">{item.type}</span>
                  <span className="font-bold text-[#0F172A]">
                    {item.count} cases ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-[#F1F5F9] rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#0F172A] h-full rounded-full transition-all duration-300"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#475569] space-y-1">
            <p className="font-bold text-[#0F172A]">High-Risk Vector Alert:</p>
            <p>
              Advance bKash/Nagad fees account for over 41% of all flagged circulars. Automated OCR triggers immediately flag any circular containing personal 11-digit wallet numbers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDetectionStats;
