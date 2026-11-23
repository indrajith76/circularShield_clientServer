import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Download,
  Trash2,
  Eye,
  CheckCircle2,
  FileText,
  Printer,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  AlertTriangle,
  History,
  AlertOctagon,
  PlusCircle,
  X,
} from 'lucide-react';

import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Input, { Select } from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import RiskScoreMeter from '../components/ui/RiskScoreMeter';
import Modal from '../components/ui/Modal';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  EmptyState,
} from '../components/ui/Table';
import { formatDate } from '../utils/formatters';
import { MOCK_CIRCULARS, MOCK_SCAM_REPORTS } from '../data/mockData';
import { useMockData } from '../context/useMockData';

export const MyActivity = ({ circulars = [], defaultTab = 'history' }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { circulars: storeCirculars, scamReports: storeReports, deleteCircular, deleteReport } = useMockData();

  // Tab State: 'history' | 'reports'
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl === 'reports' ? 'reports' : defaultTab);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams(tab === 'reports' ? { tab: 'reports' } : {});
  };

  // --------------------------------------------------------------------------
  // TAB 1: ANALYSIS HISTORY STATE
  // --------------------------------------------------------------------------
  const historyItems = useMemo(() => {
    return storeCirculars && storeCirculars.length > 0
      ? storeCirculars
      : circulars && circulars.length > 0
      ? circulars
      : MOCK_CIRCULARS;
  }, [storeCirculars, circulars]);

  const [historySearch, setHistorySearch] = useState('');
  const [historyStatusFilter, setHistoryStatusFilter] = useState('all');
  const [historySortBy, setHistorySortBy] = useState('newest');
  const [historyPage, setHistoryPage] = useState(1);
  const itemsPerPage = 5;

  const [itemToDelete, setItemToDelete] = useState(null);
  const [reportToPrint, setReportToPrint] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // --------------------------------------------------------------------------
  // TAB 2: MY REPORTS STATE
  // --------------------------------------------------------------------------
  const reportsList = useMemo(() => {
    return storeReports && storeReports.length > 0 ? storeReports : MOCK_SCAM_REPORTS;
  }, [storeReports]);

  const [reportSearch, setReportSearch] = useState('');
  const [reportStatusFilter, setReportStatusFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportToDelete, setReportToDelete] = useState(null);

  // CSV Export
  const handleExportCSV = () => {
    if (activeTab === 'history') {
      const headers = 'ID,Job Title,Company,Status,Risk Score,Date Checked\n';
      const rows = historyItems
        .map((c) =>
          `"${c.id}","${(c.title || '').replace(/"/g, '""')}","${(c.company || '').replace(/"/g, '""')}","${c.status}","${c.riskScore || 0}","${c.postedDate || ''}"`
        )
        .join('\n');
      const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `circularshield_checked_jobs_${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      const headers = 'ID,Target Entity,Category,Amount Demanded,Status,Reported Date\n';
      const rows = reportsList
        .map((r) =>
          `"${r.id}","${(r.jobCompanyName || r.targetEntity || '').replace(/"/g, '""')}","${r.category}","${r.amountDemanded || 'None'}","${r.status}","${r.submittedDate || r.reportedDate || ''}"`
        )
        .join('\n');
      const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `circularshield_scam_reports_${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  // Filter Analysis History
  const filteredHistory = useMemo(() => {
    return historyItems
      .filter((item) => {
        const query = historySearch.trim().toLowerCase();
        const matchesQuery =
          !query ||
          item.title?.toLowerCase().includes(query) ||
          item.company?.toLowerCase().includes(query) ||
          item.id?.toLowerCase().includes(query);

        const matchesStatus =
          historyStatusFilter === 'all' || item.status === historyStatusFilter;

        return matchesQuery && matchesStatus;
      })
      .sort((a, b) => {
        const dateA = new Date(a.postedDate || 0);
        const dateB = new Date(b.postedDate || 0);
        if (historySortBy === 'newest') return dateB - dateA;
        if (historySortBy === 'oldest') return dateA - dateB;
        if (historySortBy === 'highest_risk') return (b.riskScore || 0) - (a.riskScore || 0);
        if (historySortBy === 'lowest_risk') return (a.riskScore || 0) - (b.riskScore || 0);
        return 0;
      });
  }, [historyItems, historySearch, historyStatusFilter, historySortBy]);

  const totalHistoryPages = Math.ceil(filteredHistory.length / itemsPerPage) || 1;
  const paginatedHistory = filteredHistory.slice(
    (historyPage - 1) * itemsPerPage,
    historyPage * itemsPerPage
  );

  // Filter Reports
  const filteredReports = useMemo(() => {
    return reportsList.filter((rpt) => {
      const q = reportSearch.trim().toLowerCase();
      const matchQuery =
        !q ||
        rpt.jobCompanyName.toLowerCase().includes(q) ||
        rpt.id.toLowerCase().includes(q) ||
        rpt.category.toLowerCase().includes(q);

      const matchStatus =
        reportStatusFilter === 'all' ||
        rpt.status.toLowerCase() === reportStatusFilter.toLowerCase();

      return matchQuery && matchStatus;
    });
  }, [reportsList, reportSearch, reportStatusFilter]);

  // Handle Deletion
  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    const title = itemToDelete.title;
    if (deleteCircular) {
      deleteCircular(itemToDelete.id);
    }
    setItemToDelete(null);
    setToastMessage(`"${title}" was removed from your history.`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleConfirmDeleteReport = () => {
    if (!reportToDelete) return;
    const target = reportToDelete.jobCompanyName || reportToDelete.targetEntity || reportToDelete.id;
    if (deleteReport) {
      deleteReport(reportToDelete.id);
    }
    setReportToDelete(null);
    setToastMessage(`Report for "${target}" was withdrawn.`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'My Activity' },
        ]}
        title="My Activity"
        subtitle="Review job notices you previously checked and track your submitted scam reports."
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              leftIcon={Download}
              onClick={handleExportCSV}
              className="text-xs"
            >
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={AlertOctagon}
              onClick={() => navigate('/report-scam')}
              className="text-xs"
            >
              Report a Scam
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={PlusCircle}
              onClick={() => navigate('/analyze')}
              className="text-xs"
            >
              Check a Job Circular
            </Button>
          </div>
        }
      />

      {/* Success Notification Toast */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-between text-xs font-semibold text-[#16A36A] animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage('')}
            className="p-1 hover:bg-[#D1FAE5] rounded cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Tabs Switcher: Previously Checked Jobs vs My Scam Reports */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2">
        <button
          type="button"
          onClick={() => handleTabChange('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'bg-[#102C3A] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#102C3A] hover:bg-[#F1F5F8]'
          }`}
        >
          <History size={16} />
          <span>Previously Checked Jobs</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'history'
                ? 'bg-white/20 text-white'
                : 'bg-[#E2E8F0] text-[#64748B]'
            }`}
          >
            {historyItems.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('reports')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'reports'
              ? 'bg-[#102C3A] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#102C3A] hover:bg-[#F1F5F8]'
          }`}
        >
          <FileText size={16} />
          <span>My Scam Reports</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'reports'
                ? 'bg-white/20 text-white'
                : 'bg-[#E2E8F0] text-[#64748B]'
            }`}
          >
            {reportsList.length}
          </span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: ANALYSIS HISTORY                                               */}
      {/* ===================================================================== */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {/* Search & Filters Card */}
          <Card className="p-4 bg-white border border-[#E2E8F0] shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-6">
                <Input
                  placeholder="Search by job title or organization..."
                  leftIcon={Search}
                  value={historySearch}
                  onChange={(e) => {
                    setHistorySearch(e.target.value);
                    setHistoryPage(1);
                  }}
                  clearable
                />
              </div>

              <div className="sm:col-span-3">
                <Select
                  options={[
                    { value: 'all', label: 'All Statuses' },
                    { value: 'verified', label: 'Verified Only' },
                    { value: 'suspicious', label: 'Suspicious Only' },
                    { value: 'unverified', label: 'Unverified Only' },
                  ]}
                  value={historyStatusFilter}
                  onChange={(e) => {
                    setHistoryStatusFilter(e.target.value);
                    setHistoryPage(1);
                  }}
                />
              </div>

              <div className="sm:col-span-3">
                <Select
                  options={[
                    { value: 'newest', label: 'Newest First' },
                    { value: 'oldest', label: 'Oldest First' },
                    { value: 'highest_risk', label: 'Highest Risk' },
                    { value: 'lowest_risk', label: 'Lowest Risk' },
                  ]}
                  value={historySortBy}
                  onChange={(e) => setHistorySortBy(e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Results Summary & Reset */}
          <div className="flex items-center justify-between text-xs text-[#64748B] px-1">
            <span>
              Showing <strong className="text-[#102C3A]">{filteredHistory.length}</strong> previously checked circulars
            </span>
            {(historySearch || historyStatusFilter !== 'all') && (
              <button
                onClick={() => {
                  setHistorySearch('');
                  setHistoryStatusFilter('all');
                  setHistoryPage(1);
                }}
                className="text-[#087F70] hover:underline cursor-pointer flex items-center gap-1 font-medium"
              >
                <RotateCcw size={12} />
                Reset Filters
              </button>
            )}
          </div>

          {/* History Data Table */}
          <Card className="bg-white border-[#E2E8F0] shadow-sm overflow-hidden">
            {/* Desktop / Tablet Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Circular</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Checked Date</TableHead>
                    <TableHead>Risk Score</TableHead>
                    <TableHead>Final Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        <EmptyState
                          icon={History}
                          title="No checked jobs found"
                          description="No job notices match your search or filter settings."
                          action={
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setHistorySearch('');
                                setHistoryStatusFilter('all');
                                setHistoryPage(1);
                              }}
                            >
                              Clear Filters
                            </Button>
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedHistory.map((circular) => (
                      <TableRow key={circular.id} className="group">
                        <TableCell>
                          <div className="space-y-0.5">
                            <p className="font-bold text-xs sm:text-sm text-[#102C3A] group-hover:text-[#087F70] transition-colors line-clamp-1">
                              {circular.title}
                            </p>
                            <span className="font-mono text-[11px] text-[#94A3B8]">
                              {circular.id}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <span className="text-xs font-semibold text-[#102C3A] block truncate max-w-xs">
                            {circular.company}
                          </span>
                        </TableCell>

                        <TableCell>
                          <span className="text-xs text-[#64748B]">
                            {formatDate(circular.postedDate || new Date().toISOString())}
                          </span>
                        </TableCell>

                        <TableCell>
                          <div className="w-24">
                            <RiskScoreMeter
                              score={circular.riskScore || 15}
                              size="sm"
                              showLabel={false}
                            />
                            <span className="text-[11px] font-bold text-[#102C3A] mt-0.5 block">
                              {circular.riskScore || 15}/100 Risk
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant={
                              circular.status === 'verified'
                                ? 'verified'
                                : circular.status === 'suspicious'
                                ? 'suspicious'
                                : 'unverified'
                            }
                            size="sm"
                            showDot
                          >
                            {circular.status === 'verified'
                              ? 'VERIFIED'
                              : circular.status === 'suspicious'
                              ? 'SUSPICIOUS'
                              : 'UNVERIFIED'}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="sm"
                              leftIcon={Eye}
                              onClick={() => navigate(`/analysis-result/${circular.id}`)}
                            >
                              Result
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              leftIcon={Download}
                              onClick={() => setReportToPrint(circular)}
                              title="Download Report"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[#DC4B4B] hover:bg-[#FEF2F2]"
                              leftIcon={Trash2}
                              onClick={() => setItemToDelete(circular)}
                              title="Delete Record"
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Stacked Card View (<640px) */}
            <div className="sm:hidden divide-y divide-[#F1F5F8]">
              {filteredHistory.length === 0 ? (
                <div className="p-6 text-center">
                  <EmptyState
                    icon={History}
                    title="No checked jobs found"
                    description="No job notices match your search or filter settings."
                    action={
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setHistorySearch('');
                          setHistoryStatusFilter('all');
                          setHistoryPage(1);
                        }}
                      >
                        Clear Filters
                      </Button>
                    }
                  />
                </div>
              ) : (
                paginatedHistory.map((circular) => (
                  <div key={circular.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <span className="font-mono text-[10px] text-[#087F70] bg-[#087F70]/10 px-2 py-0.5 rounded font-bold">
                          {circular.id}
                        </span>
                        <h4 className="font-bold text-sm text-[#102C3A] line-clamp-1 pt-1">
                          {circular.title}
                        </h4>
                        <p className="text-xs text-[#64748B] truncate">
                          {circular.company}
                        </p>
                      </div>
                      <Badge
                        variant={
                          circular.status === 'verified'
                            ? 'verified'
                            : circular.status === 'suspicious'
                            ? 'suspicious'
                            : 'unverified'
                        }
                        size="sm"
                        showDot
                      >
                        {circular.status === 'verified'
                          ? 'VERIFIED'
                          : circular.status === 'suspicious'
                          ? 'SUSPICIOUS'
                          : 'UNVERIFIED'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-[#F8FAFC]">
                      <span className="text-[11px] text-[#94A3B8]">
                        Checked {formatDate(circular.postedDate || new Date().toISOString())}
                      </span>
                      <span className="text-xs font-bold text-[#102C3A]">
                        {circular.riskScore || 15}/100 Risk
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={Eye}
                        onClick={() => navigate(`/analysis-result/${circular.id}`)}
                        className="flex-1 justify-center text-xs h-8.5 font-semibold"
                      >
                        View Result
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={Download}
                        onClick={() => setReportToPrint(circular)}
                        title="Download Report"
                        className="h-8.5 px-3"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8.5 px-3 text-[#DC4B4B] hover:bg-[#FEF2F2] hover:border-[#FECACA]"
                        leftIcon={Trash2}
                        onClick={() => setItemToDelete(circular)}
                        title="Delete Record"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination Controls */}
            {filteredHistory.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-[#F8FAFC] border-t border-[#E2E8F0]">
                <div className="text-xs text-[#64748B]">
                  Showing{' '}
                  <span className="font-semibold text-[#102C3A]">
                    {(historyPage - 1) * itemsPerPage + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-semibold text-[#102C3A]">
                    {Math.min(historyPage * itemsPerPage, filteredHistory.length)}
                  </span>{' '}
                  of{' '}
                  <span className="font-semibold text-[#102C3A]">
                    {filteredHistory.length}
                  </span>{' '}
                  circulars
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={historyPage === 1}
                    onClick={() => setHistoryPage((p) => Math.max(p - 1, 1))}
                    className="h-8 px-2.5 text-xs"
                  >
                    <ChevronLeft size={14} className="mr-1" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalHistoryPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setHistoryPage(p)}
                        className={`h-8 w-8 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                          historyPage === p
                            ? 'bg-[#102C3A] text-white shadow-xs'
                            : 'bg-white text-[#64748B] hover:bg-[#F1F5F8] border border-[#E2E8F0]'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={historyPage === totalHistoryPages}
                    onClick={() => setHistoryPage((p) => Math.min(p + 1, totalHistoryPages))}
                    className="h-8 px-2.5 text-xs"
                  >
                    Next
                    <ChevronRight size={14} className="ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: MY SCAM REPORTS                                                */}
      {/* ===================================================================== */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {/* Search & Filters */}
          <Card className="p-4 bg-white border border-[#E2E8F0] shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-8">
                <Input
                  placeholder="Search by company, report ID, or scam type..."
                  leftIcon={Search}
                  value={reportSearch}
                  onChange={(e) => setReportSearch(e.target.value)}
                  clearable
                />
              </div>

              <div className="sm:col-span-4">
                <Select
                  options={[
                    { value: 'all', label: 'All Report Statuses' },
                    { value: 'reviewed', label: 'Reviewed' },
                    { value: 'pending', label: 'Pending Review' },
                    { value: 'action taken', label: 'Action Taken' },
                  ]}
                  value={reportStatusFilter}
                  onChange={(e) => setReportStatusFilter(e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Reports Table (Desktop) & Cards (Mobile) */}
          <Card className="bg-white border-[#E2E8F0] shadow-sm overflow-hidden">
            {/* Desktop / Tablet Table */}
            <div className="hidden sm:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report ID & Company</TableHead>
                    <TableHead>Violation Category</TableHead>
                    <TableHead>Reported Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10">
                        <EmptyState
                          icon={AlertOctagon}
                          title="No scam reports found"
                          description="You haven't filed any reports matching this filter."
                          action={
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setReportSearch('');
                                setReportStatusFilter('all');
                              }}
                            >
                              Clear Filters
                            </Button>
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredReports.map((rpt) => (
                      <TableRow key={rpt.id} className="group">
                        <TableCell>
                          <div className="space-y-0.5">
                            <span className="font-mono text-[11px] font-bold text-[#087F70] bg-[#087F70]/10 px-2 py-0.5 rounded">
                              {rpt.id}
                            </span>
                            <p className="font-bold text-xs sm:text-sm text-[#102C3A] group-hover:text-[#087F70] transition-colors truncate max-w-xs">
                              {rpt.jobCompanyName}
                            </p>
                          </div>
                        </TableCell>

                        <TableCell>
                          <span className="text-xs text-[#64748B]">
                            {rpt.category}
                          </span>
                        </TableCell>

                        <TableCell>
                          <span className="text-xs text-[#64748B]">
                            {formatDate(rpt.submittedDate)}
                          </span>
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant={
                              rpt.status === 'Reviewed' || rpt.status === 'Action Taken'
                                ? 'verified'
                                : 'unverified'
                            }
                            size="sm"
                            showDot
                          >
                            {rpt.status.toUpperCase()}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="sm"
                              leftIcon={Eye}
                              onClick={() => setSelectedReport(rpt)}
                            >
                              View Details
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[#DC4B4B] hover:bg-[#FEF2F2]"
                              leftIcon={Trash2}
                              onClick={() => setReportToDelete(rpt)}
                              title="Withdraw Report"
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards (Zero Horizontal Scroll) */}
            <div className="sm:hidden divide-y divide-[#F1F5F8]">
              {filteredReports.length === 0 ? (
                <div className="p-6 text-center">
                  <EmptyState
                    icon={AlertOctagon}
                    title="No scam reports found"
                    description="You haven't filed any reports matching this filter."
                    action={
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setReportSearch('');
                          setReportStatusFilter('all');
                        }}
                      >
                        Clear Filters
                      </Button>
                    }
                  />
                </div>
              ) : (
                filteredReports.map((rpt) => (
                  <div key={rpt.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <span className="font-mono text-[10px] text-[#087F70] bg-[#087F70]/10 px-2 py-0.5 rounded font-bold">
                          {rpt.id}
                        </span>
                        <h4 className="font-bold text-sm text-[#102C3A] line-clamp-1 pt-1">
                          {rpt.jobCompanyName}
                        </h4>
                        <p className="text-xs text-[#64748B] truncate">
                          {rpt.category}
                        </p>
                      </div>
                      <Badge
                        variant={
                          rpt.status === 'Reviewed' || rpt.status === 'Action Taken'
                            ? 'verified'
                            : 'unverified'
                        }
                        size="sm"
                        showDot
                      >
                        {rpt.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-[#F8FAFC]">
                      <span className="text-[11px] text-[#94A3B8]">
                        Reported {formatDate(rpt.submittedDate)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={Eye}
                        onClick={() => setSelectedReport(rpt)}
                        className="flex-1 justify-center text-xs h-8.5 font-semibold"
                      >
                        View Report Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8.5 px-3 text-[#DC4B4B] hover:bg-[#FEF2F2] hover:border-[#FECACA]"
                        leftIcon={Trash2}
                        onClick={() => setReportToDelete(rpt)}
                        title="Withdraw Report"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {itemToDelete && (
        <Modal
          isOpen={!!itemToDelete}
          onClose={() => setItemToDelete(null)}
          title="Delete Analysis Record"
          description={`Are you sure you want to remove "${itemToDelete.title}"?`}
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setItemToDelete(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmDelete}
              >
                Delete Record
              </Button>
            </div>
          }
        >
          <div className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-3 text-xs">
            <AlertTriangle size={20} className="text-[#DC4B4B] shrink-0 mt-0.5" />
            <p className="text-[#64748B] leading-relaxed">
              This will remove this circular check from your local analysis activity history. You can check the circular again at any time.
            </p>
          </div>
        </Modal>
      )}

      {/* WITHDRAW REPORT CONFIRMATION MODAL */}
      {reportToDelete && (
        <Modal
          isOpen={!!reportToDelete}
          onClose={() => setReportToDelete(null)}
          title="Withdraw Scam Report"
          description={`Report ID: ${reportToDelete.id}`}
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setReportToDelete(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmDeleteReport}
              >
                Withdraw Report
              </Button>
            </div>
          }
        >
          <div className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-3 text-xs">
            <AlertTriangle size={20} className="text-[#DC4B4B] shrink-0 mt-0.5" />
            <p className="text-[#64748B] leading-relaxed">
              Are you sure you want to withdraw this incident report? It will be removed from your activity list and the moderation review queue.
            </p>
          </div>
        </Modal>
      )}

      {/* REPORT DETAILS MODAL */}
      {selectedReport && (
        <Modal
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          title={`Scam Report: ${selectedReport.id}`}
          description={`Filed on ${formatDate(selectedReport.submittedDate)}`}
          footer={
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedReport(null)}
            >
              Close
            </Button>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] space-y-1">
              <span className="font-bold text-[#DC4B4B] block text-sm">
                Target: {selectedReport.jobCompanyName}
              </span>
              <p className="text-[#64748B]">Category: {selectedReport.category}</p>
              {selectedReport.paymentNumber && (
                <p className="text-[#DC4B4B] font-semibold">
                  Payment Extortion Wallet: {selectedReport.paymentNumber}
                </p>
              )}
            </div>

            <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-1">
              <span className="font-bold text-[#102C3A] block">Submitted Details:</span>
              <p className="text-[#64748B] leading-relaxed">{selectedReport.description}</p>
            </div>

            <div className="p-3.5 bg-[#F0FDF4] rounded-xl border border-[#BBF7D0] space-y-1">
              <span className="font-bold text-[#16A36A] block">Moderation & Review Status:</span>
              <p className="text-[#15803D]">{selectedReport.reviewerNotes}</p>
            </div>
          </div>
        </Modal>
      )}

      {/* PDF REPORT DOWNLOAD MODAL */}
      {reportToPrint && (
        <Modal
          isOpen={!!reportToPrint}
          onClose={() => setReportToPrint(null)}
          title="Analysis Report Summary"
          description={`CircularShield Verification Dossier • ${reportToPrint.id}`}
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setReportToPrint(null)}
              >
                Close
              </Button>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={Printer}
                onClick={() => window.print()}
              >
                Print / Save as PDF
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-[#102C3A]">{reportToPrint.title}</span>
                <Badge
                  variant={
                    reportToPrint.status === 'verified'
                      ? 'verified'
                      : reportToPrint.status === 'suspicious'
                      ? 'suspicious'
                      : 'unverified'
                  }
                  size="sm"
                >
                  {reportToPrint.status.toUpperCase()}
                </Badge>
              </div>
              <p className="text-[#64748B]">Organization: {reportToPrint.company}</p>
              <p className="text-[#64748B]">Risk Score: {reportToPrint.riskScore || 15}/100</p>
            </div>
            <p className="text-[11px] text-[#94A3B8] text-center">
              Generated by CircularShield Fraud Detection Platform • Bangladesh
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MyActivity;
