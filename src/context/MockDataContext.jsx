import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  MOCK_CIRCULARS,
  MOCK_SCAM_REPORTS,
  MOCK_VERIFIED_ORGANIZATIONS,
} from '../data/mockData';
import {
  ADMIN_RECENT_REPORTS,
  ADMIN_RECENT_USERS,
  ADMIN_RECENT_VERIFICATIONS,
} from '../data/adminMockData';
import { SAFETY_ARTICLES } from '../data/safetyArticles';
import { analyzeCircular } from '../utils/fraudDetector';
import { MockDataContext } from './MockDataContext';

// Safe localStorage helper
const getStored = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const setStored = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota/storage errors
  }
};

// Initial consolidated reports combining user and admin seeds
const INITIAL_CONSOLIDATED_REPORTS = [
  ...ADMIN_RECENT_REPORTS.map((r) => ({
    id: r.id,
    title: r.title,
    targetEntity: r.targetEntity,
    category: r.category,
    amountDemanded: r.amountDemanded,
    reportedDate: r.reportedDate,
    status: r.status, // 'investigating' | 'confirmed_scam' | 'resolved' | 'rejected'
    priority: r.priority || 'medium',
    reporter: r.reporter || 'Anonymous Candidate',
    evidenceDetails: r.evidenceDetails || 'Submitted via secure portal',
    evidenceFiles: r.evidenceFiles || [],
    reviewerNotes: r.reviewerNotes || '',
    website: r.website || '',
    phone: r.phone || '',
    paymentNumber: r.paymentNumber || '',
  })),
  ...MOCK_SCAM_REPORTS.map((r) => ({
    id: r.id,
    title: r.title,
    targetEntity: r.targetEntity,
    category: r.channel || 'Instant Messaging',
    amountDemanded: r.amountDemanded ? `BDT ${r.amountDemanded.toLocaleString()}` : 'Unspecified',
    reportedDate: r.reportedDate,
    status: r.status === 'investigating' ? 'investigating' : 'confirmed_scam',
    priority: 'high',
    reporter: 'Whistleblower',
    evidenceDetails: r.evidenceAttached || r.summary || 'Extortion proof provided',
    evidenceFiles: [
      'https://images.unsplash.com/photo-1572945281869-826b8e485e07?w=500&auto=format&fit=crop&q=80',
    ],
    reviewerNotes: 'Verified against threat intelligence blacklist.',
    website: '',
    phone: '',
    paymentNumber: r.paymentMethod || 'bKash Personal',
  })),
];

// Initial consolidated users
const INITIAL_CONSOLIDATED_USERS = [
  ...ADMIN_RECENT_USERS,
  {
    id: 'USR-8909',
    name: 'Anisur Rahman',
    email: 'anisur.tech@gmail.com',
    phone: '+880 1812-998877',
    role: 'Candidate / Job Seeker',
    status: 'deactivated',
    joinedDate: '2026-11-14T08:30:00Z',
    scansCount: 45,
    reportsCount: 0,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'USR-8908',
    name: 'Sabrina Mostafa',
    email: 'sabrina.hr@beximco.com',
    phone: '+880 1911-223344',
    role: 'Verified Employer',
    status: 'active',
    joinedDate: '2026-11-10T12:00:00Z',
    scansCount: 12,
    reportsCount: 1,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'USR-8907',
    name: 'Dr. Mahmudul Karim',
    email: 'm.karim@du.ac.bd',
    phone: '+880 1711-554433',
    role: 'Whistleblower Analyst',
    status: 'active',
    joinedDate: '2026-10-25T09:15:00Z',
    scansCount: 68,
    reportsCount: 9,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
  },
];

export const MockDataProvider = ({ children }) => {
  // 1. Scanned Job Circulars
  const [circulars, setCirculars] = useState(() =>
    getStored('cs_mock_circulars', MOCK_CIRCULARS)
  );

  useEffect(() => {
    setStored('cs_mock_circulars', circulars);
  }, [circulars]);

  // 2. Whistleblower Scam Reports
  const [scamReports, setScamReports] = useState(() =>
    getStored('cs_mock_scam_reports', INITIAL_CONSOLIDATED_REPORTS)
  );

  useEffect(() => {
    setStored('cs_mock_scam_reports', scamReports);
  }, [scamReports]);

  // 3. Organization Registry
  const [organizations, setOrganizations] = useState(() =>
    getStored('cs_mock_organizations', MOCK_VERIFIED_ORGANIZATIONS)
  );

  useEffect(() => {
    setStored('cs_mock_organizations', organizations);
  }, [organizations]);

  // 4. Verification Queue
  const [verificationQueue, setVerificationQueue] = useState(() =>
    getStored('cs_mock_verification_queue', ADMIN_RECENT_VERIFICATIONS)
  );

  useEffect(() => {
    setStored('cs_mock_verification_queue', verificationQueue);
  }, [verificationQueue]);

  // 5. User Management Roster
  const [users, setUsers] = useState(() =>
    getStored('cs_mock_users', INITIAL_CONSOLIDATED_USERS)
  );

  useEffect(() => {
    setStored('cs_mock_users', users);
  }, [users]);

  // 6. Safety Tips & Awareness Articles
  const [safetyArticles, setSafetyArticles] = useState(() =>
    getStored(
      'cs_mock_safety_articles',
      SAFETY_ARTICLES.map((a) => ({ ...a, isPublished: true }))
    )
  );

  useEffect(() => {
    setStored('cs_mock_safety_articles', safetyArticles);
  }, [safetyArticles]);

  // --------------------------------------------------------------------------
  // ACTIONS: Circulars
  // --------------------------------------------------------------------------
  const addScannedCircular = (formData) => {
    const analysis = analyzeCircular(formData);
    const newEntry = {
      id: `CIR-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      title: formData.title || 'Evaluated Job Notice',
      company: formData.company || 'Hiring Entity',
      companyLogo:
        formData.companyLogo ||
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=80',
      sector: formData.sector || 'General / Unclassified',
      location: formData.location || 'Bangladesh (Specified in body)',
      salary: formData.salary || 'Negotiable / Unspecified',
      postedDate: new Date().toISOString(),
      deadline: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString(),
      status: analysis.status,
      riskScore: analysis.score,
      verifiedOrg: analysis.status === 'verified',
      views: 1,
      applications: 0,
      source: 'User Instant Verification Scan',
      url: formData.website || '',
      email: formData.email || '',
      description: formData.content,
      redFlags: analysis.redFlags || [],
      trustFactors: analysis.trustFactors || [],
      recommendations: analysis.recommendations || [],
    };

    setCirculars((prev) => [newEntry, ...prev]);
    return newEntry;
  };

  const deleteCircular = (id) => {
    setCirculars((prev) => prev.filter((c) => c.id !== id));
  };

  const getCircularById = useCallback(
    (id) => {
      return circulars.find((c) => c.id === id) || null;
    },
    [circulars]
  );

  // --------------------------------------------------------------------------
  // ACTIONS: Whistleblower Scam Reports
  // --------------------------------------------------------------------------
  const submitScamReport = (reportData) => {
    const formattedAmount = reportData.amountDemanded
      ? typeof reportData.amountDemanded === 'number'
        ? `BDT ${reportData.amountDemanded.toLocaleString()}`
        : reportData.amountDemanded.startsWith('BDT')
        ? reportData.amountDemanded
        : `BDT ${reportData.amountDemanded}`
      : 'Unspecified';

    const newReport = {
      id: `RPT-2026-${Math.floor(9000 + Math.random() * 1000)}`,
      title:
        reportData.title ||
        `${reportData.category || 'Recruitment Scam'} reported for ${reportData.jobCompanyName || reportData.targetEntity || 'Target Organization'}`,
      targetEntity: reportData.jobCompanyName || reportData.targetEntity || 'Unspecified Entity',
      category: reportData.category || 'Fake Job Circular',
      amountDemanded: formattedAmount,
      reportedDate: new Date().toISOString(),
      status: 'investigating',
      priority: 'high',
      reporter: reportData.isAnonymous ? 'Anonymous Whistleblower' : 'Shafiqur Rahman',
      evidenceDetails:
        reportData.description ||
        reportData.summary ||
        'Submitted through secure whistleblower portal.',
      evidenceFiles: reportData.evidencePreviewUrl
        ? [reportData.evidencePreviewUrl]
        : [
            'https://images.unsplash.com/photo-1572945281869-826b8e485e07?w=500&auto=format&fit=crop&q=80',
          ],
      reviewerNotes: 'Pending initial analyst triage in verification queue.',
      website: reportData.website || '',
      phone: reportData.phone || '',
      paymentNumber: reportData.paymentNumber || '',
    };

    setScamReports((prev) => [newReport, ...prev]);
    return newReport;
  };

  const updateReportStatus = (reportId, newStatus, reviewerNotes = '') => {
    setScamReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? {
              ...r,
              status: newStatus,
              reviewerNotes: reviewerNotes || r.reviewerNotes,
            }
          : r
      )
    );
  };

  const deleteReport = (id) => {
    setScamReports((prev) => prev.filter((r) => r.id !== id));
  };

  // --------------------------------------------------------------------------
  // ACTIONS: Organization Registry
  // --------------------------------------------------------------------------
  const addOrganization = (orgData) => {
    const newOrg = {
      id: `ORG-${Math.floor(100 + Math.random() * 900)}`,
      name: orgData.name,
      category: orgData.category || 'Corporate Enterprise',
      logo:
        orgData.logo ||
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=80',
      description:
        orgData.description || 'Verified enterprise corporate employer registered in Bangladesh.',
      registrationNumber:
        orgData.registrationNumber || `C-${Math.floor(10000 + Math.random() * 90000)}/26`,
      establishedYear: Number(orgData.establishedYear) || 2026,
      officialWebsite: orgData.officialWebsite || 'https://example.com',
      officialCareerPage: orgData.officialCareerPage || 'https://example.com/careers',
      officialEmailDomain: orgData.officialEmailDomain || 'example.com',
      officialHotline: orgData.officialHotline || '+880 2 99887766',
      headquarters: orgData.headquarters || 'Dhaka, Bangladesh',
      verificationStatus: orgData.verificationStatus || 'verified',
      trustScore: orgData.verificationStatus === 'verified' ? 95 : 45,
      activeVacanciesCount: 0,
      scamReportsCount: 0,
      verifiedDate: new Date().toISOString(),
      badges: ['Enterprise Registered', 'Official Domain'],
      accreditations: ['RJSC Registered'],
    };

    setOrganizations((prev) => [newOrg, ...prev]);
    return newOrg;
  };

  const updateOrganization = (orgId, updateData) => {
    setOrganizations((prev) =>
      prev.map((o) => (o.id === orgId ? { ...o, ...updateData } : o))
    );
  };

  const deleteOrganization = (orgId) => {
    setOrganizations((prev) => prev.filter((o) => o.id !== orgId));
  };

  // --------------------------------------------------------------------------
  // ACTIONS: Verification Queue
  // --------------------------------------------------------------------------
  const submitVerificationRequest = (requestData) => {
    const newReq = {
      id: `VER-${Math.floor(400 + Math.random() * 600)}`,
      organization: requestData.companyName,
      category: requestData.category || 'Corporate & Tech',
      logo:
        requestData.logo ||
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop&q=80',
      requestDate: new Date().toISOString(),
      status: 'pending',
      officialWebsite: requestData.website,
      officialCareerPage: requestData.website
        ? `${requestData.website.replace(/\/$/, '')}/careers`
        : '',
      officialEmailDomain: requestData.corporateEmail?.split('@')?.[1] || 'domain.com',
      registrationNumber: requestData.tradeLicense || 'Pending RJSC',
      documentsSubmitted: [
        'Trade License Certificate',
        'TIN Certificate',
        'Contact Person Authorization',
      ],
      assignedAuditor: 'SecOps Tier-1 Triage',
      contactPerson: requestData.contactPerson || 'Authorized Representative',
      headquarters: requestData.headquarters || 'Dhaka, Bangladesh',
    };

    setVerificationQueue((prev) => [newReq, ...prev]);
    return newReq;
  };

  const approveVerification = useCallback(
    (queueId) => {
      const target = verificationQueue.find((q) => q.id === queueId);
      if (!target) return;

      setVerificationQueue((prev) =>
        prev.map((q) => (q.id === queueId ? { ...q, status: 'verified' } : q))
      );

      // Also reflect or add in organizations
      setOrganizations((prev) => {
        const exists = prev.find(
          (o) => o.name.toLowerCase() === target.organization.toLowerCase()
        );
        if (exists) {
          return prev.map((o) =>
            o.id === exists.id ? { ...o, verificationStatus: 'verified', trustScore: 96 } : o
          );
        }
        return [
          {
            id: `ORG-${Math.floor(100 + Math.random() * 900)}`,
            name: target.organization,
            category: target.category,
            logo: target.logo,
            description: `Certified organization: verified on ${new Date().toLocaleDateString()}.`,
            registrationNumber: target.registrationNumber,
            establishedYear: 2026,
            officialWebsite: target.officialWebsite,
            officialCareerPage: target.officialCareerPage,
            officialEmailDomain: target.officialEmailDomain,
            officialHotline: '+880 2 88776655',
            headquarters: target.headquarters,
            verificationStatus: 'verified',
            trustScore: 98,
            activeVacanciesCount: 1,
            scamReportsCount: 0,
            verifiedDate: new Date().toISOString(),
            badges: ['Certified Enterprise', 'RJSC Validated'],
            accreditations: ['RJSC Registered', 'Domain Verified'],
          },
          ...prev,
        ];
      });
    },
    [verificationQueue]
  );

  const rejectVerification = (queueId, reason = '') => {
    setVerificationQueue((prev) =>
      prev.map((q) =>
        q.id === queueId
          ? {
              ...q,
              status: 'flagged',
              assignedAuditor: `Rejected: ${reason || 'Failed document verification'}`,
            }
          : q
      )
    );
  };

  // --------------------------------------------------------------------------
  // ACTIONS: Users
  // --------------------------------------------------------------------------
  const addUser = (userData) => {
    const newUser = {
      id: `USR-${Math.floor(8900 + Math.random() * 100)}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '+880 1711-000000',
      role: userData.role || 'Candidate / Job Seeker',
      status: 'active',
      joinedDate: new Date().toISOString(),
      scansCount: 0,
      reportsCount: 0,
      avatar:
        userData.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    };

    setUsers((prev) => [newUser, ...prev]);
    return newUser;
  };

  const updateUser = (userId, data) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...data } : u))
    );
  };

  const toggleUserStatus = (userId) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              status: u.status === 'active' ? 'deactivated' : 'active',
            }
          : u
      )
    );
  };

  const deleteUser = (userId) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  // --------------------------------------------------------------------------
  // ACTIONS: Safety Tips & Articles
  // --------------------------------------------------------------------------
  const addSafetyArticle = (articleData) => {
    const newArt = {
      id: `tip-${Date.now()}`,
      categoryId: articleData.categoryId || 'job-scam-awareness',
      categoryName: {
        en: 'Job Scam Awareness',
        bn: 'চাকরির প্রতারণা সচেতনতা',
      },
      icon: 'ShieldAlert',
      badgeColor: '#087F70',
      readingTime: articleData.readingTime || '3 min read',
      isPublished: articleData.isPublished !== false,
      en: {
        title: articleData.titleEn,
        shortDesc: articleData.shortDescEn,
        sections: [
          {
            heading: 'Key Safety Advisory',
            body: articleData.fullContentEn || articleData.shortDescEn,
          },
        ],
      },
      bn: {
        title: articleData.titleBn || articleData.titleEn,
        shortDesc: articleData.shortDescBn || articleData.shortDescEn,
        sections: [
          {
            heading: 'জরুরি নিরাপত্তা পরামর্শ',
            body: articleData.fullContentBn || articleData.fullContentEn,
          },
        ],
      },
    };

    setSafetyArticles((prev) => [newArt, ...prev]);
    return newArt;
  };

  const updateSafetyArticle = (articleId, data) => {
    setSafetyArticles((prev) =>
      prev.map((a) => (a.id === articleId ? { ...a, ...data } : a))
    );
  };

  const deleteSafetyArticle = (articleId) => {
    setSafetyArticles((prev) => prev.filter((a) => a.id !== articleId));
  };

  const toggleArticlePublish = (articleId) => {
    setSafetyArticles((prev) =>
      prev.map((a) =>
        a.id === articleId ? { ...a, isPublished: !a.isPublished } : a
      )
    );
  };

  // Reset all stores to defaults
  const resetToDefaults = () => {
    try {
      localStorage.removeItem('cs_mock_circulars');
      localStorage.removeItem('cs_mock_scam_reports');
      localStorage.removeItem('cs_mock_organizations');
      localStorage.removeItem('cs_mock_verification_queue');
      localStorage.removeItem('cs_mock_users');
      localStorage.removeItem('cs_mock_safety_articles');
    } catch {
      // ignore
    }
    setCirculars(MOCK_CIRCULARS);
    setScamReports(INITIAL_CONSOLIDATED_REPORTS);
    setOrganizations(MOCK_VERIFIED_ORGANIZATIONS);
    setVerificationQueue(ADMIN_RECENT_VERIFICATIONS);
    setUsers(INITIAL_CONSOLIDATED_USERS);
    setSafetyArticles(
      SAFETY_ARTICLES.map((a) => ({ ...a, isPublished: true }))
    );
  };

  const value = useMemo(
    () => ({
      isMockStore: true,
      circulars,
      scamReports,
      organizations,
      verificationQueue,
      users,
      safetyArticles,
      // Methods
      addScannedCircular,
      deleteCircular,
      getCircularById,
      submitScamReport,
      updateReportStatus,
      deleteReport,
      addOrganization,
      updateOrganization,
      deleteOrganization,
      submitVerificationRequest,
      approveVerification,
      rejectVerification,
      addUser,
      updateUser,
      toggleUserStatus,
      deleteUser,
      addSafetyArticle,
      updateSafetyArticle,
      deleteSafetyArticle,
      toggleArticlePublish,
      resetToDefaults,
    }),
    [
      circulars,
      scamReports,
      organizations,
      verificationQueue,
      users,
      safetyArticles,
      approveVerification,
      getCircularById,
    ]
  );

  return (
    <MockDataContext.Provider value={value}>
      {children}
    </MockDataContext.Provider>
  );
};

export default MockDataProvider;
