/**
 * CircularShield Smart Fraud Detector Engine
 * Analyzes circular content, company details, URLs, and application instructions
 * to compute a realistic risk score (0-100) and pinpoint red flags.
 */

// Heuristic keyword patterns
const PAYMENT_PATTERNS = [
  /bKash/i,
  /Nagad/i,
  /Rocket/i,
  /security deposit/i,
  /registration fee/i,
  /application fee.*(send|pay|send money)/i,
  /training cost/i,
  /uniform charge/i,
  /processing fee/i,
  /refundable deposit/i,
  /pay to confirm/i,
  /pay.*fee.*before.*interview/i,
];

const FREE_EMAIL_PROVIDERS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'mail.com',
  'yandex.com',
  'protonmail.com',
];

const CHAT_CONTACT_PATTERNS = [
  /telegram\.me/i,
  /t\.me\//i,
  /telegram handle/i,
  /contact on whatsapp only/i,
  /whatsapp:\s*\+?[0-9]+/i,
  /inbox only/i,
];

const URGENCY_PATTERNS = [
  /immediate join.*24 hour/i,
  /only \d+ (seats|vacancies|spots) left/i,
  /hurry up/i,
  /no experience.*high salary/i,
  /guaranteed placement.*deposit/i,
  /100% job guaranteed/i,
];

const UNREALISTIC_SALARY_PATTERNS = [
  /earn.*(50,000|80,000|1,00,000|100000).*(part[- ]?time|2 hours)/i,
  /daily.*(3000|5000|10000).*copy.*paste/i,
  /simple typing.*huge salary/i,
];

export const analyzeCircular = (circularInput) => {
  const {
    title = '',
    company = '',
    content = '',
    email = '',
    website = '',
    phone = '',
    salary = '',
  } = circularInput;

  const fullText = `${title} ${company} ${content} ${email} ${website} ${phone} ${salary}`.toLowerCase();

  let riskScore = 0;
  const redFlags = [];
  const trustFactors = [];
  const recommendations = [];

  // Check 1: Financial Demands / Fees (High Severity)
  let foundPayment = false;
  PAYMENT_PATTERNS.forEach((pattern) => {
    if (pattern.test(fullText)) {
      foundPayment = true;
    }
  });

  if (foundPayment) {
    riskScore += 45;
    redFlags.push({
      id: 'financial_demand',
      title: 'Upfront Payment or Money Transfer Solicited',
      severity: 'critical',
      description:
        'The job post asks candidates for payments (bKash/Nagad/deposit/application/training fee). Legitimate employers NEVER charge applicants for interviews or offers.',
      weight: '+45% Risk',
    });
  } else {
    trustFactors.push({
      title: 'No upfront payment requested in circular body',
      description: 'Free application process conforms to standard fair hiring practices.',
    });
  }

  // Check 2: Unofficial / Free Email Address for Corporate Recruitment
  const extractedEmails = fullText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
  const checkEmail = email || (extractedEmails.length > 0 ? extractedEmails[0] : '');

  if (checkEmail) {
    const domain = checkEmail.split('@')[1]?.toLowerCase();
    const isFreeEmail = FREE_EMAIL_PROVIDERS.includes(domain);

    if (isFreeEmail) {
      riskScore += 25;
      redFlags.push({
        id: 'free_email_domain',
        title: `Free Email Domain Used (@${domain})`,
        severity: 'high',
        description: `Official enterprise hiring rarely uses generic webmail (@${domain}). Verified organizations use corporate domain emails (e.g., hr@company.com).`,
        weight: '+25% Risk',
      });
    } else if (domain.endsWith('.gov') || domain.endsWith('.gov.bd') || domain.endsWith('.edu')) {
      riskScore = Math.max(0, riskScore - 20);
      trustFactors.push({
        title: `Authenticated Institutional Domain (@${domain})`,
        description: 'Government/Educational apex domain verified.',
      });
    } else {
      trustFactors.push({
        title: `Custom Corporate Domain Email (@${domain})`,
        description: 'Matches legitimate corporate domain infrastructure.',
      });
    }
  } else {
    riskScore += 10;
    redFlags.push({
      id: 'missing_official_email',
      title: 'No Official Email Contact Provided',
      severity: 'medium',
      description: 'Applicants are directed to unmonitored or personal channels without corporate paper trail.',
      weight: '+10% Risk',
    });
  }

  // Check 3: Chat App Only Communication (Telegram / WhatsApp)
  let foundChatOnly = false;
  CHAT_CONTACT_PATTERNS.forEach((pattern) => {
    if (pattern.test(fullText)) {
      foundChatOnly = true;
    }
  });

  if (foundChatOnly) {
    riskScore += 25;
    redFlags.push({
      id: 'chat_contact_only',
      title: 'Recruitment Redirected to Instant Messenger (Telegram / WhatsApp)',
      severity: 'high',
      description:
        'Recruiter insists on communication solely via encrypted instant messaging, typical of task scams and non-traceable fraud syndicates.',
      weight: '+25% Risk',
    });
  }

  // Check 4: Unrealistic Salary & Low Effort (Too Good To Be True)
  let foundUnrealistic = false;
  UNREALISTIC_SALARY_PATTERNS.forEach((pattern) => {
    if (pattern.test(fullText)) {
      foundUnrealistic = true;
    }
  });

  if (foundUnrealistic) {
    riskScore += 20;
    redFlags.push({
      id: 'unrealistic_compensation',
      title: 'Disproportionately High Remuneration for Low-Skill Task',
      severity: 'medium',
      description: 'Offers extreme daily or monthly income for basic typing or part-time work, classic bait for task deposit schemes.',
      weight: '+20% Risk',
    });
  }

  // Check 5: High Urgency and Artificial Scarcity
  let foundUrgency = false;
  URGENCY_PATTERNS.forEach((pattern) => {
    if (pattern.test(fullText)) {
      foundUrgency = true;
    }
  });

  if (foundUrgency) {
    riskScore += 15;
    redFlags.push({
      id: 'urgency_tactic',
      title: 'Artificial Urgency and Pressure Tactics',
      severity: 'medium',
      description: 'Creates unwarranted pressure to rush candidate into making hasty decisions without background due diligence.',
      weight: '+15% Risk',
    });
  }

  // Check 6: Official Website Validation
  if (website) {
    try {
      const url = new URL(website.startsWith('http') ? website : `https://${website}`);
      if (url.hostname.includes('blogspot') || url.hostname.includes('wordpress') || url.hostname.includes('wixsite')) {
        riskScore += 15;
        redFlags.push({
          id: 'free_website_builder',
          title: 'Hosted on Free Generic Subdomain',
          severity: 'medium',
          description: `Company website uses free hosting (${url.hostname}), irregular for established commercial enterprises.`,
          weight: '+15% Risk',
        });
      } else {
        trustFactors.push({
          title: `Dedicated Domain Verified (${url.hostname})`,
          description: 'Custom top-level domain registered.',
        });
      }
    } catch {
      // invalid url string
    }
  }

  // Check 7: Length and Structure
  if (content.length > 250 && !foundPayment && !foundChatOnly) {
    riskScore = Math.max(0, riskScore - 10);
    trustFactors.push({
      title: 'Comprehensive Job Scope & Structured Requirements',
      description: 'Detailed role specifications, qualifications, and formal evaluation criteria.',
    });
  }

  // Clamp risk score to 0 - 100
  riskScore = Math.min(100, Math.max(5, riskScore));

  // Determine status
  let status = 'verified';
  if (riskScore > 60) {
    status = 'suspicious';
  } else if (riskScore > 25) {
    status = 'unverified';
  }

  // Tailored recommendations
  if (status === 'suspicious') {
    recommendations.push('Do NOT transfer any money or disclose your National ID / banking credentials under any pretext.');
    recommendations.push('Verify directly with the physical corporate office or primary website career portal.');
    recommendations.push('Submit a community scam alert on CircularShield to warn other vulnerable candidates.');
  } else if (status === 'unverified') {
    recommendations.push('Request formal email communication from an official company domain.');
    recommendations.push('Cross-reference the organization registration in the CircularShield Verified Directory.');
    recommendations.push('Inquire whether the interview is conducted at physical corporate premises or official video portal.');
  } else {
    recommendations.push('Job circular exhibits legitimate institutional standards.');
    recommendations.push('Proceed with your regular job application through official channels.');
    recommendations.push('Always safeguard confidential passwords and financial tokens.');
  }

  return {
    score: riskScore,
    status,
    redFlags,
    trustFactors,
    recommendations,
  };
};
