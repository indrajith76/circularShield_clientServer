import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AnalyzeCircular = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('PDF');
  const [extractedText, setExtractedText] = useState(
    'নিয়োগ বিজ্ঞপ্তি: অফিস সহকারী পদে ১০ জন। চাকরি নিশ্চিত। নিবন্ধন ফি ৫০০ টাকা, bKash 017XXXXXXXX (personal)।'
  );

  const tabs = ['PDF', 'Image', 'Paste Text', 'URL'];

  const handleAnalyze = () => {
    navigate('/analysis-result');
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#102C3A] tracking-tight">
          Analyze a Job Circular
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          Upload a PDF or image, paste text, or enter a link.
        </p>
      </div>

      {/* 2. Format Selector Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === tab
                ? 'bg-[#102C3A] text-white shadow-xs'
                : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#102C3A] hover:bg-[#F8FAFC]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. Two Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card: File Preview / Dropzone */}
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
          <h2 className="text-sm font-bold text-[#102C3A] mb-4">File Preview</h2>

          <div className="border-2 border-dashed border-[#CBD5E1] rounded-2xl min-h-[320px] flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:border-[#087F70] hover:bg-[#F8FAFC] transition-colors">
            <svg
              className="w-10 h-10 text-[#94A3B8] mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-sm font-semibold text-[#102C3A]">
              Drop a {activeTab} here
            </p>
            <p className="text-xs text-[#94A3B8] mt-1">
              or click to browse · max 10 MB
            </p>
          </div>
        </div>

        {/* Right Card: Extracted Text & Trigger */}
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <h2 className="text-sm font-bold text-[#102C3A] mb-3">
              Extracted Text (editable)
            </h2>
            <textarea
              rows={10}
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              className="w-full p-4 rounded-xl border border-[#E2E8F0] bg-[#FAFCFD] text-sm text-[#182B36] font-normal leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#087F70]/20 focus:border-[#087F70] resize-none"
            />
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-[#64748B]">Status:</span>
              <span className="px-2.5 py-0.5 rounded-full font-semibold bg-[#ECFDF5] text-[#16A36A]">
                OCR complete
              </span>
              <span className="px-2.5 py-0.5 rounded-full font-semibold bg-[#FFFBEB] text-[#D99A28]">
                Checking rules…
              </span>
            </div>

            <button
              type="button"
              onClick={handleAnalyze}
              className="w-full py-3 px-4 rounded-xl bg-[#087F70] text-white font-semibold text-sm hover:bg-[#066559] transition-colors shadow-xs cursor-pointer text-center"
            >
              Analyze Circular
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyzeCircular;
