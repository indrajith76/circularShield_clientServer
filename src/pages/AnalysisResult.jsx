
import { useState } from 'react';
import {
  useNavigate,
  useLocation
} from 'react-router-dom';


const RISK_STYLES = {
  high: {
    color: '#DC4B4B',
    background: '#FEF2F2',
    label: 'HIGH RISK',
    description: 'High estimated fraud risk',
  },

  medium: {
    color: '#D99A28',
    background: '#FFFBEB',
    label: 'MEDIUM RISK',
    description: 'Further verification recommended',
  },

  low: {
    color: '#16A36A',
    background: '#ECFDF5',
    label: 'LOW RISK',
    description: 'Low estimated fraud risk',
  },

  unknown: {
    color: '#64748B',
    background: '#F1F5F9',
    label: 'UNKNOWN',
    description: 'Risk level unavailable',
  },
};


const SOURCE_LABELS = {
  pdf: 'PDF Document',
  image: 'Image',
  text: 'Pasted Text',
  url: 'Website URL',
};


const INDICATOR_LABELS = {
  advance_payment: 'Payment Request',
  guaranteed_job: 'Guaranteed Job',
  urgent_application: 'Urgent Application',
  personal_payment: 'Personal Payment Account',
  unrealistic_income: 'Unrealistic Income',
};


const SAFETY_GUIDANCE = {
  high: {
    en: 'This circular has a high estimated fraud risk. Do not send money or sensitive personal documents until you independently verify the employer and recruitment process.',

    bn: 'এই নিয়োগ বিজ্ঞপ্তিতে প্রতারণার উচ্চ ঝুঁকি রয়েছে। প্রতিষ্ঠান ও নিয়োগ প্রক্রিয়া যাচাই না করে টাকা পাঠাবেন না বা ব্যক্তিগত তথ্য শেয়ার করবেন না।',
  },

  medium: {
    en: 'This circular requires further verification. Check the official recruitment website, organization details and payment instructions before applying.',

    bn: 'এই নিয়োগ বিজ্ঞপ্তিটি আরও যাচাই করা প্রয়োজন। আবেদন করার আগে প্রতিষ্ঠানের অফিসিয়াল ওয়েবসাইট, নিয়োগের তথ্য এবং টাকা প্রদানের নির্দেশনা যাচাই করুন।',
  },

  low: {
    en: 'The model estimates a low fraud risk. However, this does not guarantee authenticity. Verify the employer and official application process before applying.',

    bn: 'মডেলের বিশ্লেষণ অনুযায়ী প্রতারণার ঝুঁকি কম। তবে এটি বিজ্ঞপ্তির সত্যতার নিশ্চয়তা নয়। আবেদন করার আগে প্রতিষ্ঠান ও নিয়োগ প্রক্রিয়া যাচাই করুন।',
  },

  unknown: {
    en: 'The risk level could not be determined. Independently verify the circular before applying.',

    bn: 'প্রতারণার ঝুঁকি নির্ধারণ করা যায়নি। আবেদন করার আগে বিজ্ঞপ্তিটি নিজ দায়িত্বে যাচাই করুন।',
  },
};


export const AnalysisResult = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const [showFullText, setShowFullText] =
    useState(false);


  // Data received from AnalyzeCircular.jsx
  const analysisData = location.state;

  const result = analysisData?.result;


  // Handle direct page access or missing result
  if (!result) {

    return (
      <div className="min-h-[450px] flex items-center justify-center">

        <div className="bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-xs text-center max-w-md w-full space-y-4">

          <div className="text-5xl text-[#94A3B8]">
            <svg
              className="w-14 h-14 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9 12h6m-6 4h6M7 3h7l5 5v13H5V3h2z"
              />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-[#0F172A]">
            No Analysis Result
          </h2>

          <p className="text-sm text-[#64748B]">
            Please analyze a job circular first to view
            its risk assessment.
          </p>

          <button
            type="button"
            onClick={() => navigate('/analyze')}
            className="w-full py-3 rounded-xl bg-[#087F70] text-white text-sm font-semibold hover:bg-[#066559] transition-colors cursor-pointer"
          >
            Analyze a Circular
          </button>

        </div>

      </div>
    );
  }


  // ==============================
  // Prepare dynamic analysis data
  // ==============================

  const analysisId =
    analysisData.analysisId || null;

  const sourceType =
    analysisData.sourceType || 'text';

  const sourceUrl =
    analysisData.sourceUrl || null;

  const fileName =
    analysisData.fileName || null;

  const language =
    analysisData.language ||
    result.language ||
    'en';

  const circularText =
    analysisData.text || '';

  const rawScore = Number(result.risk_score);

  const hasScore =
    result.risk_score !== null &&
    result.risk_score !== undefined &&
    Number.isFinite(rawScore);

  const riskScore = hasScore
    ? Math.min(100, Math.max(0, rawScore))
    : 0;

  const rawRiskLevel = String(
    result.risk_level || 'unknown'
  ).toLowerCase();

  const riskLevel =
    hasScore &&
    Object.hasOwn(RISK_STYLES, rawRiskLevel)
      ? rawRiskLevel
      : 'unknown';

  const riskStyle = RISK_STYLES[riskLevel];

  const guidance = SAFETY_GUIDANCE[riskLevel];

  const indicators = Array.isArray(
    result.fraud_indicators
  )
    ? result.fraud_indicators
    : [];

  const urls = Array.isArray(result.urls)
    ? result.urls.filter(
        (url) => typeof url === 'string'
      )
    : [];

  const prediction =
    result.prediction &&
    typeof result.prediction === 'object'
      ? result.prediction
      : {};

  const modelName =
    prediction.model ||
    'Bilingual Linear SVC';

  const fakeProbability =
    prediction.fake_probability;

  const realProbability =
    prediction.real_probability;

  const confidence =
    prediction.confidence;


  // Dynamic circular progress ring
  const radius = 40;

  const circumference =
    2 * Math.PI * radius;

  const strokeOffset =
    circumference -
    (riskScore / 100) * circumference;


  // Source title
  const circularTitle =
    fileName ||
    analysisData.urlTitle ||
    (sourceType === 'url'
      ? 'Website Job Circular'
      : 'Job Circular Analysis');


  // Backend explanation
  const backendExplanation =
    typeof result.explanation === 'string'
      ? result.explanation
      : '';


  // Print / Save as PDF
  const handleDownload = () => {
    window.print();
  };


  // Pass analysis information to Report Scam page
  const handleReportScam = () => {

    navigate('/report-scam', {
      state: {
        analysisId,
        riskScore: hasScore ? riskScore : null,
        riskLevel,
        sourceType,
        sourceUrl,
        fileName,
        circularText,
        indicators,
      },
    });
  };


  return (

    <div className="space-y-6 print:space-y-4">


      {/* 1. Header */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
            Analysis Result
          </h1>

          <p className="text-sm text-[#64748B] mt-1 break-all">
            {circularTitle}
            {' · '}
            {SOURCE_LABELS[sourceType] || sourceType}
          </p>

        </div>


        <div className="flex flex-wrap gap-2 print:hidden">

          <button
            type="button"
            onClick={() => navigate('/analyze')}
            className="px-4 py-2 rounded-xl bg-[#087F70] text-white text-xs font-semibold hover:bg-[#066559] transition-colors cursor-pointer"
          >
            New Analysis
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="px-4 py-2 rounded-xl border border-[#CBD5E1] bg-white text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] transition-colors shadow-xs cursor-pointer"
          >
            Save as PDF
          </button>

        </div>

      </div>


      {/* 2. Risk Score and Fraud Indicators */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


        {/* Dynamic Risk Score Card */}

        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs flex flex-col items-center justify-center text-center">

          <h2 className="text-sm font-bold text-[#0F172A] mb-5">
            Circular Risk Score
          </h2>


          <div
            className="relative w-40 h-40 flex items-center justify-center"
            role="img"
            aria-label={
              hasScore
                ? `Risk score ${riskScore} out of 100`
                : 'Risk score unavailable'
            }
          >

            <svg
              className="w-full h-full -rotate-90"
              viewBox="0 0 100 100"
            >

              {/* Background circle */}

              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="#F1F5F9"
                strokeWidth="10"
                fill="transparent"
              />


              {/* Dynamic score circle */}

              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke={riskStyle.color}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700"
              />

            </svg>


            <div className="absolute flex flex-col items-center justify-center">

              <span
                className="text-4xl font-extrabold"
                style={{ color: riskStyle.color }}
              >
                {hasScore ? Math.round(riskScore) : '—'}
              </span>

              <span className="text-xs text-[#94A3B8]">
                / 100
              </span>

            </div>

          </div>


          <div className="mt-4 space-y-2">

            <span
              className="inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
              style={{
                backgroundColor: riskStyle.background,
                color: riskStyle.color,
              }}
            >
              {riskStyle.label}
            </span>

            <p className="text-xs text-[#64748B] font-medium">
              {riskStyle.description}
            </p>

            <p className="text-xs text-[#64748B]">
              {indicators.length} fraud indicator(s)
              detected
            </p>

          </div>

        </div>


        {/* Dynamic Fraud Indicators */}

        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">

          <div className="flex items-center justify-between gap-2">

            <h2 className="text-sm font-bold text-[#0F172A]">
              Detected Fraud Indicators
            </h2>

            <span className="px-2.5 py-1 rounded-full bg-[#F1F5F9] text-[#64748B] text-xs font-semibold">
              {indicators.length} detected
            </span>

          </div>


          {indicators.length > 0 ? (

            <div className="divide-y divide-[#F1F5F8]">

              {indicators.map((indicator, index) => {

                const severity = String(
                  indicator.severity || 'unknown'
                ).toLowerCase();

                const severityColor =
                  severity === 'high'
                    ? '#DC4B4B'
                    : severity === 'medium'
                    ? '#D99A28'
                    : '#64748B';

                const matchedKeywords =
                  Array.isArray(
                    indicator.matched_keywords
                  )
                    ? indicator.matched_keywords
                    : [];

                return (

                  <div
                    key={`${indicator.id || 'indicator'}-${index}`}
                    className="py-4 first:pt-0 space-y-2"
                  >

                    <div className="flex items-center justify-between gap-3">

                      <h3 className="text-sm font-semibold text-[#0F172A]">

                        {INDICATOR_LABELS[indicator.id] ||
                          indicator.id ||
                          'Fraud Indicator'}

                      </h3>

                      <span
                        className="text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-[#F8FAFC]"
                        style={{ color: severityColor }}
                      >
                        {severity}
                      </span>

                    </div>


                    {indicator.message && (

                      <p className="text-xs text-[#64748B] leading-relaxed">
                        {indicator.message}
                      </p>

                    )}


                    {matchedKeywords.length > 0 && (

                      <div className="flex flex-wrap gap-2">

                        {matchedKeywords.map(
                          (keyword, keywordIndex) => (

                            <span
                              key={keywordIndex}
                              className="px-2.5 py-1 rounded-lg bg-[#FEF2F2] text-[#DC4B4B] text-xs font-medium break-all"
                            >
                              {keyword}
                            </span>

                          )
                        )}

                      </div>

                    )}

                  </div>

                );

              })}

            </div>

          ) : (

            <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-6 text-center space-y-2">

              <p className="text-sm font-semibold text-[#0F172A]">
                No rule-based fraud indicators detected
              </p>

              <p className="text-xs text-[#64748B]">
                This does not guarantee that the
                circular is genuine.
              </p>

            </div>

          )}

        </div>

      </div>


      {/* 3. Machine Learning Information */}

      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-5">

        <div>

          <h2 className="text-sm font-bold text-[#0F172A]">
            Machine Learning Prediction
          </h2>

          <p className="text-xs text-[#64748B] mt-1">
            Model: {modelName}
          </p>

        </div>


        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <ProbabilityCard
            title="Fake Probability"
            value={fakeProbability}
            color="#DC4B4B"
          />

          <ProbabilityCard
            title="Real Probability"
            value={realProbability}
            color="#16A36A"
          />

          <ProbabilityCard
            title="Model Confidence"
            value={confidence}
            color="#087F70"
          />

        </div>

        <p className="text-xs text-[#64748B]">
          Model probabilities are estimates, not
          confirmed findings of fraud.
        </p>

      </div>


      {/* 4. Verification Summary */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">

          <p className="text-xs text-[#64748B] font-medium">
            Organization
          </p>

          <p className="text-sm font-bold text-[#D99A28] mt-1">
            Not Verified
          </p>

          <p className="text-xs text-[#94A3B8] mt-2">
            Organization directory verification
            has not been performed.
          </p>

        </div>


        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">

          <p className="text-xs text-[#64748B] font-medium">
            Application URL
          </p>

          <p className="text-sm font-bold text-[#0F172A] mt-1">
            {urls.length > 0
              ? `${urls.length} URL(s) detected`
              : 'No URL detected'}
          </p>

          <p className="text-xs text-[#D99A28] mt-2">
            Domain authenticity not verified
          </p>

        </div>


        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">

          <p className="text-xs text-[#64748B] font-medium">
            Reported Contacts
          </p>

          <p className="text-sm font-bold text-[#D99A28] mt-1">
            Not Checked
          </p>

          <p className="text-xs text-[#94A3B8] mt-2">
            Previous scam reports have not been
            checked.
          </p>

        </div>

      </div>


      {/* 5. Detected URLs */}

      {urls.length > 0 && (

        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">

          <h2 className="text-sm font-bold text-[#0F172A]">
            Detected URLs
          </h2>

          <p className="text-xs text-[#64748B]">
            These URLs were extracted from the
            circular text. Their authenticity has
            not been verified.
          </p>

          <div className="space-y-2">

            {urls.map((url, index) => (

              <div
                key={`${url}-${index}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#F8FAFC] rounded-xl p-3 border border-[#E2E8F0]"
              >

                <p className="text-xs font-medium text-[#334155] break-all">
                  {url}
                </p>

                <span className="text-[10px] font-semibold text-[#D99A28] shrink-0">
                  Unverified
                </span>

              </div>

            ))}

          </div>

        </div>

      )}


      {/* 6. Backend Explanation */}

      {backendExplanation && (

        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-3">

          <h2 className="text-sm font-bold text-[#0F172A]">
            Analysis Explanation
            {' '}
            ({language === 'bn' ? 'বাংলা' : 'English'})
          </h2>

          <p className="text-sm text-[#334155] leading-relaxed whitespace-pre-wrap">
            {backendExplanation}
          </p>

        </div>

      )}


      {/* 7. Bilingual Safety Guidance */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs space-y-2">

          <h3 className="text-xs font-bold text-[#0F172A]">
            বাংলা নিরাপত্তা পরামর্শ
          </h3>

          <p className="text-sm text-[#334155] leading-relaxed">
            {guidance.bn}
          </p>

        </div>


        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs space-y-2">

          <h3 className="text-xs font-bold text-[#0F172A]">
            English Safety Guidance
          </h3>

          <p className="text-sm text-[#334155] leading-relaxed">
            {guidance.en}
          </p>

        </div>

      </div>


      {/* 8. Analysis Information */}

      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">

        <h2 className="text-sm font-bold text-[#0F172A]">
          Analysis Information
        </h2>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          <InfoItem
            label="Analysis ID"
            value={analysisId || 'Unavailable'}
          />

          <InfoItem
            label="Source Type"
            value={
              SOURCE_LABELS[sourceType] ||
              sourceType
            }
          />

          <InfoItem
            label="Selected Language"
            value={
              language === 'bn'
                ? 'বাংলা (Bangla)'
                : 'English'
            }
          />

          <InfoItem
            label="Fraud Indicators"
            value={indicators.length}
          />

          <InfoItem
            label="Character Count"
            value={
              circularText.length.toLocaleString()
            }
          />

          <InfoItem
            label="Word Count"
            value={
              circularText.trim()
                ? circularText
                    .trim()
                    .split(/\s+/)
                    .length
                    .toLocaleString()
                : 0
            }
          />

        </div>


        {fileName && (

          <InfoItem
            label="Uploaded File"
            value={fileName}
          />

        )}


        {sourceUrl && (

          <InfoItem
            label="Source Website"
            value={sourceUrl}
          />

        )}

      </div>


      {/* 9. View Original Analyzed Text */}

      {circularText && (

        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">

          <div className="flex items-center justify-between gap-3">

            <h2 className="text-sm font-bold text-[#0F172A]">
              Analyzed Circular Text
            </h2>

            <button
              type="button"
              onClick={() =>
                setShowFullText((previous) => !previous)
              }
              className="text-xs font-semibold text-[#087F70] hover:underline cursor-pointer print:hidden"
            >
              {showFullText
                ? 'Hide Full Text'
                : 'View Full Text'}
            </button>

          </div>


          <div
            className={`bg-[#FAFCFD] rounded-xl border border-[#E2E8F0] p-4 text-sm text-[#334155] leading-relaxed whitespace-pre-wrap break-words ${
              showFullText
                ? 'max-h-[500px] overflow-y-auto'
                : 'max-h-[130px] overflow-hidden'
            } print:max-h-none print:overflow-visible`}
          >
            {circularText}
          </div>

        </div>

      )}


      {/* 10. Recommendation and Report Scam */}

      <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">

        <div className="space-y-1">

          <p className="text-sm font-semibold text-[#334155]">
            Recommended Actions
          </p>

          <p className="text-xs text-[#64748B] leading-relaxed">

            {riskLevel === 'high'
              ? 'Avoid payment, protect your personal information and independently verify the circular.'
              : riskLevel === 'medium'
              ? 'Verify the employer, recruitment process and application instructions.'
              : 'Check the official recruitment source before applying.'}

          </p>

        </div>


        <button
          type="button"
          onClick={handleReportScam}
          className="w-full sm:w-auto shrink-0 px-5 py-2.5 rounded-xl bg-[#991B1B] text-white text-xs sm:text-sm font-semibold hover:bg-[#7F1D1D] transition-colors shadow-xs cursor-pointer print:hidden"
        >
          Report Scam
        </button>

      </div>


      {/* 11. Disclaimer */}

      <div className="rounded-xl bg-[#FFFBEB] border border-[#FDE68A] p-4">

        <p className="text-xs text-[#92400E] leading-relaxed">

          <strong>Disclaimer:</strong> CircularShield
          provides machine learning and rule-based
          risk assessments. A high risk score does
          not prove fraud, and a low risk score does
          not guarantee authenticity. Always verify
          recruitment information through official
          sources.

        </p>

      </div>

    </div>

  );

};


// ======================================
// Reusable Probability Card
// ======================================

const ProbabilityCard = ({
  title,
  value,
  color
}) => {

  const numericValue = Number(value);

  const available =
    value !== null &&
    value !== undefined &&
    value !== '' &&
    Number.isFinite(numericValue);

  const percentage = available
    ? Math.max(0, Math.min(100, numericValue))
    : 0;


  return (

    <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 space-y-3">

      <p className="text-xs font-medium text-[#64748B]">
        {title}
      </p>

      <p
        className="text-2xl font-bold"
        style={{ color }}
      >
        {available
          ? `${percentage.toFixed(2)}%`
          : 'N/A'}
      </p>

      <div className="w-full h-2 rounded-full bg-[#E2E8F0] overflow-hidden">

        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />

      </div>

    </div>

  );

};


// ======================================
// Reusable Information Item
// ======================================

const InfoItem = ({ label, value }) => {

  return (

    <div className="space-y-1">

      <p className="text-xs text-[#64748B] font-medium">
        {label}
      </p>

      <p className="text-sm font-semibold text-[#0F172A] break-all">
        {value}
      </p>

    </div>

  );

};


export default AnalysisResult;
