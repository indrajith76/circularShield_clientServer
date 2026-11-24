import { useState } from 'react';

export const AdminOrganizations = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const pendingOrgs = [
    {
      id: 'ORG-PENDING-01',
      name: 'Demo Trading Co.',
      website: 'www.demotradingbd.com',
      emailDomain: '@demotradingbd.com',
      careerPage: 'www.demotradingbd.com/careers',
      submittedDocs: 'Trade License, Domain WHOIS record',
      submittedDate: '23 Feb 2026',
    },
    {
      id: 'ORG-PENDING-02',
      name: 'NextGen Agro Tech',
      website: 'www.nextgenagrotech.org',
      emailDomain: '@nextgenagrotech.org',
      careerPage: 'www.nextgenagrotech.org/jobs',
      submittedDocs: 'Incorporation Certificate, HR Authorization',
      submittedDate: '22 Feb 2026',
    },
  ];

  const directory = [
    {
      id: 'ORG-101',
      name: 'BRAC Bangladesh',
      category: 'NGO / Non-Profit',
      website: 'www.brac.net',
      careerPage: 'careers.brac.net',
      trustScore: '99/100',
      status: 'Verified',
    },
    {
      id: 'ORG-102',
      name: 'Grameenphone Ltd.',
      category: 'Telecommunications',
      website: 'www.grameenphone.com',
      careerPage: 'grameenphone.com/about/careers',
      trustScore: '98/100',
      status: 'Verified',
    },
    {
      id: 'ORG-103',
      name: 'Apex Footwear Ltd.',
      category: 'Manufacturing / Retail',
      website: 'www.apexfootwearltd.com',
      careerPage: 'apexfootwearltd.com/career',
      trustScore: '96/100',
      status: 'Verified',
    },
    {
      id: 'ORG-104',
      name: 'Quick Money Earn Hub',
      category: 'Unverified Entity',
      website: 'earnmoneyfastbd.xyz',
      careerPage: 'None (Telegram Group)',
      trustScore: '12/100',
      status: 'Blacklisted',
    },
  ];

  const filteredDirectory = directory.filter((org) =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
            Organization Verification & Directory
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Validate employer credentials, review official domains, and manage trusted companies.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#087F70] text-white text-xs font-semibold hover:bg-[#066559] transition-colors shadow-xs cursor-pointer"
        >
          + Add Verified Organization
        </button>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <span className="text-xs font-medium text-[#64748B]">Total Organizations</span>
          <div className="text-2xl font-bold text-[#0F172A] mt-2">320</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <span className="text-xs font-medium text-[#087F70]">Verified Official</span>
          <div className="text-2xl font-bold text-[#087F70] mt-2">285</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <span className="text-xs font-medium text-[#D99A28]">Pending Verification</span>
          <div className="text-2xl font-bold text-[#D99A28] mt-2">24</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <span className="text-xs font-medium text-[#DC2626]">Blacklisted / Imposters</span>
          <div className="text-2xl font-bold text-[#DC2626] mt-2">11</div>
        </div>
      </div>

      {/* 3. Verification Queue */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#F1F5F8] pb-4">
          <div>
            <h2 className="text-sm font-bold text-[#0F172A]">
              Pending Verification Requests
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Companies waiting for official green shield badge verification
            </p>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FFFBEB] text-[#D99A28]">
            2 New Requests
          </span>
        </div>

        <div className="space-y-4">
          {pendingOrgs.map((org) => (
            <div
              key={org.id}
              className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#0F172A]">{org.name}</h3>
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFFBEB] text-[#D99A28]">
                    Awaiting Review
                  </span>
                </div>
                <p className="text-xs text-[#64748B]">
                  Domain: <span className="font-medium text-[#0F172A]">{org.website}</span> • Email: <span className="font-medium text-[#0F172A]">{org.emailDomain}</span>
                </p>
                <p className="text-xs text-[#64748B]">
                  Evidence: {org.submittedDocs} • Submitted: {org.submittedDate}
                </p>
              </div>

              <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-[#087F70] text-white text-xs font-semibold hover:bg-[#066559] transition-colors shadow-xs cursor-pointer"
                >
                  Verify & Approve
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-white border border-[#CBD5E1] text-[#64748B] hover:text-[#DC2626] text-xs font-semibold hover:bg-[#FEF2F2] transition-colors cursor-pointer"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Verified Directory Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-sm font-bold text-[#0F172A]">Organization Directory</h2>
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Filter organizations..."
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
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] font-bold border-b border-[#E2E8F0]">
              <tr>
                <th className="py-3.5 px-6">Organization</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Official Career URL</th>
                <th className="py-3.5 px-6">Trust Score</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F8]">
              {filteredDirectory.map((org) => (
                <tr key={org.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-bold text-[#0F172A]">{org.name}</p>
                    <p className="text-[#64748B] text-xs mt-0.5">{org.website}</p>
                  </td>
                  <td className="py-4 px-6 text-[#64748B]">{org.category}</td>
                  <td className="py-4 px-6 text-[#087F70] font-medium">{org.careerPage}</td>
                  <td className="py-4 px-6 font-bold text-[#0F172A]">{org.trustScore}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-semibold text-[11px] ${
                        org.status === 'Verified'
                          ? 'bg-[#ECFDF5] text-[#087F70]'
                          : 'bg-[#FEF2F2] text-[#DC2626]'
                      }`}
                    >
                      {org.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      type="button"
                      className="px-2.5 py-1 rounded-lg border border-[#CBD5E1] text-[#0F172A] hover:bg-[#F1F5F9] font-medium transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="px-2.5 py-1 rounded-lg text-[#DC2626] hover:bg-[#FEF2F2] font-medium transition-colors cursor-pointer"
                    >
                      Flag
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrganizations;
