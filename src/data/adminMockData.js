/**
 * CircularShield Administrative Mock Data
 * Comprehensive telemetry, system users, verification queues,
 * scam report audits, and operational analytics.
 */

export const ADMIN_METRICS = {
  totalUsers: 18450,
  totalUsersChange: '+14.2%',
  totalAnalyzedCirculars: 14850,
  totalAnalyzedChange: '+18.5%',
  verifiedCirculars: 9320,
  verifiedPercent: '62.8%',
  suspiciousCirculars: 3840,
  suspiciousPercent: '25.9%',
  unverifiedCirculars: 1690,
  unverifiedPercent: '11.3%',
  pendingScamReports: 48,
  pendingReportsChange: '-8.3%',
  preventedFinancialLossBDT: 24650000,
  activeDetectionNodes: 8,
};

export const ADMIN_CHART_ANALYSIS_TREND = [
  { month: 'Jun', verified: 590, suspicious: 240, unverified: 120, total: 950 },
  { month: 'Jul', verified: 750, suspicious: 310, unverified: 140, total: 1200 },
  { month: 'Aug', verified: 910, suspicious: 380, unverified: 160, total: 1450 },
  { month: 'Sep', verified: 1140, suspicious: 460, unverified: 200, total: 1800 },
  { month: 'Oct', verified: 1390, suspicious: 560, unverified: 250, total: 2200 },
  { month: 'Nov', verified: 1680, suspicious: 680, unverified: 290, total: 2650 },
];

export const ADMIN_CHART_FRAUD_VECTORS = [
  { vector: 'bKash/Nagad Fee Demands', count: 1612, percentage: 42, color: '#DC4B4B' },
  { vector: 'Telegram Task Ponzi', count: 998, percentage: 26, color: '#EA580C' },
  { vector: 'Phishing Career Domains', count: 614, percentage: 16, color: '#D99A28' },
  { vector: 'Govt Ministry Clones', count: 422, percentage: 11, color: '#087F70' },
  { vector: 'Unlicensed Manpower', count: 194, percentage: 5, color: '#6366F1' },
];

export const ADMIN_CHART_USER_GROWTH = [
  { month: 'Jun', candidates: 1200, employers: 45, total: 1245 },
  { month: 'Jul', candidates: 2100, employers: 80, total: 2180 },
  { month: 'Aug', candidates: 3400, employers: 125, total: 3525 },
  { month: 'Sep', candidates: 5200, employers: 190, total: 5390 },
  { month: 'Oct', candidates: 7800, employers: 270, total: 8070 },
  { month: 'Nov', candidates: 10450, employers: 380, total: 10830 },
];

export const ADMIN_CHART_REPORT_DISTRIBUTION = [
  { name: 'Confirmed Scam', value: 54, count: 231, color: '#DC4B4B' },
  { name: 'Under Investigation', value: 28, count: 120, color: '#D99A28' },
  { name: 'Police Escalated', value: 12, count: 51, color: '#087F70' },
  { name: 'Rejected / Disproven', value: 6, count: 26, color: '#94A3B8' },
];

export const ADMIN_RECENT_USERS = [
  {
    id: 'USR-8914',
    name: 'Tanzina Sultana',
    email: 'tanzina.sultana@buet.ac.bd',
    role: 'Candidate / Job Seeker',
    status: 'active',
    joinedDate: '2026-11-23T11:40:00Z',
    scansCount: 4,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'USR-8913',
    name: 'Mohammad Farhad',
    email: 'farhad.hr@waltonbd.com',
    role: 'Verified Employer',
    status: 'active',
    joinedDate: '2026-11-23T09:15:00Z',
    scansCount: 18,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'USR-8912',
    name: 'Kamrul Hassan',
    email: 'kamrul.research@gmail.com',
    role: 'Whistleblower Analyst',
    status: 'active',
    joinedDate: '2026-11-22T17:20:00Z',
    scansCount: 32,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'USR-8911',
    name: 'Nusrat Jahan Rimi',
    email: 'nusrat.rimi@du.ac.bd',
    role: 'Candidate / Job Seeker',
    status: 'active',
    joinedDate: '2026-11-22T14:05:00Z',
    scansCount: 2,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'USR-8910',
    name: 'Shafiqur Rahman',
    email: 'shafiq.rahman@gmail.com',
    role: 'Candidate / Job Seeker',
    status: 'active',
    joinedDate: '2026-11-20T10:00:00Z',
    scansCount: 14,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
  },
];

export const ADMIN_RECENT_REPORTS = [
  {
    id: 'REP-9025',
    title: 'Admit Card bKash fee demand (BDT 650) for Postal Clerk',
    targetEntity: 'Bangladesh Postal Department (Impersonated)',
    category: 'Fake Job Circular',
    amountDemanded: 'BDT 650',
    reportedDate: '2026-11-23T12:30:00Z',
    status: 'pending',
    reporter: 'Tanzina S.',
    priority: 'high',
  },
  {
    id: 'REP-9024',
    title: 'Counterfeit HR Interview for Pharmaceuticals Sales Rep',
    targetEntity: 'Renata Pharmaceuticals (Counterfeit clone)',
    category: 'Fake Company',
    amountDemanded: 'BDT 1,500',
    reportedDate: '2026-11-23T08:15:00Z',
    status: 'confirmed_scam',
    reporter: 'Kamrul H.',
    priority: 'critical',
  },
  {
    id: 'REP-9023',
    title: 'Fake Overseas Airport Ground Staff Appointment Letter',
    targetEntity: 'Qatar Ground Handling Agency (Spoofed)',
    category: 'Fraudulent Application Link',
    amountDemanded: 'BDT 45,000',
    reportedDate: '2026-11-22T19:40:00Z',
    status: 'confirmed_scam',
    reporter: 'Anonymous User',
    priority: 'critical',
  },
  {
    id: 'REP-9022',
    title: 'Telegram Task Scam demanding 5,000 BDT activation deposit',
    targetEntity: 'Global Marketing Hub',
    category: 'Suspicious Phone Number',
    amountDemanded: 'BDT 5,000',
    reportedDate: '2026-11-22T15:10:00Z',
    status: 'investigating',
    reporter: 'Nusrat R.',
    priority: 'medium',
  },
  {
    id: 'REP-9021',
    title: 'Demanded 2,500 BDT for Railway Admit Card & Physical Token',
    targetEntity: 'Bangladesh Railway (Impersonated by syndicate)',
    category: 'Fake bKash/Nagad Number',
    amountDemanded: 'BDT 2,500',
    reportedDate: '2026-11-22T11:00:00Z',
    status: 'confirmed_scam',
    reporter: 'Shafiqur R.',
    priority: 'high',
  },
];

export const ADMIN_RECENT_VERIFICATIONS = [
  {
    id: 'VER-401',
    organization: 'Chaldal Limited',
    category: 'E-Commerce & Retail',
    logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&auto=format&fit=crop&q=80',
    requestDate: '2026-11-23T10:15:00Z',
    status: 'pending',
    documentsSubmitted: ['Trade License 2026', 'BASIS Membership Cert', 'Domain SSL'],
    assignedAuditor: 'SecOps Team Alpha',
  },
  {
    id: 'VER-400',
    organization: 'Walton Hi-Tech Industries PLC',
    category: 'Electronics & Manufacturing',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop&q=80',
    requestDate: '2026-11-22T16:30:00Z',
    status: 'verified',
    documentsSubmitted: ['DCCI Cert', 'Incorporation C-58192', 'Tax Clearance'],
    assignedAuditor: 'Kamrul H.',
  },
  {
    id: 'VER-399',
    organization: 'Gulf Overseas Placement (Unlicensed)',
    category: 'Manpower Agency',
    logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&auto=format&fit=crop&q=80',
    requestDate: '2026-11-22T14:00:00Z',
    status: 'flagged',
    documentsSubmitted: ['Forged BMET License Copy'],
    assignedAuditor: 'SecOps Team Beta',
  },
  {
    id: 'VER-398',
    organization: 'Apex Footwear Limited',
    category: 'Manufacturing & Export',
    logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&auto=format&fit=crop&q=80',
    requestDate: '2026-11-21T11:20:00Z',
    status: 'verified',
    documentsSubmitted: ['RJSC Incorporation', 'Export License'],
    assignedAuditor: 'Kamrul H.',
  },
];
