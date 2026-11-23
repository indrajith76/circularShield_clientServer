/**
 * CircularShield Realistic Mock Data
 * Comprehensive datasets covering job circulars, verified organizations,
 * scam incident reports, and system telemetry statistics.
 */

export const MOCK_CIRCULARS = [
  {
    id: 'CIR-2026-081',
    title: 'Senior Full Stack Engineer (React / Node)',
    company: 'BrainStation 23 PLC',
    companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&auto=format&fit=crop&q=80',
    sector: 'Information Technology',
    location: 'Dhaka (Hybrid) & Remote',
    salary: 'BDT 120,000 - 160,000 / month',
    postedDate: '2026-11-20T10:30:00Z',
    deadline: '2026-12-15T23:59:59Z',
    status: 'verified',
    riskScore: 8,
    verifiedOrg: true,
    views: 1420,
    applications: 68,
    source: 'Official Career Portal',
    url: 'https://brainstation-23.com/careers/se-fs-081',
    email: 'career@brainstation-23.com',
    description: `BrainStation 23 is seeking an experienced Senior Full Stack Engineer to lead modernization of enterprise banking web applications. The candidate will design scalable microservices and mentor junior developers. 

Requirements:
- 4+ years practical experience with React, TypeScript, and Node.js
- Strong proficiency with PostgreSQL, Docker, and CI/CD pipelines
- Bachelor's degree in CSE or equivalent software experience
- Excellent problem-solving and clean code discipline

Selection Process:
1. Technical take-home assessment
2. System design round (Google Meet)
3. Culture fit & HR interview
* Note: BrainStation 23 never charges any recruitment or examination fees.`,
    redFlags: [],
    trustFactors: [
      'Official corporate domain email: career@brainstation-23.com',
      'Verified registered corporate entity (BASIS & DCCI Member)',
      'No fees or deposits requested at any stage',
      'Clear technical evaluation benchmarks',
    ],
  },
  {
    id: 'CIR-2026-082',
    title: 'Assistant Project Officer (Health & Education)',
    company: 'Ministry Directorate Project Wing (Impersonated)',
    companyLogo: 'https://images.unsplash.com/photo-1572945281869-826b8e485e07?w=120&auto=format&fit=crop&q=80',
    sector: 'Public Sector Impersonation',
    location: 'All Districts (64 Divisions)',
    salary: 'BDT 42,500 + Government Perks',
    postedDate: '2026-11-22T08:15:00Z',
    deadline: '2026-11-25T17:00:00Z',
    status: 'suspicious',
    riskScore: 94,
    verifiedOrg: false,
    views: 3105,
    applications: 214,
    source: 'Viral Facebook Group & PDF circulation',
    url: 'http://gov-recruitment-bangladesh.net/apply',
    email: 'project.director.recruitment.bd@gmail.com',
    description: `Urgent recruitment notice for nationwide community health and education supervision project. 450 vacancies across all 64 districts. Immediate joining with permanent government grade scale benefits.

Eligible candidates must deposit an application verification & admit card postage fee of BDT 450 through bKash/Nagad merchant number (01700-XXXXXX) before submitting the application form. Applications without transaction ID will be canceled instantly.`,
    redFlags: [
      {
        title: 'bKash/Nagad Fee Demanded for Admit Card',
        description: 'Demands personal mobile financial transfer (BDT 450) prior to interview.',
        severity: 'critical',
      },
      {
        title: 'Generic Free Gmail Address Used',
        description: 'Using @gmail.com instead of verified government .gov.bd gateway.',
        severity: 'critical',
      },
      {
        title: 'Fake Spoofed Domain Name',
        description: 'Domain (gov-recruitment-bangladesh.net) is an unverified external site imitating state emblems.',
        severity: 'high',
      },
      {
        title: 'Unrealistic Vacancy & Extreme Urgency',
        description: 'Claims 450 unverified openings with 72-hour artificial application window.',
        severity: 'medium',
      },
    ],
    trustFactors: [],
  },
  {
    id: 'CIR-2026-083',
    title: 'Customer Operations Executive',
    company: 'Apex Logistics & Freight',
    companyLogo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=120&auto=format&fit=crop&q=80',
    sector: 'Supply Chain & Logistics',
    location: 'Chittagong Port Zone / On-site',
    salary: 'BDT 35,000 - 45,000 / month',
    postedDate: '2026-11-19T14:00:00Z',
    deadline: '2026-12-10T18:00:00Z',
    status: 'unverified',
    riskScore: 48,
    verifiedOrg: false,
    views: 890,
    applications: 32,
    source: 'Local Job Board posting',
    url: 'https://apexlogisticsfreight-bd.com',
    email: 'hr.apexlogistics@yahoo.com',
    description: `Apex Logistics & Freight is hiring Customer Operations Executives for managing customs clearance and shipping documentation.

Qualifications:
- Bachelor's degree in any discipline
- Basic computer knowledge and email communication skills
- Fresh graduates are encouraged to apply
Interested candidates are requested to send their CV with recent photograph to hr.apexlogistics@yahoo.com or drop hardcopy at our port reception desk.`,
    redFlags: [
      {
        title: 'Yahoo Webmail Domain Used',
        description: 'Corporate recruitment handled via free Yahoo email rather than domain address.',
        severity: 'medium',
      },
      {
        title: 'Employer Registration Pending Verification',
        description: 'No trade license or incorporation filing on record in the national registry.',
        severity: 'medium',
      },
    ],
    trustFactors: [
      'No application fees or financial demands observed',
      'Provides verifiable physical office reception location at Chittagong Port Zone',
      'Standard compensation commensurate with entry-level position',
    ],
  },
  {
    id: 'CIR-2026-084',
    title: 'Remote Data Entry & Captcha Processing Specialist',
    company: 'Global Digital Outsourcing LLC',
    companyLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&auto=format&fit=crop&q=80',
    sector: 'Remote Work / Freelancing',
    location: 'Work From Home (Anywhere)',
    salary: 'BDT 50,000 - 80,000 / month (Part-time)',
    postedDate: '2026-11-21T18:45:00Z',
    deadline: '2026-11-30T23:59:00Z',
    status: 'suspicious',
    riskScore: 92,
    verifiedOrg: false,
    views: 4520,
    applications: 412,
    source: 'Sponsored Social Media Ads & Telegram',
    url: 'https://t.me/global_recruiter_assistant',
    email: '',
    description: `Simple copy-paste and captcha typing work for international clients. Earn 2,500 to 3,500 BDT daily working just 2 hours from your smartphone or laptop. No prior experience or degree required!

Instructions:
1. Message our Telegram coordinator @global_recruiter_assistant immediately
2. Complete candidate registration and software ID activation
3. Pay a refundable software license deposit of BDT 1,200 (returned upon completing first 100 pages of work)
4. Receive daily work assignments directly in your Telegram inbox.`,
    redFlags: [
      {
        title: 'Telegram-Only Channel Routing',
        description: 'Recruitment isolated entirely to Telegram handle to evade identification.',
        severity: 'critical',
      },
      {
        title: 'Refundable Software Deposit Trap',
        description: 'Mandatory upfront software security fee (BDT 1,200) prior to contract.',
        severity: 'critical',
      },
      {
        title: 'Extreme Unrealistic Salary for Zero Skill',
        description: 'Promises BDT 80,000/mo for 2 hours daily copy-pasting, a standard hallmark of freelance fraud.',
        severity: 'high',
      },
      {
        title: 'No Registered Physical Address or Incorporation',
        description: 'Fictitious company entity with no real corporate registration.',
        severity: 'high',
      },
    ],
    trustFactors: [],
  },
  {
    id: 'CIR-2026-085',
    title: 'Branch Compliance Officer',
    company: 'Eastern Bank PLC',
    companyLogo: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=120&auto=format&fit=crop&q=80',
    sector: 'Banking & Financial Institutions',
    location: 'Dhaka, Sylhet, Chittagong',
    salary: 'BDT 55,000 - 70,000 + Benefits',
    postedDate: '2026-11-18T09:00:00Z',
    deadline: '2026-12-08T17:00:00Z',
    status: 'verified',
    riskScore: 5,
    verifiedOrg: true,
    views: 2280,
    applications: 94,
    source: 'Eastern Bank Official Portal & Bdjobs',
    url: 'https://www.ebl.com.bd/career/compliance-2026',
    email: 'recruitment@ebl-bd.com',
    description: `Eastern Bank PLC is inviting applications for Branch Compliance Officers responsible for AML (Anti-Money Laundering) checks, KYC documentation, and internal audit adherence.

Requirements:
- Minimum graduate in Business Administration, Accounting, or Finance
- Minimum 2 years experience in financial audit or banking operations
- Thorough knowledge of Bangladesh Bank regulatory guidelines
Applications must be submitted exclusively via Eastern Bank online career portal.`,
    redFlags: [],
    trustFactors: [
      'Verified Scheduled Commercial Bank by Central Bank regulatory registry',
      'Official verified domain: ebl.com.bd',
      'Strict zero-fee recruitment policy clearly announced',
      'Encrypted portal submission with formal tracking ID',
    ],
  },
  {
    id: 'CIR-2026-086',
    title: 'Airport Ground Handling & Passenger Service Staff',
    company: 'Gulf Aviation Ground Services (Fake Agency)',
    companyLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=120&auto=format&fit=crop&q=80',
    sector: 'Aviation & Overseas Placement',
    location: 'Hazrat Shahjalal International Airport, Dhaka',
    salary: 'BDT 65,000 + Overtime + Free Housing',
    postedDate: '2026-11-23T06:00:00Z',
    deadline: '2026-11-26T23:59:00Z',
    status: 'suspicious',
    riskScore: 98,
    verifiedOrg: false,
    views: 5210,
    applications: 340,
    source: 'Posters and Facebook Groups',
    url: 'http://gulfaviationground-bd.online',
    email: 'gulfairways.officials@gmail.com',
    description: `Urgent recruitment for 120 Ground Staff and Passenger Assistance officers at Dhaka International Airport. Free visa processing and free uniforms provided by airline management.

Direct walk-in selection. All applicants must submit medical fitness report along with BDT 2,500 security verification fee via Nagad to reserve interview entry token.`,
    redFlags: [
      {
        title: 'Security Verification Fee via Nagad',
        description: 'Demands BDT 2,500 payment before applicant is permitted to enter interview venue.',
        severity: 'critical',
      },
      {
        title: 'Unlicensed Manpower Agency',
        description: 'No RL (Recruiting License) from BMET (Bureau of Manpower, Employment and Training).',
        severity: 'critical',
      },
      {
        title: 'Gmail Address Masquerading as Airline',
        description: 'Uses gulfairways.officials@gmail.com to mimic international carrier.',
        severity: 'high',
      },
    ],
    trustFactors: [],
  },
  {
    id: 'CIR-2026-087',
    title: 'Lead Cloud Infrastructure & DevOps Engineer',
    company: 'Grameenphone Ltd',
    companyLogo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=120&auto=format&fit=crop&q=80',
    sector: 'Information Technology',
    location: 'GPHouse, Bashundhara R/A, Dhaka',
    salary: 'BDT 150,000 - 200,000 / month',
    postedDate: '2026-11-23T11:00:00Z',
    deadline: '2026-12-20T23:59:59Z',
    status: 'verified',
    riskScore: 4,
    verifiedOrg: true,
    views: 1850,
    applications: 52,
    source: 'Telenor Global Careers / Grameenphone',
    url: 'https://grameenphone.com/about/careers/lead-devops-087',
    email: 'careers@grameenphone.com',
    description: `Grameenphone is seeking an experienced Lead Cloud Infrastructure Engineer to direct Kubernetes multi-cluster architecture and hybrid telco cloud modernization.

Key Responsibilities:
- Manage AWS & on-premise OpenStack telco cloud clusters
- Automate GitOps deployment pipelines using ArgoCD and Terraform
- Ensure 99.999% SLA adherence and security compliance

Requirements:
- 5+ years hands-on production DevOps experience
- Strong Kubernetes, Docker, and Linux kernel fundamentals
- Bachelor's degree in Computer Science or related engineering field
- Grameenphone maintains an absolute zero-tolerance recruitment fee policy.`,
    redFlags: [],
    trustFactors: [
      'Official verified domain email: careers@grameenphone.com',
      'Listed public telecom operator registered with BTRC',
      'No application or processing fees requested',
      'Encrypted enterprise HR applicant tracking system',
    ],
  },
  {
    id: 'CIR-2026-088',
    title: 'VIP E-Commerce Product Rating & Commission Associate',
    company: 'TikTok & Shopee Mall Affiliate (Fake Syndicate)',
    companyLogo: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=120&auto=format&fit=crop&q=80',
    sector: 'Remote Work / Freelancing',
    location: 'Remote (Anywhere in Bangladesh)',
    salary: 'BDT 3,000 - 5,000 Daily (Guaranteed)',
    postedDate: '2026-11-22T16:20:00Z',
    deadline: '2026-11-27T18:00:00Z',
    status: 'suspicious',
    riskScore: 96,
    verifiedOrg: false,
    views: 6200,
    applications: 580,
    source: 'WhatsApp Spam Message & Facebook Reels',
    url: 'https://shopee-vip-task-rewards.xyz/login',
    email: 'support@vip-orders-mall.xyz',
    description: `Earn instant money from home! Help international merchants boost product ratings on Shopee and TikTok Shop. Simply like and submit reviews to earn 25% instant cashback commission.

Workflow:
1. Contact WhatsApp recruiter (+880 1912-334455)
2. Deposit initial task activation fund of BDT 1,500 via bKash/Nagad
3. Complete 5 rating tasks to receive BDT 2,500 return within 15 minutes!
4. VIP tiers unlock up to BDT 25,000 daily earnings.`,
    redFlags: [
      {
        title: 'Task Deposit Ponzi Scheme Structure',
        description: 'Requires candidate to deposit personal funds before receiving commission.',
        severity: 'critical',
      },
      {
        title: 'Fake Domain Mimicking Reputable Marketplace',
        description: 'Phishing domain (shopee-vip-task-rewards.xyz) with no connection to Shopee Pte.',
        severity: 'critical',
      },
      {
        title: 'Recruitment via WhatsApp Personal Number',
        description: 'Unregistered personal WhatsApp line used for financial solicitation.',
        severity: 'high',
      },
      {
        title: 'Unrealistic Guaranteed Daily Payouts',
        description: 'Guarantees 25% instant profit on tasks, a textbook cyber recruitment fraud.',
        severity: 'high',
      },
    ],
    trustFactors: [],
  },
  {
    id: 'CIR-2026-089',
    title: 'Field Program Officer (Education & WASH)',
    company: 'BRAC International',
    companyLogo: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb2?w=120&auto=format&fit=crop&q=80',
    sector: 'NGO & Development',
    location: 'Cox’s Bazar / Field Site',
    salary: 'BDT 48,000 - 60,000 + Field Allowances',
    postedDate: '2026-11-15T09:30:00Z',
    deadline: '2026-12-05T17:00:00Z',
    status: 'verified',
    riskScore: 6,
    verifiedOrg: true,
    views: 1980,
    applications: 86,
    source: 'BRAC Career Portal & ReliefWeb',
    url: 'https://careers.brac.net/jobs/fpo-wash-2026',
    email: 'recruitment.wash@brac.net',
    description: `BRAC is hiring a Field Program Officer to oversee community water sanitation and hygiene education initiatives in Cox's Bazar district.

Responsibilities:
- Conduct field monitoring visits and assess sanitation infrastructure
- Coordinate with local union parishads and community representatives
- Prepare monthly donor compliance and progress reporting

Qualifications:
- Bachelor's in Social Sciences, Environmental Science, or Public Health
- Minimum 2 years NGO field experience
- Proficiency in MS Office and reporting
* BRAC never asks for fees or deposits from job applicants.`,
    redFlags: [],
    trustFactors: [
      'Official verified domain: brac.net',
      'Accredited international non-governmental organization',
      'Strict safeguarding and zero recruitment fee compliance',
      'Standard institutional evaluation procedure',
    ],
  },
  {
    id: 'CIR-2026-090',
    title: 'Field Survey & Environmental Data Collector',
    company: 'Horizon Environmental Research (Unverified)',
    companyLogo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=120&auto=format&fit=crop&q=80',
    sector: 'Research & Survey',
    location: 'Khulna & Barisal Coastal Belt',
    salary: 'BDT 28,000 - 34,000 / month',
    postedDate: '2026-11-05T14:10:00Z',
    deadline: '2026-11-30T17:00:00Z',
    status: 'unverified',
    riskScore: 42,
    verifiedOrg: false,
    views: 740,
    applications: 28,
    source: 'Local Campus Notice Board',
    url: '',
    email: 'horizon.survey.bd@outlook.com',
    description: `Temporary field survey positions for conducting salinity and agricultural yield data collection across 12 coastal upazilas.

Requirements:
- HSC or Diploma in Agriculture / Environment
- Willingness to travel extensively across coastal unions
- Smartphone with GPS camera capability
Interested applicants should email CV to horizon.survey.bd@outlook.com.`,
    redFlags: [
      {
        title: 'Free Webmail Address Used for Research Entity',
        description: 'Using Outlook free webmail without academic or institutional affiliation.',
        severity: 'medium',
      },
      {
        title: 'Entity Not Listed in Corporate or NGO Registry',
        description: 'No registered NGO Affairs Bureau or RJSC filing found for Horizon Research.',
        severity: 'medium',
      },
    ],
    trustFactors: [
      'No upfront monetary fees demanded',
      'Realistic modest compensation for field survey role',
    ],
  },
];

export const MOCK_VERIFIED_ORGANIZATIONS = [
  {
    id: 'ORG-001',
    name: 'BrainStation 23 PLC',
    category: 'Information Technology',
    logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&auto=format&fit=crop&q=80',
    description: 'BrainStation 23 PLC is an enterprise software development and digital transformation company headquartered in Dhaka, providing global fintech and cloud engineering services.',
    registrationNumber: 'C-64821/06',
    establishedYear: 2006,
    officialWebsite: 'https://brainstation-23.com',
    officialCareerPage: 'https://brainstation-23.com/careers',
    officialEmailDomain: 'brainstation-23.com',
    verificationLevel: 'Enterprise Tier-1 (BASIS Certified)',
    verificationStatus: 'verified',
    activeCirculars: 4,
    reportedScamClones: 2,
    badgeColor: '#16A36A',
    address: '7th & 8th Floor, Plot 2, Road 14/A, Dhanmondi, Dhaka 1209',
    phone: '+880 1404-055220',
    officialRecruitmentPolicy: 'BrainStation 23 never solicits monetary contributions, examination fees, or upfront deposits at any step. All applications are processed through official channels.',
    mismatchWarning: {
      hasWarning: true,
      title: 'Known Impersonation Vectors Against BrainStation 23',
      text: 'Recruitment syndicates on Facebook have previously impersonated BrainStation 23 offering remote captcha typing and asking for BDT 1,000 security deposits. BrainStation 23 only hires for certified tech and professional roles through @brainstation-23.com and never charges applicants.',
    },
  },
  {
    id: 'ORG-002',
    name: 'Eastern Bank PLC',
    category: 'Banking & Financial',
    logo: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=120&auto=format&fit=crop&q=80',
    description: 'Eastern Bank PLC is a leading private commercial bank in Bangladesh, offering retail, corporate, and digital financial solutions under Bangladesh Bank regulations.',
    registrationNumber: 'C-22109/92',
    establishedYear: 1992,
    officialWebsite: 'https://www.ebl.com.bd',
    officialCareerPage: 'https://www.ebl.com.bd/career',
    officialEmailDomain: 'ebl-bd.com',
    verificationLevel: 'Regulated Financial Institution (Bangladesh Bank)',
    verificationStatus: 'verified',
    activeCirculars: 6,
    reportedScamClones: 7,
    badgeColor: '#16A36A',
    address: '100 Gulshan Avenue, Dhaka 1212',
    phone: '+880 2 9556360',
    officialRecruitmentPolicy: 'Official hiring is performed only through ebl.com.bd/career. Candidates are warned against fraudulent SMS notices demanding interview card fees.',
    mismatchWarning: {
      hasWarning: true,
      title: 'SMS Admit Card Token Phishing Alert',
      text: 'Fraudulent bulk SMS campaigns have circulated claiming candidates were shortlisted for EBL Management Trainee roles, demanding BDT 800 via bKash. EBL NEVER uses personal mobile money wallets for recruitment.',
    },
  },
  {
    id: 'ORG-003',
    name: 'Square Pharmaceuticals Ltd',
    category: 'Pharmaceuticals & Healthcare',
    logo: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=120&auto=format&fit=crop&q=80',
    description: 'Square Pharmaceuticals Ltd is the flagship entity of Square Group and the largest manufacturer of pharmaceutical formulations in Bangladesh.',
    registrationNumber: 'C-08342/58',
    establishedYear: 1958,
    officialWebsite: 'https://www.squarepharma.com.bd',
    officialCareerPage: 'https://career.squaregroup.com',
    officialEmailDomain: 'squaregroup.com',
    verificationLevel: 'Enterprise Tier-1 (DGDA Accredited)',
    verificationStatus: 'verified',
    activeCirculars: 3,
    reportedScamClones: 4,
    badgeColor: '#16A36A',
    address: 'Square Centre, 48 Mohakhali C/A, Dhaka 1212',
    phone: '+880 2 9859007',
    officialRecruitmentPolicy: 'All interviews take place at designated Square offices. We do not conduct interviews over phone or WhatsApp, nor do we charge interview fees.',
    mismatchWarning: {
      hasWarning: true,
      title: 'Medical Representative Appointment Fraud',
      text: 'Scammers have forged Square Group appointment letters demanding medical equipment deposits. Always verify appointment letters directly at Square Centre Mohakhali.',
    },
  },
  {
    id: 'ORG-004',
    name: 'BRAC Bangladesh',
    category: 'Non-Governmental Organization (NGO)',
    logo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=120&auto=format&fit=crop&q=80',
    description: 'BRAC is an international development organization founded in Bangladesh, dedicated to empowering people in poverty through microfinance, education, and healthcare.',
    registrationNumber: 'NGOAB-001',
    establishedYear: 1972,
    officialWebsite: 'https://www.brac.net',
    officialCareerPage: 'https://careers.brac.net',
    officialEmailDomain: 'brac.net',
    verificationLevel: 'Certified NGO (NGO Affairs Bureau)',
    verificationStatus: 'verified',
    activeCirculars: 12,
    reportedScamClones: 15,
    badgeColor: '#16A36A',
    address: '75 Mohakhali, Dhaka 1212',
    phone: '+880 2 2222 81265',
    officialRecruitmentPolicy: 'BRAC conducts recruitment strictly without fees. Beware of fake appointment letters bearing forged executive signatures.',
    mismatchWarning: {
      hasWarning: true,
      title: 'Field Officer Training Fee Scam Alert',
      text: 'Fake field supervisor circulars on social media demand BDT 1,200 for "mandatory rural orientation kit". BRAC provides all training materials free of charge.',
    },
  },
  {
    id: 'ORG-005',
    name: 'Apex Logistics & Courier Services',
    category: 'Logistics & Supply Chain',
    logo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=120&auto=format&fit=crop&q=80',
    description: 'Apex Logistics is a regional parcel handling and delivery company operating throughout urban Dhaka and Chattogram, currently expanding inter-district operations.',
    registrationNumber: 'TRAD-DCC-2025-0819',
    establishedYear: 2024,
    officialWebsite: 'https://apexlogistics-bd.com',
    officialCareerPage: 'https://apexlogistics-bd.com/jobs',
    officialEmailDomain: 'apexlogistics-bd.com',
    verificationLevel: 'Pending Trade Accreditation',
    verificationStatus: 'unverified',
    activeCirculars: 2,
    reportedScamClones: 1,
    badgeColor: '#D99A28',
    address: 'Plot 18, Sector 3, Uttara, Dhaka',
    phone: '+880 1812-445566',
    officialRecruitmentPolicy: 'Delivery rider and parcel sorter vacancies are advertised locally. Verification of trade registry documents is currently under review.',
    mismatchWarning: {
      hasWarning: true,
      title: 'Unverified Entity Due Diligence Notice',
      text: 'This organization is currently in UNVERIFIED status pending physical office inspection and RJSC validation. Candidates are advised not to pay motorbike deposits or uniform fees.',
    },
  },
  {
    id: 'ORG-006',
    name: 'Swift Career Consult (Flagged Agency)',
    category: 'Third-Party Placement Agency',
    logo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=120&auto=format&fit=crop&q=80',
    description: 'Blacklisted recruitment broker operating unauthorized job placements and issuing forged appointment documents.',
    registrationNumber: 'Fake / Forged RJSC Certificate',
    establishedYear: 2024,
    officialWebsite: 'http://swiftcareer-bd.xyz',
    officialCareerPage: 'http://swiftcareer-bd.xyz/apply',
    officialEmailDomain: 'gmail.com',
    verificationLevel: 'Blacklisted Threat Entity',
    verificationStatus: 'suspicious',
    activeCirculars: 0,
    reportedScamClones: 19,
    badgeColor: '#DC4B4B',
    address: 'Claimed Mirpur DOHS (No physical presence found)',
    phone: '+880 1789-991122',
    officialRecruitmentPolicy: 'FLAGGED ENTITY: Multiple reports of fraudulent appointment letter issuance and bKash extortion.',
    mismatchWarning: {
      hasWarning: true,
      title: 'CRITICAL FRAUD ALERT: Blacklisted Syndicate',
      text: 'Swift Career Consult has been flagged in 19 separate whistleblower reports for demanding upfront interview processing fees (BDT 1,500 - 3,500) via personal bKash accounts. The agency has no valid trade license.',
    },
  },
  {
    id: 'ORG-007',
    name: 'DGHS Health Project Coordination Wing (Fake Syndicate)',
    category: 'Public Sector (Impersonated)',
    logo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=120&auto=format&fit=crop&q=80',
    description: 'Fraudulent syndicate impersonating the Directorate General of Health Services (DGHS) through clone websites and forged government circulars.',
    registrationNumber: 'Counterfeit Government Seal',
    establishedYear: 2026,
    officialWebsite: 'http://gov-healthproject-bd.net',
    officialCareerPage: 'http://gov-healthproject-bd.net/application',
    officialEmailDomain: 'gmail.com',
    verificationLevel: 'Confirmed Impersonator',
    verificationStatus: 'suspicious',
    activeCirculars: 0,
    reportedScamClones: 28,
    badgeColor: '#DC4B4B',
    address: 'Fictitious Government Secretarial Wing',
    phone: '+880 1799-887766 (Flagged Wallet)',
    officialRecruitmentPolicy: 'IMPERSONATION WARNING: Illegally claims affiliation with the Ministry of Health. Genuine circulars are published strictly on dghs.gov.bd.',
    mismatchWarning: {
      hasWarning: true,
      title: 'Government Directorate Impersonation Alert',
      text: 'This syndicate issues fake government circulars for Project Assistant and Computer Operator positions, extorting BDT 450 - 850 for fake admit cards. Do not transfer funds.',
    },
  },
  {
    id: 'ORG-008',
    name: 'Fast Track Data Entry Agency',
    category: 'Online Freelance Scheme',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=80',
    description: 'Unverified online task brokerage soliciting remote typists across Facebook and Telegram without verifiable business credentials.',
    registrationNumber: 'Unregistered Online Portal',
    establishedYear: 2025,
    officialWebsite: 'https://fasttrackdata-bd.site',
    officialCareerPage: 'https://fasttrackdata-bd.site/register',
    officialEmailDomain: 'gmail.com',
    verificationLevel: 'Unverified / In Review',
    verificationStatus: 'unverified',
    activeCirculars: 1,
    reportedScamClones: 5,
    badgeColor: '#D99A28',
    address: 'Online Operations Only',
    phone: '+880 1911-332211',
    officialRecruitmentPolicy: 'Unregistered online task provider. Solicits remote typists with promises of daily payouts.',
    mismatchWarning: {
      hasWarning: true,
      title: 'Advance Security Deposit Caution',
      text: 'Candidates report being asked for BDT 500 "software registration fees" before receiving task files. CircularShield strongly advises against advance deposits for employment.',
    },
  },
];

export const MOCK_SCAM_REPORTS = [
  {
    id: 'REP-9021',
    title: 'Demanded 2,500 BDT for Railway Admit Card & Physical Token',
    targetEntity: 'Bangladesh Railway (Impersonated by syndicate)',
    victimCategory: 'Public Sector Job Applicant',
    amountDemanded: 2500,
    paymentMethod: 'bKash Personal (01822-XXXXXX)',
    channel: 'SMS & WhatsApp group',
    reportedDate: '2026-11-22T14:20:00Z',
    status: 'confirmed_scam',
    evidenceAttached: 'SMS screenshots, bKash transfer slip, fake PDF notice with counterfeit emblem',
    upvotes: 84,
    summary: 'Received an SMS claiming selection for Railway Assistant station master. Recruiter instructed to send 2,500 BDT for physical examination token. When questioned, applicant was blocked.',
  },
  {
    id: 'REP-9022',
    title: 'Telegram Task Scam demanding 5,000 BDT activation deposit',
    targetEntity: 'Global Marketing Hub',
    victimCategory: 'University Student / Part-time seeker',
    amountDemanded: 5000,
    paymentMethod: 'Nagad Account',
    channel: 'Telegram (@earn_daily_bd)',
    reportedDate: '2026-11-21T11:05:00Z',
    status: 'investigating',
    evidenceAttached: 'Chat transcript, fake merchant invoice',
    upvotes: 46,
    summary: 'Candidate completed 10 online tasks and was shown 12,000 BDT balance in a fake web dashboard. To withdraw, the scammer required a 5,000 BDT "VIP tax clearance deposit".',
  },
  {
    id: 'REP-9023',
    title: 'Fake Overseas Airport Ground Staff Appointment Letter',
    targetEntity: 'Qatar Ground Handling Agency (Spoofed)',
    victimCategory: 'Overseas Job Seeker',
    amountDemanded: 45000,
    paymentMethod: 'Bank Transfer (Personal Savings Account)',
    channel: 'Facebook Ad & Direct Call',
    reportedDate: '2026-11-19T16:40:00Z',
    status: 'confirmed_scam',
    evidenceAttached: 'Forged appointment letter on blurred letterhead, fake visa sticker scan',
    upvotes: 112,
    summary: 'Scammers promised direct visa and air ticket within 15 days upon paying 45,000 BDT advance for medical checkup. Agency office was found locked when visited.',
  },
  {
    id: 'REP-9024',
    title: 'Counterfeit HR Interview for Pharmaceuticals Sales Rep',
    targetEntity: 'Renata Pharmaceuticals (Counterfeit copy)',
    victimCategory: 'Fresh Medical Graduate',
    amountDemanded: 1500,
    paymentMethod: 'Rocket Wallet',
    channel: 'Email with PDF circular',
    reportedDate: '2026-11-17T09:30:00Z',
    status: 'resolved',
    evidenceAttached: 'Email headers, counterfeit logo file',
    upvotes: 38,
    summary: 'Sent from renata.careers.bd@gmail.com asking for uniform stitching deposit. Renata official HR confirmed this email is unauthorized and posted warning bulletin.',
  },
];

export const MOCK_SCAM_TACTICS = [
  {
    id: 'TAC-01',
    name: 'The "Admit Card / Security Deposit" Extortion',
    severity: 'High',
    description: 'Fake circulars mirroring government, railway, or banking notices require candidates to send 300 to 3,000 BDT via bKash/Nagad to generate admit cards or reserve interview slots.',
    detectionTip: 'Government examinations only charge fees through official Teletalk portals (e.g., xxx.teletalk.com.bd) or authorized treasury challans, NEVER personal mobile financial numbers.',
    commonTargets: 'Unemployed youth, fresh graduates, district applicants',
  },
  {
    id: 'TAC-02',
    name: 'The Telegram / WhatsApp "Task & Recharge" Trap',
    severity: 'Critical',
    description: 'Scammers recruit via Facebook/Instagram ads for "simple YouTube video liking" or "captcha typing". They pay small amounts initially (e.g., 200 BDT) to build trust, then trap victims into depositing 5,000 - 50,000 BDT into "crypto" or "merchant accounts" to unlock higher pay.',
    detectionTip: 'Any job asking you to deposit money in order to unlock salary or withdraw your own earned money is 100% a fraudulent Ponzi task scam.',
    commonTargets: 'Students, housewives, remote freelancers',
  },
  {
    id: 'TAC-03',
    name: 'The Counterfeit Appointment Letter with Forged Seals',
    severity: 'Critical',
    description: 'Victims receive an unsolicited PDF offer letter bearing scanned logos of prestigious companies (Square, Beximco, EBL) without any formal interview. The letter asks for 10,000 to 30,000 BDT for "security clearance" or "laptop dispatch insurance".',
    detectionTip: 'Reputable firms always conduct formal multi-stage interviews and send offers from their registered domain emails (never @gmail or @yahoo).',
    commonTargets: 'Job seekers who uploaded CVs to public boards',
  },
  {
    id: 'TAC-04',
    name: 'The Overseas Aviation & Ground Staff Mirage',
    severity: 'High',
    description: 'Offers high-paying jobs in Gulf/European airlines or domestic airports with zero experience required. Victims are tricked into paying for "embassy attestations", "medical fitness codes", or "security tokens".',
    detectionTip: 'Always verify recruiting agency license numbers on the BMET portal (bmet.gov.bd) before engaging with any foreign recruitment agency.',
    commonTargets: 'Aviation aspirants, overseas manpower seekers',
  },
];

export const MOCK_METRICS = {
  totalCircularsAnalyzed: 14850,
  verifiedCircularsCount: 9320,
  suspiciousCircularsCount: 3840,
  unverifiedCircularsCount: 1690,
  scamLossPreventedBDT: 18450000,
  activeWhistleblowerReports: 428,
  verifiedOrganizationsCount: 615,
};

export const MOCK_CHART_FRAUD_TRENDS = [
  { month: 'Jun', totalScans: 950, verified: 590, suspicious: 240, unverified: 120, preventedLossK: 850 },
  { month: 'Jul', totalScans: 1200, verified: 750, suspicious: 310, unverified: 140, preventedLossK: 1120 },
  { month: 'Aug', totalScans: 1450, verified: 910, suspicious: 380, unverified: 160, preventedLossK: 1480 },
  { month: 'Sep', totalScans: 1800, verified: 1140, suspicious: 460, unverified: 200, preventedLossK: 1950 },
  { month: 'Oct', totalScans: 2200, verified: 1390, suspicious: 560, unverified: 250, preventedLossK: 2400 },
  { month: 'Nov', totalScans: 2650, verified: 1680, suspicious: 680, unverified: 290, preventedLossK: 3100 },
];

export const MOCK_CHART_SCAM_TYPES = [
  { name: 'Upfront bKash/Fee Demands', value: 42, color: '#DC4B4B' },
  { name: 'Telegram Task Schemes', value: 24, color: '#F97316' },
  { name: 'Fake Govt / Bank Impersonation', value: 18, color: '#D99A28' },
  { name: 'Fake Appointment Letter Scams', value: 11, color: '#8B5CF6' },
  { name: 'Bogus Overseas Visa Traps', value: 5, color: '#087F70' },
];
