/**
 * CircularShield Safety & Awareness Articles Dataset
 * Bilingual educational resources covering job scam prevention,
 * verification strategies, payment fraud warnings, and case studies.
 */

export const SAFETY_CATEGORIES = [
  { id: 'all', en: 'All Categories', bn: 'সকল ক্যাটাগরি' },
  { id: 'job-scam-awareness', en: 'Job Scam Awareness', bn: 'চাকরির প্রতারণা সচেতনতা' },
  { id: 'safe-guidelines', en: 'Safe Job Application Guidelines', bn: 'নিরাপদ চাকরির আবেদনের নির্দেশিকা' },
  { id: 'identify-fake-circulars', en: 'How to Identify Fake Job Circulars', bn: 'ভুয়া চাকরির বিজ্ঞপ্তি চেনার উপায়' },
  { id: 'payment-scam-warning', en: 'Payment Scam Warning', bn: 'অর্থ লেনদেন সংক্রান্ত প্রতারণার সতর্কতা' },
  { id: 'website-verification', en: 'Website Verification Tips', bn: 'ওয়েবসাইট ও ডোমেন যাচাইয়ের কৌশল' },
  { id: 'recruitment-fraud-examples', en: 'Common Recruitment Fraud Examples', bn: 'নিয়োগ প্রতারণার বাস্তব উদাহরণ ও বিশ্লেষণ' },
];

export const SAFETY_ARTICLES = [
  {
    id: 'job-scam-awareness-guide',
    categoryId: 'job-scam-awareness',
    categoryName: {
      en: 'Job Scam Awareness',
      bn: 'চাকরির প্রতারণা সচেতনতা',
    },
    readingTime: {
      en: '4 min read',
      bn: '৪ মিনিট পঠন',
    },
    date: '2026-11-20',
    iconName: 'ShieldAlert',
    accentColor: '#DC4B4B',
    en: {
      title: 'The Anatomy of Modern Employment Scams in Bangladesh',
      shortDescription:
        'Understand the psychology, syndicates, and digital vectors scammers deploy to deceive university graduates and vulnerable job seekers.',
      keyTakeaways: [
        'Scammers exploit emotional urgency and desperation through viral Facebook posts and Telegram groups.',
        'No legitimate private or public employer requests payment prior to joining.',
        'High salaries for minimal daily effort are mathematically impossible lures.',
      ],
      sections: [
        {
          heading: '1. The Surge of Digital Recruitment Syndicates',
          body: `Over the past three years, recruitment fraud in Bangladesh has transitioned from physical office visits to organized cyber syndicates. Fraudsters deploy sponsored social media reels, bulk SMS blasts, and impersonated Facebook groups to target recent graduates.

These campaigns mimic the logos of prominent ministries, commercial banks, and top IT firms. The initial lure is often disguised as a casual recruitment opportunity with flexible hours and above-market compensation.`,
        },
        {
          heading: '2. Psychological Manipulation Tactics',
          body: `Syndicates rely on high-pressure psychological triggers:
- Artificial Scarcity: Claiming only 5 vacancies remain for your district.
- Guaranteed Selection: Falsely assuring candidates that interview success is 100% guaranteed.
- Small Initial Commitments: Asking for nominal registration fees (e.g., BDT 300 to 500) before escalating to larger demands.`,
        },
        {
          heading: '3. How to Shield Yourself',
          body: `Always cross-reference job openings on official corporate career pages. Never accept an offer letter without verifying the employer's physical headquarters and registered trade license.`,
        },
      ],
    },
    bn: {
      title: 'বাংলাদেশে আধুনিক চাকরির প্রতারণার ধরন ও নেপথ্যের কৌশল',
      shortDescription:
        'কীভাবে সাইবার প্রতারক চক্র ভুয়া বিজ্ঞপ্তি, ফেসবুক পোস্ট ও টেলিগ্রামের মাধ্যমে চাকরিপ্রার্থীদের ফাঁদে ফেলে তা বিস্তারিত জানুন।',
      keyTakeaways: [
        'প্রতারকরা চাকরিপ্রার্থীদের মানসিক দুর্বলতা ও জরুরি চাকরির প্রয়োজনীয়তাকে পুঁজি করে।',
        'কোনো বৈধ সরকারি বা বেসরকারি প্রতিষ্ঠান চাকরির আবেদনের জন্য ব্যক্তিগত নম্বরে টাকা নেয় না।',
        'অল্প পরিশ্রমে অস্বাভাবিক বেশি বেতনের প্রস্তাব সবসময়ই প্রতারণার লক্ষণ।',
      ],
      sections: [
        {
          heading: '১. ডিজিটাল নিয়োগ প্রতারক চক্রের বিস্তার',
          body: `সাম্প্রতিক বছরগুলোতে বাংলাদেশে চাকরির প্রতারণা নতুন রূপ নিয়েছে। ফেসবুক গ্রুপ, হোয়াটসঅ্যাপ এবং টেলিগ্রাম চ্যানেলের মাধ্যমে বিভিন্ন ভুয়া চাকরির বিজ্ঞাপন প্রচার করা হচ্ছে। প্রতিষ্ঠিত ব্যাংক, বহুজাতিক প্রতিষ্ঠান ও সরকারি বিভিন্ন দপ্তরের নাম ও লোগো নকল করে এই চক্রগুলো সক্রিয় থাকে।

বিজ্ঞপ্তিতে সাধারণত খুব সহজ কাজ, ঘরে বসে আয়ের সুযোগ অথবা দ্রুত সরকারি চাকরির প্রলোভন দেখানো হয়।`,
        },
        {
          heading: '২. প্রতারকদের মনস্তাত্ত্বিক ফাঁদ',
          body: `প্রতারক চক্র সাধারণত যে কৌশলগুলো ব্যবহার করে:
- কৃত্রিম তাগিদ তৈরি: "মাত্র ৩টি পদ খালি আছে, আজই আবেদন করুন"।
- শতভাগ চাকরির নিশ্চয়তা: কোনো পরীক্ষা বা যাচাই ছাড়াই নিয়োগপত্র দেওয়ার প্রতিশ্রুতি।
- ধাপে ধাপে টাকা দাবি: প্রথমে আবেদন ফি বা অ্যাডমিট কার্ডের নামে ৩০০-৫০০ টাকা এবং পরবর্তীতে মেডিকেল বা জামানতের নামে মোটা অঙ্কের টাকা হাতিয়ে নেওয়া।`,
        },
        {
          heading: '৩. নিজেকে সুরক্ষিত রাখার উপায়',
          body: `যেকোনো বিজ্ঞপ্তিতে আবেদনের আগে প্রতিষ্ঠানের মূল অফিসিয়াল ওয়েবসাইটের ক্যারিয়ার সেকশন যাচাই করুন। কোম্পানির অনুমোদিত ইমেইল ও টেলিফোন নম্বরে যোগাযোগ করে নিশ্চিত হন।`,
        },
      ],
    },
  },
  {
    id: 'safe-job-application-guidelines',
    categoryId: 'safe-guidelines',
    categoryName: {
      en: 'Safe Job Application Guidelines',
      bn: 'নিরাপদ চাকরির আবেদনের নির্দেশিকা',
    },
    readingTime: {
      en: '5 min read',
      bn: '৫ মিনিট পঠন',
    },
    date: '2026-11-18',
    iconName: 'ShieldCheck',
    accentColor: '#16A36A',
    en: {
      title: 'The 7 Golden Rules of Applying for Jobs Online Safely',
      shortDescription:
        'Essential hygiene principles every job candidate must practice before submitting resumes, sensitive IDs, or personal documents.',
      keyTakeaways: [
        'Protect personal data: Redact National ID numbers on early-stage job applications.',
        'Verify communication channels: Reject non-corporate email domains like @gmail.com or @yahoo.com.',
        'Insist on verifiable interview locations or encrypted corporate video calls.',
      ],
      sections: [
        {
          heading: 'Rule 1: Never Submit Sensitive Identity Documents Prematurely',
          body: `Legitimate recruiters only need your resume and summary of qualifications during initial screening. Never upload front-and-back National ID cards, birth certificates, or banking credentials until a formal written job offer has been issued and verified.`,
        },
        {
          heading: 'Rule 2: Scrutinize the Recruiter’s Email Address',
          body: `Authentic corporate HR staff communicate through domain-specific emails (e.g., hr@brainstation-23.com or recruitment@ebl-bd.com). Free email providers like @gmail.com, @outlook.com, or @yahoo.com are a massive red flag when representing established institutions.`,
        },
        {
          heading: 'Rule 3: Conduct Physical Location Verification',
          body: `Look up the claimed physical office address on Google Maps, the local Trade Registry, or telecom directories. If the company claims a Dhaka office but only operates out of temporary shared coworking spaces or refuses physical walk-ins, proceed with extreme caution.`,
        },
        {
          heading: 'Rule 4: Review Application Links with CircularShield',
          body: `Before clicking external application URLs received via SMS or WhatsApp, submit the link or text to CircularShield’s analyzer to check for phishing indicators, malicious redirection, and domain age.`,
        },
      ],
    },
    bn: {
      title: 'অনলাইনে নিরাপদে চাকরির আবেদনের ৭টি সুবর্ণ নিয়ম',
      shortDescription:
        'সিভি, জাতীয় পরিচয়পত্র বা ব্যক্তিগত তথ্য সাবমিট করার আগে প্রতিটি চাকরিপ্রার্থীর যেসব নিরাপত্তা নির্দেশনা মেনে চলা জরুরি।',
      keyTakeaways: [
        'প্রাথমিক আবেদনের সময় জাতীয় পরিচয়পত্রের গোপন নম্বর বা কপি শেয়ার করবেন না।',
        'ফ্রি জিমেইল বা ইয়াহু ইমেইল থেকে পাঠানো নিয়োগ বিজ্ঞপ্তি পরিহার করুন।',
        'অফিসিয়াল কর্পোরেট ক্যারিয়ার পোর্টাল ছাড়া ব্যক্তিগত চ্যাটে আবেদন করবেন না।',
      ],
      sections: [
        {
          heading: 'নিয়ম ১: প্রাথমিক পর্যায়ে গোপনীয় পরিচয়পত্র জমা দেবেন না',
          body: `কোনো প্রতিষ্ঠানের প্রাথমিক বাছাইয়ের জন্য কেবল একটি সংক্ষিপ্ত সিভি ও শিক্ষাগত যোগ্যতার বিবরণই যথেষ্ট। চাকরির চূড়ান্ত চুক্তি ও অফার লেটার পাওয়ার আগে জাতীয় পরিচয়পত্রের স্পষ্ট কপি, জন্ম নিবন্ধন বা ব্যাংক হিসাব নম্বর দেওয়া থেকে বিরত থাকুন।`,
        },
        {
          heading: 'নিয়ম ২: নিয়োগদাতার ইমেইল ডোমেন পরীক্ষা করুন',
          body: `প্রতিটি নিবন্ধিত প্রতিষ্ঠান তাদের নিজস্ব প্রাতিষ্ঠানিক ডোমেন ইমেইল (যেমন: career@company.com) ব্যবহার করে। কোনো বড় প্রতিষ্ঠান কখনোই ব্যক্তিগত @gmail.com বা @yahoo.com থেকে চাকরির নিয়োগপত্র পাঠায় না।`,
        },
        {
          heading: 'নিয়ম ৩: অফিসের বাস্তব ঠিকানা ও ট্রেড লাইসেন্স যাচাই করুন',
          body: `বিজ্ঞপ্তিতে উল্লেখিত অফিসের ঠিকানা গুগল ম্যাপস বা সংশ্লিষ্ট সিটি কর্পোরেশন/পৌরসভার ট্রেড লাইসেন্স ডাটাবেজে মিলিয়ে দেখুন। ঠিকানা অস্পষ্ট হলে বা সরাসরি সাক্ষাৎকার নিতে অস্বীকৃতি জানালে তা ভুয়া হতে পারে।`,
        },
        {
          heading: 'নিয়ম ৪: সার্কুলারশিল্ডের মাধ্যমে লিংক স্ক্যান করুন',
          body: `এসএমএস বা মেসেঞ্জারে প্রাপ্ত কোনো সন্দেহজনক লিংকে ক্লিক করার আগে সার্কুলারশিল্ডের অ্যানালাইজারে লিংকটি প্রবেশ করিয়ে ডোমেনের সত্যতা ও সাইবার ঝুঁকি যাচাই করে নিন।`,
        },
      ],
    },
  },
  {
    id: 'how-to-identify-fake-job-circulars',
    categoryId: 'identify-fake-circulars',
    categoryName: {
      en: 'How to Identify Fake Job Circulars',
      bn: 'ভুয়া চাকরির বিজ্ঞপ্তি চেনার উপায়',
    },
    readingTime: {
      en: '6 min read',
      bn: '৬ মিনিট পঠন',
    },
    date: '2026-11-15',
    iconName: 'FileSearch',
    accentColor: '#D99A28',
    en: {
      title: '10 Telltale Red Flags in Fraudulent Job Notices & Circulars',
      shortDescription:
        'Learn the visual and textual hallmarks that expose scam recruitment notices, from distorted seals to unrealistic compensation packages.',
      keyTakeaways: [
        'Distorted, low-resolution government emblems or company logos.',
        'Excessive grammatical errors, inconsistent font sizing, and informal vocabulary.',
        'Urgent deadlines (24-48 hours) designed to rush candidate judgment.',
      ],
      sections: [
        {
          heading: '1. Graphical Anomalies & Blurred Crests',
          body: `Scammers routinely copy logos from Google Images and paste them onto generic Word templates. Look for pixelation, inconsistent color hues, and watermarks that overlap text unprofessionally.`,
        },
        {
          heading: '2. Artificial Urgency & Immediate Joining',
          body: `Fake circulars frequently claim: "Walk-in interview tomorrow morning, only 50 applicants will be admitted." Legitimate institutional recruitment follows structured multi-week evaluation protocols.`,
        },
        {
          heading: '3. Disproportionate Salaries for Entry Roles',
          body: `Promising BDT 45,000 to 60,000 for an entry-level clerk or data collector with zero experience is an immediate red flag. Compare compensation with Bangladesh National Pay Scales or BASIS/DCCI industry benchmarks.`,
        },
        {
          heading: '4. Demands for Admit Card or Registration Fees',
          body: `The absolute definitive red flag: instructions directing applicants to send money through bKash, Nagad, or Rocket personal numbers to confirm interview admittance.`,
        },
      ],
    },
    bn: {
      title: 'ভুয়া চাকরির বিজ্ঞপ্তি চেনার ১০টি প্রধান লক্ষণ',
      shortDescription:
        'বিজ্ঞপ্তির ভাষা, লোগোর স্বচ্ছতা এবং অস্বাভাবিক বেতন দেখে কীভাবে নিমিষেই প্রতারণামূলক নোটিশ চিহ্নিত করবেন।',
      keyTakeaways: [
        'লোগো বা সরকারি মনোগ্রামের নিম্ন রেজোলিউশন ও অস্পষ্টতা।',
        'বানান ও ব্যাকরণগত অসঙ্গতি এবং অমার্জিত ভাষার ব্যবহার।',
        'অস্বাভাবিক স্বল্প সময়ের ডেডলাইন (২৪-৪৮ ঘণ্টা) যাতে যাচাইয়ের সুযোগ না মেলে।',
      ],
      sections: [
        {
          heading: '১. অস্পষ্ট লোগো ও নকল সিলমোহর',
          body: `ভুয়া বিজ্ঞপ্তিতে ইন্টারনেটের পুরনো ছবি কেটে বসানো হয়, যার ফলে লোগো ফেটে যায় বা ঝাপসা দেখায়। আসল বিজ্ঞপ্তিতে মনোগ্রাম এবং ফন্ট অত্যন্ত পরিষ্কার ও প্রফেশনাল থাকে।`,
        },
        {
          heading: '২. অযৌক্তিক তাড়াহুড়ো ও তাৎক্ষণিক যোগদানের চাপ',
          body: `বিজ্ঞপ্তিতে যদি লেখা থাকে "আগামীকালই সরাসরি ইন্টারভিউ" বা "আগে আসলে আগে পাবেন ভিত্তিতে নিয়োগ", তবে সতর্ক হোন। সরকারি ও স্বনামধন্য প্রতিষ্ঠানগুলো সুনির্দিষ্ট নিয়মে একাধিক সপ্তাহ ধরে আবেদন গ্রহণ করে।`,
        },
        {
          heading: '৩. কাজের তুলনায় মাত্রাতিরিক্ত বেতন ঘোষণা',
          body: `কোনো অভিজ্ঞতা ছাড়া সাধারণ অফিস সহকারী বা ডাটা এন্ট্রি পদে ৫০,০০০ থেকে ৮০,০০০ টাকা বেতনের প্রতিশ্রুতি দেওয়া হলে তা নিশ্চিতভাবেই প্রতারণামূলক।`,
        },
        {
          heading: '৪. বিকাশ বা নগদে ফি পরিশোধের শর্ত',
          body: `বিজ্ঞপ্তির নিচে কোনো ব্যক্তিগত মোবাইল নম্বরে আবেদন ফি, ফর্ম ফি বা প্রবেশপত্র ফি পাঠানোর নির্দেশনা থাকলে সেটি তাৎক্ষণিকভাবে এড়িয়ে চলুন।`,
        },
      ],
    },
  },
  {
    id: 'payment-scam-warning',
    categoryId: 'payment-scam-warning',
    categoryName: {
      en: 'Payment Scam Warning',
      bn: 'অর্থ লেনদেন সংক্রান্ত সতর্কতা',
    },
    readingTime: {
      en: '5 min read',
      bn: '৫ মিনিট পঠন',
    },
    date: '2026-11-22',
    iconName: 'CreditCard',
    accentColor: '#DC4B4B',
    en: {
      title: 'bKash & Nagad Application Fee Traps: Why Real Employers Never Ask for Money',
      shortDescription:
        'A comprehensive guide on mobile financial fraud in recruitment, fake admit card charges, and what to do if you encounter a payment demand.',
      keyTakeaways: [
        'Never transfer funds via personal bKash, Nagad, or Rocket numbers for job screening.',
        'Government application fees are deposited strictly via official treasury challans or Teletalk portals.',
        'Refundable security deposits for work supplies or software are 100% fraudulent.',
      ],
      sections: [
        {
          heading: 'The "Admit Card Fee" Scam Model',
          body: `In this widespread scheme, victims submit an application and receive a fast congratulatory SMS stating: "You are shortlisted! Send BDT 450 via bKash to 017XXXXXXXX to confirm your admit card code." Once the payment is completed, the number is permanently switched off.`,
        },
        {
          heading: 'The "Refundable Equipment / Software Deposit"',
          body: `Common in remote data entry and typing jobs. Scammers claim candidates must deposit BDT 1,000 to 3,000 to activate proprietary software or receive project files, promising full reimbursement with the first paycheck. The software is non-existent, and the victim is blocked.`,
        },
        {
          heading: 'Official Government Fee Standards',
          body: `Government ministries in Bangladesh collect application fees exclusively through official Teletalk SMS billing gateways or Bangladesh Bank treasury challans. No government official or recruitment committee ever uses a personal bKash wallet.`,
        },
        {
          heading: 'Action Plan If You Sent Money',
          body: `1. Immediately file an incident report on CircularShield to warn fellow job seekers.
2. Dial 999 to alert the National Emergency Police hotline.
3. Call bKash (16247) or Nagad (16167) fraud helplines to request transaction flagging.
4. Report the mobile number to the CID Cyber Police Centre (01730336107).`,
        },
      ],
    },
    bn: {
      title: 'বিকাশ ও নগদ আবেদন ফি ফাঁদ: আসল নিয়োগকারী কেন টাকা চান না',
      shortDescription:
        'চাকরির নামে মোবাইল ব্যাংকিং প্রতারণা, ভুয়া অ্যাডমিট কার্ড ফি এবং টাকা দাবি করা হলে করণীয় সম্পর্কে জরুরি সতর্কতা।',
      keyTakeaways: [
        'চাকরির কোনো ধাপে ব্যক্তিগত বিকাশ, নগদ বা রকেট নম্বরে টাকা পাঠাবেন না।',
        'সরকারি চাকরির ফি কেবল ট্রেজারি চালান বা টেলিটক অফিসিয়াল গেটওয়ের মাধ্যমে জমা হয়।',
        'সফটওয়্যার লাইসেন্স বা সিকিউরিটি ডিপোজিটের নামে নেওয়া টাকা সম্পূর্ণ ভুয়া।',
      ],
      sections: [
        {
          heading: 'অ্যাডমিট কার্ড ও রেজিস্ট্রেশন ফির নামে প্রতারণা',
          body: `চাকরিপ্রার্থী আবেদন করার পর মোবাইলে এসএমএস পাঠানো হয়: "অভিনন্দন! আপনি প্রাথমিকভাবে নির্বাচিত হয়েছেন। প্রবেশপত্র কনফার্ম করতে ৪৫০ টাকা বিকাশ করুন।" টাকা পাঠানোর সাথে সাথেই প্রতারক সিমটি বন্ধ করে দেয়।`,
        },
        {
          heading: 'ফেরতযোগ্য জামানত বা সফটওয়্যার ফির ফাঁদ',
          body: `অনলাইন টাইপিং বা ক্যাপচা এন্ট্রির বিজ্ঞাপনে বলা হয় সফটওয়্যার আইডি অ্যাক্টিভেশন বাবদ ১,৫০০ টাকা জামানত দিতে হবে, যা প্রথম বেতনের সাথে ফেরত দেওয়া হবে। এটি পুরোপুরি একটি প্রতারণামূলক স্কিম।`,
        },
        {
          heading: 'সরকারি চাকরির ফি জমা দেওয়ার আসল নিয়ম',
          body: `বাংলাদেশ সরকারের যেকোনো দপ্তরের নিয়োগ ফি কেবলমাত্র টেলিটক প্রি-পেইড সিমের মাধ্যমে এসএমএস করে অথবা সরকারি ট্রেজারি চালানের মাধ্যমে বাংলাদেশ ব্যাংকে জমা হয়। ব্যক্তিগত কোনো মোবাইল ব্যাংকিং নম্বরে নয়।`,
        },
        {
          heading: 'টাকা পাঠিয়ে ফেললে আপনার করণীয়',
          body: `১. দ্রুত সার্কুলারশিল্ডে রিপোর্ট করে অন্যান্য প্রার্থীদের সতর্ক করুন।
২. জাতীয় জরুরি সেবা ৯৯৯-এ ফোন দিয়ে পুলিশের সহায়তা নিন।
৩. সংশ্লিষ্ট বিকাশ (১৬২৪৭) বা নগদ (১৬১৬৭) হেল্পলাইনে ফোন করে ট্রানজেকশন আইডি দিয়ে অ্যাকাউন্ট রিপোর্ট করুন।
৪. সিআইডি সাইবার পুলিশ সেন্টারে (০১৭৩০৩৩৬১০৭) লিখিত অভিযোগ জানান।`,
        },
      ],
    },
  },
  {
    id: 'website-verification-tips',
    categoryId: 'website-verification',
    categoryName: {
      en: 'Website Verification Tips',
      bn: 'ওয়েবসাইট ও ডোমেন যাচাইয়ের কৌশল',
    },
    readingTime: {
      en: '5 min read',
      bn: '৫ মিনিট পঠন',
    },
    date: '2026-11-12',
    iconName: 'Globe',
    accentColor: '#087F70',
    en: {
      title: 'Spotting Spoofed Career Portals and Phishing Domains',
      shortDescription:
        'How recruitment cyber syndicates build lookalike websites and how you can verify SSL certificates, WHOIS registration, and domain structures.',
      keyTakeaways: [
        'Government websites in Bangladesh exclusively terminate in ".gov.bd".',
        'Beware of deceptive suffixes such as ".online", ".xyz", or hyphenated domain names.',
        'Inspect WHOIS registration age: newly created domains under 6 months are high-risk.',
      ],
      sections: [
        {
          heading: '1. The ".gov.bd" Rule for Public Institutions',
          body: `Every legitimate Bangladeshi ministry, directorate, and autonomous authority operates under the national domain suffix: ".gov.bd". Phishing syndicates register alternative domains such as "gov-recruitment-bd.net" or "directorate-health-bd.org". If it does not end in .gov.bd, it is an imitation.`,
        },
        {
          heading: '2. Look for Domain Typosquatting',
          body: `Syndicates replace characters in famous corporate names (e.g., using "eb1-bank.com" instead of "ebl.com.bd", or "brainstati0n.net" instead of "brainstation-23.com"). Always type the official company domain manually into your address bar.`,
        },
        {
          heading: '3. Check SSL Certificates and WHOIS Age',
          body: `Click the padlock icon next to the URL in your browser. Verify who the certificate was issued to. Using public WHOIS lookup tools, inspect when the domain was registered. If an established 30-year-old conglomerate's career website was registered only two weeks ago, it is a phishing clone.`,
        },
      ],
    },
    bn: {
      title: 'নকল ক্যারিয়ার পোর্টাল ও ফিশিং ওয়েবসাইট চেনার কৌশল',
      shortDescription:
        'প্রতারকরা কীভাবে নামকরা প্রতিষ্ঠানের নকল ওয়েবসাইট তৈরি করে এবং এসএসএল, ডোমেন নেম ও হুইজ দিয়ে তা যাচাই করার সহজ উপায়।',
      keyTakeaways: [
        'বাংলাদেশের সকল সরকারি ওয়েবসাইটের ঠিকানার শেষে বাধ্যতামূলকভাবে ".gov.bd" থাকে।',
        '".xyz", ".online", ".site" বা হাইফেনযুক্ত সন্দেহজনক ডোমেন এড়িয়ে চলুন।',
        'ডোমেন তৈরির তারিখ পরীক্ষা করুন: ১-২ মাস আগে তৈরি সাইট ভুয়া হওয়ার সম্ভাবনা বেশি।',
      ],
      sections: [
        {
          heading: '১. সরকারি ওয়েবসাইটের ".gov.bd" নিয়ম',
          body: `বাংলাদেশ সরকারের সকল মন্ত্রণালয়, অধিদপ্তর ও সরকারি প্রতিষ্ঠানের ওয়েবসাইটের ঠিকানা অবশ্যই ".gov.bd" দিয়ে শেষ হবে। প্রতারকরা "gov-recruitment-bd.net" বা "bangladesh-healthgov.com"-এর মতো ভুয়া ডোমেন খুলে সরকারি পরিচয় দেয়।`,
        },
        {
          heading: '২. বানানের সূক্ষ্ম পরিবর্তন (Typosquatting)',
          body: `সুপরিচিত প্রতিষ্ঠানের নামের সাথে মিল রেখে একটি অক্ষর বদলে ডোমেন কেনা হয় (যেমন: "ebl.com.bd"-এর পরিবর্তে "ebl-jobs.com")। তাই ব্রাউজারের অ্যাড্রেসবারে ইউআরএলটি সতর্কতার সাথে পড়ুন।`,
        },
        {
          heading: '৩. এসএসএল ও ডোমেন রেজিস্ট্রেশন বয়স যাচাই',
          body: `ওয়েবসাইটের নামের বামে প্যাডলক (তালা) আইকনে ক্লিক করে সিকিউরিটি সার্টিফিকেট দেখুন। অনলাইনে ফ্রি WHOIS টুলের মাধ্যমে দেখুন ওয়েবসাইটটি কবে কেনা হয়েছে। যদি কয়েকদিন আগের ডোমেন হয়, তবে তা ফিশিং ফাঁদ।`,
        },
      ],
    },
  },
  {
    id: 'common-recruitment-fraud-examples',
    categoryId: 'recruitment-fraud-examples',
    categoryName: {
      en: 'Common Recruitment Fraud Examples',
      bn: 'নিয়োগ প্রতারণার বাস্তব উদাহরণ',
    },
    readingTime: {
      en: '6 min read',
      bn: '৬ মিনিট পঠন',
    },
    date: '2026-11-21',
    iconName: 'AlertOctagon',
    accentColor: '#DC4B4B',
    en: {
      title: 'Field Case Studies: Anatomy of Telegram Task Rings and Fake Ministry Notices',
      shortDescription:
        'Real-world case files analyzed by CircularShield intelligence: examining how cyber rings operate, extract payments, and evade detection.',
      keyTakeaways: [
        'Case Study 1: The YouTube/TikTok review commission Ponzi trap on Telegram.',
        'Case Study 2: The 450-vacancy health supervisor rural community scam.',
        'Case Study 3: The airport ground staff visa and overseas placement syndicate.',
      ],
      sections: [
        {
          heading: 'Case Study 1: The Telegram "E-Commerce Task" Syndicate',
          body: `Modus Operandi: Candidates receive WhatsApp messages offering BDT 2,500 daily for "rating hotel rooms or liking YouTube videos". They are guided into a Telegram group with 30,000 members (mostly fake bot accounts sharing forged payment screenshots).

The Hook: The candidate completes 3 tasks and receives an initial real BDT 500 payout via bKash to build trust.
The Trap: They are invited to join "VIP Tier 2" by depositing BDT 5,000 to earn BDT 8,000. Once the candidate sends BDT 5,000 or escalates to BDT 25,000, the administrator locks the chat and expels them.`,
        },
        {
          heading: 'Case Study 2: The Fake Rural Health Project Circular',
          body: `Modus Operandi: A circulating PDF claiming 450 "Assistant Project Officers" for community health across all 64 districts with BDT 42,500 salary.
The Hook: Stolen official emblems and signatures of real government joint secretaries.
The Trap: Candidates were instructed to send BDT 450 via bKash personal wallets to generate their exam roll number. Over 2,000 rural youth lost an estimated BDT 900,000 within a single weekend before the hotline went offline.`,
        },
        {
          heading: 'Key Lessons Learned',
          body: `Never rely on social media comments or group testimonials as proof of legitimacy. Always verify via CircularShield's Verified Organizations directory or official government gazettes.`,
        },
      ],
    },
    bn: {
      title: 'বাস্তব কেস স্টাডি: টেলিগ্রাম টাস্ক রিং ও ভুয়া মন্ত্রণালয় নিয়োগ বিশ্লেষণ',
      shortDescription:
        'সার্কুলারশিল্ড টিমের হাতে আসা তিনটি বাস্তব প্রতারণা ঘটনার বিস্তারিত বিশ্লেষণ এবং কীভাবে হাজারো চাকরিপ্রার্থী প্রতারিত হয়েছেন।',
      keyTakeaways: [
        'কেস স্টাডি ১: টেলিগ্রামের মাধ্যমে ইউটিউব ভিডিও লাইক ও পণ্য রিভিউ ফাঁদ।',
        'কেস স্টাডি ২: ৬৪ জেলায় স্বাস্থ্য প্রকল্প কর্মকর্তার ভুয়া সার্কুলার।',
        'কেস স্টাডি ৩: বিমানবন্দরে গ্রাউন্ড স্টাফ পদে ভুয়া চাকরির সিন্ডিকেট।',
      ],
      sections: [
        {
          heading: 'কেস স্টাডি ১: টেলিগ্রাম ই-কমার্স টাস্ক পনজি স্কিম',
          body: `কৌশল: প্রার্থীর হোয়াটসঅ্যাপে মেসেজ আসে—ঘরে বসে ইউটিউবে লাইক দিয়ে দৈনিক ২,০০০ থেকে ৩,০০০ টাকা আয় করুন। এরপর টেলিগ্রাম গ্রুপে নিয়ে যাওয়া হয় যেখানে ভুয়া বটের মাধ্যমে বিকাশে টাকা পাওয়ার ভুয়া স্ক্রিনশট শেয়ার করা হয়।

টোপ: শুরুতে প্রার্থীকে ৩টি কাজের বিপরীতে ৫০০ টাকা দিয়ে বিশ্বাস অর্জন করানো হয়।
ফাঁদ: এরপর বলা হয় "ভিআইপি টাস্ক"-এর জন্য ৫,০০০ টাকা ডিপোজিট করতে হবে যা ৮,০০০ টাকা হয়ে ফেরত আসবে। প্রার্থী টাকা পাঠানো মাত্রই তাকে গ্রুপ থেকে ব্লক করে দেওয়া হয়।`,
        },
        {
          heading: 'কেস স্টাডি ২: পল্লী স্বাস্থ্য প্রকল্প কর্মকর্তা প্রতারণা',
          body: `কৌশল: ৬৪ জেলায় কমিউনিটি স্বাস্থ্য প্রকল্পের জন্য ৪৫০ জন "সহকারী প্রকল্প কর্মকর্তা" নিয়োগের ভুয়া সার্কুলার ফেসবুকে ভাইরাল করা হয়।
টোপ: সরকারি সিল ও ঊর্ধ্বতন কর্মকর্তার নকল স্বাক্ষর সম্বলিত পিডিএফ তৈরি করা হয়।
ফাঁদ: প্রবেশপত্র ফি বাবদ প্রতিটি প্রার্থীর কাছে ৪৫০ টাকা চাওয়া হয়। এক সপ্তাহান্তে প্রায় ২,০০০ প্রার্থীর কাছ থেকে ৯ লক্ষ টাকা হাতিয়ে নিয়ে সিম বন্ধ করে দেয় চক্রটি।`,
        },
        {
          heading: 'শিক্ষণীয় বার্তা',
          body: `ফেসবুকের কমেন্ট বা টেলিগ্রামের স্ক্রিনশট দেখে কখনোই সত্যতা যাচাই করা যায় না। যেকোনো বিজ্ঞপ্তি পেলে সার্কুলারশিল্ড বা অফিসিয়াল পোর্টালে ক্রস-ভেরিফাই করুন।`,
        },
      ],
    },
  },
];
