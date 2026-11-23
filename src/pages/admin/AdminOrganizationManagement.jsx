import { useState } from 'react';
import {
  Building2,
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  X,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Input, { Select, Textarea } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, EmptyState } from '../../components/ui/Table';
import { MOCK_VERIFIED_ORGANIZATIONS } from '../../data/mockData';
import { useMockData } from '../../context/useMockData';

export const AdminOrganizationManagement = () => {
  const {
    organizations: storeOrgs,
    addOrganization,
    updateOrganization,
    deleteOrganization,
  } = useMockData();
  const organizations = storeOrgs || MOCK_VERIFIED_ORGANIZATIONS;
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionToast, setActionToast] = useState('');

  // Selected organization for viewing dossier
  const [viewingOrg, setViewingOrg] = useState(null);

  // Add Organization Modal
  const [isAddOrgModalOpen, setIsAddOrgModalOpen] = useState(false);
  const [newOrgData, setNewOrgData] = useState({
    name: '',
    category: 'Information Technology',
    logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&auto=format&fit=crop&q=80',
    description: '',
    registrationNumber: '',
    establishedYear: new Date().getFullYear(),
    officialWebsite: '',
    officialCareerPage: '',
    officialEmailDomain: '',
    verificationStatus: 'verified',
  });

  // Edit Organization Modal
  const [editingOrg, setEditingOrg] = useState(null);

  // Delete Organization Confirmation Modal
  const [orgToDelete, setOrgToDelete] = useState(null);

  // Flag Threat Confirmation Modal
  const [orgToFlag, setOrgToFlag] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Filter logic
  const filteredOrgs = organizations.filter((org) => {
    const q = searchQuery.trim().toLowerCase();
    const matchQuery =
      !q ||
      org.name.toLowerCase().includes(q) ||
      org.category.toLowerCase().includes(q) ||
      org.officialEmailDomain.toLowerCase().includes(q) ||
      org.id.toLowerCase().includes(q);

    const matchStatus =
      statusFilter === 'all' || org.verificationStatus === statusFilter;

    return matchQuery && matchStatus;
  });

  const totalPages = Math.ceil(filteredOrgs.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredOrgs.length);
  const paginatedOrgs = filteredOrgs.slice(startIndex, endIndex);

  // Add Organization Handler
  const handleAddOrg = (e) => {
    e.preventDefault();
    if (!newOrgData.name.trim()) return;

    if (addOrganization) {
      addOrganization(newOrgData);
    }
    setIsAddOrgModalOpen(false);
    setNewOrgData({
      name: '',
      category: 'Information Technology',
      logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&auto=format&fit=crop&q=80',
      description: '',
      registrationNumber: '',
      establishedYear: new Date().getFullYear(),
      officialWebsite: '',
      officialCareerPage: '',
      officialEmailDomain: '',
      verificationStatus: 'verified',
    });
    setActionToast(`Organization "${newOrgData.name}" added to registry.`);
    setTimeout(() => setActionToast(''), 4000);
  };

  // Edit Organization Handler
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingOrg) return;

    if (updateOrganization) {
      updateOrganization(editingOrg.id, editingOrg);
    }
    setActionToast(`Organization "${editingOrg.name}" updated successfully.`);
    setEditingOrg(null);
    setTimeout(() => setActionToast(''), 4000);
  };

  // Delete Organization Handler
  const handleConfirmDelete = () => {
    if (!orgToDelete) return;
    const deletedName = orgToDelete.name;
    if (deleteOrganization) {
      deleteOrganization(orgToDelete.id);
    }
    setActionToast(`Organization "${deletedName}" removed from registry.`);
    setOrgToDelete(null);
    setTimeout(() => setActionToast(''), 4000);
  };

  // Quick Verification Workflow Transition
  const handleUpdateWorkflowStatus = (orgId, newStatus) => {
    if (updateOrganization) {
      updateOrganization(orgId, {
        verificationStatus: newStatus,
        verificationLevel:
          newStatus === 'verified'
            ? 'Enterprise Tier-1 Certified'
            : newStatus === 'suspicious'
            ? 'Blacklisted Impersonator'
            : 'Unverified / In Review',
      });
    }
    setActionToast(`Organization status changed to ${newStatus.toUpperCase()}`);
    setTimeout(() => setActionToast(''), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        breadcrumbs={[
          { label: 'Admin', to: '/admin/dashboard' },
          { label: 'Organizations' },
        ]}
        title="Organization Management"
        subtitle="Manage verified corporations, review employer domains, edit company credentials, and maintain the public registry."
        actions={
          <Button
            variant="secondary"
            size="md"
            leftIcon={Plus}
            onClick={() => setIsAddOrgModalOpen(true)}
          >
            Add New Organization
          </Button>
        }
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

      {/* Search and Filters Bar */}
      <Card className="p-4 bg-white border border-[#E2E8F0] shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8">
            <Input
              placeholder="Search by company name, registered sector, domain, or ID..."
              leftIcon={Search}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              clearable
            />
          </div>
          <div className="sm:col-span-4">
            <Select
              options={[
                { value: 'all', label: 'All Verification Statuses' },
                { value: 'verified', label: 'Verified Enterprises' },
                { value: 'unverified', label: 'Unverified / Under Audit' },
                { value: 'suspicious', label: 'Flagged / Suspicious Impersonators' },
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
          Showing <strong className="text-[#102C3A]">{filteredOrgs.length}</strong> of{' '}
          <strong className="text-[#102C3A]">{organizations.length}</strong> organizations
        </span>
        {(searchQuery || statusFilter !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setCurrentPage(1);
            }}
            className="text-[#087F70] hover:underline cursor-pointer flex items-center gap-1 font-medium"
          >
            <RotateCcw size={12} />
            Reset Filters
          </button>
        )}
      </div>

      {/* Organizations Table (Desktop) & Stacked Cards (Mobile) */}
      <Card className="bg-white border-[#E2E8F0] shadow-sm overflow-hidden">
        {/* Desktop / Tablet Table */}
        <div className="hidden sm:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization Details</TableHead>
                <TableHead>Industry Sector</TableHead>
                <TableHead>Registration Filing</TableHead>
                <TableHead>Official Domain</TableHead>
                <TableHead>Verification Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrgs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <EmptyState
                      icon={Building2}
                      title="No organizations found"
                      description="No organization matched your search query or verification filter."
                      action={
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSearchQuery('');
                            setStatusFilter('all');
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
                paginatedOrgs.map((org) => (
                  <TableRow key={org.id} className="group">
                    {/* Organization Info */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={org.logo}
                          alt={org.name}
                          className="w-10 h-10 rounded-xl object-cover border border-[#E2E8F0] shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-xs sm:text-sm text-[#102C3A] group-hover:text-[#087F70] transition-colors truncate">
                            {org.name}
                          </p>
                          <p className="text-[11px] text-[#64748B] truncate">
                            ID: <span className="font-mono text-[#087F70]">{org.id}</span> • Est. {org.establishedYear}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Sector */}
                    <TableCell>
                      <span className="text-xs font-semibold text-[#102C3A]">
                        {org.category}
                      </span>
                    </TableCell>

                    {/* Registration */}
                    <TableCell>
                      <span className="font-mono text-xs text-[#64748B]">
                        {org.registrationNumber}
                      </span>
                    </TableCell>

                    {/* Official Domain */}
                    <TableCell>
                      <span className="font-mono text-xs text-[#087F70]">
                        {org.officialEmailDomain}
                      </span>
                    </TableCell>

                    {/* Verification Status */}
                    <TableCell>
                      <Badge
                        variant={
                          org.verificationStatus === 'verified'
                            ? 'verified'
                            : org.verificationStatus === 'suspicious'
                            ? 'suspicious'
                            : 'unverified'
                        }
                        size="sm"
                        showDot
                      >
                        {org.verificationStatus.toUpperCase()}
                      </Badge>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Dossier */}
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={Eye}
                          onClick={() => setViewingOrg(org)}
                        >
                          View
                        </Button>

                        {/* Edit Org */}
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={Edit}
                          onClick={() => setEditingOrg(org)}
                        >
                          Edit
                        </Button>

                        {/* Workflow Toggle */}
                        {org.verificationStatus !== 'verified' ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={ShieldCheck}
                            onClick={() => handleUpdateWorkflowStatus(org.id, 'verified')}
                          >
                            Verify
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[#DC4B4B] hover:bg-[#FEF2F2]"
                            leftIcon={ShieldAlert}
                            onClick={() => setOrgToFlag(org)}
                          >
                            Flag Threat
                          </Button>
                        )}

                        {/* Delete Org */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#DC4B4B] hover:bg-[#FEF2F2]"
                          leftIcon={Trash2}
                          onClick={() => setOrgToDelete(org)}
                        >
                          Delete
                        </Button>
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
          {filteredOrgs.length === 0 ? (
            <div className="p-6 text-center">
              <EmptyState
                icon={Building2}
                title="No organizations found"
                description="No organization matched your search query or verification filter."
                action={
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                      setCurrentPage(1);
                    }}
                  >
                    Clear Filters
                  </Button>
                }
              />
            </div>
          ) : (
            paginatedOrgs.map((org) => (
              <div key={org.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img
                      src={org.logo}
                      alt={org.name}
                      className="w-10 h-10 rounded-xl object-cover border border-[#E2E8F0] shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm text-[#102C3A] truncate">
                        {org.name}
                      </p>
                      <p className="text-xs text-[#64748B] truncate">
                        {org.category} • Est. {org.establishedYear}
                      </p>
                      <span className="font-mono text-[10px] text-[#087F70] font-semibold">
                        {org.id}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      org.verificationStatus === 'verified'
                        ? 'verified'
                        : org.verificationStatus === 'suspicious'
                        ? 'suspicious'
                        : 'unverified'
                    }
                    size="sm"
                    showDot
                  >
                    {org.verificationStatus.toUpperCase()}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-[#F8FAFC] text-[#64748B]">
                  <span>Reg: <strong className="font-mono text-[#102C3A]">{org.registrationNumber}</strong></span>
                  <span className="font-mono text-[#087F70] truncate max-w-[150px]">{org.officialEmailDomain}</span>
                </div>

                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={Eye}
                    onClick={() => setViewingOrg(org)}
                    className="flex-1 justify-center text-xs h-8.5 font-semibold min-w-[75px]"
                  >
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={Edit}
                    onClick={() => setEditingOrg(org)}
                    className="flex-1 justify-center text-xs h-8.5 font-semibold min-w-[75px]"
                  >
                    Edit
                  </Button>
                  {org.verificationStatus !== 'verified' ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={ShieldCheck}
                      onClick={() => handleUpdateWorkflowStatus(org.id, 'verified')}
                      className="text-xs h-8.5 font-semibold px-3"
                    >
                      Verify
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-[#DC4B4B] hover:bg-[#FEF2F2] text-xs h-8.5 font-semibold px-2.5"
                      leftIcon={ShieldAlert}
                      onClick={() => setOrgToFlag(org)}
                    >
                      Flag
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8.5 px-3 text-[#DC4B4B] hover:bg-[#FEF2F2]"
                    onClick={() => setOrgToDelete(org)}
                    title="Delete Organization"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Table Pagination Footer */}
        {filteredOrgs.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-[#F8FAFC] border-t border-[#E2E8F0]">
            <div className="text-xs text-[#64748B]">
              Showing <span className="font-semibold text-[#102C3A]">{startIndex + 1}</span> to{' '}
              <span className="font-semibold text-[#102C3A]">{endIndex}</span> of{' '}
              <span className="font-semibold text-[#102C3A]">{filteredOrgs.length}</span> organizations
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

      {/* ADD ORGANIZATION MODAL */}
      {isAddOrgModalOpen && (
        <Modal
          isOpen={isAddOrgModalOpen}
          onClose={() => setIsAddOrgModalOpen(false)}
          title="Add New Organization to Registry"
          description="Register a verified corporation, public agency, or flagged syndicate profile."
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddOrgModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleAddOrg}
              >
                Register Organization
              </Button>
            </div>
          }
        >
          <form onSubmit={handleAddOrg} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Organization Name"
                placeholder="e.g. BrainStation 23 PLC"
                value={newOrgData.name}
                onChange={(e) => setNewOrgData({ ...newOrgData, name: e.target.value })}
                required
              />
              <Input
                label="Industry Category"
                placeholder="e.g. Information Technology"
                value={newOrgData.category}
                onChange={(e) => setNewOrgData({ ...newOrgData, category: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Official Website URL"
                placeholder="https://company.com"
                value={newOrgData.officialWebsite}
                onChange={(e) => setNewOrgData({ ...newOrgData, officialWebsite: e.target.value })}
              />
              <Input
                label="Official Career Page URL"
                placeholder="https://company.com/careers"
                value={newOrgData.officialCareerPage}
                onChange={(e) => setNewOrgData({ ...newOrgData, officialCareerPage: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Official Email Domain"
                placeholder="company.com"
                value={newOrgData.officialEmailDomain}
                onChange={(e) => setNewOrgData({ ...newOrgData, officialEmailDomain: e.target.value })}
              />
              <Input
                label="Registration / RJSC Number"
                placeholder="C-64821/06"
                value={newOrgData.registrationNumber}
                onChange={(e) => setNewOrgData({ ...newOrgData, registrationNumber: e.target.value })}
              />
              <Select
                label="Verification Status"
                options={[
                  { value: 'verified', label: 'VERIFIED' },
                  { value: 'unverified', label: 'UNVERIFIED' },
                  { value: 'suspicious', label: 'SUSPICIOUS' },
                ]}
                value={newOrgData.verificationStatus}
                onChange={(e) => setNewOrgData({ ...newOrgData, verificationStatus: e.target.value })}
              />
            </div>

            <Textarea
              label="Organization Description"
              rows={3}
              placeholder="Summary of business operations, verified headquarters, and official recruitment policy..."
              value={newOrgData.description}
              onChange={(e) => setNewOrgData({ ...newOrgData, description: e.target.value })}
            />
          </form>
        </Modal>
      )}

      {/* EDIT ORGANIZATION MODAL */}
      {editingOrg && (
        <Modal
          isOpen={!!editingOrg}
          onClose={() => setEditingOrg(null)}
          title={`Edit Organization: ${editingOrg.name}`}
          description={`ID: ${editingOrg.id}`}
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingOrg(null)}
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSaveEdit}
              >
                Save Changes
              </Button>
            </div>
          }
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Organization Name"
                value={editingOrg.name}
                onChange={(e) => setEditingOrg({ ...editingOrg, name: e.target.value })}
                required
              />
              <Input
                label="Industry Category"
                value={editingOrg.category}
                onChange={(e) => setEditingOrg({ ...editingOrg, category: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Official Website URL"
                value={editingOrg.officialWebsite}
                onChange={(e) => setEditingOrg({ ...editingOrg, officialWebsite: e.target.value })}
              />
              <Input
                label="Official Career Page URL"
                value={editingOrg.officialCareerPage}
                onChange={(e) => setEditingOrg({ ...editingOrg, officialCareerPage: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Official Email Domain"
                value={editingOrg.officialEmailDomain}
                onChange={(e) => setEditingOrg({ ...editingOrg, officialEmailDomain: e.target.value })}
              />
              <Input
                label="Registration Number"
                value={editingOrg.registrationNumber}
                onChange={(e) => setEditingOrg({ ...editingOrg, registrationNumber: e.target.value })}
              />
              <Select
                label="Verification Status"
                options={[
                  { value: 'verified', label: 'VERIFIED' },
                  { value: 'unverified', label: 'UNVERIFIED' },
                  { value: 'suspicious', label: 'SUSPICIOUS' },
                ]}
                value={editingOrg.verificationStatus}
                onChange={(e) => setEditingOrg({ ...editingOrg, verificationStatus: e.target.value })}
              />
            </div>

            <Textarea
              label="Organization Description"
              rows={3}
              value={editingOrg.description}
              onChange={(e) => setEditingOrg({ ...editingOrg, description: e.target.value })}
            />
          </form>
        </Modal>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {orgToDelete && (
        <Modal
          isOpen={!!orgToDelete}
          onClose={() => setOrgToDelete(null)}
          title="Confirm Organization Removal"
          description={`Are you sure you want to delete ${orgToDelete.name} from the registry?`}
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOrgToDelete(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmDelete}
              >
                Delete Organization
              </Button>
            </div>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-3">
              <AlertTriangle size={20} className="text-[#DC4B4B] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-[#DC4B4B]">Irreversible Directory Deletion</p>
                <p className="text-[#64748B] leading-relaxed">
                  Removing this organization will eliminate its verified badge credentials and associated circular mappings from the public directory.
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* VIEW DOSSIER MODAL */}
      {viewingOrg && (
        <Modal
          isOpen={!!viewingOrg}
          onClose={() => setViewingOrg(null)}
          title={viewingOrg.name}
          description={`Registered ID: ${viewingOrg.id} • Industry: ${viewingOrg.category}`}
          footer={
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewingOrg(null)}
            >
              Close Dossier
            </Button>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <img
                src={viewingOrg.logo}
                alt={viewingOrg.name}
                className="w-14 h-14 rounded-xl object-cover border border-[#E2E8F0]"
              />
              <div className="space-y-1">
                <h4 className="font-bold text-base text-[#102C3A]">
                  {viewingOrg.name}
                </h4>
                <p className="text-[#64748B]">{viewingOrg.verificationLevel}</p>
                <Badge
                  variant={
                    viewingOrg.verificationStatus === 'verified'
                      ? 'verified'
                      : viewingOrg.verificationStatus === 'suspicious'
                      ? 'suspicious'
                      : 'unverified'
                  }
                  size="sm"
                  showDot
                >
                  {viewingOrg.verificationStatus.toUpperCase()}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 bg-white rounded-xl border border-[#E2E8F0]">
              <div>
                <span className="text-[#94A3B8] block">Corporate Domain:</span>
                <span className="font-bold text-[#102C3A] font-mono">
                  {viewingOrg.officialEmailDomain}
                </span>
              </div>
              <div>
                <span className="text-[#94A3B8] block">Registration No:</span>
                <span className="font-bold text-[#102C3A] font-mono">
                  {viewingOrg.registrationNumber}
                </span>
              </div>
              <div>
                <span className="text-[#94A3B8] block">Official Website:</span>
                <a
                  href={viewingOrg.officialWebsite}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#087F70] hover:underline flex items-center gap-1 font-medium"
                >
                  <span>{viewingOrg.officialWebsite}</span>
                  <ExternalLink size={11} />
                </a>
              </div>
              <div>
                <span className="text-[#94A3B8] block">Career Portal:</span>
                <a
                  href={viewingOrg.officialCareerPage}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#087F70] hover:underline flex items-center gap-1 font-medium"
                >
                  <span>{viewingOrg.officialCareerPage}</span>
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>

            <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-1">
              <span className="font-bold text-[#102C3A] block">Corporate Profile & Description:</span>
              <p className="text-[#64748B] leading-relaxed">
                {viewingOrg.description}
              </p>
            </div>
          </div>
        </Modal>
      )}

      {/* FLAG SUSPICIOUS ENTITY CONFIRMATION MODAL */}
      {orgToFlag && (
        <Modal
          isOpen={!!orgToFlag}
          onClose={() => setOrgToFlag(null)}
          title="Flag Organization as Threat Syndicate"
          description={`Revoking verified standing for ${orgToFlag.name}`}
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOrgToFlag(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                leftIcon={ShieldAlert}
                onClick={() => {
                  handleUpdateWorkflowStatus(orgToFlag.id, 'suspicious');
                  setOrgToFlag(null);
                }}
              >
                Confirm Threat Flagging
              </Button>
            </div>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-3">
              <AlertTriangle size={20} className="text-[#DC4B4B] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-[#DC4B4B]">Critical Action: Status Downgrade & Impersonation Alert</p>
                <p className="text-[#64748B] leading-relaxed">
                  Flagging <strong>{orgToFlag.name}</strong> will revoke its Enterprise Verified checkmark across the platform and mark any job postings claiming association as suspicious risks.
                </p>
              </div>
            </div>
            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-1">
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Entity ID:</span>
                <span className="font-mono font-bold text-[#087F70]">{orgToFlag.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Domain:</span>
                <span className="font-semibold text-[#102C3A]">{orgToFlag.officialEmailDomain}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminOrganizationManagement;
