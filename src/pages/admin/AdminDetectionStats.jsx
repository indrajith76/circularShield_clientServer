import { useState, useMemo } from 'react';
import {
  CreditCard,
  Globe,
  Building2,
  KeyRound,
  Download,
  FileSpreadsheet,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

import PageHeader from '../../components/ui/PageHeader';
import Card, { CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';

export const AdminDetectionStats = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');

  const multiplier = useMemo(() => {
    switch (selectedTimeframe) {
      case '7d':
        return 0.25;
      case '90d':
        return 2.8;
      case 'all':
        return 6.4;
      default:
        return 1.0;
    }
  }, [selectedTimeframe]);

  const totalScanned = Math.round(14850 * multiplier);
  const totalThreats = Math.round(3840 * multiplier);
  const totalFinancialLoss = (24.65 * multiplier).toFixed(2);

  // 1. Detection Category Statistics
  const categoryStats = useMemo(() => {
    return [
      { name: 'Payment Extortion', count: Math.round(1612 * multiplier), percentage: '42.0%', severity: 'Critical', color: '#DC4B4B' },
      { name: 'Suspicious / Phishing URLs', count: Math.round(998 * multiplier), percentage: '26.0%', severity: 'High', color: '#EA580C' },
      { name: 'Fake Organization Clones', count: Math.round(614 * multiplier), percentage: '16.0%', severity: 'Critical', color: '#D99A28' },
      { name: 'Job Guarantee Traps', count: Math.round(422 * multiplier), percentage: '11.0%', severity: 'Medium', color: '#087F70' },
      { name: 'Unlicensed Overseas Placement', count: Math.round(194 * multiplier), percentage: '5.0%', severity: 'High', color: '#6366F1' },
    ];
  }, [multiplier]);

  const handleExportCSV = () => {
    const headers = 'Detection Category,Incidents Count,Share,Severity\n';
    const rows = categoryStats
      .map((c) => `"${c.name}",${c.count},"${c.percentage}","${c.severity}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `circularshield_stats_${selectedTimeframe}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 2. Payment Fraud Indicators
  const paymentIndicators = [
    { indicator: 'Admit Card Token Demanded via bKash', incidents: 842, riskLevel: 'Critical' },
    { indicator: 'Refundable Software / Equipment Deposit', incidents: 418, riskLevel: 'Critical' },
    { indicator: 'Interview Registration Fee via Nagad', incidents: 254, riskLevel: 'High' },
    { indicator: 'Medical Examination Fee in Advance', incidents: 98, riskLevel: 'High' },
  ];

  // 3. Suspicious URL Statistics
  const urlStats = [
    { indicator: 'Free Webmail Recruiter Address (@gmail / @yahoo)', count: 1240, share: '32.3%' },
    { indicator: 'Non-Govt Domain Mimicking State Entity (.net / .org)', count: 422, share: '11.0%' },
    { indicator: 'High-Risk TLD Usage (.xyz, .online, .site, .top)', count: 614, share: '16.0%' },
    { indicator: 'Telegram Bot / WhatsApp Exclusive Redirection', count: 998, share: '26.0%' },
  ];

  // 4. Fake Organization Statistics
  const fakeOrgStats = [
    { category: 'Public Sector Ministry Wings (Impersonated)', flaggedCases: 28, risk: 'Critical' },
    { category: 'Commercial Banking & Microfinance Clones', flaggedCases: 19, risk: 'High' },
    { category: 'Unlicensed Overseas Airline Ground Staff Agencies', flaggedCases: 14, risk: 'High' },
    { category: 'Fictitious Data Entry & Task Broking Entities', flaggedCases: 35, risk: 'Critical' },
  ];

  // 5. Scam Keyword Statistics
  const scamKeywords = [
    { keyword: 'Admit Card Fee / প্রবেশপত্র ফি', occurrences: 1612, severity: 'Critical', alertAction: 'Auto-Quarantine' },
    { keyword: 'bKash / Nagad Personal Number', occurrences: 1480, severity: 'Critical', alertAction: 'Wallet Blacklist' },
    { keyword: 'Software Activation Deposit / জামানত', occurrences: 998, severity: 'Critical', alertAction: 'Auto-Quarantine' },
    { keyword: 'Walk-in Tomorrow / সরাসরি ইন্টারভিউ', occurrences: 845, severity: 'High', alertAction: 'Risk Score +35' },
    { keyword: 'Guaranteed Daily BDT 2,500-3,500', occurrences: 760, severity: 'High', alertAction: 'Risk Score +40' },
    { keyword: 'Telegram Coordinator / টেলিগ্রাম যোগাযোগ', occurrences: 690, severity: 'High', alertAction: 'Channel Flag' },
    { keyword: 'Zero Experience / কোনো অভিজ্ঞতা প্রয়োজন নেই', occurrences: 540, severity: 'Medium', alertAction: 'Flag for Review' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <PageHeader
        breadcrumbs={[
          { label: 'Admin', to: '/admin/dashboard' },
          { label: 'Detection Statistics' },
        ]}
        title="Detection Statistics & Safety Overview"
        subtitle="Detection metrics across payment scams, suspicious job links, fake companies, and common scam keywords."
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex p-1 bg-white rounded-xl border border-[#E2E8EC]">
              {['7d', '30d', '90d', 'all'].map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setSelectedTimeframe(period)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase cursor-pointer ${
                    selectedTimeframe === period ? 'bg-[#102C3A] text-white shadow-xs' : 'text-[#64748B]'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              leftIcon={FileSpreadsheet}
              onClick={handleExportCSV}
            >
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={Download}
              onClick={() => window.print()}
            >
              Print Report
            </Button>
          </div>
        }
      />

      {/* Top 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-[#E2E8F0] shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
            Total Circulars Scanned
          </span>
          <p className="text-2xl font-black text-[#102C3A] mt-1">{totalScanned.toLocaleString()}</p>
          <span className="text-[11px] font-semibold text-[#16A36A] block mt-0.5">
            +18.5% scan volume
          </span>
        </Card>

        <Card className="p-4 bg-white border border-[#E2E8F0] shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#DC4B4B]">
            Flagged Threat Rate
          </span>
          <p className="text-2xl font-black text-[#DC4B4B] mt-1">25.9%</p>
          <span className="text-[11px] font-medium text-[#64748B] block mt-0.5">
            {totalThreats.toLocaleString()} fraudulent circulars
          </span>
        </Card>

        <Card className="p-4 bg-white border border-[#E2E8F0] shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#16A36A]">
            Financial Loss Shielded
          </span>
          <p className="text-2xl font-black text-[#16A36A] mt-1">BDT {totalFinancialLoss}M</p>
          <span className="text-[11px] font-medium text-[#64748B] block mt-0.5">
            Extortion attempts blocked
          </span>
        </Card>

        <Card className="p-4 bg-white border border-[#E2E8F0] shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#087F70]">
            Model Classification Precision
          </span>
          <p className="text-2xl font-black text-[#087F70] mt-1">98.6%</p>
          <span className="text-[11px] font-medium text-[#64748B] block mt-0.5">
            Verified ground truth benchmark
          </span>
        </Card>
      </div>

      {/* 1. DETECTION CATEGORY STATISTICS (CHART + TABLE) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-6 p-5 bg-white border border-[#E2E8F0] shadow-sm">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-base text-[#102C3A]">
              Detection Category Volume Distribution
            </CardTitle>
            <CardDescription>
              Incidents classified by threat vector across evaluated circulars.
            </CardDescription>
          </CardHeader>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryStats} layout="vertical" margin={{ left: 30, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F8" />
                <XAxis type="number" stroke="#94A3B8" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={10} width={130} />
                <Tooltip
                  formatter={(val) => [`${val} Incidents`, 'Count']}
                  contentStyle={{
                    backgroundColor: '#102C3A',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="lg:col-span-6 p-5 bg-white border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
          <div>
            <CardHeader className="p-0 pb-3">
              <CardTitle className="text-base text-[#102C3A]">
                Detection Vector Severity Matrix
              </CardTitle>
              <CardDescription>
                Breakdown of total detected threats categorized by threat vector.
              </CardDescription>
            </CardHeader>
            <div className="space-y-2 text-xs pt-1">
              {categoryStats.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-md shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-bold text-[#102C3A]">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-[#102C3A]">
                      {item.count} ({item.percentage})
                    </span>
                    <Badge
                      variant={
                        item.severity === 'Critical'
                          ? 'suspicious'
                          : item.severity === 'High'
                          ? 'unverified'
                          : 'default'
                      }
                      size="sm"
                    >
                      {item.severity}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* 2 & 3. PAYMENT FRAUD INDICATORS & SUSPICIOUS URL STATISTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Fraud Indicators */}
        <Card className="bg-white border-[#E2E8F0] shadow-sm overflow-hidden">
          <CardHeader className="border-b border-[#F1F5F8] pb-3">
            <CardTitle className="text-base text-[#DC4B4B] flex items-center gap-2">
              <CreditCard size={18} />
              Payment Fraud Indicators
            </CardTitle>
            <CardDescription>
              Monetary solicitation patterns and unauthorized fee triggers.
            </CardDescription>
          </CardHeader>
          <div className="p-4 space-y-2 text-xs">
            {paymentIndicators.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-between"
              >
                <div className="space-y-0.5">
                  <span className="font-bold text-[#102C3A] block">
                    {item.indicator}
                  </span>
                  <span className="text-[11px] text-[#64748B]">
                    Encountered in {item.incidents} job notices
                  </span>
                </div>
                <Badge variant="suspicious" size="sm">
                  {item.riskLevel}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Suspicious URL Statistics */}
        <Card className="bg-white border-[#E2E8F0] shadow-sm overflow-hidden">
          <CardHeader className="border-b border-[#F1F5F8] pb-3">
            <CardTitle className="text-base text-[#087F70] flex items-center gap-2">
              <Globe size={18} />
              Suspicious URL & Domain Statistics
            </CardTitle>
            <CardDescription>
              Phishing domain structures, spoofed TLDs, and messaging redirects.
            </CardDescription>
          </CardHeader>
          <div className="p-4 space-y-2 text-xs">
            {urlStats.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#F0FDF9] border border-[#A7F3D0] flex items-center justify-between"
              >
                <div className="space-y-0.5">
                  <span className="font-bold text-[#102C3A] block">
                    {item.indicator}
                  </span>
                  <span className="text-[11px] text-[#64748B]">
                    {item.count} detections • {item.share} of URL anomalies
                  </span>
                </div>
                <span className="font-mono text-xs font-bold text-[#087F70]">
                  {item.share}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 4. FAKE ORGANIZATION STATISTICS */}
      <Card className="bg-white border-[#E2E8F0] shadow-sm overflow-hidden">
        <CardHeader className="border-b border-[#F1F5F8] pb-3">
          <CardTitle className="text-base text-[#102C3A] flex items-center gap-2">
            <Building2 size={18} className="text-[#DC4B4B]" />
            Fake Organization & Impersonation Statistics
          </CardTitle>
          <CardDescription>
            Entities illegally mimicking registered ministries, corporations, and international agencies.
          </CardDescription>
        </CardHeader>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {fakeOrgStats.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2"
            >
              <span className="font-bold text-sm text-[#102C3A] block">
                {item.category}
              </span>
              <div className="flex items-center justify-between pt-1 border-t border-[#E2E8F0]">
                <span className="font-mono font-bold text-base text-[#DC4B4B]">
                  {item.flaggedCases} Syndicates
                </span>
                <Badge variant="suspicious" size="sm">
                  {item.risk}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 5. SCAM KEYWORD STATISTICS TABLE */}
      <Card className="bg-white border-[#E2E8F0] shadow-sm overflow-hidden">
        <CardHeader className="border-b border-[#F1F5F8] pb-3">
          <CardTitle className="text-base text-[#102C3A] flex items-center gap-2">
            <KeyRound size={18} className="text-[#087F70]" />
            Scam Keyword Frequency & Statistics
          </CardTitle>
          <CardDescription>
            Most frequently detected deceptive phrases and automatic prevention rules.
          </CardDescription>
        </CardHeader>
        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Keyword Pattern / Phrase</TableHead>
                <TableHead>Total Occurrences</TableHead>
                <TableHead>Threat Severity</TableHead>
                <TableHead className="text-right">Automated Protection Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scamKeywords.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <span className="font-bold text-xs sm:text-sm text-[#102C3A]">
                      {item.keyword}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono font-bold text-xs text-[#087F70]">
                      {item.occurrences.toLocaleString()} times
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.severity === 'Critical'
                          ? 'suspicious'
                          : item.severity === 'High'
                          ? 'unverified'
                          : 'default'
                      }
                      size="sm"
                      showDot
                    >
                      {item.severity.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-[#102C3A]/5 text-[#102C3A]">
                      {item.alertAction}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden divide-y divide-[#F1F5F8]">
          {scamKeywords.map((item, idx) => (
            <div key={idx} className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-xs text-[#102C3A] flex-1">
                  {item.keyword}
                </span>
                <Badge
                  variant={
                    item.severity === 'Critical'
                      ? 'suspicious'
                      : item.severity === 'High'
                      ? 'unverified'
                      : 'default'
                  }
                  size="sm"
                  showDot
                >
                  {item.severity.toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-[#F8FAFC]">
                <span className="font-mono font-bold text-[#087F70]">
                  {item.occurrences.toLocaleString()} times
                </span>
                <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-[#102C3A]/5 text-[#102C3A]">
                  {item.alertAction}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AdminDetectionStats;
