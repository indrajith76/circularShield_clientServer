import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  SearchCode,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  AlertOctagon,
  ArrowUpRight,
  Building2,
  Download,
  Eye,
  Check,
  X,
  History,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

import Card, { CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { formatDate, formatRelativeTime } from '../../utils/formatters';
import {
  ADMIN_METRICS,
  ADMIN_CHART_ANALYSIS_TREND,
  ADMIN_CHART_FRAUD_VECTORS,
  ADMIN_CHART_USER_GROWTH,
  ADMIN_CHART_REPORT_DISTRIBUTION,
  ADMIN_RECENT_USERS,
  ADMIN_RECENT_REPORTS,
  ADMIN_RECENT_VERIFICATIONS,
} from '../../data/adminMockData';

export const AdminDashboard = () => {
  const navigate = useNavigate();

  // Selected timeframe filter: '7d' | '30d' | '90d' | 'all'
  const [timeframe, setTimeframe] = useState('30d');

  // Interactive state for recent activities (supports in-page approvals/dismissals)
  const usersList = ADMIN_RECENT_USERS;
  const [reportsList, setReportsList] = useState(ADMIN_RECENT_REPORTS);
  const [verificationsList, setVerificationsList] = useState(ADMIN_RECENT_VERIFICATIONS);
  const [actionNotice, setActionNotice] = useState('');

  const handleUpdateReportStatus = (reportId, newStatus) => {
    setReportsList((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r))
    );
    setActionNotice(`Report ${reportId} marked as ${newStatus.replace('_', ' ').toUpperCase()}`);
    setTimeout(() => setActionNotice(''), 3500);
  };

  const handleApproveVerification = (verId, orgName) => {
    setVerificationsList((prev) =>
      prev.map((v) => (v.id === verId ? { ...v, status: 'verified' } : v))
    );
    setActionNotice(`Organization "${orgName}" verified successfully.`);
    setTimeout(() => setActionNotice(''), 3500);
  };

  const handleExportAudit = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Admin Operations Header */}
      <PageHeader
        title="Admin Overview"
        subtitle="Real-time platform statistics, user management, and scam prevention control center."
        badge={
          <Badge variant="verified" size="sm" showDot>
            Live System Status
          </Badge>
        }
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex p-1 bg-white rounded-xl border border-[#E2E8EC] shadow-2xs">
              {['7d', '30d', '90d', 'all'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTimeframe(t)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase transition-all cursor-pointer ${
                    timeframe === t
                      ? 'bg-[#102C3A] text-white shadow-xs'
                      : 'text-[#64748B] hover:text-[#102C3A]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              leftIcon={Download}
              onClick={handleExportAudit}
            >
              Export Report
            </Button>
          </div>
        }
      />

      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="p-3.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-between text-xs font-semibold text-[#16A36A] animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button
            onClick={() => setActionNotice('')}
            className="p-1 hover:bg-[#D1FAE5] rounded-md cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. DASHBOARD STATISTICS (THE 6 MANDATORY CARDS)          */}
      {/* 1. Total Users                                          */}
      {/* 2. Total Analyzed Circulars                             */}
      {/* 3. Verified Circulars                                   */}
      {/* 4. Suspicious Circulars                                 */}
      {/* 5. Unverified Circulars                                 */}
      {/* 6. Pending Scam Reports                                 */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* 1. Total Users */}
        <Card className="p-4 bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              Total Users
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#087F70]/10 text-[#087F70] flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-[#102C3A]">
              {ADMIN_METRICS.totalUsers.toLocaleString()}
            </h3>
            <p className="text-[11px] font-semibold text-[#16A36A] flex items-center gap-1 mt-1">
              <ArrowUpRight size={13} />
              <span>{ADMIN_METRICS.totalUsersChange} vs last month</span>
            </p>
          </div>
        </Card>

        {/* 2. Total Analyzed Circulars */}
        <Card className="p-4 bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              Total Analyzed
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#102C3A]/10 text-[#102C3A] flex items-center justify-center">
              <SearchCode size={16} />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-[#102C3A]">
              {ADMIN_METRICS.totalAnalyzedCirculars.toLocaleString()}
            </h3>
            <p className="text-[11px] font-semibold text-[#16A36A] flex items-center gap-1 mt-1">
              <ArrowUpRight size={13} />
              <span>{ADMIN_METRICS.totalAnalyzedChange} scans</span>
            </p>
          </div>
        </Card>

        {/* 3. Verified Circulars */}
        <Card className="p-4 bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#16A36A]">
              Verified Clean
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#16A36A]/10 text-[#16A36A] flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-[#16A36A]">
              {ADMIN_METRICS.verifiedCirculars.toLocaleString()}
            </h3>
            <p className="text-[11px] font-medium text-[#64748B] mt-1">
              {ADMIN_METRICS.verifiedPercent} of total scans
            </p>
          </div>
        </Card>

        {/* 4. Suspicious Circulars */}
        <Card className="p-4 bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#DC4B4B]">
              Suspicious Scams
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#DC4B4B]/10 text-[#DC4B4B] flex items-center justify-center">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-[#DC4B4B]">
              {ADMIN_METRICS.suspiciousCirculars.toLocaleString()}
            </h3>
            <p className="text-[11px] font-medium text-[#64748B] mt-1">
              {ADMIN_METRICS.suspiciousPercent} flagged threats
            </p>
          </div>
        </Card>

        {/* 5. Unverified Circulars */}
        <Card className="p-4 bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#D99A28]">
              Unverified Caution
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#D99A28]/10 text-[#D99A28] flex items-center justify-center">
              <HelpCircle size={16} />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-[#D99A28]">
              {ADMIN_METRICS.unverifiedCirculars.toLocaleString()}
            </h3>
            <p className="text-[11px] font-medium text-[#64748B] mt-1">
              {ADMIN_METRICS.unverifiedPercent} needs review
            </p>
          </div>
        </Card>

        {/* 6. Pending Scam Reports */}
        <Card className="p-4 bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#DC4B4B]">
              Pending Reports
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#DC4B4B]/10 text-[#DC4B4B] flex items-center justify-center">
              <AlertOctagon size={16} />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-[#DC4B4B]">
              {ADMIN_METRICS.pendingScamReports}
            </h3>
            <p className="text-[11px] font-semibold text-[#D99A28] flex items-center gap-1 mt-1">
              <span>Awaiting moderation</span>
            </p>
          </div>
        </Card>
      </div>

      {/* ======================================================== */}
      {/* 2. ANALYTICS (RECHARTS CHARTS - 4 MANDATORY CHARTS)      */}
      {/* 1. Circular Analysis Chart                               */}
      {/* 2. Fraud Detection Statistics                            */}
      {/* 3. Monthly User Growth                                   */}
      {/* 4. Report Status Distribution                            */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 1: Circular Analysis Chart */}
        <Card className="p-5 bg-white border border-[#E2E8F0] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[#102C3A]">
                Circular Analysis & Verification Trend
              </h3>
              <p className="text-xs text-[#64748B]">
                Monthly volume breakdown of verified, suspicious, and unverified circulars.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#087F70] bg-[#087F70]/10 px-2.5 py-1 rounded-lg">
              6-Month Trend
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ADMIN_CHART_ANALYSIS_TREND}>
                <defs>
                  <linearGradient id="verifiedColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16A36A" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#16A36A" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="suspiciousColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC4B4B" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#DC4B4B" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F8" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#102C3A',
                    borderColor: '#102C3A',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Area
                  type="monotone"
                  dataKey="verified"
                  name="Verified Clean"
                  stroke="#16A36A"
                  fillOpacity={1}
                  fill="url(#verifiedColor)"
                />
                <Area
                  type="monotone"
                  dataKey="suspicious"
                  name="Suspicious Scam"
                  stroke="#DC4B4B"
                  fillOpacity={1}
                  fill="url(#suspiciousColor)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* CHART 2: Fraud Detection Statistics */}
        <Card className="p-5 bg-white border border-[#E2E8F0] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[#102C3A]">
                Fraud Detection Statistics by Vector
              </h3>
              <p className="text-xs text-[#64748B]">
                Distribution of detected threats across key recruitment deception vectors.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#DC4B4B] bg-[#DC4B4B]/10 px-2.5 py-1 rounded-lg">
              Primary Vectors
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={ADMIN_CHART_FRAUD_VECTORS}
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F8" />
                <XAxis type="number" stroke="#94A3B8" fontSize={11} />
                <YAxis
                  dataKey="vector"
                  type="category"
                  stroke="#94A3B8"
                  fontSize={10}
                  width={130}
                />
                <Tooltip
                  formatter={(val) => [`${val} Cases`, 'Detections']}
                  contentStyle={{
                    backgroundColor: '#102C3A',
                    borderColor: '#102C3A',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" name="Threat Incidents" radius={[0, 6, 6, 0]}>
                  {ADMIN_CHART_FRAUD_VECTORS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* CHART 3: Monthly User Growth */}
        <Card className="p-5 bg-white border border-[#E2E8F0] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[#102C3A]">
                Monthly User & Employer Growth
              </h3>
              <p className="text-xs text-[#64748B]">
                Candidate onboarding vs verified corporate recruiter registrations.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#16A36A] bg-[#16A36A]/10 px-2.5 py-1 rounded-lg">
              +14.2% MoM
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ADMIN_CHART_USER_GROWTH}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F8" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#102C3A',
                    borderColor: '#102C3A',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line
                  type="monotone"
                  dataKey="candidates"
                  name="Job Seekers"
                  stroke="#087F70"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="employers"
                  name="Verified Employers"
                  stroke="#102C3A"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* CHART 4: Report Status Distribution */}
        <Card className="p-5 bg-white border border-[#E2E8F0] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[#102C3A]">
                Whistleblower Report Status Distribution
              </h3>
              <p className="text-xs text-[#64748B]">
                Current disposition of all submitted scam incident reports.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#102C3A] bg-[#102C3A]/10 px-2.5 py-1 rounded-lg">
              428 Total
            </span>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ADMIN_CHART_REPORT_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {ADMIN_CHART_REPORT_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => [`${val}%`, 'Proportion']}
                  contentStyle={{
                    backgroundColor: '#102C3A',
                    borderColor: '#102C3A',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* ======================================================== */}
      {/* 3. RECENT ACTIVITIES (THE 3 MANDATORY STREAMS)           */}
      {/* 1. New User Registrations                                */}
      {/* 2. New Scam Reports                                     */}
      {/* 3. Organization Verification Activities                 */}
      {/* ======================================================== */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#102C3A]">
              Live Administrative Operations & Recent Activities
            </h2>
            <p className="text-xs text-[#64748B]">
              Real-time audit feeds across user onboarding, scam whistleblowers, and enterprise verifications.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={History}
              onClick={() => navigate('/admin/activity')}
            >
              Activity Logs
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/users')}
            >
              View Users
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/reports')}
            >
              Reports Queue
            </Button>
          </div>
        </div>

        {/* FEED 1: New User Registrations */}
        <Card className="bg-white border-[#E2E8F0] shadow-sm overflow-hidden">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-base text-[#102C3A]">
                <Users size={18} className="text-[#087F70]" />
                New User Registrations (Recent Audit Log)
              </CardTitle>
              <CardDescription>
                Recently registered candidates, employers, and analysts on CircularShield.
              </CardDescription>
            </div>
            <span className="text-xs text-[#64748B]">Showing latest 5</span>
          </CardHeader>
          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Information</TableHead>
                  <TableHead>Account Role</TableHead>
                  <TableHead>Joined Date</TableHead>
                  <TableHead>Total Scans</TableHead>
                  <TableHead>Account Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersList.map((usr) => (
                  <TableRow key={usr.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={usr.avatar}
                          alt={usr.name}
                          className="w-9 h-9 rounded-xl object-cover border border-[#E2E8F0]"
                        />
                        <div>
                          <p className="font-bold text-xs sm:text-sm text-[#102C3A]">
                            {usr.name}
                          </p>
                          <p className="text-[11px] text-[#64748B]">
                            {usr.email} • ID: {usr.id}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-xs text-[#102C3A]">
                        {usr.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-[#64748B]">
                        {formatDate(usr.joinedDate)} ({formatRelativeTime(usr.joinedDate)})
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono font-bold text-xs text-[#087F70]">
                        {usr.scansCount}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="verified" size="sm" showDot>
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={Eye}
                        onClick={() => navigate('/admin/users')}
                      >
                        Inspect
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* Mobile Cards */}
          <div className="sm:hidden divide-y divide-[#F1F5F8]">
            {usersList.map((usr) => (
              <div key={usr.id} className="p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img
                      src={usr.avatar}
                      alt={usr.name}
                      className="w-9 h-9 rounded-xl object-cover border border-[#E2E8F0] shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm text-[#102C3A] truncate">{usr.name}</p>
                      <p className="text-xs text-[#64748B] truncate">{usr.email}</p>
                      <span className="font-mono text-[10px] text-[#087F70]">{usr.role}</span>
                    </div>
                  </div>
                  <Badge variant="verified" size="sm" showDot>
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-[#F8FAFC] text-[#64748B]">
                  <span>Joined {formatRelativeTime(usr.joinedDate)}</span>
                  <span>Scans: <strong className="text-[#087F70]">{usr.scansCount}</strong></span>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={Eye}
                  onClick={() => navigate('/admin/users')}
                  className="w-full justify-center text-xs h-8"
                >
                  Inspect User
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* FEED 2: New Scam Reports */}
        <Card className="bg-white border-[#E2E8F0] shadow-sm overflow-hidden">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-base text-[#102C3A]">
                <AlertOctagon size={18} className="text-[#DC4B4B]" />
                New Scam Reports (Triage & Moderation Queue)
              </CardTitle>
              <CardDescription>
                Whistleblower submissions requiring admin review, evidence verification, or law enforcement escalation.
              </CardDescription>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/admin/reports')}
            >
              Open Full Queue
            </Button>
          </CardHeader>
          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Details</TableHead>
                  <TableHead>Target Entity</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Demanded</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Triage Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportsList.map((rep) => (
                  <TableRow key={rep.id}>
                    <TableCell>
                      <div className="space-y-0.5">
                        <span className="font-mono text-[11px] font-bold text-[#087F70] bg-[#087F70]/10 px-2 py-0.5 rounded">
                          {rep.id}
                        </span>
                        <p className="font-semibold text-xs sm:text-sm text-[#102C3A] line-clamp-1">
                          {rep.title}
                        </p>
                        <p className="text-[11px] text-[#94A3B8]">
                          Reported by {rep.reporter} • {formatRelativeTime(rep.reportedDate)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-bold text-[#102C3A] block truncate max-w-xs">
                        {rep.targetEntity}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-[#64748B] block truncate max-w-[140px]">
                        {rep.category}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono font-bold text-xs text-[#DC4B4B]">
                        {rep.amountDemanded}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          rep.status === 'confirmed_scam'
                            ? 'suspicious'
                            : rep.status === 'investigating'
                            ? 'unverified'
                            : 'verified'
                        }
                        size="sm"
                        showDot
                      >
                        {rep.status === 'confirmed_scam'
                          ? 'Confirmed Scam'
                          : rep.status === 'investigating'
                          ? 'Under Review'
                          : 'Resolved'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {rep.status !== 'confirmed_scam' && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() =>
                              handleUpdateReportStatus(rep.id, 'confirmed_scam')
                            }
                          >
                            Confirm Scam
                          </Button>
                        )}
                        {rep.status !== 'resolved' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleUpdateReportStatus(rep.id, 'resolved')
                            }
                          >
                            Resolve
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* Mobile Cards */}
          <div className="sm:hidden divide-y divide-[#F1F5F8]">
            {reportsList.map((rep) => (
              <div key={rep.id} className="p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <span className="font-mono text-[10px] text-[#087F70] bg-[#087F70]/10 px-2 py-0.5 rounded font-bold">
                      {rep.id}
                    </span>
                    <h4 className="font-bold text-sm text-[#102C3A] line-clamp-1 pt-0.5">
                      {rep.targetEntity}
                    </h4>
                    <p className="text-xs text-[#64748B] line-clamp-1">{rep.title}</p>
                  </div>
                  <Badge
                    variant={
                      rep.status === 'confirmed_scam'
                        ? 'suspicious'
                        : rep.status === 'investigating'
                        ? 'unverified'
                        : 'verified'
                    }
                    size="sm"
                    showDot
                  >
                    {rep.status === 'confirmed_scam'
                      ? 'Scam'
                      : rep.status === 'investigating'
                      ? 'Review'
                      : 'Resolved'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-[#F8FAFC] text-[#64748B]">
                  <span>{rep.category}</span>
                  <span className="font-mono font-bold text-[#DC4B4B]">{rep.amountDemanded}</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  {rep.status !== 'confirmed_scam' && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleUpdateReportStatus(rep.id, 'confirmed_scam')}
                      className="flex-1 justify-center text-xs h-8"
                    >
                      Confirm Scam
                    </Button>
                  )}
                  {rep.status !== 'resolved' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateReportStatus(rep.id, 'resolved')}
                      className="flex-1 justify-center text-xs h-8"
                    >
                      Resolve
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* FEED 3: Organization Verification Activities */}
        <Card className="bg-white border-[#E2E8F0] shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-base text-[#102C3A]">
                <Building2 size={18} className="text-[#087F70]" />
                Organization Verification Activities
              </CardTitle>
              <CardDescription>
                Corporate entity credentials and trade license reviews submitted for verified employer tier.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/verification')}
            >
              Manage Verifications
            </Button>
          </CardHeader>
          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Submitted Documents</TableHead>
                  <TableHead>Assigned Auditor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Verification Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {verificationsList.map((ver) => (
                  <TableRow key={ver.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={ver.logo}
                          alt={ver.organization}
                          className="w-9 h-9 rounded-xl object-cover border border-[#E2E8F0]"
                        />
                        <div>
                          <p className="font-bold text-xs sm:text-sm text-[#102C3A]">
                            {ver.organization}
                          </p>
                          <p className="text-[11px] text-[#94A3B8]">
                            Request ID: {ver.id} • {formatDate(ver.requestDate)}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-[#64748B]">
                        {ver.category}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {ver.documentsSubmitted.map((doc, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-[#F1F5F8] text-[#475569] px-2 py-0.5 rounded font-medium"
                          >
                            {doc}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-semibold text-[#102C3A]">
                        {ver.assignedAuditor}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          ver.status === 'verified'
                            ? 'verified'
                            : ver.status === 'flagged'
                            ? 'suspicious'
                            : 'unverified'
                        }
                        size="sm"
                        showDot
                      >
                        {ver.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {ver.status === 'pending' ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          leftIcon={Check}
                          onClick={() =>
                            handleApproveVerification(ver.id, ver.organization)
                          }
                        >
                          Approve Org
                        </Button>
                      ) : (
                        <span className="text-xs text-[#64748B] italic">
                          Audit Completed
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* Mobile Cards */}
          <div className="sm:hidden divide-y divide-[#F1F5F8]">
            {verificationsList.map((ver) => (
              <div key={ver.id} className="p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img
                      src={ver.logo}
                      alt={ver.organization}
                      className="w-9 h-9 rounded-xl object-cover border border-[#E2E8F0] shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm text-[#102C3A] truncate">{ver.organization}</p>
                      <p className="text-xs text-[#64748B] truncate">{ver.category}</p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      ver.status === 'verified'
                        ? 'verified'
                        : ver.status === 'flagged'
                        ? 'suspicious'
                        : 'unverified'
                    }
                    size="sm"
                    showDot
                  >
                    {ver.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-xs text-[#64748B] pt-1 border-t border-[#F8FAFC]">
                  <span>Auditor: <strong className="text-[#102C3A]">{ver.assignedAuditor}</strong></span>
                </div>
                {ver.status === 'pending' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={Check}
                    onClick={() => handleApproveVerification(ver.id, ver.organization)}
                    className="w-full justify-center text-xs h-8"
                  >
                    Approve Organization
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
