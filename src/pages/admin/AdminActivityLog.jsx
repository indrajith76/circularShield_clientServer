import { useState, useMemo } from 'react';
import {
  History,
  Search,
  Download,
  Eye,
  ShieldAlert,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Terminal,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import Input, { Select } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { formatDate, formatRelativeTime } from '../../utils/formatters';

const INITIAL_LOGS = [
  {
    id: 'LOG-2026-9901',
    timestamp: '2026-11-23T15:45:00Z',
    operator: 'SecOps Super Administrator',
    operatorEmail: 'admin@circularshield.security',
    category: 'Org Verification',
    action: 'ORGANIZATION_ACCREDITED',
    targetResource: 'BrainStation 23 (ORG-001)',
    targetType: 'Organization',
    severity: 'SECURITY',
    ipAddress: '103.25.244.18',
    location: 'Dhaka NOC Station 01',
    summary: 'Approved enterprise verification badge after DNS TXT and RJSC validation.',
    details: {
      previousStatus: 'pending_review',
      newStatus: 'verified',
      auditNote: 'Verified domain MX/TXT records match corporate trade license C-88190.',
      checksum: 'sha256-a94f8fe5ccb19ba61c4c0873d391e987982fbbd3',
    },
  },
  {
    id: 'LOG-2026-9902',
    timestamp: '2026-11-23T15:20:00Z',
    operator: 'SecOps Analyst (Shafiq)',
    operatorEmail: 'analyst@circularshield.org',
    category: 'Scam Moderation',
    action: 'SCAM_CONFIRMED_BLACKLIST',
    targetResource: 'Fake Railway Admit Fee (RPT-2026-9041)',
    targetType: 'Scam Report',
    severity: 'CRITICAL',
    ipAddress: '103.25.244.22',
    location: 'Chittagong Cyber Cell',
    summary: 'Confirmed illegal admit card deposit extortion. Flagged bKash wallet 01799-887766.',
    details: {
      previousStatus: 'under_investigation',
      newStatus: 'confirmed_scam',
      auditNote: 'bKash personal wallet linked to 8 other extortion reports across Rangpur.',
      checksum: 'sha256-f48a1c976d91199a6b9a897621f8a84620f4c081',
    },
  },
  {
    id: 'LOG-2026-9903',
    timestamp: '2026-11-23T14:10:00Z',
    operator: 'SecOps Super Administrator',
    operatorEmail: 'admin@circularshield.security',
    category: 'User Access',
    action: 'USER_DEACTIVATED',
    targetResource: 'Anisur Rahman (USR-8909)',
    targetType: 'User Account',
    severity: 'WARNING',
    ipAddress: '103.25.244.18',
    location: 'Dhaka NOC Station 01',
    summary: 'Deactivated account due to automated rapid scan flooding behavior.',
    details: {
      previousStatus: 'active',
      newStatus: 'deactivated',
      auditNote: 'Rate limiter triggered 340 POST requests/minute. Account placed in quarantine.',
      checksum: 'sha256-2e8b417c8003f901cb0098df98132aa57a220cf9',
    },
  },
  {
    id: 'LOG-2026-9904',
    timestamp: '2026-11-23T13:30:00Z',
    operator: 'SecOps Content Lead',
    operatorEmail: 'education@circularshield.org',
    category: 'Safety Tips',
    action: 'ARTICLE_PUBLISHED',
    targetResource: 'Payment Extortion Red Flags (ART-004)',
    targetType: 'Safety Guide',
    severity: 'INFO',
    ipAddress: '103.25.244.40',
    location: 'Dhaka HQ Node',
    summary: 'Published bilingual advisory guide on identifying bKash/Nagad fee traps.',
    details: {
      previousStatus: 'draft',
      newStatus: 'published',
      auditNote: 'English and Bangla translations approved for immediate public syndication.',
      checksum: 'sha256-89b1c7820a004ef9bc811094da55b770921ec567',
    },
  },
  {
    id: 'LOG-2026-9905',
    timestamp: '2026-11-23T12:05:00Z',
    operator: 'SecOps Super Administrator',
    operatorEmail: 'admin@circularshield.security',
    category: 'System Policies',
    action: 'SECURITY_THRESHOLD_ADJUSTED',
    targetResource: 'Fraud Detection Engine v2.6',
    targetType: 'System Configuration',
    severity: 'CRITICAL',
    ipAddress: '103.25.244.18',
    location: 'Dhaka NOC Station 01',
    summary: 'Elevated upfront fee weight coefficient from 0.75 to 0.90 in risk formula.',
    details: {
      previousStatus: 'weight_0.75',
      newStatus: 'weight_0.90',
      auditNote: 'Policy amendment following national spike in fake military circular deposits.',
      checksum: 'sha256-559d8170c812bb31980aef871b9c2980fa24177d',
    },
  },
  {
    id: 'LOG-2026-9906',
    timestamp: '2026-11-23T11:15:00Z',
    operator: 'SecOps Analyst (Shafiq)',
    operatorEmail: 'analyst@circularshield.org',
    category: 'Org Verification',
    action: 'ORGANIZATION_REJECTED',
    targetResource: 'Delta Overseas Placement Agency (VER-403)',
    targetType: 'Organization Verification',
    severity: 'WARNING',
    ipAddress: '103.25.244.22',
    location: 'Chittagong Cyber Cell',
    summary: 'Rejected accreditation request due to fraudulent BMET license and free Gmail host.',
    details: {
      previousStatus: 'pending',
      newStatus: 'rejected_blacklisted',
      auditNote: 'BMET registration number was counterfeit; entity domain forwarded to scam server.',
      checksum: 'sha256-78ab319e07f9188a910bc45d911ec59082da419c',
    },
  },
  {
    id: 'LOG-2026-9907',
    timestamp: '2026-11-23T09:40:00Z',
    operator: 'SecOps Super Administrator',
    operatorEmail: 'admin@circularshield.security',
    category: 'User Access',
    action: 'USER_ROLE_PROMOTED',
    targetResource: 'Dr. Mahmudul Karim (USR-8907)',
    targetType: 'User Account',
    severity: 'INFO',
    ipAddress: '103.25.244.18',
    location: 'Dhaka NOC Station 01',
    summary: 'Promoted citizen researcher account to Certified Whistleblower Analyst role.',
    details: {
      previousStatus: 'Candidate / Job Seeker',
      newStatus: 'Whistleblower Analyst',
      auditNote: 'Institutional credentials verified through Dhaka University Department of CSE.',
      checksum: 'sha256-cc910a76f284b9101c78e3810f92da8470a191bc',
    },
  },
  {
    id: 'LOG-2026-9908',
    timestamp: '2026-11-23T08:15:00Z',
    operator: 'SecOps Analyst (Shafiq)',
    operatorEmail: 'analyst@circularshield.org',
    category: 'Scam Moderation',
    action: 'REPORT_DISMISSED_NON_THREAT',
    targetResource: 'Apex Regional Retail Division (RPT-2026-9044)',
    targetType: 'Scam Report',
    severity: 'INFO',
    ipAddress: '103.25.244.22',
    location: 'Chittagong Cyber Cell',
    summary: 'Dismissed candidate complaint after verifying call originated from genuine HR.',
    details: {
      previousStatus: 'pending',
      newStatus: 'rejected',
      auditNote: 'Official Apex HR confirmed legitimate interview scheduling call; zero money was demanded.',
      checksum: 'sha256-44bc91238e019fa1187c554901ad8992e109fac8',
    },
  },
  {
    id: 'LOG-2026-9909',
    timestamp: '2026-11-22T17:30:00Z',
    operator: 'SecOps Super Administrator',
    operatorEmail: 'admin@circularshield.security',
    category: 'System Policies',
    action: 'IP_RADAR_QUARANTINE',
    targetResource: 'Subnet 192.168.100.0/24 (Proxy Network)',
    targetType: 'Firewall Policy',
    severity: 'CRITICAL',
    ipAddress: '103.25.244.18',
    location: 'Dhaka NOC Station 01',
    summary: 'Quarantined automated bot IP range generating counterfeit circular submissions.',
    details: {
      previousStatus: 'whitelisted',
      newStatus: 'blocked',
      auditNote: 'Syndicate attempted to submit 40 fake circular approvals via headless scrapers.',
      checksum: 'sha256-11ac9800e123fa45610bc78901de3456789abcde',
    },
  },
  {
    id: 'LOG-2026-9910',
    timestamp: '2026-11-22T15:10:00Z',
    operator: 'SecOps Super Administrator',
    operatorEmail: 'admin@circularshield.security',
    category: 'Org Verification',
    action: 'ORGANIZATION_ACCREDITED',
    targetResource: 'Pathao Logistics & Technologies (ORG-002)',
    targetType: 'Organization',
    severity: 'SECURITY',
    ipAddress: '103.25.244.18',
    location: 'Dhaka NOC Station 01',
    summary: 'Approved Pathao verification badge after corporate career domain validation.',
    details: {
      previousStatus: 'pending',
      newStatus: 'verified',
      auditNote: 'Career portal https://pathao.com/careers authenticated via SSL and DNS.',
      checksum: 'sha256-99ee8812ab34cd56ef78901234567890abcdef12',
    },
  },
];

const ITEMS_PER_PAGE = 6;

export default function AdminActivityLog() {
  const [logs] = useState(INITIAL_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState(null);
  const [exportNotice, setExportNotice] = useState('');

  // Filtering
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        log.id.toLowerCase().includes(q) ||
        log.operator.toLowerCase().includes(q) ||
        log.summary.toLowerCase().includes(q) ||
        log.targetResource.toLowerCase().includes(q) ||
        log.ipAddress.toLowerCase().includes(q);

      const matchesCat = categoryFilter === 'all' || log.category === categoryFilter;
      const matchesSev = severityFilter === 'all' || log.severity === severityFilter;

      return matchesSearch && matchesCat && matchesSev;
    });
  }, [logs, searchQuery, categoryFilter, severityFilter]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return <Badge variant="suspicious" size="sm">CRITICAL</Badge>;
      case 'WARNING':
        return <Badge variant="warning" size="sm">WARNING</Badge>;
      case 'SECURITY':
        return <Badge variant="verified" size="sm">SECURITY</Badge>;
      default:
        return <Badge variant="neutral" size="sm">INFO</Badge>;
    }
  };

  const handleExport = () => {
    const jsonStr = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `circularshield_audit_logs_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setExportNotice('Audit log dataset successfully compiled and exported as JSON.');
    setTimeout(() => setExportNotice(''), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <PageHeader
        breadcrumbs={[
          { label: 'Admin', to: '/admin/dashboard' },
          { label: 'Settings', to: '/admin/settings' },
          { label: 'Activity Log' },
        ]}
        title="Administrative Activity & Audit Trail"
        subtitle="Security log of administrative actions, user account changes, and system events."
        badgeText="SecOps Compliance"
        actions={
          <Button
            variant="secondary"
            size="md"
            leftIcon={Download}
            onClick={handleExport}
            className="text-xs font-semibold shadow-xs"
          >
            Export Audit Log (JSON)
          </Button>
        }
      />

      {/* Export Notification Toast */}
      {exportNotice && (
        <div className="p-3.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-between text-xs font-semibold text-[#16A36A] animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{exportNotice}</span>
          </div>
          <button onClick={() => setExportNotice('')} className="p-1 hover:bg-[#D1FAE5] rounded cursor-pointer">
            &times;
          </button>
        </div>
      )}

      {/* KPI Overview Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#64748B]">Total Logged Actions</p>
            <p className="text-2xl font-bold text-[#102C3A] mt-1">{logs.length}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-[#F1F5F8] text-[#102C3A]">
            <History size={20} />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#64748B]">Critical Interventions</p>
            <p className="text-2xl font-bold text-[#DC4B4B] mt-1">
              {logs.filter((l) => l.severity === 'CRITICAL').length}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-[#FEF2F2] text-[#DC4B4B]">
            <ShieldAlert size={20} />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#64748B]">Security Accreditations</p>
            <p className="text-2xl font-bold text-[#16A36A] mt-1">
              {logs.filter((l) => l.severity === 'SECURITY').length}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-[#ECFDF5] text-[#16A36A]">
            <ShieldCheck size={20} />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#64748B]">Active SecOps Stations</p>
            <p className="text-2xl font-bold text-[#087F70] mt-1">3 Stations</p>
          </div>
          <div className="p-2.5 rounded-lg bg-[#F0FDF9] text-[#087F70]">
            <Terminal size={20} />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 bg-white border border-[#E2E8F0] shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6">
            <Input
              placeholder="Search by operator, action, resource, or IP address..."
              leftIcon={Search}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              clearable
            />
          </div>

          <div className="sm:col-span-3">
            <Select
              options={[
                { value: 'all', label: 'All Action Categories' },
                { value: 'Org Verification', label: 'Organization Verification' },
                { value: 'Scam Moderation', label: 'Scam Report Moderation' },
                { value: 'User Access', label: 'User & Identity Access' },
                { value: 'Safety Tips', label: 'Safety Guides & Content' },
                { value: 'System Policies', label: 'Threat Radar & Policies' },
              ]}
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="sm:col-span-3">
            <Select
              options={[
                { value: 'all', label: 'All Severities' },
                { value: 'CRITICAL', label: 'Critical Threats' },
                { value: 'WARNING', label: 'Warnings / Blocks' },
                { value: 'SECURITY', label: 'Security Accreditations' },
                { value: 'INFO', label: 'Informational Events' },
              ]}
              value={severityFilter}
              onChange={(e) => {
                setSeverityFilter(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </Card>

      {/* Audit Log Table */}
      <Card className="bg-white border border-[#E2E8F0] shadow-sm overflow-hidden">
        <CardHeader className="px-5 py-4 border-b border-[#F1F5F8] flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-[#102C3A]">
              Immutable Audit Ledger
            </CardTitle>
            <CardDescription className="text-xs text-[#64748B]">
              Showing {filteredLogs.length === 0 ? 0 : startIndex + 1} to{' '}
              {Math.min(startIndex + ITEMS_PER_PAGE, filteredLogs.length)} of {filteredLogs.length} logged events
            </CardDescription>
          </div>

          {(searchQuery || categoryFilter !== 'all' || severityFilter !== 'all') && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={RotateCcw}
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
                setSeverityFilter('all');
                setCurrentPage(1);
              }}
              className="text-xs"
            >
              Reset Filters
            </Button>
          )}
        </CardHeader>

        <CardContent className="p-0">
          {filteredLogs.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#F1F5F8] flex items-center justify-center mx-auto text-[#94A3B8]">
                <Search size={22} />
              </div>
              <p className="text-sm font-semibold text-[#182B36]">No audit logs match criteria</p>
              <p className="text-xs text-[#64748B]">Try expanding your search query or selecting all categories.</p>
            </div>
          ) : (
            <>
              {/* Desktop / Tablet Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider font-semibold">
                      <th className="py-3 px-4">Event ID & Time</th>
                      <th className="py-3 px-4">SecOps Operator</th>
                      <th className="py-3 px-4">Action & Resource</th>
                      <th className="py-3 px-4">Workstation Node</th>
                      <th className="py-3 px-4">Severity</th>
                      <th className="py-3 px-4 text-right">Inspection</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {paginatedLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-[#F8FAFC]/80 transition-colors">
                        {/* Timestamp */}
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-[#102C3A] block">
                            {log.id}
                          </span>
                          <span className="text-[11px] text-[#64748B] block mt-0.5">
                            {formatDate(log.timestamp)} ({formatRelativeTime(log.timestamp)})
                          </span>
                        </td>

                        {/* Operator */}
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-[#102C3A] block">
                            {log.operator}
                          </span>
                          <span className="text-[11px] text-[#64748B] font-mono">
                            {log.operatorEmail}
                          </span>
                        </td>

                        {/* Action & Resource */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#F1F5F8] text-[#102C3A] font-bold">
                              {log.action}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-[#182B36] truncate">
                            {log.targetResource}
                          </p>
                          <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                            {log.summary}
                          </p>
                        </td>

                        {/* Node & IP */}
                        <td className="py-3.5 px-4 font-mono text-[11px]">
                          <span className="text-[#102C3A] block font-semibold">
                            {log.ipAddress}
                          </span>
                          <span className="text-[#64748B] block text-[10px]">
                            {log.location}
                          </span>
                        </td>

                        {/* Severity */}
                        <td className="py-3.5 px-4">
                          {getSeverityBadge(log.severity)}
                        </td>

                        {/* Action */}
                        <td className="py-3.5 px-4 text-right">
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={Eye}
                            onClick={() => setSelectedLog(log)}
                            className="text-xs h-8"
                          >
                            Inspect
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Stacked Cards (Zero Horizontal Scroll) */}
              <div className="sm:hidden divide-y divide-[#F1F5F8]">
                {paginatedLogs.map((log) => (
                  <div key={log.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <span className="font-mono text-[10px] text-[#087F70] bg-[#087F70]/10 px-2 py-0.5 rounded font-bold">
                          {log.id}
                        </span>
                        <h4 className="font-bold text-sm text-[#102C3A] line-clamp-1 pt-1">
                          {log.targetResource}
                        </h4>
                        <p className="text-[11px] font-mono uppercase text-[#64748B]">
                          {log.action}
                        </p>
                      </div>
                      {getSeverityBadge(log.severity)}
                    </div>

                    <p className="text-xs text-[#475569] leading-relaxed line-clamp-2">
                      {log.summary}
                    </p>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-[#F8FAFC] text-[#64748B]">
                      <span>{log.operator}</span>
                      <span className="font-mono text-[11px]">{log.ipAddress}</span>
                    </div>

                    <div className="pt-1">
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={Eye}
                        onClick={() => setSelectedLog(log)}
                        className="w-full justify-center text-xs h-8.5 font-semibold"
                      >
                        Inspect Audit Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-[#F1F5F8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-[#F8FAFC]">
              <span className="text-[#64748B]">
                Page <strong>{safePage}</strong> of <strong>{totalPages}</strong>
              </span>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={safePage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="h-8 px-2"
                >
                  <ChevronLeft size={16} />
                  <span className="hidden sm:inline ml-1">Previous</span>
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setCurrentPage(num)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      safePage === num
                        ? 'bg-[#087F70] text-white shadow-xs'
                        : 'bg-white border border-[#CBD5E1] text-[#475569] hover:bg-[#F1F5F8]'
                    }`}
                  >
                    {num}
                  </button>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={safePage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className="h-8 px-2"
                >
                  <span className="hidden sm:inline mr-1">Next</span>
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audit Event Detail Inspection Modal */}
      {selectedLog && (
        <Modal
          isOpen={!!selectedLog}
          onClose={() => setSelectedLog(null)}
          title={`Audit Event Inspection: ${selectedLog.id}`}
          description={`Timestamp: ${formatDate(selectedLog.timestamp)} • Station: ${selectedLog.location}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4 text-xs text-[#182B36]">
            {/* Action Banner */}
            <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#64748B] uppercase font-bold block">
                  Action Code
                </span>
                <span className="text-sm font-mono font-bold text-[#102C3A]">
                  {selectedLog.action}
                </span>
              </div>
              <div>{getSeverityBadge(selectedLog.severity)}</div>
            </div>

            {/* Operator Footprint */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-[#F1F5F8] border border-[#E2E8EC]">
                <span className="text-[10px] text-[#64748B] block uppercase font-bold">Operator ID</span>
                <span className="font-bold text-[#102C3A] block mt-0.5">{selectedLog.operator}</span>
                <span className="text-[11px] text-[#64748B] font-mono">{selectedLog.operatorEmail}</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F1F5F8] border border-[#E2E8EC]">
                <span className="text-[10px] text-[#64748B] block uppercase font-bold">Origin Terminal</span>
                <span className="font-bold text-[#102C3A] block mt-0.5 font-mono">{selectedLog.ipAddress}</span>
                <span className="text-[11px] text-[#64748B]">{selectedLog.location}</span>
              </div>
            </div>

            {/* Target Information */}
            <div className="p-3 rounded-xl border border-[#E2E8F0] space-y-1.5">
              <span className="text-[10px] text-[#64748B] uppercase font-bold block">
                Targeted Platform Resource
              </span>
              <p className="font-bold text-[#102C3A] text-sm">
                {selectedLog.targetResource}
              </p>
              <p className="text-xs text-[#475569] leading-relaxed">
                {selectedLog.summary}
              </p>
            </div>

            {/* Diff / State Payload */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-[#64748B] uppercase font-bold block">
                State Transition Diff
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-[#DC4B4B]">
                  <span className="text-[10px] uppercase font-bold block text-[#B91C1C]">Before</span>
                  <span className="mt-1 block font-bold">{selectedLog.details.previousStatus}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] text-[#16A36A]">
                  <span className="text-[10px] uppercase font-bold block text-[#047857]">After</span>
                  <span className="mt-1 block font-bold">{selectedLog.details.newStatus}</span>
                </div>
              </div>
            </div>

            {/* Audit Notes */}
            <div className="space-y-1">
              <span className="text-[10px] text-[#64748B] uppercase font-bold block">
                Operator Investigation Assessment
              </span>
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-slate-700 leading-relaxed font-sans">
                {selectedLog.details.auditNote}
              </div>
            </div>

            {/* Cryptographic Checksum */}
            <div className="p-2.5 rounded-lg bg-[#0F172A] text-slate-300 font-mono text-[10px] space-y-1">
              <span className="text-slate-400 block font-bold">Cryptographic Ledger Signature:</span>
              <span className="text-[#00E5C9] break-all block">{selectedLog.details.checksum}</span>
            </div>

            {/* Close */}
            <div className="flex justify-end pt-2">
              <Button variant="secondary" onClick={() => setSelectedLog(null)}>
                Dismiss Inspection
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
