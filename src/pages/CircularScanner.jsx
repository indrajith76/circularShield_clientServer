import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  FileText,
  Type,
  Link2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  SearchCode,
  Loader2,
  Trash2,
  Edit2,
  Check,
  ArrowRight,
} from 'lucide-react';

import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { analyzeCircular } from '../utils/fraudDetector';

export const CircularScanner = ({ onSaveScanned }) => {
  const navigate = useNavigate();

  // 3 Methods: 'file' | 'text' | 'url'
  const [activeMethod, setActiveMethod] = useState('file');

  // File Upload State
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Text Input State
  const [textContent, setTextContent] = useState('');

  // URL Input State
  const [urlInput, setUrlInput] = useState('');
  const [urlError, setUrlError] = useState('');

  // Extracted text preview (editable)
  const [extractedText, setExtractedText] = useState('');
  const [isEditingExtracted, setIsEditingExtracted] = useState(false);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [formError, setFormError] = useState('');

  // 5 Simple Processing Steps
  const PROCESSING_STEPS = [
    { title: 'Reading Circular Content', desc: 'Extracting text and job details.' },
    { title: 'Checking Organization Records', desc: 'Validating employer credentials and registration.' },
    { title: 'Scanning Contact Details', desc: 'Verifying emails, websites, and phone numbers.' },
    { title: 'Detecting Payment Demands', desc: 'Checking for bKash, Nagad, or upfront interview fees.' },
    { title: 'Finalizing Safety Rating', desc: 'Preparing clear safety score and recommendations.' },
  ];

  // Handle URL change with live validation
  const handleUrlChange = (val) => {
    setUrlInput(val);
    if (!val.trim()) {
      setUrlError('');
      return;
    }
    if (!/^https?:\/\//i.test(val)) {
      setUrlError('URL must begin with http:// or https://');
    } else if (!/^https?:\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/i.test(val)) {
      setUrlError('Please enter a valid domain (e.g. https://company.com/career).');
    } else {
      setUrlError('');
    }
  };
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  // Mock extracted text for uploaded files
  const getMockTextForFile = (filename) => {
    const isImage = /\.(jpg|jpeg|png)$/i.test(filename);
    if (isImage) {
      return `RECRUITMENT ADVERTISEMENT
Position: Office Assistant & Part-time Typist
Company: Alpha Logistics & E-Commerce BD
Salary: BDT 25,000 / month (Immediate joining)
Requirements: Basic computer typing knowledge.
Instructions: Send CV to alpha.recruitment.bd@gmail.com.
Payment Notice: Selected candidates must send BDT 650 via bKash personal wallet 01799-887766 for admit card issuance.`;
    }
    return `OFFICIAL EMPLOYMENT NOTIFICATION
Position: Junior Software Engineer
Organization: BrainStation 23 PLC
Location: Dhaka, Bangladesh
Apply via official career portal: https://brainstation-23.com/careers
Official Email: career@brainstation-23.com
Notice: BrainStation 23 never demands any money or registration fees from job seekers.`;
  };

  // Handle File Selection
  const handleFileChange = (file) => {
    if (!file) return;

    const validExtensions = /\.(pdf|jpg|jpeg|png)$/i;
    if (!validExtensions.test(file.name)) {
      setFormError('Please upload a PDF document or image file (JPG, PNG).');
      return;
    }

    setFormError('');
    setSelectedFile(file);

    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setFilePreviewUrl(url);
    } else {
      setFilePreviewUrl(null);
    }

    const mockExtracted = getMockTextForFile(file.name);
    setExtractedText(mockExtracted);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreviewUrl(null);
    setExtractedText('');
    setIsEditingExtracted(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Sample Loaders for Quick Testing
  const handleLoadSample = (type) => {
    setFormError('');
    setUrlError('');
    setAnalysisResult(null);

    if (type === 'scam') {
      setActiveMethod('text');
      const sample = `URGENT RECRUITMENT NOTICE - BANGLADESH RAILWAY PROJECT WING
Position: Assistant Project Officer (180 Vacancies)
Salary: BDT 35,000 / month + Govt Allowance.

Application Guidelines:
Send an examination admit card verification fee of BDT 850 via bKash Personal Number: 01712-334455.
Send payment screenshot to railway.recruitment.bd@gmail.com. Applications without fee will be cancelled within 48 hours.`;
      setTextContent(sample);
      setExtractedText(sample);
    } else {
      setActiveMethod('text');
      const sample = `BRAINSTATION 23 PLC - OFFICIAL RECRUITMENT
Position: Software Engineer (React / Node.js)
Location: Dhaka (Hybrid)
Salary: Market competitive + benefits.
Apply online at https://brainstation-23.com/careers
Official Contact: career@brainstation-23.com
* BrainStation 23 never asks for any money, deposits, or admit card fees at any point of recruitment.`;
      setTextContent(sample);
      setExtractedText(sample);
    }
  };

  // Start Analysis
  const handleStartAnalysis = (e) => {
    if (e) e.preventDefault();
    setFormError('');
    setAnalysisResult(null);

    let textToAnalyze = '';

    if (activeMethod === 'file') {
      if (!selectedFile) {
        setFormError('Please choose or drag a circular file first.');
        return;
      }
      textToAnalyze = extractedText || getMockTextForFile(selectedFile.name);
    } else if (activeMethod === 'text') {
      if (!textContent.trim() || textContent.trim().length < 15) {
        setFormError('Please enter at least 15 characters of circular information.');
        return;
      }
      textToAnalyze = textContent;
    } else if (activeMethod === 'url') {
      if (!urlInput.trim()) {
        setUrlError('Please enter a website link.');
        return;
      }
      try {
        new URL(urlInput);
      } catch {
        setUrlError('Please enter a valid website address (e.g., https://example.com/job).');
        return;
      }
      textToAnalyze = `Website link: ${urlInput}. Circular scanned from public web page.`;
    }

    // Step progression animation
    setIsProcessing(true);
    setCurrentStep(1);

    const stepDelay = 350;
    setTimeout(() => setCurrentStep(2), stepDelay);
    setTimeout(() => setCurrentStep(3), stepDelay * 2);
    setTimeout(() => setCurrentStep(4), stepDelay * 3);
    setTimeout(() => setCurrentStep(5), stepDelay * 4);

    setTimeout(() => {
      const result = analyzeCircular({
        title: selectedFile ? selectedFile.name : activeMethod === 'url' ? 'Web Circular' : 'Job Notice',
        company: textToAnalyze.includes('BrainStation')
          ? 'BrainStation 23 PLC'
          : textToAnalyze.includes('Railway')
          ? 'Bangladesh Railway Project'
          : 'Hiring Organization',
        content: textToAnalyze,
        email: textToAnalyze.includes('@')
          ? textToAnalyze.match(/[\w.-]+@[\w.-]+\.\w+/)?.[0] || ''
          : '',
        website: activeMethod === 'url' ? urlInput : '',
      });

      let saved = null;
      if (onSaveScanned) {
        saved = onSaveScanned({
          title: selectedFile
            ? selectedFile.name.replace(/\.[^/.]+$/, '')
            : activeMethod === 'url'
            ? 'Web Job Circular'
            : result.title || 'Checked Job Notice',
          company: textToAnalyze.includes('BrainStation')
            ? 'BrainStation 23 PLC'
            : textToAnalyze.includes('Railway')
            ? 'Bangladesh Railway Project'
            : result.company || 'Hiring Entity',
          content: textToAnalyze,
          riskScore: result.score || result.riskScore || 25,
          status: result.status,
          redFlags: result.redFlags,
          trustFactors: result.trustFactors,
          website: activeMethod === 'url' ? urlInput : '',
        });
      }

      setAnalysisResult({
        ...result,
        id: saved?.id || `CIR-2026-${Math.floor(100 + Math.random() * 900)}`,
        title: saved?.title || result.title,
        company: saved?.company || result.company,
      });
      setIsProcessing(false);
      setCurrentStep(0);
    }, stepDelay * 5);
  };

  // Reset form
  const handleReset = () => {
    setSelectedFile(null);
    setFilePreviewUrl(null);
    setTextContent('');
    setUrlInput('');
    setUrlError('');
    setExtractedText('');
    setIsEditingExtracted(false);
    setAnalysisResult(null);
    setFormError('');
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* 1. Page Heading & Subtitle */}
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Check Job Circular' },
        ]}
        title="Check a Job Circular"
        subtitle="Upload a job circular or paste its information to check for possible scams."
        actions={
          <Button
            variant="ghost"
            size="sm"
            leftIcon={RotateCcw}
            onClick={handleReset}
            className="text-xs text-[#64748B]"
          >
            Reset Form
          </Button>
        }
      />

      {/* 2. Method Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => {
            setActiveMethod('file');
            setFormError('');
          }}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
            activeMethod === 'file'
              ? 'bg-white border-[#087F70] shadow-sm ring-2 ring-[#087F70]/20'
              : 'bg-white/60 border-[#E2E8F0] hover:bg-white text-[#64748B]'
          }`}
        >
          <div
            className={`p-2.5 rounded-lg shrink-0 ${
              activeMethod === 'file'
                ? 'bg-[#087F70] text-white'
                : 'bg-[#F1F5F8] text-[#64748B]'
            }`}
          >
            <Upload size={20} />
          </div>
          <div>
            <p className="font-bold text-sm text-[#102C3A]">1. Upload File</p>
            <p className="text-xs text-[#64748B]">PDF, JPG, or PNG</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveMethod('text');
            setFormError('');
          }}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
            activeMethod === 'text'
              ? 'bg-white border-[#087F70] shadow-sm ring-2 ring-[#087F70]/20'
              : 'bg-white/60 border-[#E2E8F0] hover:bg-white text-[#64748B]'
          }`}
        >
          <div
            className={`p-2.5 rounded-lg shrink-0 ${
              activeMethod === 'text'
                ? 'bg-[#087F70] text-white'
                : 'bg-[#F1F5F8] text-[#64748B]'
            }`}
          >
            <Type size={20} />
          </div>
          <div>
            <p className="font-bold text-sm text-[#102C3A]">2. Paste Text</p>
            <p className="text-xs text-[#64748B]">Copy & paste circular text</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveMethod('url');
            setFormError('');
          }}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
            activeMethod === 'url'
              ? 'bg-white border-[#087F70] shadow-sm ring-2 ring-[#087F70]/20'
              : 'bg-white/60 border-[#E2E8F0] hover:bg-white text-[#64748B]'
          }`}
        >
          <div
            className={`p-2.5 rounded-lg shrink-0 ${
              activeMethod === 'url'
                ? 'bg-[#087F70] text-white'
                : 'bg-[#F1F5F8] text-[#64748B]'
            }`}
          >
            <Link2 size={20} />
          </div>
          <div>
            <p className="font-bold text-sm text-[#102C3A]">3. Enter Website URL</p>
            <p className="text-xs text-[#64748B]">Job portal or link</p>
          </div>
        </button>
      </div>

      {/* 3. Main Input Card */}
      <Card className="bg-white border-[#E2E8F0] shadow-sm p-6 space-y-5">
        {/* Helper quick sample tags */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#F1F5F8] text-xs">
          <span className="text-[#64748B]">Need a sample to test?</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleLoadSample('safe')}
              className="px-2.5 py-1 rounded-lg bg-[#ECFDF5] text-[#16A36A] font-semibold hover:bg-[#D1FAE5] cursor-pointer"
            >
              Load Genuine Sample
            </button>
            <button
              type="button"
              onClick={() => handleLoadSample('scam')}
              className="px-2.5 py-1 rounded-lg bg-[#FEF2F2] text-[#DC4B4B] font-semibold hover:bg-[#FEE2E2] cursor-pointer"
            >
              Load Fake Scam Sample
            </button>
          </div>
        </div>

        {/* METHOD 1: FILE UPLOAD */}
        {activeMethod === 'file' && (
          <div className="space-y-4">
            {!selectedFile ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-[#087F70] bg-[#087F70]/5'
                    : 'border-[#CBD5E1] hover:border-[#087F70] hover:bg-[#F8FAFC]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,image/png,image/jpeg,image/jpg"
                  onChange={(e) => handleFileChange(e.target.files?.[0])}
                  className="hidden"
                />
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#087F70]/10 text-[#087F70] flex items-center justify-center mb-3">
                  <Upload size={28} />
                </div>
                <h4 className="text-base font-bold text-[#102C3A]">
                  Choose a circular file or drag it here
                </h4>
                <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
                  Supports official PDF circulars or scanned newspaper photos (JPG, PNG). Max size: 10MB.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#102C3A] text-white text-xs font-semibold">
                  Browse Device Files
                </div>
              </div>
            ) : (
              /* File Selected Preview */
              <div className="p-4 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {filePreviewUrl ? (
                      <img
                        src={filePreviewUrl}
                        alt="Preview"
                        className="w-12 h-12 rounded-lg object-cover border border-[#E2E8F0]"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-[#087F70]/10 text-[#087F70] flex items-center justify-center">
                        <FileText size={24} />
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-sm text-[#102C3A] line-clamp-1">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-[#64748B]">
                        {formatFileSize(selectedFile.size)} • Ready for analysis
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-2 text-[#DC4B4B] hover:bg-[#FEF2F2] rounded-lg transition-colors cursor-pointer"
                    title="Remove File"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* METHOD 2: TEXT INPUT */}
        {activeMethod === 'text' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#102C3A]">
                Paste Circular Text or SMS Notice
              </label>
              <span className={`text-[11px] ${textContent.length >= 15 ? 'text-[#16A36A] font-medium' : 'text-[#94A3B8]'}`}>
                {textContent.length} characters (min 15 required)
              </span>
            </div>
            <textarea
              rows={6}
              value={textContent}
              onChange={(e) => {
                setTextContent(e.target.value);
                setExtractedText(e.target.value);
                if (formError) setFormError('');
              }}
              placeholder="Paste the full job circular text, SMS message, Facebook post, or WhatsApp recruitment notice here..."
              className="w-full text-xs sm:text-sm p-4 rounded-xl border border-[#CBD5E1] focus:border-[#087F70] focus:ring-2 focus:ring-[#087F70]/20 outline-none transition-all placeholder-[#94A3B8]"
            />
          </div>
        )}

        {/* METHOD 3: URL INPUT */}
        {activeMethod === 'url' && (
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#102C3A]">
              Enter Job Circular Web Address
            </label>
            <input
              type="url"
              value={urlInput}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://company.com/career/job-details"
              className={`w-full text-xs sm:text-sm px-4 py-3 rounded-xl border ${
                urlError ? 'border-[#DC4B4B] focus:ring-[#DC4B4B]/20' : 'border-[#CBD5E1] focus:border-[#087F70] focus:ring-[#087F70]/20'
              } outline-none focus:ring-2 transition-all placeholder-[#94A3B8]`}
            />
            {urlError && (
              <p className="text-xs text-[#DC4B4B] font-medium">{urlError}</p>
            )}
          </div>
        )}

        {/* Extracted Text Preview Card (with Edit toggle) */}
        {extractedText && (
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-[#102C3A] flex items-center gap-1.5">
                <FileText size={14} className="text-[#087F70]" />
                Extracted Information Preview
              </span>
              <button
                type="button"
                onClick={() => setIsEditingExtracted(!isEditingExtracted)}
                className="text-xs font-semibold text-[#087F70] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {isEditingExtracted ? <Check size={14} /> : <Edit2 size={13} />}
                <span>{isEditingExtracted ? 'Done Editing' : 'Edit Text'}</span>
              </button>
            </div>

            {isEditingExtracted ? (
              <textarea
                rows={4}
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                className="w-full text-xs p-3 rounded-lg border border-[#CBD5E1] bg-white outline-none focus:border-[#087F70]"
              />
            ) : (
              <p className="text-xs text-[#64748B] line-clamp-3 leading-relaxed whitespace-pre-line">
                {extractedText}
              </p>
            )}
          </div>
        )}

        {/* Error Feedback */}
        {formError && (
          <div className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-center gap-2 text-xs font-semibold text-[#DC4B4B]">
            <AlertTriangle size={16} className="shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Big Action Button */}
        <div className="pt-2">
          <Button
            variant="secondary"
            size="lg"
            leftIcon={isProcessing ? Loader2 : SearchCode}
            disabled={isProcessing}
            onClick={handleStartAnalysis}
            className={`w-full font-bold shadow-sm text-sm sm:text-base py-3.5 ${
              isProcessing ? 'cursor-not-allowed opacity-90' : ''
            }`}
          >
            {isProcessing ? 'Checking Circular...' : 'Check Circular for Scams'}
          </Button>
        </div>
      </Card>

      {/* 4. Processing Progress Display */}
      {isProcessing && (
        <Card className="bg-white border-[#A7F3D0] shadow-sm p-6 space-y-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <Loader2 size={22} className="text-[#087F70] animate-spin shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-[#102C3A]">
                Checking Job Circular for Scams...
              </h4>
              <p className="text-xs text-[#64748B]">
                Checking payment requests, employer info, and contact details.
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            {PROCESSING_STEPS.map((step, idx) => {
              const stepNumber = idx + 1;
              const isCompleted = currentStep > stepNumber;
              const isCurrent = currentStep === stepNumber;

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-2.5 rounded-xl text-xs transition-all ${
                    isCurrent
                      ? 'bg-[#ECFDF5] text-[#065C51] font-semibold'
                      : isCompleted
                      ? 'text-[#16A36A]'
                      : 'text-[#94A3B8]'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 size={16} className="text-[#16A36A]" />
                    ) : isCurrent ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#087F70] animate-pulse" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-[#CBD5E1]" />
                    )}
                  </div>
                  <div className="flex-1 flex justify-between items-center">
                    <span>{step.title}</span>
                    <span className="text-[11px] opacity-75">{step.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* 5. Quick Result Card upon Completion */}
      {analysisResult && !isProcessing && (
        <Card className="bg-white border-[#E2E8F0] shadow-sm p-6 space-y-4 animate-in slide-in-from-bottom-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="space-y-1">
              <span className="text-xs text-[#64748B] font-medium">Safety Check Complete</span>
              <h3 className="text-lg font-bold text-[#102C3A]">
                {analysisResult.title || 'Evaluated Job Notice'}
              </h3>
              <p className="text-xs text-[#64748B]">
                Organization: <strong>{analysisResult.company || 'Hiring Entity'}</strong>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Badge
                variant={
                  analysisResult.status === 'verified'
                    ? 'verified'
                    : analysisResult.status === 'suspicious'
                    ? 'suspicious'
                    : 'unverified'
                }
                size="md"
                showDot
              >
                {analysisResult.status === 'verified'
                  ? 'VERIFIED'
                  : analysisResult.status === 'suspicious'
                  ? 'SUSPICIOUS'
                  : 'UNVERIFIED'}
              </Badge>
              <div className="text-right">
                <span className="text-xs text-[#64748B] block">Risk Score</span>
                <span className="font-extrabold text-sm text-[#102C3A]">
                  {analysisResult.riskScore || 15}/100
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={handleReset}
              className="w-full sm:w-auto justify-center"
            >
              Check Another Circular
            </Button>
            <Button
              variant="secondary"
              size="md"
              rightIcon={ArrowRight}
              onClick={() => navigate(`/analysis-result/${analysisResult.id || 'CIR-2026-082'}`)}
              className="w-full sm:w-auto justify-center"
            >
              View Full Safety Report
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CircularScanner;
