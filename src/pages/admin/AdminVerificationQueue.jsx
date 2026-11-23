import { useState } from 'react';
import {
  ShieldCheck,
  ExternalLink,
  Check,
  X,
  AlertTriangle,
  Globe,
  CheckCircle2,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, EmptyState } from '../../components/ui/Table';
import { formatDate } from '../../utils/formatters';
import { ADMIN_RECENT_VERIFICATIONS } from '../../data/adminMockData';
import { useMockData } from '../../context/useMockData';

export const AdminVerificationQueue = () => {
  const { verificationQueue, approveVerification, rejectVerification } = useMockData();
  const queue = verificationQueue || ADMIN_RECENT_VERIFICATIONS;

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending'); // 'pending' | 'all' | 'verified' | 'flagged'
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [rejectionModalItem, setRejectionModalItem] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('Forged documentation or domain impersonation.');
  const [actionToast, setActionToast] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Critical Action Confirmation Modals
  const [orgToApprove, setOrgToApprove] = useState(null);

  const filteredQueue = queue.filter((item) => {
    const q = searchQuery.trim().toLowerCase();
    const matchSearch =
      !q ||
      item.organization.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q);

    const matchStatus =
      filterStatus === 'all' || item.status === filterStatus;

    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredQueue.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredQueue.length);
  const paginatedQueue = filteredQueue.slice(startIndex, endIndex);

  const handleApprove = (item) => {
    if (approveVerification) {
      approveVerification(item.id);
    }
    setActionToast(`Organization "${item.organization}" has been certified as Verified Enterprise Tier-1.`);
    if (selectedVerification?.id === item.id) {
      setSelectedVerification(null);
    }
    setTimeout(() => setActionToast(''), 4000);
  };

  const executeConfirmApprove = () => {
    if (!orgToApprove) return;
    handleApprove(orgToApprove);
    setOrgToApprove(null);
  };

  const handleConfirmReject = () => {
    if (!rejectionModalItem) return;
    const orgName = rejectionModalItem.organization;

    if (rejectVerification) {
      rejectVerification(rejectionModalItem.id, rejectionReason);
    }
    setActionToast(`Organization "${orgName}" rejected and flagged as suspicious.`);
    setRejectionModalItem(null);
    if (selectedVerification?.id === rejectionModalItem.id) {
      setSelectedVerification(null);
    }
    setTimeout(() => setActionToast(''), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        breadcrumbs={[
          { label: 'Admin', to: '/admin/dashboard' },
          { label: 'Verification Queue' },
        ]}
        title="Organization Verification"
        subtitle="Review corporate credentials, inspect official websites and career portals, and grant verified enterprise tier certification."
      />

      {/* Action Notification Toast */}
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

      {/* Filter Tabs & Search */}
      <Card className="p-4 bg-white border border-[#E2E8F0] shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Search by company or request ID..."
              leftIcon={Search}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              clearable
            />
          </div>

          <div className="inline-flex p-1 bg-[#F1F5F8] rounded-xl border border-[#E2E8EC]">
            {[
              { id: 'pending', label: 'Pending Audit', count: queue.filter(q => q.status === 'pending').length },
              { id: 'all', label: 'All Requests', count: queue.length },
              { id: 'verified', label: 'Approved', count: queue.filter(q => q.status === 'verified').length },
              { id: 'flagged', label: 'Flagged / Rejected', count: queue.filter(q => q.status === 'flagged').length },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setFilterStatus(tab.id);
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filterStatus === tab.id
                    ? 'bg-white text-[#102C3A] shadow-xs'
                    : 'text-[#64748B] hover:text-[#102C3A]'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#E2E8F0] text-[#475569]">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Verification Queue Table */}
      <Card className="bg-white border-[#E2E8F0] shadow-sm overflow-hidden">
        {/* Desktop / Tablet Table */}
        <div className="hidden sm:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization Application</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Digital Footprint</TableHead>
                <TableHead>Submitted Evidence</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Audit Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQueue.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <EmptyState
                      icon={ShieldCheck}
                      title="No verification requests in this view"
                      description="All pending enterprise verification requests have been audited."
                      action={
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSearchQuery('');
                            setFilterStatus('all');
                            setCurrentPage(1);
                          }}
                        >
                          View All Applications
                        </Button>
                      }
                    />
                  </TableCell>
                </TableRow>
              ) : (
                paginatedQueue.map((item) => (
                  <TableRow key={item.id} className="group">
                    {/* Organization Info */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={item.logo}
                          alt={item.organization}
                          className="w-10 h-10 rounded-xl object-cover border border-[#E2E8F0] shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-xs sm:text-sm text-[#102C3A] group-hover:text-[#087F70] transition-colors truncate">
                            {item.organization}
                          </p>
                          <p className="text-[11px] text-[#94A3B8]">
                            Request ID: <span className="font-mono text-[#087F70]">{item.id}</span> • {formatDate(item.requestDate)}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Category */}
                    <TableCell>
                      <span className="text-xs font-semibold text-[#102C3A]">
                        {item.category}
                      </span>
                    </TableCell>

                    {/* Official Website & Career Page */}
                    <TableCell>
                      <div className="space-y-1 text-xs">
                        {item.officialWebsite && (
                          <a
                            href={item.officialWebsite}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#087F70] hover:underline flex items-center gap-1 font-medium truncate max-w-[160px]"
                          >
                            <Globe size={11} className="shrink-0" />
                            <span>{item.officialWebsite.replace('https://', '')}</span>
                          </a>
                        )}
                        {item.officialCareerPage && (
                          <a
                            href={item.officialCareerPage}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#64748B] hover:underline flex items-center gap-1 text-[11px] truncate max-w-[160px]"
                          >
                            <ExternalLink size={10} className="shrink-0" />
                            <span>Career Portal</span>
                          </a>
                        )}
                      </div>
                    </TableCell>

                    {/* Documents Submitted */}
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {item.documentsSubmitted?.map((doc, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-[#F1F5F8] text-[#475569] px-2 py-0.5 rounded font-medium"
                          >
                            {doc}
                          </span>
                        ))}
                      </div>
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell>
                      <Badge
                        variant={
                          item.status === 'verified'
                            ? 'verified'
                            : item.status === 'flagged'
                            ? 'suspicious'
                            : 'unverified'
                        }
                        size="sm"
                        showDot
                      >
                        {item.status === 'verified'
                          ? 'VERIFIED'
                          : item.status === 'flagged'
                          ? 'FLAGGED / REJECTED'
                          : 'PENDING AUDIT'}
                      </Badge>
                    </TableCell>

                    {/* Action Buttons */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedVerification(item)}
                        >
                          Review
                        </Button>

                        {item.status === 'pending' && (
                          <>
                            <Button
                              variant="secondary"
                              size="sm"
                              leftIcon={Check}
                              onClick={() => setOrgToApprove(item)}
                            >
                              Verify
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              leftIcon={X}
                              onClick={() => setRejectionModalItem(item)}
                            >
                              Reject
                            </Button>
                          </>
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
          {filteredQueue.length === 0 ? (
            <div className="p-6 text-center">
              <EmptyState
                icon={ShieldCheck}
                title="No verification requests in this view"
                description="All pending enterprise verification requests have been audited."
                action={
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('');
                      setFilterStatus('all');
                      setCurrentPage(1);
                    }}
                  >
                    View All Applications
                  </Button>
                }
              />
            </div>
          ) : (
            paginatedQueue.map((item) => (
              <div key={item.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img
                      src={item.logo}
                      alt={item.organization}
                      className="w-10 h-10 rounded-xl object-cover border border-[#E2E8F0] shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm text-[#102C3A] truncate">
                        {item.organization}
                      </p>
                      <p className="text-xs text-[#64748B] truncate">
                        {item.category}
                      </p>
                      <span className="font-mono text-[10px] text-[#087F70] font-semibold">
                        {item.id}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      item.status === 'verified'
                        ? 'verified'
                        : item.status === 'flagged'
                        ? 'suspicious'
                        : 'unverified'
                    }
                    size="sm"
                    showDot
                  >
                    {item.status === 'verified'
                      ? 'VERIFIED'
                      : item.status === 'flagged'
                      ? 'FLAGGED'
                      : 'PENDING'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-[#F8FAFC] text-[#64748B]">
                  <span>Applied {formatDate(item.requestDate)}</span>
                  {item.officialWebsite && (
                    <a
                      href={item.officialWebsite}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#087F70] font-medium truncate max-w-[150px]"
                    >
                      {item.officialWebsite.replace('https://', '')}
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedVerification(item)}
                    className="flex-1 justify-center text-xs h-8.5 font-semibold min-w-[80px]"
                  >
                    Review
                  </Button>
                  {item.status === 'pending' && (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={Check}
                        onClick={() => setOrgToApprove(item)}
                        className="flex-1 justify-center text-xs h-8.5 font-semibold min-w-[80px]"
                      >
                        Verify
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        leftIcon={X}
                        onClick={() => setRejectionModalItem(item)}
                        className="flex-1 justify-center text-xs h-8.5 font-semibold min-w-[80px]"
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Table Pagination Footer */}
        {filteredQueue.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-[#F8FAFC] border-t border-[#E2E8F0]">
            <div className="text-xs text-[#64748B]">
              Showing <span className="font-semibold text-[#102C3A]">{startIndex + 1}</span> to{' '}
              <span className="font-semibold text-[#102C3A]">{endIndex}</span> of{' '}
              <span className="font-semibold text-[#102C3A]">{filteredQueue.length}</span> applications
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

      {/* REVIEW COMPANY INFORMATION MODAL */}
      {selectedVerification && (
        <Modal
          isOpen={!!selectedVerification}
          onClose={() => setSelectedVerification(null)}
          title={`Enterprise Audit: ${selectedVerification.organization}`}
          description={`Verification Request ${selectedVerification.id} • Submitted ${formatDate(selectedVerification.requestDate)}`}
          footer={
            <div className="flex items-center justify-between w-full">
              {selectedVerification.status === 'pending' ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={Check}
                    onClick={() => {
                      const target = selectedVerification;
                      setSelectedVerification(null);
                      setOrgToApprove(target);
                    }}
                  >
                    Verify & Certify Organization
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    leftIcon={X}
                    onClick={() => {
                      const target = selectedVerification;
                      setSelectedVerification(null);
                      setRejectionModalItem(target);
                    }}
                  >
                    Reject Application
                  </Button>
                </div>
              ) : (
                <span className="text-xs text-[#64748B]">
                  Status: <strong>{selectedVerification.status.toUpperCase()}</strong>
                </span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedVerification(null)}
              >
                Close Audit
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            {/* Header info */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <img
                src={selectedVerification.logo}
                alt={selectedVerification.organization}
                className="w-14 h-14 rounded-xl object-cover border border-[#E2E8F0]"
              />
              <div className="space-y-1">
                <h4 className="font-bold text-base text-[#102C3A]">
                  {selectedVerification.organization}
                </h4>
                <p className="text-[#64748B]">
                  Sector: {selectedVerification.category} • Auditor: {selectedVerification.assignedAuditor}
                </p>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      selectedVerification.status === 'verified'
                        ? 'verified'
                        : selectedVerification.status === 'flagged'
                        ? 'suspicious'
                        : 'unverified'
                    }
                    size="sm"
                  >
                    {selectedVerification.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Official Website & Career Review */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-white rounded-xl border border-[#E2E8F0]">
              <div className="space-y-1">
                <span className="font-bold text-[#102C3A] block">Official Website</span>
                <a
                  href={selectedVerification.officialWebsite || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#087F70] hover:underline flex items-center gap-1 font-medium"
                >
                  <span>{selectedVerification.officialWebsite || 'https://company.com'}</span>
                  <ExternalLink size={12} />
                </a>
                <span className="text-[10px] text-[#16A36A] font-semibold block">
                  ✓ SSL Certificate Valid (SHA-256)
                </span>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-[#102C3A] block">Career Portal</span>
                <a
                  href={selectedVerification.officialCareerPage || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#087F70] hover:underline flex items-center gap-1 font-medium"
                >
                  <span>{selectedVerification.officialCareerPage || 'https://company.com/careers'}</span>
                  <ExternalLink size={12} />
                </a>
                <span className="text-[10px] text-[#64748B] block">
                  Domain: {selectedVerification.officialEmailDomain || 'company.com'}
                </span>
              </div>
            </div>

            {/* Registration Details */}
            <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-2">
              <span className="font-bold text-[#102C3A] block">Corporate Legal Identification:</span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[#94A3B8] block">Registration No:</span>
                  <span className="font-bold text-[#102C3A]">
                    {selectedVerification.registrationNumber || 'C-64821/06'}
                  </span>
                </div>
                <div>
                  <span className="text-[#94A3B8] block">Headquarters:</span>
                  <span className="font-bold text-[#102C3A]">
                    {selectedVerification.headquarters || 'Dhaka, Bangladesh'}
                  </span>
                </div>
              </div>
            </div>

            {/* Submitted Documents Checklist */}
            <div className="space-y-2">
              <span className="font-bold text-[#102C3A] block">Submitted Evidentiary Artifacts:</span>
              <div className="space-y-1.5">
                {selectedVerification.documentsSubmitted?.map((doc, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-between text-xs"
                  >
                    <span className="font-medium text-[#102C3A]">{doc}</span>
                    <span className="text-[#16A36A] font-bold text-[11px] flex items-center gap-1">
                      <CheckCircle2 size={12} /> Authenticated
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* REJECT CONFIRMATION MODAL */}
      {rejectionModalItem && (
        <Modal
          isOpen={!!rejectionModalItem}
          onClose={() => setRejectionModalItem(null)}
          title="Reject Organization Application"
          description={`Rejecting verification for ${rejectionModalItem.organization}`}
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRejectionModalItem(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmReject}
              >
                Confirm Rejection & Flag
              </Button>
            </div>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-3">
              <AlertTriangle size={20} className="text-[#DC4B4B] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-[#DC4B4B]">Verification Rejection & Threat Flagging</p>
                <p className="text-[#64748B] leading-relaxed">
                  Rejecting this application will flag the entity as unverified/suspicious in the database and block any associated circulars from displaying a verified enterprise shield badge.
                </p>
              </div>
            </div>

            <Input
              label="Rejection Reason / Auditor Note"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Explain why credentials failed verification..."
            />
          </div>
        </Modal>
      )}

      {/* APPROVE VERIFICATION CONFIRMATION MODAL */}
      {orgToApprove && (
        <Modal
          isOpen={!!orgToApprove}
          onClose={() => setOrgToApprove(null)}
          title="Certify Enterprise Tier-1 Verification"
          description={`Granting verified enterprise credentials to ${orgToApprove.organization}`}
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOrgToApprove(null)}
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={ShieldCheck}
                onClick={executeConfirmApprove}
              >
                Confirm Certification & Grant Badge
              </Button>
            </div>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-start gap-3">
              <CheckCircle2 size={20} className="text-[#16A36A] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-[#16A36A]">Verify Enterprise Organization</p>
                <p className="text-[#64748B] leading-relaxed">
                  You are certifying that <strong>{orgToApprove.organization}</strong> has passed corporate incorporation, official email domain validation, and career portal scrutiny. A green verified shield badge will appear on all job circulars published by this employer.
                </p>
              </div>
            </div>

            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Request ID:</span>
                <span className="font-mono font-bold text-[#087F70]">{orgToApprove.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Official Domain:</span>
                <span className="font-semibold text-[#102C3A]">{orgToApprove.officialEmailDomain}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Assigned Auditor:</span>
                <span className="font-semibold text-[#102C3A]">{orgToApprove.assignedAuditor}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminVerificationQueue;
