import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  FileSearch,
  CreditCard,
  Globe,
  AlertOctagon,
  Search,
  Clock,
  ArrowRight,
  ArrowLeft,
  Languages,
  BookOpen,
  CheckCircle2,
  Printer,
  Share2,
  RotateCcw,
  Check,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

import PageHeader from '../components/ui/PageHeader';
import Card, { CardContent } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { EmptyState } from '../components/ui/Table';
import { formatDate } from '../utils/formatters';
import { SAFETY_CATEGORIES, SAFETY_ARTICLES } from '../data/safetyArticles';
import { useAuth } from '../context/AuthContext';
import { useAuthModal } from '../context/AuthModalContext';

// Icon mapping helper
const CATEGORY_ICONS = {
  ShieldAlert: ShieldAlert,
  ShieldCheck: ShieldCheck,
  FileSearch: FileSearch,
  CreditCard: CreditCard,
  Globe: Globe,
  AlertOctagon: AlertOctagon,
};

export const ScamAlerts = () => {
  const navigate = useNavigate();
  const { articleId } = useParams();
  const { isAuthenticated } = useAuth();
  const { openAuthModal } = useAuthModal();

  // Language state: 'en' (English) | 'bn' (Bangla)
  const [lang, setLang] = useState('en');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Selected article state (derived from URL param or local state)
  const [selectedArticleId, setSelectedArticleId] = useState(articleId || null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Active article if viewing detail page
  const activeArticle = useMemo(() => {
    const targetId = articleId || selectedArticleId;
    if (!targetId) return null;
    return SAFETY_ARTICLES.find((a) => a.id === targetId) || null;
  }, [articleId, selectedArticleId]);

  // Filtered articles list
  const filteredArticles = useMemo(() => {
    return SAFETY_ARTICLES.filter((article) => {
      // 1. Category filter
      const matchesCategory =
        selectedCategory === 'all' || article.categoryId === selectedCategory;

      // 2. Search query filter
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesCategory;

      const titleEn = article.en.title.toLowerCase();
      const titleBn = article.bn.title.toLowerCase();
      const descEn = article.en.shortDescription.toLowerCase();
      const descBn = article.bn.shortDescription.toLowerCase();
      const catEn = article.categoryName.en.toLowerCase();
      const catBn = article.categoryName.bn.toLowerCase();

      const matchesSearch =
        titleEn.includes(query) ||
        titleBn.includes(query) ||
        descEn.includes(query) ||
        descBn.includes(query) ||
        catEn.includes(query) ||
        catBn.includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Handlers
  const handleOpenArticle = (id) => {
    setSelectedArticleId(id);
    navigate(`/alerts/${id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedArticleId(null);
    navigate('/alerts');
  };

  const handleShareArticle = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper to render icon
  const renderIcon = (iconName, size = 20, className = '') => {
    const IconComponent = CATEGORY_ICONS[iconName] || BookOpen;
    return <IconComponent size={size} className={className} />;
  };

  // ==========================================================
  // VIEW 1: INDIVIDUAL ARTICLE DETAIL VIEW
  // ==========================================================
  if (activeArticle) {
    const content = activeArticle[lang] || activeArticle.en;
    const relatedArticles = SAFETY_ARTICLES.filter(
      (a) => a.id !== activeArticle.id
    ).slice(0, 3);

    return (
      <div className="space-y-8 animate-in fade-in duration-200">
        {/* Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button
            variant="outline"
            size="sm"
            leftIcon={ArrowLeft}
            onClick={handleBackToList}
          >
            {lang === 'en' ? 'Back to Safety Guides' : 'সকল গাইডে ফিরে যান'}
          </Button>

          {/* Language Toggle & Actions */}
          <div className="flex items-center gap-2">
            {/* Language Switcher Tabs */}
            <div className="inline-flex p-1 bg-[#F1F5F8] rounded-xl border border-[#E2E8EC]">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-white text-[#102C3A] shadow-xs'
                    : 'text-[#64748B] hover:text-[#102C3A]'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLang('bn')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  lang === 'bn'
                    ? 'bg-white text-[#087F70] shadow-xs'
                    : 'text-[#64748B] hover:text-[#102C3A]'
                }`}
              >
                বাংলা
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              leftIcon={copiedLink ? Check : Share2}
              onClick={handleShareArticle}
            >
              {copiedLink
                ? lang === 'en'
                  ? 'Link Copied!'
                  : 'লিংক কপি হয়েছে!'
                : lang === 'en'
                ? 'Share'
                : 'শেয়ার'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              leftIcon={Printer}
              onClick={handlePrint}
            >
              {lang === 'en' ? 'Print Guide' : 'প্রিন্ট'}
            </Button>
          </div>
        </div>

        {/* Article Container */}
        <article className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          {/* Article Header Banner */}
          <div className="p-6 sm:p-8 bg-gradient-to-br from-[#F8FAFC] via-white to-[#F0FDF9] border-b border-[#E2E8F0] space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#102C3A] text-white">
                {renderIcon(activeArticle.iconName, 14)}
                {activeArticle.categoryName[lang]}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-[#64748B] font-medium bg-[#E2E8F0]/60 px-2.5 py-1 rounded-full">
                <Clock size={12} />
                {activeArticle.readingTime[lang]}
              </span>
              <span className="text-xs text-[#94A3B8]">
                {formatDate(activeArticle.date)}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#102C3A] leading-tight">
              {content.title}
            </h1>

            <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-4xl">
              {content.shortDescription}
            </p>

            <div className="flex items-center gap-2 pt-2 text-xs text-[#64748B]">
              <span className="w-2 h-2 rounded-full bg-[#16A36A]" />
              <span>
                {lang === 'en'
                  ? 'Reviewed by CircularShield Security Research Team'
                  : 'সার্কুলারশিল্ড সিকিউরিটি রিসার্চ টিম কর্তৃক যাচাইকৃত'}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-10 space-y-8">
            {/* PROMINENT MANDATORY WARNING BANNER */}
            <div className="p-5 rounded-2xl bg-[#FEF2F2] border-2 border-[#FECACA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-[#DC4B4B] text-white shrink-0 mt-0.5">
                  <AlertTriangle size={22} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base sm:text-lg font-black text-[#DC4B4B] tracking-tight">
                    {lang === 'en'
                      ? 'CRITICAL DEFENSE RULE:'
                      : 'জরুরি নিরাপত্তা সতর্কতা:'}
                  </h4>
                  <p className="text-sm sm:text-base font-bold text-[#102C3A]">
                    {lang === 'en'
                      ? '"Never pay money to secure a job or guarantee an interview."'
                      : '"চাকরি পেতে বা ইন্টারভিউ নিশ্চিত করতে কখনোই কাউকে টাকা দেবেন না।"'}
                  </p>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    {lang === 'en'
                      ? 'Legitimate employers never demand application processing fees, software security deposits, or bKash/Nagad transfers. Any such demand is definitive proof of fraud.'
                      : 'কোনো বৈধ প্রতিষ্ঠান আবেদন ফি, প্রবেশপত্র ফি, সফটওয়্যার ডিপোজিট বা বিকাশ/নগদে টাকা দাবি করে না। টাকা চাওয়া মানেই তা শতভাগ প্রতারণা।'}
                  </p>
                </div>
              </div>
            </div>

            {/* Key Takeaways Card */}
            {content.keyTakeaways?.length > 0 && (
              <div className="p-5 sm:p-6 rounded-2xl bg-[#F0FDF9] border border-[#A7F3D0] space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#065C51] flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-[#16A36A]" />
                  {lang === 'en' ? 'Key Takeaways & Core Rules' : 'প্রধান শিক্ষণীয় বার্তা ও মূল নিয়ম'}
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-[#182B36]">
                  {content.keyTakeaways.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-[#087F70] font-bold shrink-0 mt-0.5">
                        ✓
                      </span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Full Article Content Sections */}
            <div className="space-y-8 text-sm sm:text-base text-[#334155] leading-relaxed">
              {content.sections.map((section, idx) => (
                <section key={idx} className="space-y-3">
                  <h2 className="text-lg sm:text-xl font-bold text-[#102C3A] pt-2 border-t border-[#F1F5F8]">
                    {section.heading}
                  </h2>
                  <div className="whitespace-pre-line text-xs sm:text-sm text-[#475569] leading-relaxed space-y-2">
                    {section.body}
                  </div>
                </section>
              ))}
            </div>

            {/* Bottom Actions Banner */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-bold text-sm text-[#102C3A]">
                  {lang === 'en'
                    ? 'Found a suspicious job notice?'
                    : 'সন্দেহজনক কোনো চাকরির বিজ্ঞপ্তি পেয়েছেন?'}
                </h4>
                <p className="text-xs text-[#64748B]">
                  {lang === 'en'
                    ? 'Check job notices, PDFs, or website links immediately with our fraud checker.'
                    : 'আমাদের স্ক্যানারের মাধ্যমে এখনই টেক্সট, পিডিএফ বা লিংক পরীক্ষা করে ঝুঁকি যাচাই করুন।'}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full sm:w-auto justify-center"
                  onClick={() => {
                    if (isAuthenticated) {
                      navigate('/analyze');
                    } else {
                      openAuthModal({
                        destination: '/analyze',
                        featureTitle: 'Check Job Circular',
                        reason:
                          'Checking suspicious job circulars requires signing in to your free account.',
                      });
                    }
                  }}
                >
                  {lang === 'en' ? 'Check Job Circular' : 'বিজ্ঞপ্তি স্ক্যান করুন'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto justify-center"
                  onClick={() => {
                    if (isAuthenticated) {
                      navigate('/report-scam');
                    } else {
                      openAuthModal({
                        destination: '/report-scam',
                        featureTitle: 'Report a Scam',
                        reason:
                          'Submitting scam reports and uploading extortion evidence requires an authenticated session to prevent false reporting and maintain case tracking.',
                      });
                    }
                  }}
                >
                  {lang === 'en' ? 'Report a Scam' : 'প্রতারণা রিপোর্ট করুন'}
                </Button>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-bold text-[#102C3A] flex items-center gap-2">
              <BookOpen size={20} className="text-[#087F70]" />
              {lang === 'en'
                ? 'Related Safety & Awareness Guides'
                : 'সম্পর্কিত অন্যান্য নিরাপত্তা গাইড'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedArticles.map((item) => {
                const itemContent = item[lang] || item.en;
                return (
                  <Card
                    key={item.id}
                    hoverEffect
                    onClick={() => handleOpenArticle(item.id)}
                    className="flex flex-col justify-between"
                  >
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#087F70]">
                          {item.categoryName[lang]}
                        </span>
                        <span className="text-[#94A3B8]">
                          {item.readingTime[lang]}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-[#102C3A] line-clamp-2">
                        {itemContent.title}
                      </h4>
                      <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                        {itemContent.shortDescription}
                      </p>
                    </CardContent>
                    <div className="px-5 py-3 bg-[#F8FAFC] border-t border-[#F1F5F8] text-xs font-semibold text-[#087F70] flex items-center justify-between">
                      <span>
                        {lang === 'en' ? 'Read Guide' : 'গাইড পড়ুন'}
                      </span>
                      <span>&rarr;</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================================
  // VIEW 2: ARTICLE DIRECTORY (RESOURCE CARDS & FILTERS)
  // ==========================================================
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <PageHeader
        title="Stay Safe. Stay Informed."
        subtitle={
          lang === 'en'
            ? 'Educational resources, detection guidelines, and scam warnings to help you identify recruitment fraud and apply safely.'
            : 'চাকরির প্রতারণা চিহ্নিত করতে এবং নিরাপদে আবেদন করার প্রয়োজনীয় শিক্ষামূলক নির্দেশিকা ও সতর্কতা।'
        }
        actions={
          <div className="flex items-center gap-2">
            {/* Bilingual Content Switcher Tabs */}
            <div className="inline-flex p-1 bg-[#F1F5F8] rounded-xl border border-[#E2E8EC]">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-white text-[#102C3A] shadow-xs'
                    : 'text-[#64748B] hover:text-[#102C3A]'
                }`}
              >
                <Languages size={13} />
                <span>English</span>
              </button>
              <button
                type="button"
                onClick={() => setLang('bn')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  lang === 'bn'
                    ? 'bg-white text-[#087F70] shadow-xs'
                    : 'text-[#64748B] hover:text-[#102C3A]'
                }`}
              >
                <Languages size={13} />
                <span>বাংলা</span>
              </button>
            </div>
          </div>
        }
      />

      {/* ======================================================== */}
      {/* PROMINENT MANDATORY WARNING BANNER                      */}
      {/* "Never pay money to secure a job or guarantee an interview." */}
      {/* ======================================================== */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#FEF2F2] via-[#FEF2F2] to-[#FFF5F5] border-2 border-[#FECACA] shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-[#DC4B4B] text-white shrink-0 shadow-sm mt-0.5">
              <ShieldAlert size={26} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#DC4B4B] bg-white px-2 py-0.5 rounded-md border border-[#FECACA]">
                  {lang === 'en' ? 'Core Safety Mandate' : 'মৌলিক নিরাপত্তা নীতি'}
                </span>
                <span className="text-xs text-[#DC4B4B] font-medium">
                  {lang === 'en' ? '100% Zero-Tolerance' : 'শতভাগ সতর্কতা'}
                </span>
              </div>
              <h3 className="text-base sm:text-lg lg:text-xl font-extrabold text-[#102C3A] tracking-tight">
                {lang === 'en'
                  ? '"Never pay money to secure a job or guarantee an interview."'
                  : '"চাকরি পেতে বা ইন্টারভিউ নিশ্চিত করতে কখনোই কাউকে টাকা দেবেন না।"'}
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed max-w-3xl">
                {lang === 'en'
                  ? 'Legitimate employers never demand registration fees, admit card costs, training deposits, or bKash/Nagad transfers. Any demand for upfront payment is definitive proof of an employment scam.'
                  : 'প্রকৃত নিয়োগকারী প্রতিষ্ঠান কখনোই আবেদন ফি, প্রবেশপত্র খরচ, জামানত বা বিকাশ/নগদে টাকা দাবি করে না। চাকরির শুরুতে যেকোনো আর্থিক দাবি নিশ্চিতভাবেই প্রতারণা।'}
              </p>
            </div>
          </div>

          <Button
            variant="danger"
            size="sm"
            onClick={() => navigate('/report')}
            className="shrink-0 shadow-xs"
          >
            {lang === 'en' ? 'Report a Job Scam' : 'প্রতারণা রিপোর্ট করুন'}
          </Button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SEARCH BAR & CATEGORY FILTER BAR                        */}
      {/* 6 Categories:                                           */}
      {/* 1. Job Scam Awareness                                   */}
      {/* 2. Safe Job Application Guidelines                      */}
      {/* 3. How to Identify Fake Job Circulars                   */}
      {/* 4. Payment Scam Warning                                 */}
      {/* 5. Website Verification Tips                            */}
      {/* 6. Common Recruitment Fraud Examples                    */}
      {/* ======================================================== */}
      <Card className="p-4 sm:p-5 bg-white border-[#E2E8F0] shadow-sm space-y-4">
        {/* Search Input */}
        <div className="w-full">
          <Input
            placeholder={
              lang === 'en'
                ? 'Search safety guides, fraud indicators, or keywords...'
                : 'নিরাপত্তা গাইড, প্রতারণার ধরন বা কীওয়ার্ড দিয়ে খুঁজুন...'
            }
            leftIcon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            clearable
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2 border-t border-[#F1F5F8]">
          {SAFETY_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const count =
              cat.id === 'all'
                ? SAFETY_ARTICLES.length
                : SAFETY_ARTICLES.filter((a) => a.categoryId === cat.id).length;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#102C3A] text-white shadow-xs'
                    : 'bg-[#F1F5F8] text-[#64748B] hover:text-[#102C3A] hover:bg-[#E2E8F0]'
                }`}
              >
                <span>{cat[lang]}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-[#E2E8F0] text-[#64748B]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Results Count & Reset Filter */}
      <div className="flex items-center justify-between text-xs text-[#64748B] px-1">
        <span>
          {lang === 'en' ? (
            <>
              Showing <strong className="text-[#102C3A]">{filteredArticles.length}</strong> educational articles
            </>
          ) : (
            <>
              মোট <strong className="text-[#102C3A]">{filteredArticles.length}</strong>টি শিক্ষামূলক গাইড পাওয়া গেছে
            </>
          )}
        </span>
        {(searchQuery || selectedCategory !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="text-[#087F70] hover:underline cursor-pointer flex items-center gap-1"
          >
            <RotateCcw size={12} />
            {lang === 'en' ? 'Reset Filters' : 'ফিল্টার রিসেট করুন'}
          </button>
        )}
      </div>

      {/* ======================================================== */}
      {/* ATTRACTIVE ARTICLE CARDS GRID                           */}
      {/* Title, Short Description, Icon/Illustration,            */}
      {/* Reading Time, Read More Button                          */}
      {/* ======================================================== */}
      {filteredArticles.length === 0 ? (
        <Card className="py-16 text-center">
          <CardContent>
            <EmptyState
              icon={Search}
              title={
                lang === 'en'
                  ? 'No articles found'
                  : 'কোনো গাইড খুঁজে পাওয়া যায়নি'
              }
              description={
                lang === 'en'
                  ? 'No safety articles matched your search query. Try clearing your keywords or switching category filters.'
                  : 'আপনার সার্চ কীওয়ার্ড বা ক্যাটাগরির সাথে মিল রেখে কোনো আর্টিকেল পাওয়া যায়নি।'
              }
              action={
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={RotateCcw}
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                >
                  {lang === 'en' ? 'View All Articles' : 'সকল আর্টিকেল দেখুন'}
                </Button>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => {
            const content = article[lang] || article.en;
            return (
              <Card
                key={article.id}
                hoverEffect
                onClick={() => handleOpenArticle(article.id)}
                className="flex flex-col justify-between overflow-hidden border-[#E2E8F0] group"
              >
                {/* Card Top Banner with Icon & Category */}
                <div className="p-5 bg-gradient-to-br from-[#F8FAFC] to-white border-b border-[#F1F5F8] space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs"
                      style={{ backgroundColor: article.accentColor }}
                    >
                      {renderIcon(article.iconName, 20)}
                    </div>
                    <Badge variant="default" size="sm">
                      {article.categoryName[lang]}
                    </Badge>
                  </div>

                  {/* Title & Reading Time */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center gap-2 text-[11px] text-[#94A3B8]">
                      <span className="flex items-center gap-1 font-medium text-[#64748B]">
                        <Clock size={11} />
                        {article.readingTime[lang]}
                      </span>
                      <span>•</span>
                      <span>{formatDate(article.date)}</span>
                    </div>

                    <h3 className="font-bold text-base text-[#102C3A] group-hover:text-[#087F70] transition-colors line-clamp-2 leading-snug">
                      {content.title}
                    </h3>
                  </div>
                </div>

                {/* Card Content & Short Description */}
                <CardContent className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-[#64748B] line-clamp-3 leading-relaxed">
                    {content.shortDescription}
                  </p>

                  {/* Highlights Pill */}
                  {content.keyTakeaways?.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-[#F0FDF9] border border-[#A7F3D0]/60 text-[11px] text-[#065C51] line-clamp-2">
                      <strong className="block text-[#087F70]">
                        {lang === 'en' ? 'Takeaway:' : 'মূল বিষয়:'}
                      </strong>
                      <span>{content.keyTakeaways[0]}</span>
                    </div>
                  )}
                </CardContent>

                {/* Card Footer: Read More Button */}
                <div className="px-5 py-3.5 bg-[#F8FAFC] border-t border-[#F1F5F8] flex items-center justify-between text-xs">
                  <span className="text-[#94A3B8] font-medium">
                    {lang === 'en' ? 'Official Guide' : 'অফিসিয়াল গাইড'}
                  </span>
                  <span className="font-bold text-[#087F70] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>
                      {lang === 'en' ? 'Read Full Guide' : 'সম্পূর্ণ গাইড পড়ুন'}
                    </span>
                    <ArrowRight size={14} />
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* QUICK EMERGENCY HELPLINE CALLOUT                        */}
      {/* ======================================================== */}
      <Card className="bg-gradient-to-r from-white via-white to-[#F0FDF9] border-[#087F70]/30 shadow-xs">
        <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-bold text-sm sm:text-base text-[#102C3A] flex items-center gap-2 justify-center sm:justify-start">
              <Sparkles size={16} className="text-[#087F70]" />
              {lang === 'en'
                ? 'Encountered a suspected recruitment scam?'
                : 'সন্দেহজনক নিয়োগ প্রতারণার শিকার হয়েছেন?'}
            </h4>
            <p className="text-xs text-[#64748B] max-w-xl">
              {lang === 'en'
                ? 'Report fake job circulars, cloned organizations, or fraudulent bKash/Nagad accounts to protect the broader job seeker community.'
                : 'অন্যান্য চাকরিপ্রার্থীদের সুরক্ষিত রাখতে ভুয়া সার্কুলার, নকল প্রতিষ্ঠান বা বিকাশ/নগদ নম্বর দ্রুত রিপোর্ট করুন।'}
            </p>
          </div>
          <Button
            variant="secondary"
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
                    'Reporting recruitment scams with verifiable evidence and contact logs requires an active citizen whistleblower session.',
                });
              }
            }}
            className="shrink-0 shadow-xs"
          >
            {lang === 'en' ? 'Report Scam Now' : 'এখনই রিপোর্ট করুন'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScamAlerts;
