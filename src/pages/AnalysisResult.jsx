import { useNavigate } from 'react-router-dom';

export const AnalysisResult = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* 1. Header with Title & Download Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#102C3A] tracking-tight">
            Analysis Result
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Office Assistant circular · 22 Nov 2026
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-[#CBD5E1] bg-white text-xs font-semibold text-[#102C3A] hover:bg-[#F8FAFC] transition-colors shadow-xs"
        >
          Download PDF
        </button>
      </div>

      {/* 2. Top Row: Score Ring & Detected Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Score Gauge Card */}
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs flex flex-col items-center justify-center text-center">
          {/* Circular Risk Ring */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#F1F5F9"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#DC4B4B"
                strokeWidth="10"
                strokeDasharray="251.2"
                strokeDashoffset="32.6"
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-[#102C3A]">87</span>
              <span className="text-xs text-[#94A3B8]">/ 100</span>
            </div>
          </div>

          <div className="mt-4">
            <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-[#FEF2F2] text-[#DC4B4B]">
              SUSPICIOUS
            </span>
            <p className="text-xs text-[#64748B] mt-1.5 font-medium">
              High risk · Fraud indicators detected
            </p>
          </div>
        </div>

        {/* Right: Detected Fraud Indicators List */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#102C3A]">
            Detected Fraud Indicators
          </h2>

          <div className="divide-y divide-[#F1F5F8] text-sm text-[#182B36]">
            <div className="py-3 first:pt-0">
              Payment request: <span className="font-semibold text-[#DC4B4B]">“নিবন্ধন ফি ৫০০ টাকা”</span>
            </div>
            <div className="py-3">
              Personal wallet: <span className="font-semibold text-[#DC4B4B]">bKash 017XXXXXXXX (personal)</span>
            </div>
            <div className="py-3">
              Job guarantee: <span className="font-semibold text-[#DC4B4B]">“চাকরি নিশ্চিত”</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Middle 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] shadow-xs">
          <p className="text-xs text-[#64748B] font-medium">Organization</p>
          <p className="text-sm font-bold text-[#102C3A] mt-1">
            No match in verified directory
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] shadow-xs">
          <p className="text-xs text-[#64748B] font-medium">Application URL</p>
          <p className="text-sm font-bold text-[#102C3A] mt-1">
            Not on an official domain
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] shadow-xs">
          <p className="text-xs text-[#64748B] font-medium">Reported contacts</p>
          <p className="text-sm font-bold text-[#102C3A] mt-1">
            Number matches 2 prior reports
          </p>
        </div>
      </div>

      {/* 4. Bilingual Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs space-y-2">
          <h3 className="text-xs font-bold text-[#102C3A]">বাংলা ব্যাখ্যা</h3>
          <p className="text-sm text-[#334155] leading-relaxed">
            এই বিজ্ঞপ্তিতে চাকরির জন্য টাকা চাওয়া হয়েছে এবং ব্যক্তিগত বিকাশ নম্বর দেওয়া হয়েছে। টাকা পাঠাবেন না।
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs space-y-2">
          <h3 className="text-xs font-bold text-[#102C3A]">English Explanation</h3>
          <p className="text-sm text-[#334155] leading-relaxed">
            This circular asks for a fee and lists a personal wallet. Do not send money or personal documents.
          </p>
        </div>
      </div>

      {/* 5. Bottom Recommendation & Report Scam CTA */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs sm:text-sm font-semibold text-[#334155]">
          Recommended: do not pay · do not share NID · report this circular
        </p>

        <button
          type="button"
          onClick={() => navigate('/report-scam')}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#991B1B] text-white text-xs sm:text-sm font-semibold hover:bg-[#7F1D1D] transition-colors shadow-xs cursor-pointer text-center"
        >
          Report Scam
        </button>
      </div>
    </div>
  );
};

export default AnalysisResult;
