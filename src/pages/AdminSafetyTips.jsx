import { useState } from 'react';

export const AdminSafetyTips = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const tips = [
    {
      id: 'TIP-01',
      titleBn: 'কখনোই কোনো চাকরির জন্য টাকা বা ফি দেবেন না',
      titleEn: 'Never pay upfront fees for job applications or tests',
      category: 'Payment Fraud',
      status: 'Published',
      reads: '14.2K',
      updatedAt: '20 Feb 2026',
      summary:
        'কোনো স্বনামধন্য প্রতিষ্ঠান কখনো ইন্টারভিউ, ইউনিফর্ম বা মেডিক্যাল টেস্টের জন্য টাকা নেয় না।',
    },
    {
      id: 'TIP-02',
      titleBn: 'অফিসিয়াল ইমেইল ডোমেইন ও ওয়েবসাইট যাচাই করুন',
      titleEn: 'Always verify official corporate email domains',
      category: 'Verification',
      status: 'Published',
      reads: '8.7K',
      updatedAt: '18 Feb 2026',
      summary:
        'বড় ব্যাংকের বিজ্ঞপ্তি অথচ ইমেইল @gmail.com বা @yahoo.com হলে তা শতভাগ ভুয়া ও প্রতারণামূলক।',
    },
    {
      id: 'TIP-03',
      titleBn: 'হোয়াটসঅ্যাপ বা টেলিগ্রাম ভিত্তিক ডাটা এন্ট্রি প্রতারণা',
      titleEn: 'Avoid WhatsApp/Telegram simple typing task traps',
      category: 'Online Scams',
      status: 'Published',
      reads: '6.4K',
      updatedAt: '15 Feb 2026',
      summary:
        'ঘরে বসে সহজে প্রতিদিন ১,০০০ টাকা আয়ের লোভ দেখিয়ে আগে সিকিউরিটি ডিপোজিট নেওয়া হয়।',
    },
    {
      id: 'TIP-04',
      titleBn: 'নকল নিয়োগপত্র ও গেজেট নোটিফিকেশন চেনার উপায়',
      titleEn: 'How to recognize forged appointment letters',
      category: 'Forged Documents',
      status: 'Draft',
      reads: '0',
      updatedAt: '24 Feb 2026',
      summary:
        'সরকারি সিল ও মনোগ্রাম জাল করে প্রস্তুতকৃত চিঠিগুলোর স্মারক নম্বর সংশ্লিষ্ট ওয়েবসাইটে চেক করুন।',
    },
  ];

  const filteredTips =
    activeCategory === 'All'
      ? tips
      : tips.filter((t) => t.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
            Safety Tips & Awareness Moderation
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Create, publish, and manage job scam prevention guides for applicants.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#087F70] text-white text-xs font-semibold hover:bg-[#066559] transition-colors shadow-xs cursor-pointer"
        >
          + Create New Safety Tip
        </button>
      </div>

      {/* 2. Top Metric Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <span className="text-xs font-medium text-[#64748B]">Published Articles</span>
          <div className="text-2xl font-bold text-[#0F172A] mt-2">12</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <span className="text-xs font-medium text-[#D99A28]">Drafts & Review</span>
          <div className="text-2xl font-bold text-[#D99A28] mt-2">3</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <span className="text-xs font-medium text-[#087F70]">Total Awareness Reads</span>
          <div className="text-2xl font-bold text-[#087F70] mt-2">29.3K</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <span className="text-xs font-medium text-[#64748B]">Supported Categories</span>
          <div className="text-2xl font-bold text-[#0F172A] mt-2">6</div>
        </div>
      </div>

      {/* 3. Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['All', 'Payment Fraud', 'Verification', 'Online Scams', 'Forged Documents'].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
              activeCategory === cat
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 4. Safety Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTips.map((tip) => (
          <div
            key={tip.id}
            className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-4 hover:border-[#CBD5E1] transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F1F5F9] text-[#475569]">
                {tip.category}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  tip.status === 'Published'
                    ? 'bg-[#ECFDF5] text-[#087F70]'
                    : 'bg-[#FFFBEB] text-[#D99A28]'
                }`}
              >
                {tip.status}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">{tip.titleBn}</h3>
              <p className="text-xs text-[#64748B] mt-0.5">{tip.titleEn}</p>
            </div>

            <p className="text-xs text-[#475569] leading-relaxed bg-[#F8FAFC] p-3 rounded-xl border border-[#F1F5F8]">
              {tip.summary}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F8] text-xs text-[#64748B]">
              <span>Reads: {tip.reads} • Updated: {tip.updatedAt}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-3 py-1 rounded-lg border border-[#CBD5E1] text-[#0F172A] hover:bg-[#F1F5F9] font-medium transition-colors cursor-pointer"
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="px-3 py-1 rounded-lg text-[#DC2626] hover:bg-[#FEF2F2] font-medium transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSafetyTips;
