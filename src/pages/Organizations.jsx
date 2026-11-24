import { useState } from 'react';

export const Organizations = () => {
  const [search, setSearch] = useState('');
  const [selectedOrg, setSelectedOrg] = useState({
    name: 'Sample Bank Ltd.',
    status: 'Verified',
    statusColor: 'bg-[#ECFDF5] text-[#16A36A]',
    website: 'samplebank.example',
    careerPage: 'samplebank.example/careers',
    emailDomain: '@samplebank.example',
  });

  const organizations = [
    {
      name: 'Sample Bank Ltd.',
      subtitle: 'samplebank.example · Career page listed',
      status: 'Verified',
      statusColor: 'bg-[#ECFDF5] text-[#16A36A]',
      website: 'samplebank.example',
      careerPage: 'samplebank.example/careers',
      emailDomain: '@samplebank.example',
    },
    {
      name: 'Example Tech Ltd.',
      subtitle: 'exampletech.example · Email domain listed',
      status: 'Verified',
      statusColor: 'bg-[#ECFDF5] text-[#16A36A]',
      website: 'exampletech.example',
      careerPage: 'exampletech.example/careers',
      emailDomain: '@exampletech.example',
    },
    {
      name: 'Demo Trading Co.',
      subtitle: 'No official career page on record',
      status: 'Pending',
      statusColor: 'bg-[#FFFBEB] text-[#D99A28]',
      website: 'demotrading.example',
      careerPage: 'None on record',
      emailDomain: '@demotrading.example',
    },
    {
      name: 'Fake-Look Agency',
      subtitle: 'Name mismatch reported',
      status: 'Flagged',
      statusColor: 'bg-[#FEF2F2] text-[#DC4B4B]',
      website: 'fakelook.agency',
      careerPage: 'Unverified link',
      emailDomain: 'gmail.com',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#102C3A] tracking-tight">
          Verified Organizations
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          Search the directory of official employers.
        </p>
      </div>

      {/* 2. Search Input */}
      <div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search organization..."
          className="w-full px-4 py-3 rounded-2xl border border-[#CBD5E1] bg-white text-sm text-[#182B36] focus:outline-none focus:ring-2 focus:ring-[#087F70]/20 focus:border-[#087F70] shadow-xs"
        />
      </div>

      {/* 3. Two Columns: Directory List & Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Organization List */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs divide-y divide-[#F1F5F8]">
          {organizations.map((org) => (
            <div
              key={org.name}
              onClick={() => setSelectedOrg(org)}
              className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#F8FAFC] -mx-3 px-3 rounded-xl transition-colors"
            >
              <div>
                <p className="text-sm font-bold text-[#102C3A]">{org.name}</p>
                <p className="text-xs text-[#64748B] mt-0.5">{org.subtitle}</p>
              </div>

              <span
                className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide ${org.statusColor}`}
              >
                {org.status}
              </span>
            </div>
          ))}
        </div>

        {/* Right: Company Profile Card */}
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-5">
          <h2 className="text-sm font-bold text-[#64748B]">Company Profile</h2>

          <div className="space-y-3">
            <h3 className="text-xl font-bold text-[#102C3A]">{selectedOrg.name}</h3>
            <span
              className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide ${selectedOrg.statusColor}`}
            >
              {selectedOrg.status}
            </span>
          </div>

          <div className="space-y-4 pt-2 text-xs">
            <div>
              <p className="font-semibold text-[#64748B]">Official website</p>
              <p className="text-sm font-medium text-[#102C3A] mt-0.5">{selectedOrg.website}</p>
            </div>

            <div>
              <p className="font-semibold text-[#64748B]">Official career page</p>
              <p className="text-sm font-medium text-[#102C3A] mt-0.5">{selectedOrg.careerPage}</p>
            </div>

            <div>
              <p className="font-semibold text-[#64748B]">Official email domain</p>
              <p className="text-sm font-medium text-[#102C3A] mt-0.5">{selectedOrg.emailDomain}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Organizations;
