import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AnalysisHistory = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const historyItems = [
    {
      id: 1,
      title: 'Office Assistant circular',
      meta: 'Text · 22 Nov · Score 87',
      status: 'Suspicious',
      statusColor: 'bg-[#FEF2F2] text-[#DC4B4B]',
    },
    {
      id: 2,
      title: 'Officer – Trainee (Bank)',
      meta: 'Image · 21 Nov · Score 8',
      status: 'Verified',
      statusColor: 'bg-[#ECFDF5] text-[#16A36A]',
    },
    {
      id: 3,
      title: 'Data Entry – Work from Home',
      meta: 'Text · 20 Nov · Score 79',
      status: 'Suspicious',
      statusColor: 'bg-[#FEF2F2] text-[#DC4B4B]',
    },
    {
      id: 4,
      title: 'Sales Executive',
      meta: 'PDF · 18 Nov · Score 45',
      status: 'Unverified',
      statusColor: 'bg-[#FFFBEB] text-[#D99A28]',
    },
    {
      id: 5,
      title: 'Management Trainee',
      meta: 'PDF · 15 Nov · Score 12',
      status: 'Verified',
      statusColor: 'bg-[#ECFDF5] text-[#16A36A]',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#102C3A] tracking-tight">
          Analysis History
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          All your previous analyses.
        </p>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search analysis..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#182B36] focus:outline-none focus:ring-2 focus:ring-[#087F70]/20 focus:border-[#087F70] shadow-xs"
        />

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-xs font-semibold text-[#182B36] hover:bg-[#F8FAFC] shadow-xs cursor-pointer"
          >
            Status: All
          </button>
          <button
            type="button"
            className="px-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-xs font-semibold text-[#182B36] hover:bg-[#F8FAFC] shadow-xs cursor-pointer"
          >
            Date: Last 30 days
          </button>
        </div>
      </div>

      {/* 3. History List Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs divide-y divide-[#F1F5F8]">
        {historyItems.map((item) => (
          <div
            key={item.id}
            className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
          >
            <div>
              <p className="text-sm font-bold text-[#102C3A]">{item.title}</p>
              <p className="text-xs text-[#64748B] mt-0.5">{item.meta}</p>
            </div>

            <span
              className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide ${item.statusColor}`}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>

      {/* 4. Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          type="button"
          onClick={() => navigate('/analysis-result')}
          className="px-5 py-2.5 rounded-xl bg-[#087F70] text-white text-xs font-semibold hover:bg-[#066559] transition-colors shadow-xs cursor-pointer"
        >
          View Details
        </button>

        <button
          type="button"
          onClick={() => window.print()}
          className="px-5 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-[#182B36] text-xs font-semibold hover:bg-[#F8FAFC] transition-colors shadow-xs cursor-pointer"
        >
          Download PDF
        </button>

        <button
          type="button"
          className="px-5 py-2.5 rounded-xl border border-[#FCA5A5] bg-white text-[#DC4B4B] text-xs font-semibold hover:bg-[#FEF2F2] transition-colors shadow-xs cursor-pointer"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default AnalysisHistory;
