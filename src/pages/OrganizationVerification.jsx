import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  Search,
  ExternalLink,
  Phone,
  MapPin,
  BadgeCheck,
  ArrowLeft,
  Building2,
  Info,
  X,
  Share2,
  AlertOctagon,
  Check,
} from 'lucide-react';

import PageHeader from '../components/ui/PageHeader';
import Card, { CardContent } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { CardSkeleton } from '../components/ui/Skeleton';
import { useAuth } from '../context/AuthContext';
import { useAuthModal } from '../context/AuthModalContext';
import { useMockData } from '../context/useMockData';

export const OrganizationVerification = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { openAuthModal } = useAuthModal();
  const { organizations, submitVerificationRequest } = useMockData();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatusFilter, setActiveStatusFilter] = useState('all'); // 'all' | 'verified' | 'unverified' | 'suspicious'
  const [activeCategory, setActiveCategory] = useState('all');
  const [isSearching, setIsSearching] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Selected Org derived from route parameter (PAGE 1 vs PAGE 2)
  const selectedOrg = id ? organizations.find((o) => o.id === id) || null : null;

  // Request Verification Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orgRequest, setOrgRequest] = useState({
    companyName: '',
    tradeLicense: '',
    corporateEmail: '',
    website: '',
    contactPerson: '',
  });
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  // Search input change with simulated loading state
  const handleSearchChange = (val) => {
    setSearchQuery(val);
    if (val.trim()) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setIsSearching(false);
    }
  };

  // Trigger search explicitly
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 250);
  };

  // Open Organization Details (PAGE 2)
  const handleViewDetails = (org) => {
    navigate(`/verify-org/${org.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back to Organization Directory (PAGE 1)
  const handleBackToDirectory = () => {
    navigate('/verify-org');
  };

  // Share link handler
  const handleShare = () => {
    setCopiedLink(true);
    navigator.clipboard?.writeText(window.location.href);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Request Validation Errors
  const [requestErrors, setRequestErrors] = useState({});

  // Submit request modal
  const handleRequestSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!orgRequest.companyName.trim()) {
      errors.companyName = 'Organization Name is required.';
    }
    if (!orgRequest.tradeLicense.trim()) {
      errors.tradeLicense = 'Trade license or registration number is required.';
    }
    if (!orgRequest.corporateEmail.trim()) {
      errors.corporateEmail = 'Corporate email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orgRequest.corporateEmail)) {
      errors.corporateEmail = 'Please enter a valid corporate email.';
    }
    if (!orgRequest.website.trim()) {
      errors.website = 'Official website is required.';
    } else if (!/^https?:\/\//i.test(orgRequest.website)) {
      errors.website = 'Website must start with http:// or https://';
    }

    if (Object.keys(errors).length > 0) {
      setRequestErrors(errors);
      return;
    }

    setRequestErrors({});
    setRequestSubmitted(true);

    if (submitVerificationRequest) {
      submitVerificationRequest(orgRequest);
    }

    setTimeout(() => {
      setIsModalOpen(false);
      setRequestSubmitted(false);
      setOrgRequest({
        companyName: '',
        tradeLicense: '',
        corporateEmail: '',
        website: '',
        contactPerson: '',
      });
    }, 1500);
  };

  // Status Filter options
  const statusFilters = [
    { id: 'all', label: 'All Organizations', count: organizations.length },
    {
      id: 'verified',
      label: 'Verified Employers',
      count: organizations.filter((o) => o.verificationStatus === 'verified').length,
      variant: 'verified',
    },
    {
      id: 'unverified',
      label: 'Unverified Companies',
      count: organizations.filter((o) => o.verificationStatus === 'unverified').length,
      variant: 'unverified',
    },
    {
      id: 'suspicious',
      label: 'Flagged / Suspicious',
      count: organizations.filter((o) => o.verificationStatus === 'suspicious').length,
      variant: 'suspicious',
    },
  ];

  // Category list
  const categoryFilters = [
    'all',
    'Information Technology',
    'Banking & Financial',
    'Pharmaceuticals & Healthcare',
    'Non-Governmental Organization (NGO)',
    'Logistics & Supply Chain',
    'Third-Party Placement Agency',
  ];

  // Filtering Logic
  const filteredOrgs = organizations.filter((org) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !query ||
      org.name.toLowerCase().includes(query) ||
      org.category.toLowerCase().includes(query) ||
      org.registrationNumber.toLowerCase().includes(query) ||
      org.officialEmailDomain.toLowerCase().includes(query) ||
      org.officialWebsite.toLowerCase().includes(query);

    const matchesStatus =
      activeStatusFilter === 'all' || org.verificationStatus === activeStatusFilter;

    const matchesCategory =
      activeCategory === 'all' || org.category === activeCategory;

    return matchesQuery && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Educational & Mock Data Disclaimer */}
      <div className="p-3.5 rounded-xl bg-[#F0FDF9] border border-[#99F6E4] flex items-start sm:items-center gap-3 text-xs text-[#087F70]">
        <Info size={18} className="shrink-0 mt-0.5 sm:mt-0" />
        <p className="leading-relaxed">
          <strong>Directory Disclaimer:</strong> Organization verification profiles are mock simulation data for educational and fraud prevention demonstration. CircularShield does not certify legal entities in the real world.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* PAGE 2: ORGANIZATION DETAILS VIEW (When selectedOrg is active)             */}
      {/* ========================================================================= */}
      {selectedOrg ? (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-150">
          {/* Back Button & Navigation Bar */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <button
              type="button"
              onClick={handleBackToDirectory}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#64748B] hover:text-[#087F70] transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>&larr; Back to Organization Directory</span>
            </button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={copiedLink ? Check : Share2}
                onClick={handleShare}
                className="text-xs h-8.5"
              >
                {copiedLink ? 'Link Copied' : 'Share Profile'}
              </Button>

              <Button
                variant="danger"
                size="sm"
                leftIcon={AlertOctagon}
                onClick={() => {
                  if (isAuthenticated) {
                    navigate('/report-scam');
                  } else {
                    openAuthModal({
                      destination: '/report-scam',
                      featureTitle: `Report Impersonation: ${selectedOrg.name}`,
                      reason:
                        'Reporting an employer impersonator requires signing in to maintain case records.',
                    });
                  }
                }}
                className="text-xs h-8.5"
              >
                Report Impersonation
              </Button>
            </div>
          </div>

          {/* Organization Details Hero Banner Card */}
          <Card className="border-[#E2E8F0] shadow-sm overflow-hidden">
            <div
              className={`h-3 w-full ${
                selectedOrg.verificationStatus === 'verified'
                  ? 'bg-[#16A36A]'
                  : selectedOrg.verificationStatus === 'suspicious'
                  ? 'bg-[#DC4B4B]'
                  : 'bg-[#D99A28]'
              }`}
            />

            <CardContent className="p-6 sm:p-8 space-y-6">
              {/* Header Profile Row */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-[#F1F5F8]">
                <div className="flex items-start gap-4">
                  {/* Company Logo */}
                  <img
                    src={selectedOrg.logo}
                    alt={selectedOrg.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-[#E2E8F0] shrink-0 shadow-xs"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&auto=format&fit=crop&q=80';
                    }}
                  />

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-xl sm:text-2xl font-black text-[#102C3A]">
                        {selectedOrg.name}
                      </h1>
                      {selectedOrg.verificationStatus === 'verified' && (
                        <CheckCircle2 size={20} className="text-[#16A36A] shrink-0" />
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
                      <span className="font-semibold text-[#182B36]">{selectedOrg.category}</span>
                      <span>•</span>
                      <span>Established {selectedOrg.establishedYear}</span>
                      <span>•</span>
                      <span className="font-mono">Ref: {selectedOrg.id}</span>
                    </div>

                    <div className="pt-1">
                      <Badge
                        variant={selectedOrg.verificationStatus}
                        size="md"
                        showDot={true}
                        className="font-bold uppercase tracking-wider"
                      >
                        {selectedOrg.verificationStatus === 'verified'
                          ? 'VERIFIED ENTERPRISE'
                          : selectedOrg.verificationStatus === 'suspicious'
                          ? 'SUSPICIOUS / BLACKLISTED'
                          : 'UNVERIFIED / PENDING ACCREDITATION'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Direct Action */}
                <div className="shrink-0 w-full sm:w-auto">
                  <a
                    href={selectedOrg.officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto"
                  >
                    <Button
                      variant={selectedOrg.verificationStatus === 'verified' ? 'secondary' : 'outline'}
                      size="md"
                      rightIcon={ExternalLink}
                      className="w-full sm:w-auto text-xs font-bold"
                    >
                      Visit Official Website
                    </Button>
                  </a>
                </div>
              </div>

              {/* Organization Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  About Organization
                </h4>
                <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">
                  {selectedOrg.description}
                </p>
              </div>

              {/* Key Verification & Technical Credentials Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
                {/* Official Website */}
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs space-y-1">
                  <span className="text-[#94A3B8] block text-[11px] font-semibold">
                    Official Website
                  </span>
                  <a
                    href={selectedOrg.officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#087F70] hover:underline flex items-center gap-1.5 truncate"
                  >
                    <span className="truncate">{selectedOrg.officialWebsite}</span>
                    <ExternalLink size={13} className="shrink-0" />
                  </a>
                </div>

                {/* Official Career Page */}
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs space-y-1">
                  <span className="text-[#94A3B8] block text-[11px] font-semibold">
                    Official Career Gateway
                  </span>
                  <a
                    href={selectedOrg.officialCareerPage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#087F70] hover:underline flex items-center gap-1.5 truncate"
                  >
                    <span className="truncate">{selectedOrg.officialCareerPage}</span>
                    <ExternalLink size={13} className="shrink-0" />
                  </a>
                </div>

                {/* Official Email Domain */}
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs space-y-1">
                  <span className="text-[#94A3B8] block text-[11px] font-semibold">
                    Certified Corporate Email Domain
                  </span>
                  <span className="font-mono font-bold text-[#102C3A] block truncate">
                    @{selectedOrg.officialEmailDomain}
                  </span>
                </div>

                {/* Registration / RJSC Number */}
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs space-y-1">
                  <span className="text-[#94A3B8] block text-[11px] font-semibold">
                    Registration / Trade License No
                  </span>
                  <span className="font-mono font-bold text-[#102C3A] block">
                    {selectedOrg.registrationNumber}
                  </span>
                </div>

                {/* Verification Level */}
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs space-y-1">
                  <span className="text-[#94A3B8] block text-[11px] font-semibold">
                    Accreditation Level
                  </span>
                  <span className="font-bold text-[#102C3A] block">
                    {selectedOrg.verificationLevel}
                  </span>
                </div>

                {/* Active Circulars */}
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs space-y-1">
                  <span className="text-[#94A3B8] block text-[11px] font-semibold">
                    Active Verified Notices
                  </span>
                  <span className="font-bold text-[#087F70] block">
                    {selectedOrg.activeCirculars} Circulars in Registry
                  </span>
                </div>
              </div>

              {/* Physical Office & Phone */}
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#475569]">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-[#087F70] shrink-0" />
                  <span>Headquarters: {selectedOrg.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-[#102C3A] shrink-0" />
                  <span>Corporate Line: {selectedOrg.phone}</span>
                </div>
              </div>

              {/* ORGANIZATION MISMATCH WARNING SECTION */}
              {selectedOrg.mismatchWarning && (
                <div
                  className={`p-5 rounded-2xl border space-y-2.5 ${
                    selectedOrg.verificationStatus === 'suspicious'
                      ? 'bg-[#FEF2F2] border-[#FECACA] text-[#DC4B4B]'
                      : selectedOrg.verificationStatus === 'unverified'
                      ? 'bg-[#FFFBEB] border-[#FDE68A] text-[#D99A28]'
                      : 'bg-[#FFFBEB] border-[#FDE68A] text-[#D99A28]'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {selectedOrg.verificationStatus === 'suspicious' ? (
                      <AlertOctagon size={18} />
                    ) : (
                      <AlertTriangle size={18} />
                    )}
                    <span>Organization Mismatch & Impersonation Warning</span>
                  </div>

                  <h5 className="font-bold text-xs text-[#182B36]">
                    {selectedOrg.mismatchWarning.title}
                  </h5>

                  <p className="text-xs text-[#334155] leading-relaxed">
                    {selectedOrg.mismatchWarning.text}
                  </p>

                  <div className="pt-1 flex items-center justify-between flex-wrap gap-2 text-xs">
                    <span className="font-semibold text-slate-700">
                      Reported Scam Clones Mimicking This Org: {selectedOrg.reportedScamClones} Cases
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (isAuthenticated) {
                          navigate('/report-scam');
                        } else {
                          openAuthModal({
                            destination: '/report-scam',
                            featureTitle: `Report Impersonation: ${selectedOrg.name}`,
                            reason:
                              'Filing a whistleblower impersonation complaint requires an authenticated session to track the investigation.',
                          });
                        }
                      }}
                      className="font-bold hover:underline cursor-pointer flex items-center gap-1 text-[#DC4B4B]"
                    >
                      Report a fake notice claiming to be {selectedOrg.name} &rarr;
                    </button>
                  </div>
                </div>
              )}

              {/* Official Recruitment Policy Statement */}
              <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] space-y-1.5 text-xs">
                <span className="font-bold text-[#102C3A] flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-[#16A36A]" />
                  Recruitment Integrity Policy:
                </span>
                <p className="text-[#64748B] leading-relaxed">
                  {selectedOrg.officialRecruitmentPolicy}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* ========================================================================= */
        /* PAGE 1: ORGANIZATION DIRECTORY VIEW (When browsing directory)              */
        /* ========================================================================= */
        <div className="space-y-6">
          {/* Page Title & Subtitle */}
          <PageHeader
            breadcrumbs={[
              { label: 'Dashboard', to: '/dashboard' },
              { label: 'Organizations' },
            ]}
            title="Organizations"
            subtitle="Search verified employers, check official career domains, and avoid company impersonators."
            actions={
              <Button
                variant="secondary"
                size="md"
                leftIcon={BadgeCheck}
                onClick={() => {
                  if (isAuthenticated) {
                    setIsModalOpen(true);
                  } else {
                    openAuthModal({
                      destination: '/organizations',
                      featureTitle: 'Apply for Organization Verification',
                      reason:
                        'Employer verification accreditation requires an authenticated business representative or enterprise account.',
                    });
                  }
                }}
                className="text-xs font-semibold shadow-xs"
              >
                Apply for Organization Verification
              </Button>
            }
          />

          {/* Search Bar Container */}
          <Card className="bg-gradient-to-r from-white via-white to-[#F0FDF9] border-[#087F70]/30 shadow-xs">
            <CardContent className="p-5 sm:p-6 space-y-4">
              <div className="max-w-xl">
                <h3 className="text-base font-bold text-[#102C3A] flex items-center gap-2">
                  <Building2 size={20} className="text-[#087F70]" />
                  Search Organization Registry
                </h3>
                <p className="text-xs text-[#64748B] mt-1">
                  Search by organization name, email domain (e.g. <code>brainstation-23.com</code>), or registration ID.
                </p>
              </div>

              {/* Search Input Form */}
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                    <Search size={18} />
                  </div>

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search organization name, domain, or registration license..."
                    className="w-full bg-white text-xs sm:text-sm pl-10 pr-9 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#087F70] focus:ring-2 focus:ring-[#087F70]/20 outline-none transition-all placeholder-[#94A3B8]"
                  />

                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => handleSearchChange('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#94A3B8] hover:text-[#182B36] cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="secondary"
                  size="md"
                  leftIcon={Search}
                  className="shrink-0 font-semibold text-xs"
                >
                  Search Organization
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Status Filters: All, Verified, Unverified, Suspicious */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              {statusFilters.map((sf) => (
                <button
                  key={sf.id}
                  type="button"
                  onClick={() => setActiveStatusFilter(sf.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                    activeStatusFilter === sf.id
                      ? 'bg-[#102C3A] text-white border-[#102C3A] shadow-xs'
                      : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#CBD5E1] hover:text-[#182B36]'
                  }`}
                >
                  <span>{sf.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      activeStatusFilter === sf.id
                        ? 'bg-white/20 text-white'
                        : 'bg-[#F1F5F8] text-[#475569]'
                    }`}
                  >
                    {sf.count}
                  </span>
                </button>
              ))}
            </div>

            <span className="text-xs text-[#94A3B8] hidden sm:block">
              Showing {filteredOrgs.length} of {organizations.length} Organizations
            </span>
          </div>

          {/* Category Quick Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[#94A3B8] font-semibold shrink-0 mr-1">Industry:</span>
            {categoryFilters.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-[#087F70] text-white font-semibold'
                    : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#182B36]'
                }`}
              >
                {cat === 'all' ? 'All Industries' : cat}
              </button>
            ))}
          </div>

          {/* LOADING STATE WITH SKELETON CARDS */}
          {isSearching && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} rows={3} />
              ))}
            </div>
          )}

          {/* NO-RESULT STATE */}
          {!isSearching && filteredOrgs.length === 0 && (
            <Card className="text-center py-12 px-6 border-dashed border-2 border-[#CBD5E1]">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#94A3B8] mb-4">
                <Building2 size={28} />
              </div>

              <h4 className="text-base font-bold text-[#102C3A]">
                No organizations found matching &quot;{searchQuery}&quot;
              </h4>
              <p className="text-xs text-[#64748B] max-w-md mx-auto mt-1 leading-relaxed">
                This employer has not been accredited or cataloged in CircularShield yet. Exercise caution before submitting application fees or sharing National ID.
              </p>

              <div className="pt-6 flex items-center justify-center gap-3 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveStatusFilter('all');
                    setActiveCategory('all');
                  }}
                  className="text-xs"
                >
                  Clear All Filters
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={BadgeCheck}
                  onClick={() => {
                    setOrgRequest((prev) => ({ ...prev, companyName: searchQuery }));
                    setIsModalOpen(true);
                  }}
                  className="text-xs font-bold"
                >
                  Request Verification for this Entity
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  leftIcon={AlertOctagon}
                  onClick={() => navigate('/report-scam')}
                  className="text-xs"
                >
                  Report Suspicious Circular
                </Button>
              </div>
            </Card>
          )}

          {/* ORGANIZATION LISTING CARDS GRID */}
          {!isSearching && filteredOrgs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredOrgs.map((org) => {
                const isVerified = org.verificationStatus === 'verified';
                const isSuspicious = org.verificationStatus === 'suspicious';

                return (
                  <Card
                    key={org.id}
                    className={`flex flex-col justify-between border-t-4 transition-all hover:shadow-sm ${
                      isVerified
                        ? 'border-t-[#16A36A]'
                        : isSuspicious
                        ? 'border-t-[#DC4B4B]'
                        : 'border-t-[#D99A28]'
                    }`}
                  >
                    <CardContent className="p-5 space-y-4">
                      {/* Logo & Name Header */}
                      <div className="flex items-start gap-3.5">
                        <img
                          src={org.logo}
                          alt={org.name}
                          className="w-12 h-12 rounded-xl object-cover border border-[#E2E8F0] shrink-0"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&auto=format&fit=crop&q=80';
                          }}
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-sm sm:text-base text-[#182B36] truncate hover:text-[#087F70] transition-colors">
                              {org.name}
                            </h4>
                            {isVerified && (
                              <CheckCircle2 size={15} className="text-[#16A36A] shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-[#64748B] truncate mt-0.5">
                            {org.category}
                          </p>
                        </div>
                      </div>

                      {/* Verification Badge & Tier */}
                      <div className="flex items-center justify-between text-xs">
                        <Badge
                          variant={org.verificationStatus}
                          size="sm"
                          showDot={true}
                          className="font-bold uppercase tracking-wider"
                        >
                          {isVerified
                            ? 'VERIFIED'
                            : isSuspicious
                            ? 'SUSPICIOUS'
                            : 'UNVERIFIED'}
                        </Badge>

                        <span className="text-[11px] font-mono text-[#64748B]">
                          {org.registrationNumber}
                        </span>
                      </div>

                      {/* Official Website & Domain */}
                      <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs space-y-1">
                        <div className="flex items-center justify-between text-[#64748B] truncate">
                          <span>Official Website:</span>
                          <a
                            href={org.officialWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-[#087F70] hover:underline flex items-center gap-1 truncate max-w-[150px]"
                          >
                            <span className="truncate">{org.officialWebsite}</span>
                            <ExternalLink size={12} className="shrink-0" />
                          </a>
                        </div>

                        <div className="flex items-center justify-between text-[#64748B]">
                          <span>Domain:</span>
                          <span className="font-mono font-semibold text-[#182B36]">
                            @{org.officialEmailDomain}
                          </span>
                        </div>
                      </div>

                      {/* Short Description */}
                      <p className="text-[11px] text-[#64748B] line-clamp-2 leading-relaxed">
                        {org.description}
                      </p>
                    </CardContent>

                    {/* Card Footer: View Details Button */}
                    <div className="px-5 py-3 bg-[#F8FAFC] border-t border-[#F1F5F8] flex items-center justify-between">
                      <span className="text-[11px] text-[#64748B]">
                        Active Notices: <strong className="text-[#182B36]">{org.activeCirculars}</strong>
                      </span>

                      <Button
                        variant="subtle"
                        size="sm"
                        onClick={() => handleViewDetails(org)}
                        className="text-xs h-7.5 px-3 font-semibold text-[#087F70] hover:bg-[#087F70]/10"
                      >
                        View Details &rarr;
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* REQUEST ORGANIZATION VERIFICATION MODAL                                    */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Apply for Organization Verification"
        description="Submit your enterprise credentials, corporate email domain, and trade license for accreditation in the CircularShield Registry."
      >
        {requestSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#ECFDF5] text-[#16A36A] flex items-center justify-center mx-auto shadow-2xs">
              <CheckCircle2 size={28} />
            </div>
            <h4 className="text-base font-bold text-[#182B36]">
              Application Submitted for Review!
            </h4>
            <p className="text-xs text-[#64748B] max-w-sm mx-auto leading-relaxed">
              Our accreditation desk will verify your RJSC certificate, corporate domain records, and phone lines within 2–3 business days.
            </p>
          </div>
        ) : (
          <form onSubmit={handleRequestSubmit} className="space-y-4">
            <Input
              label="Organization Name"
              placeholder="e.g. Apex Corporation PLC"
              value={orgRequest.companyName}
              onChange={(e) => {
                setOrgRequest({ ...orgRequest, companyName: e.target.value });
                if (requestErrors.companyName) setRequestErrors({ ...requestErrors, companyName: '' });
              }}
              error={requestErrors.companyName}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Trade License / RJSC Reg Number"
                placeholder="C-XXXXXX/YY"
                value={orgRequest.tradeLicense}
                onChange={(e) => {
                  setOrgRequest({ ...orgRequest, tradeLicense: e.target.value });
                  if (requestErrors.tradeLicense) setRequestErrors({ ...requestErrors, tradeLicense: '' });
                }}
                error={requestErrors.tradeLicense}
                required
              />

              <Input
                label="Corporate Email Domain"
                placeholder="corporate@company.com"
                value={orgRequest.corporateEmail}
                onChange={(e) => {
                  setOrgRequest({ ...orgRequest, corporateEmail: e.target.value });
                  if (requestErrors.corporateEmail) setRequestErrors({ ...requestErrors, corporateEmail: '' });
                }}
                error={requestErrors.corporateEmail}
                required
              />
            </div>

            <Input
              label="Official Career Website Gateway"
              placeholder="https://company.com/careers"
              value={orgRequest.website}
              onChange={(e) => {
                setOrgRequest({ ...orgRequest, website: e.target.value });
                if (requestErrors.website) setRequestErrors({ ...requestErrors, website: '' });
              }}
              error={requestErrors.website}
              required
            />

            <Input
              label="Authorised HR Representative Name & Title"
              placeholder="Shafiqul Islam, Head of People Operations"
              value={orgRequest.contactPerson}
              onChange={(e) =>
                setOrgRequest({ ...orgRequest, contactPerson: e.target.value })
              }
              required
            />

            <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#64748B] flex items-start gap-2">
              <ShieldCheck size={16} className="text-[#16A36A] shrink-0 mt-0.5" />
              <span>
                Free verification service for registered corporate entities and public interest organizations in Bangladesh.
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="secondary"
                size="md"
                className="font-semibold"
              >
                Submit for Accreditation
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default OrganizationVerification;
