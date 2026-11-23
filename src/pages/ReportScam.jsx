import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  Send,
  CheckCircle2,
  Phone,
  CreditCard,
  Link2,
  Building2,
  FileText,
  Upload,
  Trash2,
  RefreshCw,
  AlertOctagon,
  Clock,
  XCircle,
  FileCheck,
  History,
  Sparkles,
} from 'lucide-react';

import PageHeader from '../components/ui/PageHeader';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { formatDate } from '../utils/formatters';

export const ReportScam = ({ onSubmitReport }) => {
  const navigate = useNavigate();
  // Navigation View: 'form' | 'history'
  const [activeView, setActiveView] = useState('form');

  // The 6 exact required report categories
  const REPORT_CATEGORIES = [
    { id: 'Fake Job Circular', label: 'Fake Job Circular', icon: FileText, desc: 'Fabricated notice soliciting fees or fake roles' },
    { id: 'Fake Company', label: 'Fake Company', icon: Building2, desc: 'Fictitious or impersonated hiring entity' },
    { id: 'Suspicious Phone Number', label: 'Suspicious Phone Number', icon: Phone, desc: 'Recruiter calling or messaging for illegal demands' },
    { id: 'Fake bKash/Nagad Number', label: 'Fake bKash/Nagad Number', icon: CreditCard, desc: 'Personal mobile money account soliciting deposits' },
    { id: 'Suspicious Website', label: 'Suspicious Website', icon: Link2, desc: 'Spoofed portal or deceptive domain clone' },
    { id: 'Fraudulent Application Link', label: 'Fraudulent Application Link', icon: AlertOctagon, desc: 'Phishing form or Telegram chat trap link' },
  ];

  // Initial Seed Reports for Report History (covering Pending, Reviewed, Rejected)
  const [reportsList, setReportsList] = useState([
    {
      id: 'RPT-2026-9041',
      category: 'Fake bKash/Nagad Number',
      jobCompanyName: 'Bangladesh Railway Project Wing (Impersonated)',
      website: 'http://gov-railwayproject-bd.net',
      phone: '01711-223344',
      paymentNumber: '01799-887766 (bKash Personal)',
      description: 'Candidate was ordered to send BDT 450 exam admit card fee to a personal bKash wallet. Unpaid applications threatened with cancellation within 48 hours.',
      evidenceFile: { name: 'railway_admit_fee_sms.png', size: 450000, type: 'image/png' },
      submittedDate: '2026-11-23T08:30:00Z',
      status: 'Reviewed',
      reviewerNotes: 'Verified threat syndicate. bKash account flagged in Cyber Police CID radar database.',
    },
    {
      id: 'RPT-2026-9042',
      category: 'Fraudulent Application Link',
      jobCompanyName: 'Telegram Data Work BD',
      website: 'https://t.me/bangladesh_daily_parttime_jobs',
      phone: '01819-223344',
      paymentNumber: '01819-223344 (Nagad)',
      description: 'Urged students to join anonymous Telegram channel for captcha typing. Demanded BDT 1,000 refundable software activation security deposit.',
      evidenceFile: { name: 'telegram_chat_receipt.pdf', size: 1240000, type: 'application/pdf' },
      submittedDate: '2026-11-22T14:15:00Z',
      status: 'Pending',
      reviewerNotes: 'Under active inspection by security analyst. Domain quarantine underway.',
    },
    {
      id: 'RPT-2026-9043',
      category: 'Fake Company',
      jobCompanyName: 'Swift Placement Consultants',
      website: 'http://swiftcareer-bd.xyz',
      phone: '01789-991122',
      paymentNumber: '01789-991122',
      description: 'Issued counterfeit appointment letter with forged ministry emblems. Demanded BDT 3,500 background check fee.',
      evidenceFile: { name: 'forged_appointment_letter.pdf', size: 1850000, type: 'application/pdf' },
      submittedDate: '2026-11-20T11:00:00Z',
      status: 'Reviewed',
      reviewerNotes: 'Confirmed fake agency. Blacklist entry generated in Organization Registry.',
    },
    {
      id: 'RPT-2026-9044',
      category: 'Suspicious Phone Number',
      jobCompanyName: 'Apex Regional Retail Division',
      website: '',
      phone: '01911-332211',
      paymentNumber: '',
      description: 'Candidate reported receiving a follow-up interview inquiry call. Investigation confirmed call originated from verified HR department.',
      evidenceFile: null,
      submittedDate: '2026-11-18T16:20:00Z',
      status: 'Rejected',
      reviewerNotes: 'Inspection concluded. Call verified as genuine employer scheduling call; no fees were solicited.',
    },
  ]);

  // Form State
  const [formData, setFormData] = useState({
    category: 'Fake Job Circular',
    jobCompanyName: '',
    website: '',
    phone: '',
    paymentNumber: '',
    description: '',
  });

  // Evidence Upload State
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [evidencePreviewUrl, setEvidencePreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Validation Errors
  const [errors, setErrors] = useState({});

  // Confirmation Modal State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success State Banner
  const [submissionSuccess, setSubmissionSuccess] = useState(null);

  // History Tab Filter
  const [historyStatusFilter, setHistoryStatusFilter] = useState('all'); // 'all' | 'Pending' | 'Reviewed' | 'Rejected'
  const [selectedHistoryReport, setSelectedHistoryReport] = useState(null);

  // Helper: Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  // Handle Form Input Change
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Handle File Upload
  const handleFileChange = (file) => {
    if (!file) return;

    // Validate type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    const isExtensionValid = /\.(pdf|jpg|jpeg|png)$/i.test(file.name);

    if (!validTypes.includes(file.type) && !isExtensionValid) {
      setErrors((prev) => ({
        ...prev,
        evidence: 'Please upload a valid PDF document or Image (JPG, PNG).',
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, evidence: '' }));
    setEvidenceFile(file);

    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setEvidencePreviewUrl(url);
    } else {
      setEvidencePreviewUrl(null);
    }
  };

  const handleRemoveEvidence = () => {
    setEvidenceFile(null);
    setEvidencePreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Form Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.category) {
      newErrors.category = 'Please select a report category.';
    }

    if (!formData.jobCompanyName.trim()) {
      newErrors.jobCompanyName = 'Job or Company Name is required.';
    } else if (formData.jobCompanyName.trim().length < 2) {
      newErrors.jobCompanyName = 'Company name must be at least 2 characters.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please provide a detailed description of the suspicious activity.';
    } else if (formData.description.trim().length < 15) {
      newErrors.description = 'Description must be at least 15 characters long to assist analysts.';
    }

    // Category-specific validation
    if (
      formData.category === 'Fake bKash/Nagad Number' &&
      !formData.paymentNumber.trim()
    ) {
      newErrors.paymentNumber = 'Please specify the suspicious mobile payment number.';
    }

    if (
      formData.category === 'Suspicious Phone Number' &&
      !formData.phone.trim()
    ) {
      newErrors.phone = 'Please provide the suspicious caller/contact phone number.';
    }

    if (
      (formData.category === 'Suspicious Website' ||
        formData.category === 'Fraudulent Application Link') &&
      !formData.website.trim()
    ) {
      newErrors.website = 'Please provide the suspicious URL or website link.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Initial Form Submit (Opens Confirmation Modal)
  const handleOpenConfirm = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowConfirmModal(true);
    }
  };

  // Confirm and Finalize Submission
  const handleFinalSubmit = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      const newReportId = `RPT-2026-${Math.floor(9000 + Math.random() * 1000)}`;
      const newReport = {
        id: newReportId,
        category: formData.category,
        jobCompanyName: formData.jobCompanyName,
        website: formData.website,
        phone: formData.phone,
        paymentNumber: formData.paymentNumber,
        description: formData.description,
        evidenceFile: evidenceFile
          ? { name: evidenceFile.name, size: evidenceFile.size, type: evidenceFile.type }
          : null,
        submittedDate: new Date().toISOString(),
        status: 'Pending',
        reviewerNotes: 'Report logged in system. Awaiting verification by security desk.',
      };

      // Add to internal list
      setReportsList((prev) => [newReport, ...prev]);

      // Call parent hook if provided
      if (onSubmitReport) {
        onSubmitReport({
          title: `Reported: ${formData.category} - ${formData.jobCompanyName}`,
          targetEntity: formData.jobCompanyName,
          category: formData.category,
          jobCompanyName: formData.jobCompanyName,
          description: formData.description,
          summary: formData.description,
          contactNumber: formData.phone || formData.paymentNumber,
          channel: formData.category,
          website: formData.website,
          phone: formData.phone,
          paymentNumber: formData.paymentNumber,
          evidencePreviewUrl: evidencePreviewUrl,
          amountDemanded: formData.paymentNumber ? 'BDT 1,500' : 'Unspecified',
        });
      }

      setIsSubmitting(false);
      setShowConfirmModal(false);
      setSubmissionSuccess(newReport);

      // Reset form
      setFormData({
        category: 'Fake Job Circular',
        jobCompanyName: '',
        website: '',
        phone: '',
        paymentNumber: '',
        description: '',
      });
      handleRemoveEvidence();
    }, 600);
  };

  // Preset sample filler
  const handleLoadSample = (sampleType) => {
    if (sampleType === 'bKash-scam') {
      setFormData({
        category: 'Fake bKash/Nagad Number',
        jobCompanyName: 'Directorate Health Coordination Wing (Fake)',
        website: 'http://gov-healthproject-bd.net',
        phone: '01711-889900',
        paymentNumber: '01799-887766 (bKash Personal)',
        description: 'Received SMS stating candidate was selected for Computer Operator. Required sending BDT 450 exam admit card fee to bKash 01799-887766 before download link is released.',
      });
    } else if (sampleType === 'fake-company') {
      setFormData({
        category: 'Fake Company',
        jobCompanyName: 'Global Apex Digital Services Ltd',
        website: 'https://apex-digital-typing.xyz',
        phone: '01822-445566',
        paymentNumber: '01822-445566 (Nagad)',
        description: 'Advertised work-from-home copy paste jobs promising 4,000 BDT daily. Required a BDT 1,000 software security deposit before sending task files.',
      });
    }
    setErrors({});
  };

  // Filtered reports for history view
  const filteredReports = reportsList.filter((r) => {
    if (historyStatusFilter === 'all') return true;
    return r.status === historyStatusFilter;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Page Header with Title and Description */}
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Report a Scam' },
        ]}
        title="Report a Job Scam"
        subtitle="Help protect other job seekers by reporting suspicious recruitment activities."
        badge={
          <Badge variant="suspicious" size="sm" showDot>
            Anonymous & Confidential
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant={activeView === 'form' ? 'secondary' : 'outline'}
              size="sm"
              leftIcon={Send}
              onClick={() => setActiveView('form')}
              className="text-xs h-9 font-semibold"
            >
              Submit Report
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={History}
              onClick={() => navigate('/my-activity?tab=reports')}
              className="text-xs h-9 font-semibold"
            >
              My Activity Reports ({reportsList.length})
            </Button>
          </div>
        }
      />

      {/* 2. Top Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveView('form')}
            className={`pb-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeView === 'form'
                ? 'border-[#087F70] text-[#087F70]'
                : 'border-transparent text-[#64748B] hover:text-[#182B36]'
            }`}
          >
            <Send size={16} />
            <span>Submit a Scam Report</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('history')}
            className={`pb-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeView === 'history'
                ? 'border-[#087F70] text-[#087F70]'
                : 'border-transparent text-[#64748B] hover:text-[#182B36]'
            }`}
          >
            <History size={16} />
            <span>My Submitted Reports</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F1F5F8] text-[#102C3A] font-mono">
              {reportsList.length}
            </span>
          </button>
        </div>

        <span className="text-xs text-[#94A3B8] hidden sm:block">
          Your identity is kept completely private
        </span>
      </div>

      {/* ========================================================================= */}
      {/* VIEW A: REPORT FORM VIEW                                                  */}
      {/* ========================================================================= */}
      {activeView === 'form' && (
        <div className="space-y-6">
          {/* Success Banner if newly submitted */}
          {submissionSuccess && (
            <div className="p-5 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] space-y-3 animate-in fade-in duration-200">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#16A36A] text-white flex items-center justify-center font-bold shrink-0">
                    <CheckCircle2 size={22} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#102C3A]">
                      Scam Report Submitted Successfully!
                    </h4>
                    <p className="text-xs text-[#16A36A]">
                      Reference Case ID:{' '}
                      <strong className="font-mono">{submissionSuccess.id}</strong> • Status:{' '}
                      <span className="font-bold">Pending Review</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSubmissionSuccess(null)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <XCircle size={18} />
                </button>
              </div>

              <p className="text-xs text-[#475569] leading-relaxed">
                Thank you for acting to protect job seekers. Your report has been dispatched to our security intelligence team and added to your <strong>Report History</strong>.
              </p>

              <div className="pt-1 flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/my-activity?tab=reports')}
                  className="text-xs bg-white"
                >
                  View in My Activity &rarr;
                </Button>
                <button
                  type="button"
                  onClick={() => setSubmissionSuccess(null)}
                  className="text-xs font-semibold text-[#087F70] hover:underline"
                >
                  File another report
                </button>
              </div>
            </div>
          )}

          {/* Quick-Fill Sample Banner */}
          <div className="p-3.5 bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#102C3A]">
              <Sparkles size={16} className="text-[#087F70]" />
              <span>Quick Test Samples:</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              <button
                type="button"
                onClick={() => handleLoadSample('bKash-scam')}
                className="px-2.5 py-1 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-[#DC4B4B] font-semibold hover:bg-red-100 transition-colors cursor-pointer"
              >
                Fake bKash Fee Notice
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample('fake-company')}
                className="px-2.5 py-1 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] text-[#D99A28] font-semibold hover:bg-amber-100 transition-colors cursor-pointer"
              >
                Fake Company Task Scheme
              </button>
            </div>
          </div>

          {/* Main Form Layout (7 cols Form / 5 cols Guidance) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Form Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <Card className="border-[#E2E8F0] shadow-xs">
                <CardHeader>
                  <CardTitle>Whistleblower Incident Form</CardTitle>
                  <CardDescription>
                    Provide verified details and evidence of the suspicious recruitment scheme.
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6 space-y-5">
                  <form onSubmit={handleOpenConfirm} className="space-y-5">
                    {/* 1. Report Category Selector (6 Required Categories) */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#182B36] flex items-center justify-between">
                        <span>Report Category *</span>
                        {errors.category && (
                          <span className="text-[#DC4B4B] text-[11px] font-normal">
                            {errors.category}
                          </span>
                        )}
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {REPORT_CATEGORIES.map((cat) => {
                          const Icon = cat.icon;
                          const isSelected = formData.category === cat.id;

                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => handleInputChange('category', cat.id)}
                              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                                isSelected
                                  ? 'bg-[#F0FDF9] border-[#087F70] shadow-xs'
                                  : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1]'
                              }`}
                            >
                              <div
                                className={`p-1.5 rounded-lg shrink-0 ${
                                  isSelected
                                    ? 'bg-[#087F70] text-white'
                                    : 'bg-[#F1F5F8] text-[#64748B]'
                                }`}
                              >
                                <Icon size={16} />
                              </div>

                              <div className="min-w-0">
                                <p
                                  className={`text-xs font-bold ${
                                    isSelected ? 'text-[#087F70]' : 'text-[#182B36]'
                                  }`}
                                >
                                  {cat.label}
                                </p>
                                <p className="text-[10px] text-[#64748B] line-clamp-1 mt-0.5">
                                  {cat.desc}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 2. Job / Company Name */}
                    <div className="space-y-1">
                      <Input
                        label="Job Title or Impersonated Company Name *"
                        placeholder="e.g. Bangladesh Railway Assistant or Swift Career Agency"
                        value={formData.jobCompanyName}
                        onChange={(e) => handleInputChange('jobCompanyName', e.target.value)}
                        error={errors.jobCompanyName}
                        required
                      />
                      <span className="text-[11px] text-[#64748B]">
                        Specify the entity or position title mentioned in the circular.
                      </span>
                    </div>

                    {/* 3. Suspicious Website or URL */}
                    <div className="space-y-1">
                      <Input
                        label="Suspicious Website or URL"
                        placeholder="https://fake-job-portal.net or Telegram channel link..."
                        leftIcon={Link2}
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        error={errors.website}
                      />
                      <span className="text-[11px] text-[#64748B]">
                        Include the website address or application form link if applicable.
                      </span>
                    </div>

                    {/* 4. Contact Numbers Grid: Phone & Payment Number */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Phone Number */}
                      <div className="space-y-1">
                        <Input
                          label="Recruiter Phone Number"
                          placeholder="e.g. 01711-XXXXXX"
                          leftIcon={Phone}
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          error={errors.phone}
                        />
                        <span className="text-[11px] text-[#64748B]">
                          Phone or WhatsApp contact line used by the scammer.
                        </span>
                      </div>

                      {/* Payment Number (bKash/Nagad) */}
                      <div className="space-y-1">
                        <Input
                          label="Fake bKash / Nagad Wallet Number"
                          placeholder="e.g. 01799-887766"
                          leftIcon={CreditCard}
                          value={formData.paymentNumber}
                          onChange={(e) => handleInputChange('paymentNumber', e.target.value)}
                          error={errors.paymentNumber}
                        />
                        <span className="text-[11px] text-[#64748B]">
                          Personal mobile wallet where payment was demanded.
                        </span>
                      </div>
                    </div>

                    {/* 5. Detailed Description */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <label className="font-semibold text-[#182B36]">
                          Detailed Incident Description *
                        </label>
                        <span className="text-[11px] font-mono text-[#64748B]">
                          {formData.description.length} / 2,000 chars
                        </span>
                      </div>

                      <textarea
                        rows={4}
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Describe how they contacted you, what fees they demanded, fake excuses given (e.g. admit card, uniform, training deposit), and what happened next..."
                        className={`w-full bg-[#F8FAFC] text-xs sm:text-sm p-3.5 rounded-xl border focus:bg-white outline-none transition-all placeholder-[#94A3B8] leading-relaxed resize-y ${
                          errors.description
                            ? 'border-[#DC4B4B] focus:ring-2 focus:ring-red-500/20'
                            : 'border-[#CBD5E1] focus:border-[#087F70] focus:ring-2 focus:ring-[#087F70]/20'
                        }`}
                      />

                      {errors.description && (
                        <p className="text-xs text-[#DC4B4B]">{errors.description}</p>
                      )}
                      <span className="text-[11px] text-[#64748B] block">
                        Provide as much detail as possible to assist fraud investigators.
                      </span>
                    </div>

                    {/* 6. Evidence Upload (PDF, JPG, PNG) */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#182B36] flex items-center justify-between">
                        <span>Attach Supporting Evidence (Screenshots, PDF notice, SMS slips)</span>
                        <span className="text-[11px] text-[#64748B]">PDF, JPG, PNG up to 10MB</span>
                      </label>

                      {/* Hidden native input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,application/pdf,image/png,image/jpeg,image/jpg"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleFileChange(e.target.files[0]);
                          }
                        }}
                      />

                      {!evidenceFile ? (
                        /* Drag and Drop Zone */
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                          }}
                          onDragLeave={() => setIsDragging(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setIsDragging(false);
                            if (e.dataTransfer.files?.[0]) {
                              handleFileChange(e.dataTransfer.files[0]);
                            }
                          }}
                          onClick={() => fileInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer group ${
                            isDragging
                              ? 'border-[#087F70] bg-[#ECFDF5]'
                              : 'border-[#CBD5E1] hover:border-[#087F70] bg-[#F8FAFC]'
                          }`}
                        >
                          <Upload size={22} className="mx-auto text-[#087F70] group-hover:scale-105 transition-transform" />
                          <p className="text-xs font-bold text-[#102C3A] mt-2">
                            Drop screenshot or PDF evidence here, or <span className="text-[#087F70] underline">browse</span>
                          </p>
                          <p className="text-[11px] text-[#94A3B8] mt-0.5">
                            Transaction SMS, fake circular PDF, WhatsApp screenshots
                          </p>
                        </div>
                      ) : (
                        /* File Preview & Remove Control */
                        <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] space-y-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center text-[#087F70] shrink-0">
                                <FileCheck size={20} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-[#102C3A] truncate">
                                  {evidenceFile.name}
                                </p>
                                <p className="text-[11px] text-[#64748B]">
                                  {formatFileSize(evidenceFile.size)} • {evidenceFile.type || 'Document'}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="p-1.5 text-slate-500 hover:text-[#087F70] rounded-lg hover:bg-slate-100"
                                title="Replace file"
                              >
                                <RefreshCw size={15} />
                              </button>
                              <button
                                type="button"
                                onClick={handleRemoveEvidence}
                                className="p-1.5 text-slate-500 hover:text-[#DC4B4B] rounded-lg hover:bg-red-50"
                                title="Remove evidence"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>

                          {/* Image preview thumbnail if image */}
                          {evidencePreviewUrl && (
                            <div className="rounded-lg overflow-hidden border border-[#E2E8F0] max-h-36 flex items-center justify-center bg-white">
                              <img
                                src={evidencePreviewUrl}
                                alt="Evidence Preview"
                                className="max-h-36 object-contain"
                              />
                            </div>
                          )}
                        </div>
                      )}
                      {errors.evidence && (
                        <p className="text-xs text-[#DC4B4B]">{errors.evidence}</p>
                      )}
                    </div>

                    {/* Submit Report Button */}
                    <div className="pt-2">
                      <Button
                        type="submit"
                        variant="danger"
                        size="lg"
                        leftIcon={Send}
                        className="w-full text-sm font-bold shadow-sm"
                      >
                        Submit Scam Report
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Right Guidance & Emergency Info (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Whistleblower Protocol Advice */}
              <Card className="border-[#DC4B4B]/30 bg-gradient-to-br from-white to-[#FEF2F2]">
                <CardHeader>
                  <div className="flex items-center gap-2 text-[#DC4B4B]">
                    <ShieldAlert size={20} />
                    <CardTitle className="text-[#DC4B4B]">
                      Whistleblower Protection
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-xs text-[#475569] leading-relaxed">
                  <p>
                    <strong>Keep Evidence Safe:</strong> Save SMS alerts, bKash transaction IDs (TrxID), and chat logs. Do not delete them.
                  </p>
                  <p>
                    <strong>Direct Police Referral:</strong> Verified reports with transaction numbers are logged in the national fraud radar and shared with the CID Cyber Crime Division.
                  </p>
                  <div className="p-3 bg-white rounded-xl border border-red-200 text-[#182B36] space-y-1">
                    <span className="font-bold block text-[#DC4B4B]">
                      Emergency Police Hotline:
                    </span>
                    <p>National Emergency: 999</p>
                    <p>CID Cyber Police: 01730336107 / 01320010148</p>
                  </div>
                </CardContent>
              </Card>

              {/* Statistics Card */}
              <Card className="border-[#E2E8F0]">
                <CardHeader>
                  <CardTitle>Whistleblower Impact</CardTitle>
                  <CardDescription>
                    Citizen vigilance protecting graduates nationwide.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-xs text-[#64748B]">
                  <div className="flex items-center justify-between p-2.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                    <span>Syndicate Reports Logged</span>
                    <strong className="text-[#182B36] font-mono">428 Verified</strong>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                    <span>bKash Wallets Blocked</span>
                    <strong className="text-[#DC4B4B] font-mono">186 Blacklisted</strong>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                    <span>Phishing Domains Taken Down</span>
                    <strong className="text-[#087F70] font-mono">114 Neutralized</strong>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW B: REPORT HISTORY SECTION                                            */}
      {/* ========================================================================= */}
      {activeView === 'history' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* History Header & Status Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#102C3A]">
                Submitted Whistleblower Reports History
              </h3>
              <p className="text-xs text-[#64748B]">
                Track the status of your reported recruitment scam incidents and reviewer findings.
              </p>
            </div>

            {/* Status Filter Badges: Pending, Reviewed, Rejected */}
            <div className="flex items-center gap-1.5 p-1 bg-[#F1F5F8] rounded-xl border border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setHistoryStatusFilter('all')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  historyStatusFilter === 'all'
                    ? 'bg-white text-[#102C3A] shadow-xs'
                    : 'text-[#64748B] hover:text-[#182B36]'
                }`}
              >
                All ({reportsList.length})
              </button>
              <button
                type="button"
                onClick={() => setHistoryStatusFilter('Pending')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  historyStatusFilter === 'Pending'
                    ? 'bg-[#D99A28] text-white shadow-xs'
                    : 'text-[#D99A28] hover:bg-amber-50'
                }`}
              >
                Pending
              </button>
              <button
                type="button"
                onClick={() => setHistoryStatusFilter('Reviewed')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  historyStatusFilter === 'Reviewed'
                    ? 'bg-[#16A36A] text-white shadow-xs'
                    : 'text-[#16A36A] hover:bg-emerald-50'
                }`}
              >
                Reviewed
              </button>
              <button
                type="button"
                onClick={() => setHistoryStatusFilter('Rejected')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  historyStatusFilter === 'Rejected'
                    ? 'bg-[#DC4B4B] text-white shadow-xs'
                    : 'text-[#DC4B4B] hover:bg-red-50'
                }`}
              >
                Rejected
              </button>
            </div>
          </div>

          {/* Reports Table / Card List */}
          <div className="space-y-3.5">
            {filteredReports.map((report) => {
              const isReviewed = report.status === 'Reviewed';
              const isPending = report.status === 'Pending';

              return (
                <Card
                  key={report.id}
                  className={`border-l-4 transition-all hover:shadow-xs ${
                    isReviewed
                      ? 'border-l-[#16A36A]'
                      : isPending
                      ? 'border-l-[#D99A28]'
                      : 'border-l-[#DC4B4B]'
                  }`}
                >
                  <CardContent className="p-5 space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#102C3A]/5 text-[#102C3A]">
                          {report.id}
                        </span>
                        <Badge variant="neutral" size="sm">
                          {report.category}
                        </Badge>
                        <span className="text-xs text-[#94A3B8]">
                          {formatDate(report.submittedDate)}
                        </span>
                      </div>

                      {/* Required Status Badge: Pending, Reviewed, Rejected */}
                      <Badge
                        variant={
                          isReviewed
                            ? 'verified'
                            : isPending
                            ? 'unverified'
                            : 'suspicious'
                        }
                        size="sm"
                        showDot={true}
                        className="font-bold uppercase tracking-wider"
                      >
                        {report.status}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-[#182B36]">
                        {report.jobCompanyName}
                      </h4>
                      <p className="text-xs text-[#475569] leading-relaxed mt-1 line-clamp-2">
                        {report.description}
                      </p>
                    </div>

                    {/* Metadata & Evidence snippet */}
                    <div className="pt-2 border-t border-[#F1F5F8] flex flex-wrap items-center justify-between gap-3 text-xs text-[#64748B]">
                      <div className="flex items-center gap-4 flex-wrap">
                        {report.paymentNumber && (
                          <span className="flex items-center gap-1 font-mono text-[#DC4B4B] font-semibold">
                            <CreditCard size={13} />
                            <span>{report.paymentNumber}</span>
                          </span>
                        )}
                        {report.phone && (
                          <span className="flex items-center gap-1 font-mono text-[#182B36]">
                            <Phone size={13} />
                            <span>{report.phone}</span>
                          </span>
                        )}
                        {report.evidenceFile && (
                          <span className="flex items-center gap-1 text-[#087F70] font-medium">
                            <FileCheck size={13} />
                            <span>Evidence Attached ({report.evidenceFile.name})</span>
                          </span>
                        )}
                      </div>

                      <Button
                        variant="subtle"
                        size="sm"
                        onClick={() => setSelectedHistoryReport(report)}
                        className="text-xs h-7.5 px-3 text-[#087F70]"
                      >
                        Inspect Details &rarr;
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {filteredReports.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-[#E2E8F0]">
                <Clock size={32} className="mx-auto text-slate-300 mb-2" />
                <h4 className="text-sm font-bold text-[#182B36]">No reports in this filter</h4>
                <p className="text-xs text-[#64748B] mt-1">
                  You have no {historyStatusFilter !== 'all' ? historyStatusFilter.toLowerCase() : ''} reports at this time.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. CONFIRMATION MODAL BEFORE SUBMISSION                                    */}
      {/* ========================================================================= */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Scam Report Submission"
        description="Please review your report details before lodging this case with the whistleblower intelligence desk."
        footer={
          <div className="flex items-center justify-end gap-2.5 w-full">
            <Button
              variant="outline"
              size="md"
              onClick={() => setShowConfirmModal(false)}
            >
              Go Back & Edit
            </Button>
            <Button
              variant="danger"
              size="md"
              leftIcon={Send}
              onClick={handleFinalSubmit}
              isLoading={isSubmitting}
              className="font-bold"
            >
              Confirm & Submit Report
            </Button>
          </div>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
              <span className="text-[#64748B]">Category</span>
              <Badge variant="suspicious" size="sm">
                {formData.category}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#64748B]">Target Company/Job:</span>
              <strong className="text-[#182B36]">{formData.jobCompanyName}</strong>
            </div>

            {formData.website && (
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Website / URL:</span>
                <span className="font-mono text-[#087F70] truncate max-w-[200px]">
                  {formData.website}
                </span>
              </div>
            )}

            {formData.paymentNumber && (
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Payment Wallet:</span>
                <span className="font-mono text-[#DC4B4B] font-bold">
                  {formData.paymentNumber}
                </span>
              </div>
            )}

            {formData.phone && (
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Phone Number:</span>
                <span className="font-mono text-[#182B36]">{formData.phone}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="text-[#64748B]">Evidence Attached:</span>
              <span className="font-semibold text-[#182B36]">
                {evidenceFile ? evidenceFile.name : 'None'}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="font-bold text-[#182B36]">Description Preview:</span>
            <p className="p-3 rounded-lg bg-white border border-[#E2E8F0] text-slate-700 leading-relaxed max-h-24 overflow-y-auto">
              {formData.description}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[11px] text-[#DC4B4B] flex items-start gap-2">
            <AlertOctagon size={16} className="shrink-0 mt-0.5" />
            <span>
              By submitting, you certify that you encountered deceptive recruitment activities or fee solicitations. Malicious false reports violate platform terms.
            </span>
          </div>
        </div>
      </Modal>

      {/* ========================================================================= */}
      {/* 4. INSPECT REPORT DETAILS MODAL (From History)                            */}
      {/* ========================================================================= */}
      {selectedHistoryReport && (
        <Modal
          isOpen={!!selectedHistoryReport}
          onClose={() => setSelectedHistoryReport(null)}
          title={`Report Details • ${selectedHistoryReport.id}`}
          description={`Logged on ${formatDate(selectedHistoryReport.submittedDate)}`}
          footer={
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedHistoryReport(null)}
            >
              Close
            </Button>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <div>
                <span className="text-[#94A3B8] block text-[11px]">Category</span>
                <span className="font-bold text-[#182B36]">{selectedHistoryReport.category}</span>
              </div>
              <Badge
                variant={
                  selectedHistoryReport.status === 'Reviewed'
                    ? 'verified'
                    : selectedHistoryReport.status === 'Pending'
                    ? 'unverified'
                    : 'suspicious'
                }
                size="md"
              >
                {selectedHistoryReport.status}
              </Badge>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-[#64748B]">Company / Notice:</span>
              <p className="font-semibold text-sm text-[#182B36]">{selectedHistoryReport.jobCompanyName}</p>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-[#64748B]">Detailed Narrative:</span>
              <p className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-slate-700 leading-relaxed whitespace-pre-line">
                {selectedHistoryReport.description}
              </p>
            </div>

            {selectedHistoryReport.reviewerNotes && (
              <div className="p-3.5 rounded-xl bg-[#F0FDF9] border border-[#99F6E4] space-y-1">
                <span className="font-bold text-[#087F70] flex items-center gap-1.5">
                  <ShieldCheck size={15} />
                  Analyst Review Note:
                </span>
                <p className="text-slate-700 leading-relaxed">
                  {selectedHistoryReport.reviewerNotes}
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ReportScam;
