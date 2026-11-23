import { useState } from 'react';
import {
  AlertOctagon,
  Search,
  CheckCircle2,
  Eye,
  X,
  FileText,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Input, { Select } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, EmptyState } from '../../components/ui/Table';
import { formatDate, formatRelativeTime } from '../../utils/formatters';
import { ADMIN_RECENT_REPORTS } from '../../data/adminMockData';
import { useMockData } from '../../context/useMockData';

export const AdminReportManagement = () => {
  const { scamReports, updateReportStatus } = useMockData();
  const reports = scamReports || ADMIN_RECENT_REPORTS;

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [evidenceModalReport, setEvidenceModalReport] = useState(null);
  const [actionToast, setActionToast] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Confirmation Modals for critical actions
  const [reportToConfirmScam, setReportToConfirmScam] = useState(null);
  const [reportToReject, setReportToReject] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('Insufficient evidence or unverified extortion claims.');

  // Filter logic
  const filteredReports = reports.filter((r) => {
    const q = searchQuery.trim().toLowerCase();
    const matchQuery =
      !q ||
      r.title.toLowerCase().includes(q) ||
      r.targetEntity.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q) ||
      r.reporter.toLowerCase().includes(q);

    const matchStatus =
      statusFilter === 'all' || r.status === statusFilter;

    const matchCategory =
      categoryFilter === 'all' || r.category === categoryFilter;

    return matchQuery && matchStatus && matchCategory;
  });

  const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredReports.length);
  const paginatedReports = filteredReports.slice(startIndex, endIndex);

  // Status transition handler (approve, review, reject, resolve)
  const handleUpdateStatus = (reportId, newStatus) => {
    if (updateReportStatus) {
      updateReportStatus(reportId, newStatus);
    }
    const label =
      newStatus === 'confirmed_scam'
        ? 'Confirmed as Scam'
        : newStatus === 'rejected'
        ? 'Rejected / Dismissed'
        : newStatus === 'resolved'
        ? 'Resolved'
        : 'Moved to Under Investigation';

    setActionToast(`Report ${reportId} has been ${label}.`);
    if (selectedReport?.id === reportId) {
      setSelectedReport((prev) => ({ ...prev, status: newStatus }));
    }
    setTimeout(() => setActionToast(''), 4000);
  };

  const executeConfirmScam = () => {
    if (!reportToConfirmScam) return;
    const reportId = reportToConfirmScam.id;
    handleUpdateStatus(reportId, 'confirmed_scam');
    setReportToConfirmScam(null);
  };

  const executeRejectReport = () => {
    if (!reportToReject) return;
    const reportId = reportToReject.id;
    handleUpdateStatus(reportId, 'rejected');
    setReportToReject(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        breadcrumbs={[
          { label: 'Admin', to: '/admin/dashboard' },
          { label: 'Scam Reports' },
        ]}
        title="Scam Report Management"
        subtitle="Review community-reported fake circulars, phone extortion demands, and evidence submissions."
      />

      {/* Action Toast */}
      {actionToast && (
        <div className="p-3.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-between text-xs font-semibold text-[#16A36A] animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{actionToast}</span>
          </div>
          <button onClick={() => setActionToast('')} className="p-1 hover:bg-[#D1FAE5] rounded cursor-pointer">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Search and Filters Bar */}
      <Card className="p-4 bg-white border border-[#E2E8F0] shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6">
            <Input
              placeholder="Search by title, target entity, reporter, or report ID..."
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
                { value: 'all', label: 'All Categories' },
                { value: 'Fake Job Circular', label: 'Fake Job Circular' },
                { value: 'Fake Company', label: 'Fake Company' },
                { value: 'Suspicious Phone Number', label: 'Suspicious Phone Number' },
                { value: 'Fake bKash/Nagad Number', label: 'Fake bKash/Nagad Number' },
                { value: 'Fraudulent Application Link', label: 'Fraudulent Application Link' },
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
                { value: 'all', label: 'All Statuses' },
                { value: 'pending', label: 'Pending Triage' },
                { value: 'investigating', label: 'Under Review' },
                { value: 'confirmed_scam', label: 'Confirmed Scams' },
                { value: 'resolved', label: 'Resolved / Neutralized' },
                { value: 'rejected', label: 'Rejected / Disproven' },
              ]}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </Card>

      {/* Results Header Counter */}
      <div className="flex items-center justify-between text-xs text-[#64748B] px-1">
        <span>
          Showing <strong className="text-[#102C3A]">{filteredReports.length}</strong> of{' '}
          <strong className="text-[#102C3A]">{reports.length}</strong> whistleblower submissions
        </span>
        {(searchQuery || statusFilter !== 'all' || categoryFilter !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setCategoryFilter('all');
              setCurrentPage(1);
            }}
            className="text-[#087F70] hover:underline cursor-pointer flex items-center gap-1 font-medium"
          >
            <RotateCcw size={12} />
            Reset Filters
          </button>
        )}
      </div>

      {/* Reports Table (Desktop) & Stacked Cards (Mobile) */}
      <Card className="bg-white border-[#E2E8F0] shadow-sm overflow-hidden">
        {/* Desktop / Tablet Table */}
        <div className="hidden sm:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Dossier</TableHead>
                <TableHead>Target Entity</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Demanded</TableHead>
                <TableHead>Current Status</TableHead>
                <TableHead className="text-right">Triage Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <EmptyState
                      icon={AlertOctagon}
                      title="No scam reports found"
                      description="No whistleblower reports matched your search filters."
                      action={
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSearchQuery('');
                            setStatusFilter('all');
                            setCategoryFilter('all');
                            setCurrentPage(1);
                          }}
                        >
                          Clear Filters
                        </Button>
                      }
                    />
                  </TableCell>
                </TableRow>
              ) : (
                paginatedReports.map((r) => (
                  <TableRow key={r.id} className="group">
                    {/* Report ID & Title */}
                    <TableCell>
                      <div className="space-y-0.5">
                        <span className="font-mono text-[11px] font-bold text-[#087F70] bg-[#087F70]/10 px-2 py-0.5 rounded">
                          {r.id}
                        </span>
                        <p className="font-semibold text-xs sm:text-sm text-[#102C3A] group-hover:text-[#087F70] transition-colors line-clamp-1">
                          {r.title}
                        </p>
                        <p className="text-[11px] text-[#94A3B8]">
                          Submitted by {r.reporter} • {formatRelativeTime(r.reportedDate)}
                        </p>
                      </div>
                    </TableCell>

                    {/* Target Entity */}
                    <TableCell>
                      <span className="text-xs font-bold text-[#102C3A] block truncate max-w-xs">
                        {r.targetEntity}
                      </span>
                    </TableCell>

                    {/* Category */}
                    <TableCell>
                      <span className="text-xs text-[#64748B] block truncate max-w-[140px]">
                        {r.category}
                      </span>
                    </TableCell>

                    {/* Demanded */}
                    <TableCell>
                      <span className="font-mono font-bold text-xs text-[#DC4B4B]">
                        {r.amountDemanded}
                      </span>
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell>
                      <Badge
                        variant={
                          r.status === 'confirmed_scam'
                            ? 'suspicious'
                            : r.status === 'investigating' || r.status === 'pending'
                            ? 'unverified'
                            : r.status === 'resolved'
                            ? 'verified'
                            : 'default'
                        }
                        size="sm"
                        showDot
                      >
                        {r.status === 'confirmed_scam'
                          ? 'CONFIRMED SCAM'
                          : r.status === 'investigating'
                          ? 'UNDER REVIEW'
                          : r.status === 'pending'
                          ? 'PENDING'
                          : r.status === 'resolved'
                          ? 'RESOLVED'
                          : 'REJECTED'}
                      </Badge>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Inspect Details */}
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={Eye}
                          onClick={() => setSelectedReport(r)}
                        >
                          Details
                        </Button>

                        {/* View Evidence */}
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={FileText}
                          onClick={() => setEvidenceModalReport(r)}
                        >
                          Evidence
                        </Button>

                        {/* Approve as Scam */}
                        {r.status !== 'confirmed_scam' && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => setReportToConfirmScam(r)}
                          >
                            Confirm Scam
                          </Button>
                        )}

                        {/* Reject */}
                        {r.status !== 'rejected' && r.status !== 'confirmed_scam' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#64748B] hover:text-[#DC4B4B]"
                            onClick={() => setReportToReject(r)}
                          >
                            Reject
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Stacked Cards (Zero Horizontal Scroll) */}
        <div className="sm:hidden divide-y divide-[#F1F5F8]">
          {filteredReports.length === 0 ? (
            <div className="p-6 text-center">
              <EmptyState
                icon={AlertOctagon}
                title="No scam reports found"
                description="No whistleblower reports matched your search filters."
                action={
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                      setCategoryFilter('all');
                      setCurrentPage(1);
                    }}
                  >
                    Clear Filters
                  </Button>
                }
              />
            </div>
          ) : (
            paginatedReports.map((r) => (
              <div key={r.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <span className="font-mono text-[10px] text-[#087F70] bg-[#087F70]/10 px-2 py-0.5 rounded font-bold">
                      {r.id}
                    </span>
                    <h4 className="font-bold text-sm text-[#102C3A] line-clamp-1 pt-1">
                      {r.targetEntity}
                    </h4>
                    <p className="text-xs text-[#64748B] line-clamp-1">
                      {r.title}
                    </p>
                  </div>
                  <Badge
                    variant={
                      r.status === 'confirmed_scam'
                        ? 'suspicious'
                        : r.status === 'investigating' || r.status === 'pending'
                        ? 'unverified'
                        : r.status === 'resolved'
                        ? 'verified'
                        : 'default'
                    }
                    size="sm"
                    showDot
                  >
                    {r.status === 'confirmed_scam'
                      ? 'CONFIRMED'
                      : r.status === 'investigating'
                      ? 'REVIEW'
                      : r.status === 'pending'
                      ? 'PENDING'
                      : r.status === 'resolved'
                      ? 'RESOLVED'
                      : 'REJECTED'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-[#F8FAFC] text-[#64748B]">
                  <span>{r.category}</span>
                  <span className="font-mono font-bold text-[#DC4B4B]">{r.amountDemanded}</span>
                </div>

                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={Eye}
                    onClick={() => setSelectedReport(r)}
                    className="flex-1 justify-center text-xs h-8.5 font-semibold min-w-[90px]"
                  >
                    Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={FileText}
                    onClick={() => setEvidenceModalReport(r)}
                    className="flex-1 justify-center text-xs h-8.5 font-semibold min-w-[90px]"
                  >
                    Evidence
                  </Button>
                  {r.status !== 'confirmed_scam' && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setReportToConfirmScam(r)}
                      className="text-xs h-8.5 font-semibold px-3"
                    >
                      Confirm
                    </Button>
                  )}
                  {r.status !== 'rejected' && r.status !== 'confirmed_scam' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-8.5 px-3 text-[#DC4B4B]"
                      onClick={() => setReportToReject(r)}
                    >
                      Reject
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Table Pagination Footer */}
        {filteredReports.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-[#F8FAFC] border-t border-[#E2E8F0]">
            <div className="text-xs text-[#64748B]">
              Showing <span className="font-semibold text-[#102C3A]">{startIndex + 1}</span> to{' '}
              <span className="font-semibold text-[#102C3A]">{endIndex}</span> of{' '}
              <span className="font-semibold text-[#102C3A]">{filteredReports.length}</span> reports
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="h-8 px-2.5 text-xs"
              >
                <ChevronLeft size={14} className="mr-1" />
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`h-8 w-8 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      currentPage === pageNum
                        ? 'bg-[#102C3A] text-white shadow-xs'
                        : 'bg-white text-[#64748B] hover:bg-[#F1F5F8] border border-[#E2E8F0]'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="h-8 px-2.5 text-xs"
              >
                Next
                <ChevronRight size={14} className="ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* REPORT DETAILS MODAL */}
      {selectedReport && (
        <Modal
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          title={`Whistleblower Dossier: ${selectedReport.id}`}
          description={`Filed on ${formatDate(selectedReport.reportedDate)} by ${selectedReport.reporter}`}
          footer={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    const target = selectedReport;
                    setSelectedReport(null);
                    setReportToConfirmScam(target);
                  }}
                >
                  Confirm as Scam
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const target = selectedReport;
                    setSelectedReport(null);
                    setReportToReject(target);
                  }}
                >
                  Reject Report
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleUpdateStatus(selectedReport.id, 'resolved')}
                >
                  Mark Resolved
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedReport(null)}
              >
                Close
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FECACA] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#DC4B4B]">
                  {selectedReport.title}
                </span>
                <Badge variant="suspicious" size="sm">
                  {selectedReport.priority.toUpperCase()} PRIORITY
                </Badge>
              </div>
              <p className="text-[#64748B]">
                Target Impersonated Entity: <strong className="text-[#102C3A]">{selectedReport.targetEntity}</strong>
              </p>
              <p className="text-[#64748B]">
                Category: <strong className="text-[#102C3A]">{selectedReport.category}</strong>
              </p>
              <p className="text-[#64748B]">
                Financial Demand: <strong className="text-[#DC4B4B]">{selectedReport.amountDemanded}</strong>
              </p>
            </div>

            <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-1.5">
              <span className="font-bold text-[#102C3A] block">Whistleblower Incident Summary:</span>
              <p className="text-[#64748B] leading-relaxed">
                {selectedReport.summary || selectedReport.evidenceDetails || 'The victim was solicited through an unofficial messaging channel and requested to transfer verification and admit card fees before accessing an interview room.'}
              </p>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#E2E8F0]">
              <span className="font-bold text-[#102C3A]">Attached Proof & Evidentiary Artifacts:</span>
              <Button
                variant="outline"
                size="sm"
                leftIcon={FileText}
                onClick={() => {
                  const target = selectedReport;
                  setSelectedReport(null);
                  setEvidenceModalReport(target);
                }}
              >
                View Evidence Files
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* SUBMITTED EVIDENCE MODAL */}
      {evidenceModalReport && (
        <Modal
          isOpen={!!evidenceModalReport}
          onClose={() => setEvidenceModalReport(null)}
          title={`Evidentiary Artifacts: ${evidenceModalReport.id}`}
          description={`Submitted evidence files and forensic screenshots for ${evidenceModalReport.targetEntity}`}
          footer={
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEvidenceModalReport(null)}
            >
              Close Evidence
            </Button>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
              <span className="font-bold text-[#102C3A] block">Evidence Summary Note:</span>
              <p className="text-[#64748B] leading-relaxed">
                {evidenceModalReport.evidenceDetails || 'Transaction slip, fake circular notice, and screenshot of WhatsApp demand.'}
              </p>
            </div>

            {/* Mock Evidence Image Gallery */}
            <div className="space-y-2">
              <span className="font-bold text-[#102C3A] block">Uploaded Evidence Artifacts:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-2 bg-white rounded-xl border border-[#E2E8F0] space-y-2">
                  <div className="h-44 rounded-lg overflow-hidden bg-[#102C3A]/5 flex items-center justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1572945281869-826b8e485e07?w=500&auto=format&fit=crop&q=80"
                      alt="Scam Circular Slip"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=500&auto=format&fit=crop&q=80';
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                    <span>Counterfeit Circular Header.pdf</span>
                    <span className="font-bold text-[#DC4B4B]">High Severity</span>
                  </div>
                </div>

                <div className="p-2 bg-white rounded-xl border border-[#E2E8F0] space-y-2">
                  <div className="h-44 rounded-lg overflow-hidden bg-[#102C3A]/5 flex items-center justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=500&auto=format&fit=crop&q=80"
                      alt="Transaction Transfer Screenshot"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80';
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                    <span>bKash Transfer Demand Screenshot.png</span>
                    <span className="font-bold text-[#DC4B4B]">Evidence Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* CONFIRM SCAM THREAT ESCALATION MODAL */}
      {reportToConfirmScam && (
        <Modal
          isOpen={!!reportToConfirmScam}
          onClose={() => setReportToConfirmScam(null)}
          title="Confirm Threat Escalation & Scam Flagging"
          description={`Report ID: ${reportToConfirmScam.id} • Target: ${reportToConfirmScam.targetEntity}`}
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setReportToConfirmScam(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                leftIcon={ShieldAlert}
                onClick={executeConfirmScam}
              >
                Confirm as Scam & Escalate
              </Button>
            </div>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-3">
              <AlertTriangle size={20} className="text-[#DC4B4B] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-[#DC4B4B]">Critical Action: Cyber Enforcement & Blacklist</p>
                <p className="text-[#64748B] leading-relaxed">
                  Confirming this report will officially mark the circular as a confirmed scam, blacklist associated payment accounts (e.g. {reportToConfirmScam.amountDemanded} extortion), and automatically notify the CID Cyber Police Unit.
                </p>
              </div>
            </div>
            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-1">
              <span className="font-semibold text-[#102C3A]">Report Summary:</span>
              <p className="text-[#64748B]">{reportToConfirmScam.title}</p>
            </div>
          </div>
        </Modal>
      )}

      {/* REJECT REPORT CONFIRMATION MODAL */}
      {reportToReject && (
        <Modal
          isOpen={!!reportToReject}
          onClose={() => setReportToReject(null)}
          title="Dismiss Whistleblower Report"
          description={`Report ID: ${reportToReject.id} • Target: ${reportToReject.targetEntity}`}
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setReportToReject(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={executeRejectReport}
              >
                Confirm Dismissal
              </Button>
            </div>
          }
        >
          <div className="space-y-3 text-xs">
            <p className="text-[#64748B] leading-relaxed">
              Are you sure you want to dismiss this report? It will be marked as rejected and removed from active investigation triage.
            </p>
            <Input
              label="Auditor Rejection Reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason for rejection..."
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminReportManagement;
