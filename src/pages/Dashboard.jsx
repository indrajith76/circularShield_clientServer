
import {
  useState,
  useEffect,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthProvider";

import {
  getDashboardData,
} from "../services/dashboardApi";


// =====================================
// Risk Level Configuration
// =====================================

const RISK_CONFIG = {

  low: {

    label: "LOW RISK",

    color: "#16A36A",

    style: "bg-[#ECFDF5] text-[#16A36A]",

  },

  medium: {

    label: "MEDIUM RISK",

    color: "#D99A28",

    style: "bg-[#FFFBEB] text-[#D99A28]",

  },

  high: {

    label: "SUSPICIOUS",

    color: "#DC4B4B",

    style: "bg-[#FEF2F2] text-[#DC4B4B]",

  },

  unknown: {

    label: "UNKNOWN",

    color: "#64748B",

    style: "bg-[#F1F5F9] text-[#64748B]",

  },

};


// =====================================
// Source Type Configuration
// =====================================

const SOURCE_LABELS = {

  pdf: "PDF",

  image: "Image",

  text: "Text",

  url: "URL",

};


// =====================================
// Dashboard Component
// =====================================

export const Dashboard = () => {

  const navigate = useNavigate();

  const { user, profile } = useAuth();


  // Dashboard states

  const [dashboardData, setDashboardData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [refreshKey, setRefreshKey] =
    useState(0);


  // ===================================
  // 1. Load Dashboard Data
  // ===================================

  useEffect(() => {

    if (!user?.uid) {

      setDashboardData(null);
      setLoading(false);

      return;

    }

    const controller = new AbortController();

    let active = true;


    const loadDashboard = async () => {

      setLoading(true);

      setError("");

      setDashboardData(null);


      try {

        const response = await getDashboardData(
          controller.signal
        );

        if (active) {

          setDashboardData(response);

        }

      } catch (err) {

        if (
          active &&
          err.name !== "AbortError"
        ) {

          console.error(
            "Dashboard loading failed:",
            err
          );

          setError(

            err.message ||

            "Unable to load dashboard data."

          );

        }

      } finally {

        if (active) {

          setLoading(false);

        }

      }

    };


    loadDashboard();


    return () => {

      active = false;

      controller.abort();

    };

  }, [user?.uid, refreshKey]);


  // ===================================
  // 2. Prepare Dashboard Data
  // ===================================

  const userName =

    dashboardData?.user?.name ||

    profile?.name ||

    user?.displayName ||

    "User";


  const statistics =

    dashboardData?.statistics || {

      total_analyzed: 0,

      low_risk: 0,

      medium_risk: 0,

      high_risk: 0,

      unknown_risk: 0,

    };


  const recentAnalyses =

    dashboardData?.recent_analyses || [];


  const recentAlerts =

    dashboardData?.recent_alerts || [];


  // ===================================
  // 3. Metric Cards
  // ===================================

  const metrics = [

    {

      label: "Total Analyzed",

      value: statistics.total_analyzed,

      color: "#0F172A",

    },

    {

      label: "Low Risk",

      value: statistics.low_risk,

      color: "#16A36A",

    },

    {

      label: "Suspicious",

      value: statistics.high_risk,

      color: "#DC4B4B",

    },

    {

      label: "Medium Risk",

      value: statistics.medium_risk,

      color: "#D99A28",

    },

  ];


  // ===================================
  // 4. Dynamic Chart Data
  // ===================================

  const chartData = [

    {

      label: "Low Risk",

      value: statistics.low_risk,

      color: "#16A36A",

    },

    {

      label: "Suspicious",

      value: statistics.high_risk,

      color: "#DC4B4B",

    },

    {

      label: "Medium Risk",

      value: statistics.medium_risk,

      color: "#D99A28",

    },

  ];


  // Include unknown risk when necessary

  if (statistics.unknown_risk > 0) {

    chartData.push({

      label: "Unknown",

      value: statistics.unknown_risk,

      color: "#64748B",

    });

  }


  const maxChartValue = Math.max(

    ...chartData.map((item) => item.value),

    1

  );


  // ===================================
  // 5. Format Analysis Date
  // ===================================

  const formatDate = (value) => {

    if (!value) return "Date unavailable";

    // MongoDB timestamps without an offset are UTC
    const normalizedValue =
      /(?:Z|[+-]\d{2}:\d{2})$/i.test(value)
        ? value
        : `${value}Z`;

    const date = new Date(normalizedValue);

    if (Number.isNaN(date.getTime())) {

      return "Date unavailable";

    }

    return date.toLocaleDateString(

      "en-GB",

      {

        day: "numeric",

        month: "short",

        year: "numeric",

      }

    );

  };


  // ===================================
  // 6. View Saved Analysis
  // ===================================

  const handleViewAnalysis = (analysis) => {

    navigate("/analysis-result", {

      state: {

        analysisId: analysis.analysis_id,

        result: analysis.result,

        text: analysis.text || "",

        language: analysis.language || "en",

        sourceType: analysis.source_type || "text",

        sourceUrl: analysis.source_url || null,

        fileName: analysis.file_name || null,

      },

    });

  };


  // ===================================
  // 7. Refresh Dashboard
  // ===================================

  const handleRefresh = () => {

    setRefreshKey(
      (previous) => previous + 1
    );

  };


  // ===================================
  // 8. Dashboard UI
  // ===================================

  return (

    <div className="space-y-6">


      {/* Page Header */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">

            স্বাগতম / Welcome back

          </h1>

          <p className="text-sm font-semibold text-[#087F70] mt-1 break-words">

            {userName}

          </p>

          <p className="text-sm text-[#64748B] mt-1">

            Check a circular before you apply.

          </p>

        </div>


        <div className="flex flex-wrap items-center gap-2">

          <button

            type="button"

            disabled={loading}

            onClick={handleRefresh}

            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#64748B] text-xs font-semibold hover:bg-[#F8FAFC] transition-colors cursor-pointer disabled:opacity-50"

          >

            <svg

              className={`w-4 h-4 ${
                loading ? "animate-spin" : ""
              }`}

              fill="none"

              stroke="currentColor"

              viewBox="0 0 24 24"

            >

              <path

                strokeLinecap="round"

                strokeLinejoin="round"

                strokeWidth="2"

                d="M20 7v5h-5M4 17v-5h5M6.1 8a7 7 0 0111.8-2L20 12M4 12l2.1 6A7 7 0 0018 16"

              />

            </svg>

            Refresh

          </button>


          <Link

            to="/analyze"

            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#087F70] text-white text-sm font-semibold hover:bg-[#066559] transition-colors shadow-xs"

          >

            Quick Analyze

          </Link>

        </div>

      </div>


      {/* Loading State */}

      {loading && (

        <DashboardSkeleton />

      )}


      {/* Error State */}

      {!loading && error && (

        <div

          role="alert"

          className="bg-red-50 border border-red-200 rounded-2xl p-6 space-y-3"

        >

          <h2 className="text-sm font-bold text-red-700">

            Unable to load dashboard

          </h2>

          <p className="text-sm text-red-600">

            {error}

          </p>

          <button

            type="button"

            onClick={handleRefresh}

            className="px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 cursor-pointer"

          >

            Try Again

          </button>

        </div>

      )}


      {/* Dashboard Content */}

      {!loading && !error && dashboardData && (

        <>


          {/* Top Metric Cards */}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

            {metrics.map((metric) => (

              <MetricCard

                key={metric.label}

                label={metric.label}

                value={metric.value}

                color={metric.color}

              />

            ))}

          </div>


          {/* Unknown Risk Notice */}

          {statistics.unknown_risk > 0 && (

            <p className="text-xs text-[#64748B]">

              {statistics.unknown_risk} analysis(es)
              have an unknown risk classification.

            </p>

          )}


          {/* Main Content */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


            {/* Recent History and Statistics */}

            <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 border border-[#E2E8F0] shadow-xs space-y-6">


              {/* History Header */}

              <div className="flex items-center justify-between gap-3">

                <h2 className="text-base font-bold text-[#0F172A]">

                  Recent Analysis History

                </h2>


                <Link

                  to="/history"

                  className="text-xs font-semibold text-[#087F70] hover:underline shrink-0"

                >

                  View All

                </Link>

              </div>


              {/* Recent Analysis List */}

              {recentAnalyses.length > 0 ? (

                <div className="divide-y divide-[#F1F5F8]">

                  {recentAnalyses.map((analysis) => {

                    const risk =

                      RISK_CONFIG[analysis.risk_level] ||

                      RISK_CONFIG.unknown;


                    return (

                      <button

                        key={analysis.analysis_id}

                        type="button"

                        onClick={() =>
                          handleViewAnalysis(analysis)
                        }

                        className="w-full text-left py-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 first:pt-0 hover:bg-[#F8FAFC] transition-colors cursor-pointer"

                      >


                        <div className="min-w-0 flex-1">

                          <p className="text-sm font-semibold text-[#0F172A] truncate">

                            {analysis.title}

                          </p>


                          <p className="text-xs text-[#64748B] mt-1">

                            {SOURCE_LABELS[
                              analysis.source_type
                            ] || "Text"}

                            {" · "}

                            {formatDate(
                              analysis.created_at
                            )}

                          </p>

                        </div>


                        <div className="flex items-center gap-2 shrink-0">

                          <span

                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide ${risk.style}`}

                          >

                            {risk.label}

                          </span>


                          <svg

                            className="w-4 h-4 text-[#94A3B8]"

                            fill="none"

                            stroke="currentColor"

                            viewBox="0 0 24 24"

                          >

                            <path

                              strokeLinecap="round"

                              strokeLinejoin="round"

                              strokeWidth="2"

                              d="M9 18l6-6-6-6"

                            />

                          </svg>

                        </div>

                      </button>

                    );

                  })}

                </div>

              ) : (

                <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-8 text-center space-y-3">

                  <svg

                    className="w-10 h-10 mx-auto text-[#94A3B8]"

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


                  <p className="text-sm font-semibold text-[#0F172A]">

                    No analysis history yet

                  </p>


                  <p className="text-xs text-[#64748B]">

                    Analyze your first job circular
                    to see your results here.

                  </p>


                  <Link

                    to="/analyze"

                    className="inline-flex px-4 py-2 rounded-lg bg-[#087F70] text-white text-xs font-semibold hover:bg-[#066559]"

                  >

                    Analyze First Circular

                  </Link>

                </div>

              )}


              {/* Dynamic Statistics Chart */}

              <div className="pt-5 border-t border-[#F1F5F8] space-y-5">

                <div>

                  <h3 className="text-sm font-bold text-[#0F172A]">

                    Analysis Statistics

                  </h3>

                  <p className="text-xs text-[#64748B] mt-1">

                    Distribution of your analyzed circulars

                  </p>

                </div>


                {statistics.total_analyzed > 0 ? (

                  <div className="flex items-end justify-around gap-3 sm:gap-6">


                    {chartData.map((item) => {

                      const percentage =

                        statistics.total_analyzed > 0

                          ? (

                              item.value /

                              statistics.total_analyzed

                            ) * 100

                          : 0;


                      const barHeight =

                        (

                          item.value /

                          maxChartValue

                        ) * 100;


                      return (

                        <div

                          key={item.label}

                          className="flex-1 min-w-0 flex flex-col items-center gap-2"

                        >


                          {/* Count */}

                          <span

                            className="text-sm font-bold"

                            style={{

                              color: item.color,

                            }}

                          >

                            {item.value}

                          </span>


                          {/* Dynamic Bar */}

                          <div className="w-full max-w-[65px] h-32 rounded-lg bg-[#F1F5F9] flex items-end overflow-hidden">

                            <div

                              className="w-full rounded-t-lg transition-all duration-700"

                              style={{

                                height: `${barHeight}%`,

                                backgroundColor: item.color,

                              }}

                              title={`${item.label}: ${item.value}`}

                            />

                          </div>


                          {/* Label */}

                          <p className="text-[10px] sm:text-xs font-semibold text-[#334155] text-center">

                            {item.label}

                          </p>


                          {/* Percentage */}

                          <p className="text-[11px] text-[#64748B]">

                            {percentage.toFixed(1)}%

                          </p>

                        </div>

                      );

                    })}

                  </div>

                ) : (

                  <div className="rounded-xl bg-[#F8FAFC] p-6 text-center">

                    <p className="text-xs text-[#64748B]">

                      Statistics will appear after
                      your first analysis.

                    </p>

                  </div>

                )}

              </div>

            </div>


            {/* Recent Personal Risk Alerts */}

            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E2E8F0] shadow-xs space-y-4">

              <div>

                <h2 className="text-base font-bold text-[#0F172A]">

                  Recent Risk Alerts

                </h2>

                <p className="text-xs text-[#64748B] mt-1">

                  Warning signs found in your circulars

                </p>

              </div>


              {recentAlerts.length > 0 ? (

                <div className="space-y-3">

                  {recentAlerts.map((alert, index) => (

                    <AlertCard

                      key={`${alert.indicator_id}-${index}`}

                      alert={alert}

                    />

                  ))}

                </div>

              ) : (

                <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-5 text-center space-y-2">

                  <svg

                    className="w-8 h-8 mx-auto text-[#94A3B8]"

                    fill="none"

                    stroke="currentColor"

                    viewBox="0 0 24 24"

                  >

                    <path

                      strokeLinecap="round"

                      strokeLinejoin="round"

                      strokeWidth="1.5"

                      d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z"

                    />

                  </svg>

                  <p className="text-sm font-semibold text-[#334155]">

                    No recent risk alerts

                  </p>

                  <p className="text-xs text-[#64748B]">

                    Detected fraud indicators will
                    appear here.

                  </p>

                </div>

              )}


              {/* Safety Tips Link */}

              <Link

                to="/safety-tips"

                className="block w-full text-center py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-semibold text-[#087F70] hover:bg-[#F8FAFC] transition-colors"

              >

                View Safety Tips

              </Link>

            </div>

          </div>


          {/* Dashboard Disclaimer */}

          <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">

            <p className="text-xs text-[#64748B] leading-relaxed">

              CircularShield provides AI-based fraud
              risk estimates. Low risk does not guarantee
              authenticity, and suspicious results do not
              prove fraud. Always verify recruitment
              information through official sources.

            </p>

          </div>

        </>

      )}

    </div>

  );

};


// =====================================
// Reusable Metric Card
// =====================================

const MetricCard = ({

  label,

  value,

  color,

}) => {

  return (

    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] shadow-xs">

      <span className="text-xs font-medium text-[#64748B]">

        {label}

      </span>


      <div

        className="text-3xl sm:text-4xl font-extrabold mt-2"

        style={{ color }}

      >

        {Number(value || 0).toLocaleString()}

      </div>

    </div>

  );

};


// =====================================
// Reusable Alert Card
// =====================================

const AlertCard = ({ alert }) => {

  const severity = alert.severity || "unknown";


  const style =

    severity === "high"

      ? {

          color: "#DC4B4B",

          background: "#FEF2F2",

          border: "#FECACA",

        }

      : severity === "medium"

      ? {

          color: "#D99A28",

          background: "#FFFBEB",

          border: "#FDE68A",

        }

      : {

          color: "#64748B",

          background: "#F8FAFC",

          border: "#E2E8F0",

        };


  const keywords = Array.isArray(
    alert.matched_keywords
  )
    ? alert.matched_keywords
    : [];


  return (

    <div

      className="p-3.5 rounded-xl border space-y-2"

      style={{

        backgroundColor: style.background,

        borderColor: style.border,

      }}

    >


      <div className="flex items-center gap-2">

        <svg

          className="w-4 h-4 shrink-0"

          style={{ color: style.color }}

          fill="none"

          stroke="currentColor"

          viewBox="0 0 24 24"

        >

          <path

            strokeLinecap="round"

            strokeLinejoin="round"

            strokeWidth="2"

            d="M12 9v4m0 4h.01M10.3 3.9L2.5 18a2 2 0 001.7 3h15.6a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"

          />

        </svg>


        <span

          className="text-[10px] font-bold uppercase tracking-wide"

          style={{ color: style.color }}

        >

          {severity === "unknown"
            ? "Risk indicator"
            : `${severity} severity`}

        </span>

      </div>


      <p className="text-xs text-[#334155] leading-relaxed">

        {alert.message}

      </p>


      {keywords.length > 0 && (

        <div className="flex flex-wrap gap-1.5">

          {keywords.slice(0, 3).map(

            (keyword, index) => (

              <span

                key={index}

                className="px-2 py-1 rounded-md bg-white/80 text-[10px] font-medium break-all"

                style={{ color: style.color }}

              >

                {keyword}

              </span>

            )

          )}

        </div>

      )}

    </div>

  );

};


// =====================================
// Dashboard Loading Skeleton
// =====================================

const DashboardSkeleton = () => {

  return (

    <div

      role="status"

      aria-label="Loading dashboard"

      className="space-y-6 animate-pulse"

    >


      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {[1, 2, 3, 4].map((item) => (

          <div

            key={item}

            className="bg-white rounded-2xl p-5 border border-[#E2E8F0] space-y-4"

          >

            <div className="h-3 w-24 bg-[#E2E8F0] rounded" />

            <div className="h-8 w-16 bg-[#E2E8F0] rounded" />

          </div>

        ))}

      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#E2E8F0] space-y-5">

          <div className="h-4 w-40 bg-[#E2E8F0] rounded" />

          {[1, 2, 3].map((item) => (

            <div

              key={item}

              className="h-14 bg-[#F1F5F9] rounded-xl"

            />

          ))}

          <div className="h-32 bg-[#F1F5F9] rounded-xl" />

        </div>


        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] space-y-4">

          <div className="h-4 w-32 bg-[#E2E8F0] rounded" />

          {[1, 2, 3].map((item) => (

            <div

              key={item}

              className="h-20 bg-[#F1F5F9] rounded-xl"

            />

          ))}

        </div>

      </div>

    </div>

  );

};


export default Dashboard;
