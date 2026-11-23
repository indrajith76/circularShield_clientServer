export const SafetyTips = () => {
  const tips = [
    {
      title: 'Job scam awareness',
      bengali: 'চাকরির জন্য টাকা চাইলে সাবধান।',
      english: 'Real employers do not charge application fees.',
    },
    {
      title: 'Safe application guidelines',
      bengali: 'অফিসিয়াল ওয়েবসাইটে আবেদন করুন।',
      english: 'Apply only through the official career page.',
    },
    {
      title: 'Spot a fake circular',
      bengali: 'নাম, ঠিকানা ও ডোমেইন মিলিয়ে দেখুন।',
      english: 'Check the name, address and domain.',
    },
    {
      title: 'Payment scam warning',
      bengali: 'ব্যক্তিগত বিকাশ নম্বরে টাকা পাঠাবেন না।',
      english: 'Never pay to a personal wallet.',
    },
    {
      title: 'Website verification',
      bengali: 'লিংক শর্ট করা বা অচেনা কি না দেখুন।',
      english: 'Be wary of shortened or unfamiliar links.',
    },
    {
      title: 'Common fraud examples',
      bengali: 'চাকরি নিশ্চিত — এমন প্রতিশ্রুতি এড়িয়ে চলুন।',
      english: 'Avoid guaranteed-job promises.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#102C3A] tracking-tight">
          Safety & Awareness
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          নিরাপদ চাকরি আবেদনের গাইড · Bangla + English
        </p>
      </div>

      {/* 2. Grid of 6 Awareness Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tips.map((tip, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs flex flex-col justify-between min-h-[170px] space-y-4 hover:shadow-md transition-shadow"
          >
            <div>
              <h2 className="text-sm font-bold text-[#102C3A] mb-3">
                {tip.title}
              </h2>
              <p className="text-sm font-semibold text-[#182B36] leading-snug">
                {tip.bengali}
              </p>
            </div>

            <p className="text-xs text-[#64748B] leading-relaxed pt-2 border-t border-[#F8FAFC]">
              {tip.english}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SafetyTips;
