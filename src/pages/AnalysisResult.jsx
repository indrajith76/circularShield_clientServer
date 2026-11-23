import { useState, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useMockData } from '../context/useMockData';
import {
  ShieldCheck,
  Download,
  SearchCode,
  LayoutDashboard,
  Globe,
  CreditCard,
  Mail,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
} from 'lucide-react';

import PageHeader from '../components/ui/PageHeader';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export const AnalysisResult = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Active scenario switch for review: 'govt-scam' | 'verified-corp' | 'telegram-trap'
  const [selectedScenario, setSelectedScenario] = useState(() => {
    if (id === 'CIR-2026-081') return 'verified-corp';
    if (id === 'CIR-2026-083') return 'telegram-trap';
    return 'govt-scam';
  });

  // Expandable sections toggle states
  const [expandedSections, setExpandedSections] = useState({
    indicators: false,
    urlCheck: false,
    contacts: false,
    bilingual: false,
  });

  const toggleSection = (key) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const [bilingualLang, setBilingualLang] = useState('bn');
  const [isPrinting, setIsPrinting] = useState(false);

  // Scenario data
  const SCENARIOS = {
    'govt-scam': {
      id: 'CIR-2026-082',
      title: 'Assistant Project Officer (Rural Health & Family Welfare Wing)',
      organization: 'Directorate General of Health Services (Impersonated)',
      claimedOrg: 'Directorate General of Health Services (DGHS)',
      legitOrgUrl: 'https://dghs.gov.bd',
      submittedUrl: 'http://gov-healthproject-bd.net',
      date: '2026-11-23T08:30:00Z',
      score: 92,
      status: 'suspicious', // 'verified' | 'suspicious' | 'unverified'
      riskLevel: 'High Risk – Confirmed Recruitment Scam',
      badgeColor: '#DC4B4B',
      shortExplanation:
        'This circular is a fake government job scam. It demands an admit card fee via personal bKash/Nagad and uses an unofficial website to trick job seekers.',
      orgCheck: {
        status: 'Impersonating Official Directorate',
        isLegit: false,
        note: 'Official DGHS notices are published ONLY on dghs.gov.bd. They never charge fees via personal mobile numbers.',
      },
      suspiciousHighlights: [
        'Demands BDT 450 admit card fee via personal bKash (01799-887766).',
        'Uses fake commercial domain (gov-healthproject-bd.net) instead of .gov.bd.',
        'Contact email is a free Gmail address, not an official government email.',
        'Creates artificial urgency with a 48-hour payment deadline.',
      ],
      safetyActions: [
        'Do NOT send any money via bKash, Nagad, or bank transfer.',
        'Do NOT provide copies of your NID, passport, or certificates.',
        'Verify legitimate vacancies directly on the official portal: dghs.gov.bd.',
        'Report this scam number to CID Cyber Police Helpline: 01730336107.',
      ],
      indicators: [
        {
          title: 'Payment Fee Extortion',
          severity: 'Critical Threat',
          desc: 'Demands BDT 450 via personal bKash wallet 01799-887766.',
        },
        {
          title: 'Unofficial Phishing Website',
          severity: 'High Threat',
          desc: 'Registered 14 days ago on an anonymous server mimicking government portals.',
        },
        {
          title: 'Unofficial Email Address',
          severity: 'Warning',
          desc: 'Recruiter uses free Gmail (govt.recruitment.bd@gmail.com).',
        },
      ],
      explanationEn:
        'This circular represents an advance-fee fraud scheme. Criminal syndicates fabricate government-styled circulars to collect small processing fees from hundreds of job applicants. Genuine public bodies never use personal bKash numbers.',
      explanationBn:
        'এই নিয়োগ বিজ্ঞপ্তিটি সম্পূর্ণ ভুয়া ও প্রতারণামূলক। প্রতারক চক্র স্বাস্থ্য অধিদপ্তরের নাম ব্যবহার করে আবেদনকারীদের কাছ থেকে বিকাশ/নগদে ৪৫০ টাকা হাতিয়ে নেওয়ার চেষ্টা করছে। কোনো সরকারি প্রতিষ্ঠান ব্যক্তিগত মোবাইল ব্যাংকিংয়ে ফি গ্রহণ করে না।',
    },

    'verified-corp': {
      id: 'CIR-2026-081',
      title: 'Senior Software Engineer (React & Node.js)',
      organization: 'BrainStation 23 PLC',
      claimedOrg: 'BrainStation 23 PLC (BASIS & DCCI Member)',
      legitOrgUrl: 'https://brainstation-23.com',
      submittedUrl: 'https://brainstation-23.com/careers/se-081',
      date: '2026-11-20T10:30:00Z',
      score: 8,
      status: 'verified',
      riskLevel: 'Low Risk – Verified Legitimate Opportunity',
      badgeColor: '#16A36A',
      shortExplanation:
        'This job circular is published by an authenticated, registered corporation. No fees are demanded, and applications are handled through their verified career portal.',
      orgCheck: {
        status: 'Enterprise Tier-1 Verified',
        isLegit: true,
        note: 'BrainStation 23 PLC is an accredited member of BASIS and RJSC with valid headquarters in Dhaka.',
      },
      suspiciousHighlights: [
        'Zero application fees or security deposits demanded.',
        'Official career portal with valid SSL certificate (brainstation-23.com).',
        'Official enterprise domain email used for HR communications.',
        'Standard merit-based interview process.',
      ],
      safetyActions: [
        'Apply directly through the official career portal: brainstation-23.com/careers.',
        'Prepare your technical portfolio and resume according to requirements.',
        'Never pay money to any middleman or third-party agent claiming to represent the company.',
      ],
      indicators: [
        {
          title: 'Payment Policy Check',
          severity: 'Passed (Safe)',
          desc: 'Explicit zero-fee recruitment policy across all stages.',
        },
        {
          title: 'Official Domain Check',
          severity: 'Passed (Safe)',
          desc: 'Active 12+ years corporate domain with valid encryption.',
        },
        {
          title: 'Corporate Standing',
          severity: 'Passed (Safe)',
          desc: 'Accredited with BASIS and national corporate registry.',
        },
      ],
      explanationEn:
        'This circular meets all legitimate recruitment standards. Communications originate from verified company infrastructure and follow ethical employment practices.',
      explanationBn:
        'এই নিয়োগ বিজ্ঞপ্তিটি সম্পূর্ণ সঠিক এবং প্রতিষ্ঠানটি আনুষ্ঠানিকভাবে যাচাইকৃত। বিজ্ঞপ্তিটিতে কোনো প্রকার টাকা দাবি করা হয়নি এবং আবেদন প্রক্রিয়া তাদের নিজস্ব অফিশিয়াল ওয়েবসাইটের মাধ্যমে সম্পন্ন হচ্ছে।',
    },

    'telegram-trap': {
      id: 'CIR-2026-083',
      title: 'Work-From-Home Typing & Review Operator',
      organization: 'Global Task Media BD (Unregistered)',
      claimedOrg: 'Online Freelance Task Portal',
      legitOrgUrl: 'None (Unregistered)',
      submittedUrl: 'https://t.me/bangladesh_daily_parttime_jobs',
      date: '2026-11-22T14:10:00Z',
      score: 58,
      status: 'unverified',
      riskLevel: 'Moderate Risk – Unverified Entity',
      badgeColor: '#D99A28',
      shortExplanation:
        'This circular originates from an unregistered entity operating solely via Telegram. Proceed with caution and do not pay any software activation fees.',
      orgCheck: {
        status: 'Unverified Entity / No Physical Office',
        isLegit: false,
        note: 'Publisher has no registered trade license or official website. Operates exclusively via anonymous chat groups.',
      },
      suspiciousHighlights: [
        'Operates solely through anonymous Telegram chat channels.',
        'Promises unrealistically high daily pay (BDT 3,000–5,000 for simple typing).',
        'Mentions a refundable software deposit before assigning task sets.',
      ],
      safetyActions: [
        'Do NOT deposit any "training fee", "software activation token", or "security deposit".',
        'Do not share personal bank details or one-time passwords (OTP).',
        'Ask for official business registration documents before doing any work.',
      ],
      indicators: [
        {
          title: 'Unrealistic Income Promise',
          severity: 'High Risk',
          desc: 'Exaggerated payouts for basic tasks are typical of task deposit traps.',
        },
        {
          title: 'Anonymous Channel',
          severity: 'Warning',
          desc: 'Telegram channels can be deleted instantly without accountability.',
        },
      ],
      explanationEn:
        'This opportunity bears hallmarks of click-farm or deposit-trap schemes. Candidates are often enticed by high daily wages and then asked for an activation deposit.',
      explanationBn:
        'বিজ্ঞপ্তিটি টেলিগ্রামভিত্তিক অননুমোদিত স্কিম। কাজ শুরুর আগে কোনো সফটওয়্যার চার্জ বা ডিপোজিট দেওয়া যাবে না। এ ধরনের চ্যানেলে আর্থিক লেনদেন করা ঝুঁকিপূর্ণ।',
    },
  };

  const { circulars } = useMockData();
  const matchedCircular = useMemo(() => {
    if (!id) return null;
    return circulars?.find((c) => c.id === id) || null;
  }, [id, circulars]);

  const dynamicScenario = useMemo(() => {
    if (!matchedCircular) return null;
    const isVerified = matchedCircular.status === 'verified';
    const isSuspicious = matchedCircular.status === 'suspicious';
    return {
      id: matchedCircular.id,
      title: matchedCircular.title,
      organization: matchedCircular.company,
      claimedOrg: matchedCircular.company,
      legitOrgUrl: matchedCircular.url || (isVerified ? 'https://official.org.bd' : 'None'),
      submittedUrl: matchedCircular.url || 'Uploaded Circular Document',
      date: matchedCircular.postedDate || new Date().toISOString(),
      score: matchedCircular.riskScore || (isVerified ? 8 : isSuspicious ? 92 : 55),
      status: matchedCircular.status,
      riskLevel: isVerified
        ? 'Low Risk – Verified Legitimate Opportunity'
        : isSuspicious
        ? 'High Risk – Confirmed Recruitment Scam'
        : 'Moderate Risk – Unverified Entity',
      badgeColor: isVerified ? '#16A36A' : isSuspicious ? '#DC4B4B' : '#D99A28',
      shortExplanation: isVerified
        ? 'This job circular is published by an authenticated, registered corporation. No fees are demanded, and applications are handled through verified portals.'
        : isSuspicious
        ? 'Warning signs detected: potential fee demands, unverified contact info, or spoofed organizational details.'
        : 'This circular comes from an unverified source. Proceed with caution and never pay upfront fees.',
      orgCheck: {
        status: isVerified ? 'Enterprise Tier-1 Verified' : 'Unverified / Warning',
        isLegit: isVerified,
        note: isVerified
          ? 'Organization matched against certified corporate registries.'
          : 'Organization credentials unverified or absent in official registers.',
      },
      suspiciousHighlights:
        matchedCircular.redFlags?.length > 0
          ? matchedCircular.redFlags
          : [
              'Always verify with official employer career portals before submitting personal documents.',
              'Never send advance fees for job applications or interviews.',
            ],
      safetyActions:
        matchedCircular.recommendations?.length > 0
          ? matchedCircular.recommendations
          : [
              'Do NOT send money via bKash or Nagad for admit cards or interviews.',
              'Verify legitimate vacancies on the official company portal.',
            ],
      indicators: (matchedCircular.redFlags || []).map((flag) => ({
        title: 'Detected Warning Indicator',
        severity: 'Warning Flag',
        desc: flag,
      })),
      explanationEn:
        matchedCircular.description ||
        'Evaluated job circular report generated by CircularShield.',
      explanationBn:
        'সার্কুলারশিল্ড নিরাপত্তা অডিট রিপোর্ট। কোনো প্রতিষ্ঠানে আবেদন করার আগে অফিশিয়াল ওয়েবসাইট যাচাই করুন।',
    };
  }, [matchedCircular]);

  const current = (selectedScenario === 'custom' && dynamicScenario) || (!['govt-scam', 'verified-corp', 'telegram-trap'].includes(selectedScenario) && dynamicScenario) || SCENARIOS[selectedScenario] || dynamicScenario || SCENARIOS['govt-scam'];

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 150);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* 1. Standardized Header with Breadcrumbs & Action Buttons */}
      <PageHeader
        className="print:hidden"
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'My Activity', to: '/my-activity' },
          { label: `Result #${current.id}` },
        ]}
        title="Safety Check Result"
        subtitle={`Evaluation report for "${current.title}" issued by ${current.organization}.`}
        actions={
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              leftIcon={Download}
              onClick={handlePrint}
              isLoading={isPrinting}
              className="w-full sm:w-auto justify-center"
            >
              Download Report
            </Button>

            <Button
              variant="secondary"
              size="sm"
              leftIcon={SearchCode}
              onClick={() => navigate('/analyze')}
              className="w-full sm:w-auto justify-center"
            >
              Check Another Circular
            </Button>

            <Button
              variant="ghost"
              size="sm"
              leftIcon={LayoutDashboard}
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto justify-center"
            >
              Back to Dashboard
            </Button>
          </div>
        }
      />

      {/* Interactive Scenario Switcher (Helpful for testing all 3 statuses) */}
      <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 print:hidden text-xs">
        <span className="font-semibold text-[#102C3A] flex items-center gap-1.5">
          <Sparkles size={14} className="text-[#087F70]" />
          Review all 3 statuses:
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setSelectedScenario('govt-scam')}
            className={`px-3 py-1 rounded-lg font-bold cursor-pointer transition-all ${
              selectedScenario === 'govt-scam'
                ? 'bg-[#DC4B4B] text-white'
                : 'bg-white text-[#DC4B4B] border border-[#FECACA]'
            }`}
          >
            SUSPICIOUS (Red)
          </button>
          <button
            type="button"
            onClick={() => setSelectedScenario('verified-corp')}
            className={`px-3 py-1 rounded-lg font-bold cursor-pointer transition-all ${
              selectedScenario === 'verified-corp'
                ? 'bg-[#16A36A] text-white'
                : 'bg-white text-[#16A36A] border border-[#BBF7D0]'
            }`}
          >
            VERIFIED (Green)
          </button>
          <button
            type="button"
            onClick={() => setSelectedScenario('telegram-trap')}
            className={`px-3 py-1 rounded-lg font-bold cursor-pointer transition-all ${
              selectedScenario === 'telegram-trap'
                ? 'bg-[#D99A28] text-white'
                : 'bg-white text-[#D99A28] border border-[#FDE68A]'
            }`}
          >
            UNVERIFIED (Amber)
          </button>
        </div>
      </div>

      {/* 2. THE MOST IMPORTANT RESULT FIRST (Hero Card) */}
      <Card
        className={`border-2 shadow-sm overflow-hidden ${
          current.status === 'suspicious'
            ? 'border-[#DC4B4B]/30 bg-gradient-to-b from-[#FEF2F2] to-white'
            : current.status === 'verified'
            ? 'border-[#16A36A]/30 bg-gradient-to-b from-[#F0FDF4] to-white'
            : 'border-[#D99A28]/30 bg-gradient-to-b from-[#FFFBEB] to-white'
        }`}
      >
        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Main Status & Score Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Badge
                  variant={
                    current.status === 'verified'
                      ? 'verified'
                      : current.status === 'suspicious'
                      ? 'suspicious'
                      : 'unverified'
                  }
                  size="lg"
                  showDot
                  className="text-sm font-extrabold px-3 py-1"
                >
                  {current.status.toUpperCase()}
                </Badge>
                <span className="text-xs font-semibold text-[#64748B]">
                  {current.riskLevel}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-[#102C3A]">
                {current.title}
              </h2>
              <p className="text-sm text-[#475569]">
                Claimed Publisher: <strong className="text-[#102C3A]">{current.organization}</strong>
              </p>
            </div>

            {/* Big Risk Score Indicator */}
            <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs text-center shrink-0 min-w-[130px]">
              <span className="text-[11px] font-bold text-[#64748B] block uppercase tracking-wider">
                Safety Risk Score
              </span>
              <span
                className="text-3xl sm:text-4xl font-black"
                style={{ color: current.badgeColor }}
              >
                {current.score}
              </span>
              <span className="text-xs text-[#94A3B8] font-bold"> / 100</span>
            </div>
          </div>

          {/* Plain-Language Short Explanation */}
          <div className="p-4 rounded-xl bg-white/80 border border-[#CBD5E1]/60 text-sm text-[#102C3A] leading-relaxed">
            <span className="font-bold block mb-1">Summary of What We Found:</span>
            {current.shortExplanation}
          </div>

          {/* Organization Verification Check */}
          <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] flex items-start gap-3 text-xs sm:text-sm">
            {current.orgCheck.isLegit ? (
              <CheckCircle2 size={22} className="text-[#16A36A] shrink-0 mt-0.5" />
            ) : (
              <AlertOctagon size={22} className="text-[#DC4B4B] shrink-0 mt-0.5" />
            )}
            <div className="space-y-0.5">
              <span className="font-bold text-[#102C3A] block">
                Employer Identity Check: {current.orgCheck.status}
              </span>
              <p className="text-[#64748B]">{current.orgCheck.note}</p>
            </div>
          </div>

          {/* Key Findings / Suspicious Indicators */}
          <div className="space-y-2">
            <span className="font-bold text-xs uppercase tracking-wider text-[#102C3A] block">
              Warning Signs Found:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {current.suspiciousHighlights.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-white border border-[#E2E8F0] flex items-start gap-2"
                >
                  <span className="text-[#087F70] font-bold">•</span>
                  <span className="text-[#334155]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Safety Actions */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
            <span className="font-bold text-xs uppercase tracking-wider text-[#102C3A] block flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-[#087F70]" />
              Recommended Safety Actions:
            </span>
            <ul className="space-y-1.5 text-xs text-[#334155]">
              {current.safetyActions.map((action, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-bold text-[#087F70]">{idx + 1}.</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Safety Disclaimer */}
          <div className="p-3.5 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-[11px] text-[#92400E] leading-relaxed">
            <strong>Important Safety Reminder:</strong> Never pay money to secure a job or guarantee an interview. Genuine employers in Bangladesh never charge fees through personal bKash/Nagad accounts. A VERIFIED status confirms legitimate corporate records, but you should always exercise personal caution.
          </div>
        </CardContent>
      </Card>

      {/* 3. EXPANDABLE SECTIONS (Keep primary view clean for beginners) */}
      <div className="space-y-3 print:space-y-4">
        {/* Section 1: Detailed Technical Indicators */}
        <Card className="bg-white border-[#E2E8F0] shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('indicators')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-[#F8FAFC] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <CreditCard size={18} className="text-[#087F70]" />
              <span className="font-bold text-sm text-[#102C3A]">
                Detailed Warning Signs & Verification Notes
              </span>
            </div>
            {expandedSections.indicators ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {expandedSections.indicators && (
            <div className="p-4 border-t border-[#F1F5F8] space-y-3 text-xs bg-[#FAFAFA]">
              {current.indicators.map((ind, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white border border-[#E2E8F0] space-y-1">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-[#102C3A]">{ind.title}</span>
                    <Badge variant={current.status} size="sm">{ind.severity}</Badge>
                  </div>
                  <p className="text-[#64748B]">{ind.desc}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Section 2: Website & URL Inspection */}
        <Card className="bg-white border-[#E2E8F0] shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('urlCheck')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-[#F8FAFC] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Globe size={18} className="text-[#087F70]" />
              <span className="font-bold text-sm text-[#102C3A]">
                Website & Link Security Checks
              </span>
            </div>
            {expandedSections.urlCheck ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {expandedSections.urlCheck && (
            <div className="p-4 border-t border-[#F1F5F8] space-y-3 text-xs bg-[#FAFAFA]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-xl border border-[#E2E8F0]">
                  <span className="text-[#94A3B8] block">Submitted Link:</span>
                  <span className="font-bold text-[#102C3A] font-mono break-all">
                    {current.submittedUrl}
                  </span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#E2E8F0]">
                  <span className="text-[#94A3B8] block">Official Website:</span>
                  <a
                    href={current.legitOrgUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-[#087F70] hover:underline flex items-center gap-1 font-mono break-all"
                  >
                    <span>{current.legitOrgUrl}</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Section 3: Bilingual Complete Explanations (বাংলা & English) */}
        <Card className="bg-white border-[#E2E8F0] shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('bilingual')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-[#F8FAFC] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Mail size={18} className="text-[#087F70]" />
              <span className="font-bold text-sm text-[#102C3A]">
                Detailed Explanation in English & বাংলা
              </span>
            </div>
            {expandedSections.bilingual ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {expandedSections.bilingual && (
            <div className="p-4 border-t border-[#F1F5F8] space-y-4 text-xs bg-[#FAFAFA]">
              <div className="inline-flex p-1 bg-white rounded-lg border border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setBilingualLang('bn')}
                  className={`px-3 py-1 rounded text-xs font-bold cursor-pointer ${
                    bilingualLang === 'bn' ? 'bg-[#102C3A] text-white' : 'text-[#64748B]'
                  }`}
                >
                  বাংলা বিবরণ
                </button>
                <button
                  type="button"
                  onClick={() => setBilingualLang('en')}
                  className={`px-3 py-1 rounded text-xs font-bold cursor-pointer ${
                    bilingualLang === 'en' ? 'bg-[#102C3A] text-white' : 'text-[#64748B]'
                  }`}
                >
                  English Explanation
                </button>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] leading-relaxed text-[#334155] whitespace-pre-line text-xs sm:text-sm">
                {bilingualLang === 'bn' ? current.explanationBn : current.explanationEn}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* 4. Bottom Quick Nav Row */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748B] print:hidden">
        <span>Need to report a scam? <Link to="/report-scam" className="text-[#087F70] font-semibold hover:underline">File a report here</Link></span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/my-activity')}>
            My Activity History
          </Button>
          <Button variant="secondary" size="sm" onClick={() => navigate('/analyze')}>
            Check Another Circular
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
