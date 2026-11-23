import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  ShieldAlert,
  SearchCode,
  AlertOctagon,
  FileText,
  AlertTriangle,
  ArrowRight,
  Eye,
} from 'lucide-react';

import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import MetricCard from '../components/ui/MetricCard';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { useAuth } from '../context/AuthContext';
import { useMockData } from '../context/useMockData';
import {
  MOCK_METRICS,
  MOCK_CIRCULARS,
  MOCK_SCAM_REPORTS,
} from '../data/mockData';
import { formatDate } from '../utils/formatters';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { circulars: storeCirculars, scamReports: storeReports } = useMockData();
  const [selectedCircular, setSelectedCircular] = useState(null);

  const displayCirculars = storeCirculars && storeCirculars.length > 0 ? storeCirculars : MOCK_CIRCULARS;
  const displayReports = storeReports && storeReports.length > 0 ? storeReports : MOCK_SCAM_REPORTS;

  const userName = user?.name || 'Candidate';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Welcoming Hero Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#102C3A] via-[#102C3A] to-[#0A1D27] text-white shadow-sm border border-[#1D4355] relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#A7F3D0] backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-[#16A36A] animate-pulse" />
            <span>CircularShield Protection Active</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {userName}!
          </h1>

          <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
            CircularShield helps you verify job circulars, detect recruitment fraud, and check if an employer is genuine before you apply.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2 w-full sm:w-auto">
            <Button
              variant="secondary"
              size="lg"
              leftIcon={SearchCode}
              onClick={() => navigate('/analyze')}
              className="font-bold shadow-md hover:scale-[1.02] transition-transform w-full sm:w-auto justify-center"
            >
              Check a Job Circular
            </Button>
            <Button
              variant="glass"
              size="lg"
              leftIcon={<AlertOctagon size={18} className="text-[#FCA5A5] shrink-0" />}
              onClick={() => navigate('/report-scam')}
              className="font-semibold text-white w-full sm:w-auto justify-center"
            >
              Report a Scam
            </Button>
          </div>
        </div>

        {/* Decorative background shield watermark */}
        <div className="absolute right-4 -bottom-10 opacity-5 pointer-events-none">
          <ShieldCheck size={280} />
        </div>
      </div>

      {/* 2. Four Clean Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Checked"
          value={MOCK_METRICS.totalCircularsAnalyzed.toLocaleString()}
          subtitle="Job notices checked for safety"
          icon={FileText}
          variant="default"
        />

        <MetricCard
          title="Verified"
          value={MOCK_METRICS.verifiedCircularsCount.toLocaleString()}
          subtitle="Genuine employers verified"
          icon={ShieldCheck}
          variant="verified"
        />

        <MetricCard
          title="Suspicious"
          value={MOCK_METRICS.suspiciousCircularsCount.toLocaleString()}
          subtitle="Scams and fake jobs flagged"
          icon={ShieldAlert}
          variant="suspicious"
        />

        <MetricCard
          title="Unverified"
          value={MOCK_METRICS.unverifiedCircularsCount.toLocaleString()}
          subtitle="Need further company verification"
          icon={AlertTriangle}
          variant="unverified"
        />
      </div>

      {/* 3. Simple Analysis Statistics Card */}
      <Card className="bg-white border-[#E2E8F0] shadow-sm">
        <CardHeader>
          <CardTitle className="text-base text-[#102C3A]">
            Safety Check Summary
          </CardTitle>
          <CardDescription>
            Overview of job circular safety checks across Bangladesh.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Verified Bar */}
            <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#16A36A] flex items-center gap-1.5">
                  <ShieldCheck size={16} /> Verified Authentic
                </span>
                <span className="font-extrabold text-[#16A36A]">62.8%</span>
              </div>
              <div className="w-full bg-[#DCFCE7] h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#16A36A] h-full rounded-full" style={{ width: '62.8%' }} />
              </div>
              <p className="text-[11px] text-[#15803D]">
                Matched against accredited trade licenses and official career domains.
              </p>
            </div>

            {/* Suspicious Bar */}
            <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FECACA] space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#DC4B4B] flex items-center gap-1.5">
                  <ShieldAlert size={16} /> Suspicious / Fake
                </span>
                <span className="font-extrabold text-[#DC4B4B]">25.8%</span>
              </div>
              <div className="w-full bg-[#FEE2E2] h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#DC4B4B] h-full rounded-full" style={{ width: '25.8%' }} />
              </div>
              <p className="text-[11px] text-[#B91C1C]">
                Caught upfront fee demands (bKash/Nagad) or spoofed email addresses.
              </p>
            </div>

            {/* Unverified Bar */}
            <div className="p-4 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#D99A28] flex items-center gap-1.5">
                  <AlertTriangle size={16} /> Unverified / Caution
                </span>
                <span className="font-extrabold text-[#D99A28]">11.4%</span>
              </div>
              <div className="w-full bg-[#FEF3C7] h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#D99A28] h-full rounded-full" style={{ width: '11.4%' }} />
              </div>
              <p className="text-[11px] text-[#B45309]">
                Employers with incomplete digital records or unofficial job postings.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Lower Grid: Recent Activity & Recent Scam Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Recent Activity (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="bg-white border-[#E2E8F0] shadow-sm">
            <CardHeader
              action={
                <Link
                  to="/my-activity"
                  className="text-xs font-semibold text-[#087F70] hover:underline inline-flex items-center gap-1"
                >
                  <span>View All Activity</span>
                  <ArrowRight size={14} />
                </Link>
              }
            >
              <CardTitle className="text-base text-[#102C3A]">Recent Activity</CardTitle>
              <CardDescription>
                Recently evaluated circulars and their verification results.
              </CardDescription>
            </CardHeader>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title & Organization</TableHead>
                    <TableHead>Checked</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayCirculars.slice(0, 5).map((circ) => (
                    <TableRow key={circ.id} className="group">
                      <TableCell>
                        <div className="space-y-0.5">
                          <p className="font-semibold text-xs sm:text-sm text-[#102C3A] group-hover:text-[#087F70] transition-colors truncate max-w-[200px]">
                            {circ.title}
                          </p>
                          <p className="text-[11px] text-[#64748B] truncate max-w-[200px]">
                            {circ.company}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className="text-xs text-[#64748B] whitespace-nowrap">
                          {formatDate(circ.postedDate)}
                        </span>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={
                            circ.status === 'verified'
                              ? 'verified'
                              : circ.status === 'suspicious'
                              ? 'suspicious'
                              : 'unverified'
                          }
                          size="sm"
                          showDot
                        >
                          {circ.status.toUpperCase()}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={Eye}
                          onClick={() => navigate(`/analysis-result/${circ.id}`)}
                        >
                          View Result
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Stacked Card View (<640px) - Zero Horizontal Scrolling */}
            <div className="sm:hidden divide-y divide-[#F1F5F8]">
              {displayCirculars.slice(0, 5).map((circ) => (
                <div key={circ.id} className="p-3.5 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-xs text-[#102C3A] truncate">
                        {circ.title}
                      </p>
                      <p className="text-[11px] text-[#64748B] truncate">
                        {circ.company}
                      </p>
                    </div>
                    <Badge
                      variant={
                        circ.status === 'verified'
                          ? 'verified'
                          : circ.status === 'suspicious'
                          ? 'suspicious'
                          : 'unverified'
                      }
                      size="sm"
                      showDot
                    >
                      {circ.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[11px] text-[#94A3B8]">
                      Checked {formatDate(circ.postedDate)}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={Eye}
                      onClick={() => navigate(`/analysis-result/${circ.id}`)}
                      className="h-7.5 px-2.5 text-xs font-semibold"
                    >
                      View Result
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: Recent Scam Alerts (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="bg-white border-[#E2E8F0] shadow-sm">
            <CardHeader
              action={
                <Link
                  to="/report-scam"
                  className="text-xs font-semibold text-[#DC4B4B] hover:underline inline-flex items-center gap-1"
                >
                  <span>Report Scam</span>
                  <ArrowRight size={14} />
                </Link>
              }
            >
              <CardTitle className="text-base text-[#102C3A] flex items-center gap-2">
                <ShieldAlert size={18} className="text-[#DC4B4B]" />
                <span>Recent Scam Alerts</span>
              </CardTitle>
              <CardDescription>
                Active fraudulent campaigns reported by candidates.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 p-4">
              {displayReports.slice(0, 3).map((report) => (
                <div
                  key={report.id}
                  className="p-3.5 rounded-xl border border-[#FECACA] bg-[#FEF2F2] space-y-2 transition-all hover:shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-xs sm:text-sm text-[#DC4B4B] line-clamp-1">
                      {report.title}
                    </span>
                    <Badge variant="suspicious" size="sm">
                      SCAM
                    </Badge>
                  </div>

                  <p className="text-xs text-[#64748B] line-clamp-2">
                    {report.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-[#DC4B4B] font-semibold pt-1 border-t border-[#FEE2E2]">
                    <span>Extortion: {report.amountDemanded}</span>
                    <span className="text-[#64748B] font-normal">
                      Reported {formatDate(report.reportedDate)}
                    </span>
                  </div>
                </div>
              ))}

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between text-xs">
                <span className="text-[#64748B]">Know of a suspicious job post?</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/report-scam')}
                  className="text-xs"
                >
                  Report Scam
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Selected Circular Quick Modal */}
      {selectedCircular && (
        <Modal
          isOpen={!!selectedCircular}
          onClose={() => setSelectedCircular(null)}
          title={selectedCircular.title}
          description={`Organization: ${selectedCircular.company}`}
          footer={
            <div className="flex items-center justify-between w-full">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const id = selectedCircular.id;
                  setSelectedCircular(null);
                  navigate(`/analysis-result/${id}`);
                }}
              >
                Open Safety Result
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedCircular(null)}
              >
                Close
              </Button>
            </div>
          }
        >
          <div className="space-y-3 text-xs">
            <p className="text-[#64748B]">{selectedCircular.description}</p>
            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
              <span className="font-bold text-[#102C3A] block">Safety Risk Score:</span>
              <span className="text-base font-extrabold text-[#DC4B4B]">
                {selectedCircular.riskScore || 15}/100
              </span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;
