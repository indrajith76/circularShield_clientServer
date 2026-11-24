import { useState } from 'react';

export const ReportScam = () => {
  const [category, setCategory] = useState('Fake circular');
  const [detail, setDetail] = useState('');
  const [description, setDescription] = useState('');

  const categories = [
    'Fake circular',
    'Fake company',
    'Phone number',
    'bKash/Nagad number',
    'Website',
    'Application link',
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
          Report a Scam
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          Help others avoid fake recruitment.
        </p>
      </div>

      {/* 2. Two Columns: Reporting Form & History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-5">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-2.5">
              What are you reporting?
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                    category === cat
                      ? 'bg-[#0F172A] text-white shadow-xs'
                      : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Suspicious Detail */}
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
              Suspicious detail
            </label>
            <input
              type="text"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="Number, link or company name"
              className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#182B36] focus:outline-none focus:ring-2 focus:ring-[#087F70]/20 focus:border-[#087F70]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
              Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 rounded-xl border border-[#CBD5E1] text-sm text-[#182B36] focus:outline-none focus:ring-2 focus:ring-[#087F70]/20 focus:border-[#087F70] resize-none"
            />
          </div>

          {/* Upload Evidence Box */}
          <div className="border-2 border-dashed border-[#CBD5E1] rounded-xl p-5 text-center cursor-pointer hover:border-[#087F70] hover:bg-[#F8FAFC] transition-colors">
            <p className="text-xs font-medium text-[#64748B]">
              Upload evidence (screenshot or PDF)
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            className="w-full py-3 px-4 rounded-xl bg-[#087F70] text-white text-sm font-semibold hover:bg-[#066559] transition-colors shadow-xs cursor-pointer text-center"
          >
            Submit Report
          </button>
        </div>

        {/* Right Column: My Report History */}
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#0F172A]">
            My Report History
          </h2>

          <div className="divide-y divide-[#F1F5F8]">
            <div className="py-3.5 first:pt-0 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-[#0F172A]">Fake bKash number</p>
                <p className="text-xs text-[#64748B] mt-0.5">20 Nov</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FFFBEB] text-[#D99A28]">
                Pending
              </span>
            </div>

            <div className="py-3.5 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-[#0F172A]">Fake company page</p>
                <p className="text-xs text-[#64748B] mt-0.5">17 Nov</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#ECFDF5] text-[#16A36A]">
                Reviewed
              </span>
            </div>

            <div className="py-3.5 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-[#0F172A]">Application link</p>
                <p className="text-xs text-[#64748B] mt-0.5">12 Nov</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FEF2F2] text-[#DC4B4B]">
                Rejected
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportScam;

