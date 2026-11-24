import { useState } from 'react';

export const AdminScamReports = () => {
  const [activeTab, setActiveTab] = useState('pending');

  const reports = [
    {
      id: 'REP-2026-081',
      title: 'Fake bKash processing fee demanded',
      claimedOrg: 'Standard Chartered Bank (Impersonation)',
      reporter: 'Anonymous User',
      date: '24 Feb 2026',
      status: 'Pending',
      category: 'Payment Fraud',
      evidenceFiles: 2,
      description:
        'Applicant received an SMS stating they were selected for Trainee Officer and must send BDT 1,200 via personal bKash number to confirm medical test.',
    },
    {
      id: 'REP-2026-080',
      title: 'Fake company Facebook page & interview form',
      claimedOrg: 'Apex Footwear Ltd. (Counterfeit)',
      reporter: 'Kamal Uddin',
      date: '23 Feb 2026',
      status: 'Pending',
      category: 'Fake Organization',
      evidenceFiles: 1,
      description:
        'Fake Facebook page running sponsored ads offering remote data entry jobs with 45,000 BDT salary. Asks for national ID and photo.',
    },
    {
      id: 'REP-2026-079',
      title: 'WhatsApp typing task security deposit scam',
      claimedOrg: 'Global Freelance Hub',
      reporter: 'Sharmin Sultana',
      date: '22 Feb 2026',
      status: 'Confirmed',
      category: 'Advance Fee',
      evidenceFiles: 3,
      description:
        'Demanded 500 BDT deposit for typing raw PDF files into MS Word, then blocked reporter once money was sent.',
    },
    {
      id: 'REP-2026-078',
      title: 'Government health recruitment fraud notice',
      claimedOrg: 'DGHS (Forged Directorate Seal)',
      reporter: 'Tareq Rahman',
      date: '21 Feb 2026',
      status: 'Confirmed',
      category: 'Forged Document',
      evidenceFiles: 4,
      description:
        'Fake gazette circular circulating on Facebook with forged signatures of ministry officials and unofficial Gmail contact.',
    },
  ];

  const filteredReports =
    activeTab === 'all'
      ? reports
      : reports.filter((r) => r.status.toLowerCase() === activeTab.toLowerCase());

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
          Scam Reports Queue
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          Review, investigate, and moderate community-submitted fraud reports.
        </p>
      </div>

      {/* 2. Metric Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <span className="text-xs font-medium text-[#64748B]">Total Reports</span>
          <div className="text-2xl font-bold text-[#0F172A] mt-2">156</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <span className="text-xs font-medium text-[#D99A28]">Pending Review</span>
          <div className="text-2xl font-bold text-[#D99A28] mt-2">18</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <span className="text-xs font-medium text-[#087F70]">Confirmed Scams</span>
          <div className="text-2xl font-bold text-[#087F70] mt-2">112</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <span className="text-xs font-medium text-[#64748B]">Dismissed / False</span>
          <div className="text-2xl font-bold text-[#64748B] mt-2">26</div>
        </div>
      </div>

      {/* 3. Filter Tabs */}
      <div className="flex items-center gap-2 p-1 bg-[#E2E8F0]/60 rounded-xl w-fit">
        {[
          { key: 'all', label: 'All Reports (156)' },
          { key: 'pending', label: 'Pending Review (18)' },
          { key: 'confirmed', label: 'Confirmed Scams (112)' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === tab.key
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-4 hover:border-[#CBD5E1] transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#F1F5F8] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#64748B]">{report.id}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      report.status === 'Pending'
                        ? 'bg-[#FFFBEB] text-[#D99A28]'
                        : 'bg-[#ECFDF5] text-[#087F70]'
                    }`}
                  >
                    {report.status}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#F1F5F9] text-[#475569]">
                    {report.category}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#0F172A] mt-1.5">
                  {report.title}
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Claimed Target: <span className="font-semibold text-[#0F172A]">{report.claimedOrg}</span> • Reporter: {report.reporter} • Date: {report.date}
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-[#087F70] text-white text-xs font-semibold hover:bg-[#066559] transition-colors shadow-xs cursor-pointer"
                >
                  Approve as Scam
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-[#991B1B] text-white text-xs font-semibold hover:bg-[#7F1D1D] transition-colors shadow-xs cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              {report.description}
            </p>

            <div className="flex items-center justify-between text-xs text-[#64748B] pt-2">
              <span className="inline-flex items-center gap-1.5 font-medium text-[#087F70]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                {report.evidenceFiles} Evidence File(s) Attached
              </span>
              <button
                type="button"
                className="text-xs font-bold text-[#0F172A] hover:underline cursor-pointer"
              >
                View Full Audit Details →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminScamReports;
