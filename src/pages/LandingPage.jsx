import { useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAuthModal } from '../context/AuthModalContext';
import {
  ShieldCheck,
  ShieldAlert,
  SearchCode,
  AlertOctagon,
  Building2,
  FileText,
  DollarSign,
  Link2,
  ArrowRight,
  CheckCircle2,
  CheckCircle,
  PhoneCall,
  Mail,
  MapPin,
  Clock,
} from 'lucide-react';

import LandingNavbar from '../components/landing/LandingNavbar';
import HeroIllustration from '../components/landing/HeroIllustration';
import BrandLogo from '../components/common/BrandLogo';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { MOCK_METRICS } from '../data/mockData';

export const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { openAuthModal } = useAuthModal();

  useEffect(() => {
    if (location.pathname === '/features' || location.hash === '#features') {
      const el = document.getElementById('features');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (location.pathname === '/how-it-works' || location.hash === '#how-it-works') {
      const el = document.getElementById('how-it-works');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.pathname, location.hash]);

  const TRUST_STATS = [
    {
      label: 'Total Jobs Checked',
      value: `${MOCK_METRICS.totalCircularsAnalyzed.toLocaleString()}+`,
      sub: 'Screened across social & web channels',
      variant: 'default',
    },
    {
      label: 'Verified Jobs',
      value: `${MOCK_METRICS.verifiedCircularsCount.toLocaleString()}+`,
      sub: 'Certified authentic opportunities',
      variant: 'verified',
    },
    {
      label: 'Fake Jobs Flagged',
      value: `${MOCK_METRICS.suspiciousCircularsCount.toLocaleString()}+`,
      sub: 'Threats flagged and neutralized',
      variant: 'suspicious',
    },
    {
      label: 'Verified Employers',
      value: `${MOCK_METRICS.verifiedOrganizationsCount.toLocaleString()}+`,
      sub: 'Accredited employers in registry',
      variant: 'secondary',
    },
  ];

  const FEATURES = [
    {
      id: 'analysis',
      title: 'Check Any Job Circular',
      description:
        'Upload any job circular, image, or link to instantly check if it is genuine or a scam.',
      icon: SearchCode,
      tag: 'Smart Scam Scanner',
      linkText: 'Check a Job &rarr;',
      linkTo: '/scanner',
    },
    {
      id: 'payment',
      title: 'Payment Fraud Detection',
      description:
        'Instantly flags extortion demands for bKash, Nagad, Rocket, training fees, uniform deposits, or paid admit card generation.',
      icon: DollarSign,
      tag: 'Zero-Fee Enforcement',
      linkText: 'Learn Red Flags &rarr;',
      linkTo: '#safety-tips',
    },
    {
      id: 'url',
      title: 'Suspicious URL & Domain Check',
      description:
        'Screens for spoofed web addresses, free website builders, and free webmail addresses (@gmail, @yahoo) impersonating corporate entities.',
      icon: Link2,
      tag: 'Domain Authentication',
      linkText: 'Check Domain &rarr;',
      linkTo: '/verify-org',
    },
    {
      id: 'org',
      title: 'Fake Organization Detection',
      description:
        'Cross-checks company registration filings, verified trade license numbers, physical office records, and official career gateways.',
      icon: Building2,
      tag: 'Registry Authentication',
      linkText: 'Search Directory &rarr;',
      linkTo: '/verify-org',
    },
    {
      id: 'reporting',
      title: 'Report a Scam',
      description:
        'Empowers candidates to anonymously report scam circulars, fraudulent phone numbers, and payment slips to protect other job seekers.',
      icon: AlertOctagon,
      tag: 'Community Watchdog',
      linkText: 'Report a Scam &rarr;',
      linkTo: '/report',
    },
    {
      id: 'verification',
      title: 'Organization Verification Portal',
      description:
        'Legitimate companies can authenticate their recruitment emails and obtain verified badges to prevent counterfeit clones.',
      icon: ShieldCheck,
      tag: 'Enterprise Badging',
      linkText: 'Get Verified &rarr;',
      linkTo: '/verify-org',
    },
  ];

  const HOW_IT_WORKS_STEPS = [
    {
      number: '01',
      title: 'Upload or Paste Circular',
      description:
        'Copy-paste the job notice text, paste the social media or Telegram post link, or fill in the recruiter details.',
      icon: FileText,
      badge: 'Input Stage',
    },
    {
      number: '02',
      title: 'Check Warning Signs',
      description:
        'Our system automatically scans for common scam signs, such as money demands, suspicious links, and fake contact info.',
      icon: SearchCode,
      badge: 'Instant Safety Check',
    },
    {
      number: '03',
      title: 'Review Safety Results',
      description:
        'Get a clear safety score (0–100) with a simple explanation of any warning signs found and recommended actions.',
      icon: ShieldAlert,
      badge: 'Safety Score',
    },
    {
      number: '04',
      title: 'Apply Safely or Report',
      description:
        'Apply with confidence through verified official employer career portals, or flag suspicious syndicates to warn the community.',
      icon: ShieldCheck,
      badge: 'Safe Action',
    },
  ];

  const SAFETY_RULES = [
    {
      title: 'Rule 1: Legitimate Employers NEVER Solicit Fees',
      desc: 'Whether called an application fee, interview reservation, admit card token, or uniform deposit—genuine companies NEVER charge applicants.',
      critical: true,
    },
    {
      title: 'Rule 2: Check Email Domain Integrity',
      desc: 'Corporations recruit via corporate domain emails (e.g. hr@company.com), never generic webmail like @gmail.com or @yahoo.com.',
      critical: true,
    },
    {
      title: 'Rule 3: Beware of Telegram & WhatsApp Only Recruiting',
      desc: 'Recruiters refusing phone calls or official video interviews and insisting exclusively on encrypted messaging are almost always syndicates.',
      critical: false,
    },
    {
      title: 'Rule 4: Avoid Unrealistic "Too Good to Be True" Pay',
      desc: 'Offers promising BDT 60,000–80,000 for 2 hours of simple copy-paste or captcha typing are fabricated lures for Ponzi deposit scams.',
      critical: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#182B36] font-sans antialiased">
      {/* 1. NAVBAR */}
      <LandingNavbar />

      <main className="pt-20">
        {/* 2. HERO SECTION */}
        <section id="hero" className="relative py-16 sm:py-24 lg:py-28 overflow-hidden bg-gradient-to-b from-[#F7F9FA] via-white to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Heading & CTAs */}
              <div className="lg:col-span-7 space-y-6 text-left">
                {/* Security Tag Pill */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ECFDF5] border border-[#A7F3D0] rounded-full text-xs font-semibold text-[#16A36A]">
                  <ShieldCheck size={16} />
                  <span>National Job Circular Fraud Detection Platform</span>
                </div>

                {/* Primary Heading */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#102C3A] tracking-tight leading-[1.12]">
                  Don't Let Fake Job Circulars{' '}
                  <span className="text-[#087F70] relative inline-block">
                    Steal Your Future.
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg text-[#64748B] max-w-xl leading-relaxed">
                  Check job circulars, verify real employers, and identify recruitment scams before you apply.
                </p>

                {/* CTAs */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                  <Button
                    variant="secondary"
                    size="lg"
                    rightIcon={ArrowRight}
                    onClick={() => {
                      if (isAuthenticated) {
                        navigate('/analyze');
                      } else {
                        openAuthModal({
                          destination: '/analyze',
                          featureTitle: 'Check Job Circular',
                          reason:
                            'Checking job notices for scams, fake contact details, and employer verification requires signing in.',
                        });
                      }
                    }}
                    className="shadow-sm font-semibold text-sm sm:text-base px-6 h-12"
                  >
                    Check a Job Circular
                  </Button>
                  <a
                    href="#how-it-works"
                    className="inline-flex items-center justify-center font-medium text-sm sm:text-base px-5 h-12 rounded-xl text-[#182B36] hover:bg-[#F1F5F8] border border-[#CBD5E1] transition-colors"
                  >
                    Learn How It Works
                  </a>
                </div>

                {/* Trust Points */}
                <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#64748B]">
                  <div className="flex items-center gap-1.5 font-medium">
                    <CheckCircle size={15} className="text-[#16A36A]" />
                    <span>Zero Fees Required</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <CheckCircle size={15} className="text-[#16A36A]" />
                    <span>Instant Safety Check</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <CheckCircle size={15} className="text-[#16A36A]" />
                    <span>100% Free Public Interest</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Professional Verification Illustration */}
              <div className="lg:col-span-5 relative">
                <HeroIllustration />
              </div>
            </div>
          </div>
        </section>

        {/* 3. TRUST STATISTICS */}
        <section className="py-12 bg-white border-y border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
              {TRUST_STATS.map((stat, idx) => (
                <div
                  key={idx}
                  className="space-y-1.5 text-center md:text-left border-r last:border-r-0 border-[#F1F5F8] pr-4"
                >
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#102C3A] tracking-tight">
                    {stat.value}
                  </p>
                  <h4 className="text-xs sm:text-sm font-bold text-[#182B36]">
                    {stat.label}
                  </h4>
                  <p className="text-[11px] text-[#64748B] hidden sm:block">
                    {stat.sub}
                  </p>
                </div>
              ))}
            </div>

            {/* Candidate Savings Banner */}
            <div className="mt-8 p-4 rounded-2xl bg-[#0A1C25] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="w-10 h-10 rounded-xl bg-[#087F70] flex items-center justify-center shrink-0">
                  <ShieldCheck size={22} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    ৳1.84+ Crore in Candidate Extortion Blocked
                  </p>
                  <p className="text-xs text-slate-300">
                    Calculated across 4,000+ neutralized scam syndicates and verified whistleblower filings.
                  </p>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  if (isAuthenticated) {
                    navigate('/history');
                  } else {
                    openAuthModal({
                      destination: '/history',
                      featureTitle: 'Circular Threat Directory & Audit Records',
                      reason:
                        'Reviewing screened job notices and past scam dossiers requires an authenticated session.',
                    });
                  }
                }}
                className="whitespace-nowrap shrink-0 text-xs"
              >
                Explore Screened Directory &rarr;
              </Button>
            </div>
          </div>
        </section>

        {/* 4. FEATURES SECTION */}
        <section id="features" className="py-20 sm:py-28 bg-[#F7F9FA]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <Badge variant="info" size="sm">
                Complete Verification Suite
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#102C3A] tracking-tight">
                Built to Protect Job Seekers from Employment Fraud
              </h2>
              <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
                CircularShield helps you verify employer credentials, detect suspicious payment demands, and avoid recruitment scams before you apply.
              </p>
            </div>

            {/* 6 Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={feature.id}
                    className="flex flex-col justify-between hover:shadow-md hover:border-[#CBD5E1] transition-all bg-white"
                  >
                    <CardContent className="p-6 sm:p-7 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-[#087F70]/10 text-[#087F70] flex items-center justify-center shadow-2xs">
                          <Icon size={24} />
                        </div>
                        <span className="text-[11px] font-semibold text-[#087F70] bg-[#ECFDF5] px-2.5 py-1 rounded-full border border-[#A7F3D0]">
                          {feature.tag}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-base sm:text-lg font-bold text-[#102C3A]">
                          {feature.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </CardContent>

                    <div className="px-6 py-3.5 bg-[#F8FAFC] border-t border-[#F1F5F8] text-xs font-semibold text-[#087F70]">
                      <button
                        type="button"
                        onClick={() => {
                          if (feature.linkTo.startsWith('#')) {
                            const el = document.querySelector(feature.linkTo);
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          } else {
                            const target = feature.linkTo === '/scanner' ? '/analyze' : feature.linkTo;
                            const isProtected = ['/analyze', '/scanner', '/report', '/report-scam', '/history', '/circulars', '/dashboard'].includes(target);
                            if (!isAuthenticated && isProtected) {
                              openAuthModal({
                                destination: target,
                                featureTitle: feature.title,
                                reason: `${feature.title} requires an active user session to safeguard threat surveillance records.`,
                              });
                            } else {
                              navigate(target);
                            }
                          }
                        }}
                        className="hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span dangerouslySetInnerHTML={{ __html: feature.linkText }} />
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. HOW IT WORKS */}
        <section id="how-it-works" className="py-20 sm:py-28 bg-white border-t border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <Badge variant="neutral" size="sm">
                Step-by-Step Workflow
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#102C3A] tracking-tight">
                How CircularShield Protects You
              </h2>
              <p className="text-sm sm:text-base text-[#64748B]">
                Verify any circular in under 30 seconds with four streamlined steps.
              </p>
            </div>

            {/* 4 Step Cards Progression */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {HOW_IT_WORKS_STEPS.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-4 hover:border-[#087F70] transition-all relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-[#CBD5E1] group-hover:text-[#087F70] transition-colors font-mono">
                        {step.number}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-white text-[#087F70] flex items-center justify-center border border-[#E2E8F0] shadow-2xs">
                        <Icon size={20} />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#087F70]">
                        {step.badge}
                      </span>
                      <h4 className="text-base font-bold text-[#102C3A]">
                        {step.title}
                      </h4>
                      <p className="text-xs text-[#64748B] leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Demo Trigger CTA */}
            <div className="text-center pt-2">
              <Button
                variant="primary"
                size="lg"
                rightIcon={ArrowRight}
                onClick={() => navigate('/scanner')}
                className="px-8 font-semibold shadow-xs"
              >
                Launch Circular Scanner Now
              </Button>
            </div>
          </div>
        </section>

        {/* 6. SAFETY AWARENESS SECTION */}
        <section id="safety-tips" className="py-20 sm:py-28 bg-[#F7F9FA] border-t border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <Badge variant="suspicious" size="sm" showDot>
                Public Vigilance Desk
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#102C3A] tracking-tight">
                Essential Job Seeker Defense Rules
              </h2>
              <p className="text-sm sm:text-base text-[#64748B]">
                Fraud syndicates evolve rapidly. Remember these golden rules before submitting your application or making any transaction.
              </p>
            </div>

            {/* Safety Rules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {SAFETY_RULES.map((rule, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl border transition-all ${
                    rule.critical
                      ? 'bg-white border-[#FECACA] shadow-xs'
                      : 'bg-white border-[#E2E8F0]'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                        rule.critical
                          ? 'bg-[#FEF2F2] text-[#DC4B4B]'
                          : 'bg-[#F1F5F8] text-[#087F70]'
                      }`}
                    >
                      {rule.critical ? <ShieldAlert size={20} /> : <ShieldCheck size={20} />}
                    </div>
                    <div className="space-y-1.5 text-left">
                      <h4 className="text-sm sm:text-base font-bold text-[#182B36]">
                        {rule.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                        {rule.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Official Law Enforcement Support Card */}
            <Card className="border-[#087F70]/30 bg-gradient-to-r from-white via-white to-[#F0FDF9]">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-xl">
                    <div className="flex items-center gap-2 text-[#087F70]">
                      <PhoneCall size={20} />
                      <h3 className="text-base sm:text-lg font-bold text-[#102C3A]">
                        Victim of Job Extortion? Contact Cyber Police Directly
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                      If an entity demanded money for admit cards or appointment letters, save your transaction IDs and report immediately to Bangladesh Police CID Cyber Crime Investigation Division.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 flex-wrap">
                    <div className="px-4 py-2.5 bg-white rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#102C3A]">
                      Hotline: 01730336107
                    </div>
                    <div className="px-4 py-2.5 bg-white rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#102C3A]">
                      Emergency: 999
                    </div>
                    <Button
                      variant="danger"
                      size="md"
                      leftIcon={AlertOctagon}
                      onClick={() => {
                        if (isAuthenticated) {
                          navigate('/report-scam');
                        } else {
                          openAuthModal({
                            destination: '/report-scam',
                            featureTitle: 'Whistleblower Scam Reporting',
                            reason:
                              'Submitting scam reports and uploading extortion evidence requires an authenticated session to prevent false reporting and maintain case tracking.',
                          });
                        }
                      }}
                    >
                      Report on CircularShield
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* 7. FOOTER */}
      <footer className="border-t border-[#E2E8F0] bg-white py-12 px-4 sm:px-6 lg:px-8 text-xs text-[#64748B]">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
            {/* Col 1: Brand & Tagline */}
            <div className="md:col-span-5 space-y-3.5">
              <BrandLogo size="md" showTagline={true} />
              <p className="text-xs text-[#64748B] max-w-sm leading-relaxed">
                CircularShield is a non-profit public interest surveillance initiative committed to eliminating recruitment fraud, fake appointment letters, and applicant extortion.
              </p>
              <div className="pt-1 flex items-center gap-2 text-xs text-[#16A36A] font-semibold">
                <CheckCircle2 size={16} />
                <span>Verified Independent Fraud Watchdog</span>
              </div>
            </div>

            {/* Col 2: Platform Links */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#102C3A]">
                Platform Navigation
              </h4>
              <ul className="space-y-2 text-xs font-medium">
                <li>
                  <Link to="/analyze" className="hover:text-[#087F70] transition-colors">
                    Check Job Circular
                  </Link>
                </li>
                <li>
                  <Link to="/my-activity" className="hover:text-[#087F70] transition-colors">
                    Previously Checked Jobs
                  </Link>
                </li>
                <li>
                  <Link to="/organizations" className="hover:text-[#087F70] transition-colors">
                    Verified Organizations
                  </Link>
                </li>
                <li>
                  <Link to="/report-scam" className="hover:text-[#DC4B4B] transition-colors font-semibold">
                    Report a Scam
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="hover:text-[#087F70] transition-colors">
                    User Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Contact Placeholders */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#102C3A]">
                Public Watchdog Contact
              </h4>
              <ul className="space-y-2.5 text-xs text-[#64748B]">
                <li className="flex items-center gap-2">
                  <Mail size={14} className="text-[#087F70] shrink-0" />
                  <span>support@circularshield.org</span>
                </li>
                <li className="flex items-center gap-2">
                  <PhoneCall size={14} className="text-[#087F70] shrink-0" />
                  <span>Advisory Desk: +880 1730-336107</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin size={14} className="text-[#087F70] shrink-0" />
                  <span>Dhaka, Bangladesh</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock size={14} className="text-[#087F70] shrink-0" />
                  <span>Live Threat Monitoring: 24/7/365</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="pt-8 border-t border-[#F1F5F8] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#94A3B8]">
            <p>&copy; {new Date().getFullYear()} CircularShield. All rights reserved. Public interest verification infrastructure.</p>
            <div className="flex items-center gap-4">
              <Link to="/login" className="hover:text-[#087F70] transition-colors font-medium">
                Portal Login
              </Link>
              <span>•</span>
              <a href="#hero" className="hover:text-[#087F70] transition-colors">
                Back to Top &uarr;
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
