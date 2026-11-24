
import { useState, useEffect } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthProvider";

import {
  getAnalysisHistory,
  getAnalysisById,
  deleteAnalysis,
} from "../services/historyApi";


// =====================================
// Risk Configuration
// =====================================

const RISK_CONFIG = {

  low: {
    label: "Low Risk",
    style: "bg-[#ECFDF5] text-[#16A36A]",
  },

  medium: {
    label: "Medium Risk",
    style: "bg-[#FFFBEB] text-[#D99A28]",
  },

  high: {
    label: "Suspicious",
    style: "bg-[#FEF2F2] text-[#DC4B4B]",
  },

  unknown: {
    label: "Unknown",
    style: "bg-[#F1F5F9] text-[#64748B]",
  },

};


const SOURCE_LABELS = {

  pdf: "PDF",

  image: "Image",

  text: "Text",

  url: "URL",

};


// =====================================
// Format Date
// =====================================

const formatDate = (value) => {

  if (!value) return "Date unavailable";

  const normalizedValue =
    /(?:Z|[+-]\d{2}:\d{2})$/i.test(value)
      ? value
      : `${value}Z`;

  const date = new Date(normalizedValue);

  if (Number.isNaN(date.getTime())) {

    return "Date unavailable";

  }

  return date.toLocaleDateString("en-GB", {

    day: "numeric",

    month: "short",

    year: "numeric",

  });

};


// =====================================
// Analysis History Component
// =====================================

export const AnalysisHistory = () => {

  const navigate = useNavigate();

  const { user } = useAuth();


  // Search and filter states

  const [search, setSearch] = useState("");

  const [debouncedSearch, setDebouncedSearch] =
    useState("");

  const [riskLevel, setRiskLevel] =
    useState("all");

  const [dateRange, setDateRange] =
    useState("all");


  // History states

  const [historyItems, setHistoryItems] =
    useState([]);

  const [selectedId, setSelectedId] =
    useState(null);


  // Pagination states

  const [page, setPage] = useState(1);

  const [pagination, setPagination] =
    useState({

      page: 1,

      total_records: 0,

      total_pages: 1,

      has_next: false,

      has_previous: false,

    });


  // Loading and error states

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState("");

  const [error, setError] =
    useState("");

  const [actionError, setActionError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [refreshKey, setRefreshKey] =
    useState(0);


  // Delete confirmation modal

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);


  // ===================================
  // 1. Debounced Search
  // ===================================

  useEffect(() => {

    const timer = setTimeout(() => {

      setPage(1);

      setDebouncedSearch(search.trim());

    }, 400);

    return () => clearTimeout(timer);

  }, [search]);


  // ===================================
  // 2. Load Analysis History
  // ===================================

  useEffect(() => {

    if (!user?.uid) {

      setHistoryItems([]);

      setSelectedId(null);

      setLoading(false);

      return;

    }

    const controller = new AbortController();

    let active = true;

    const loadHistory = async () => {

      setLoading(true);

      setError("");

      setSelectedId(null);

      setHistoryItems([]);

      try {

        const response =
          await getAnalysisHistory(

            {

              search: debouncedSearch,

              riskLevel,

              dateRange,

              page,

              limit: 10,

            },

            controller.signal

          );

        if (active) {

          setHistoryItems(
            response.history || []
          );

          setPagination(
            response.pagination
          );

          if (response.pagination.page !== page) {

            setPage(
              response.pagination.page
            );

          }

        }

      } catch (err) {

        if (
          active &&
          err.name !== "AbortError"
        ) {

          setError(

            err.message ||

            "Unable to load analysis history."

          );

        }

      } finally {

        if (active) {

          setLoading(false);

        }

      }

    };

    loadHistory();

    return () => {

      active = false;

      controller.abort();

    };

  }, [

    user?.uid,

    debouncedSearch,

    riskLevel,

    dateRange,

    page,

    refreshKey,

  ]);


  // ===================================
  // 3. Selected Analysis
  // ===================================

  const selectedAnalysis = historyItems.find(

    (item) => item.analysis_id === selectedId

  );

  const busy = loading || Boolean(actionLoading);


  // ===================================
  // 4. Refresh History
  // ===================================

  const handleRefresh = () => {

    setActionError("");

    setSuccess("");

    setRefreshKey(
      (previous) => previous + 1
    );

  };


  // ===================================
  // 5. Clear Filters
  // ===================================

  const handleClearFilters = () => {

    setSearch("");

    setDebouncedSearch("");

    setRiskLevel("all");

    setDateRange("all");

    setPage(1);

    setSelectedId(null);

  };


  // ===================================
  // 6. View Analysis Result
  // ===================================

  const openAnalysis = async (
    analysisId,
    printMode = false
  ) => {

    if (!analysisId || busy) return;

    setActionLoading(
      printMode ? "download" : "view"
    );

    setActionError("");

    setSuccess("");

    try {

      const response =
        await getAnalysisById(analysisId);

      const analysis = response.analysis;

      navigate("/analysis-result", {

        state: {

          analysisId: analysis.analysis_id,

          result: analysis.result,

          text: analysis.text || "",

          language: analysis.language || "en",

          sourceType: analysis.source_type,

          sourceUrl: analysis.source_url || null,

          fileName: analysis.file_name || null,

          createdAt: analysis.created_at,

          title: analysis.title,

          fromHistory: true,

          printMode,

        },

      });

    } catch (err) {

      setActionError(

        err.message ||

        "Unable to open the selected analysis."

      );

    } finally {

      setActionLoading("");

    }

  };


  // ===================================
  // 7. Delete Selected Analysis
  // ===================================

  const handleDelete = async () => {

    if (!selectedId || busy) return;

    setActionLoading("delete");

    setActionError("");

    setSuccess("");

    try {

      await deleteAnalysis(selectedId);

      setShowDeleteModal(false);

      setSelectedId(null);

      setSuccess(
        "Analysis deleted successfully."
      );

      // Move back if the last item on a page
      // has been deleted.

      if (
        historyItems.length === 1 &&
        page > 1
      ) {

        setPage(
          (previous) => previous - 1
        );

      } else {

        setRefreshKey(
          (previous) => previous + 1
        );

      }

    } catch (err) {

      setActionError(

        err.message ||

        "Unable to delete the analysis."

      );

      setShowDeleteModal(false);

    } finally {

      setActionLoading("");

    }

  };


  // ===================================
  // 8. History Page UI
  // ===================================

  return (

    <div className="space-y-6">


      {/* 1. Page Header */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">

            Analysis History

          </h1>

          <p className="text-sm text-[#64748B] mt-1">

            All your previous circular analyses.

          </p>

        </div>


        <div className="flex items-center gap-2">

          <button

            type="button"

            disabled={busy}

            onClick={handleRefresh}

            className="px-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer disabled:opacity-50"

          >

            {loading ? "Refreshing..." : "Refresh"}

          </button>


          <Link

            to="/analyze"

            className="px-4 py-2.5 rounded-xl bg-[#087F70] text-white text-xs font-semibold hover:bg-[#066559]"

          >

            New Analysis

          </Link>

        </div>

      </div>


      {/* 2. Search and Filter Bar */}

      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">


        {/* Search Input */}

        <div className="relative flex-1">

          <svg

            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]"

            fill="none"

            stroke="currentColor"

            viewBox="0 0 24 24"

          >

            <path

              strokeLinecap="round"

              strokeLinejoin="round"

              strokeWidth="2"

              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"

            />

          </svg>


          <input

            type="text"

            value={search}

            maxLength={100}

            disabled={Boolean(actionLoading)}

            onChange={(e) =>
              setSearch(e.target.value)
            }

            placeholder="Search analysis..."

            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#182B36] focus:outline-none focus:ring-2 focus:ring-[#087F70]/20 focus:border-[#087F70] shadow-xs"

          />

        </div>


        {/* Risk Filter */}

        <select

          aria-label="Filter by risk level"

          value={riskLevel}

          disabled={Boolean(actionLoading)}

          onChange={(e) => {

            setRiskLevel(e.target.value);

            setPage(1);

          }}

          className="px-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-xs font-semibold text-[#182B36] cursor-pointer focus:outline-none focus:border-[#087F70]"

        >

          <option value="all">
            Status: All
          </option>

          <option value="low">
            Low Risk
          </option>

          <option value="medium">
            Medium Risk
          </option>

          <option value="high">
            Suspicious
          </option>

        </select>


        {/* Date Filter */}

        <select

          aria-label="Filter by date"

          value={dateRange}

          disabled={Boolean(actionLoading)}

          onChange={(e) => {

            setDateRange(e.target.value);

            setPage(1);

          }}

          className="px-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-xs font-semibold text-[#182B36] cursor-pointer focus:outline-none focus:border-[#087F70]"

        >

          <option value="all">
            Date: All Time
          </option>

          <option value="7">
            Last 7 Days
          </option>

          <option value="30">
            Last 30 Days
          </option>

          <option value="90">
            Last 90 Days
          </option>

        </select>


        {/* Clear Filters */}

        <button

          type="button"

          disabled={Boolean(actionLoading)}

          onClick={handleClearFilters}

          className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer"

        >

          Clear

        </button>

      </div>


      {/* 3. Success Message */}

      {success && (

        <div

          role="status"

          className="p-4 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-sm font-medium text-[#087F70]"

        >

          {success}

        </div>

      )}


      {/* 4. Action Error */}

      {actionError && (

        <div

          role="alert"

          className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600"

        >

          {actionError}

        </div>

      )}


      {/* 5. Loading State */}

      {loading && (

        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] space-y-4 animate-pulse">

          {[1, 2, 3, 4, 5].map((item) => (

            <div

              key={item}

              className="h-16 rounded-xl bg-[#F1F5F9]"

            />

          ))}

        </div>

      )}


      {/* 6. API Error State */}

      {!loading && error && (

        <div

          role="alert"

          className="rounded-2xl p-6 bg-red-50 border border-red-200 space-y-3"

        >

          <p className="text-sm font-bold text-red-700">

            Unable to load analysis history

          </p>

          <p className="text-sm text-red-600">

            {error}

          </p>

          <button

            type="button"

            onClick={handleRefresh}

            className="px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-semibold cursor-pointer"

          >

            Try Again

          </button>

        </div>

      )}


      {/* 7. History List */}

      {!loading && !error && (

        <>


          {/* Record Count */}

          <div className="flex items-center justify-between gap-3">

            <p className="text-xs font-medium text-[#64748B]">

              {pagination.total_records} analysis record(s)

            </p>

            {selectedAnalysis && (

              <span className="text-xs font-semibold text-[#087F70]">

                1 analysis selected

              </span>

            )}

          </div>


          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#E2E8F0] shadow-xs">


            {historyItems.length > 0 ? (

              <div className="space-y-2">

                {historyItems.map((item) => {

                  const risk =

                    RISK_CONFIG[item.risk_level] ||

                    RISK_CONFIG.unknown;


                  const selected =

                    selectedId === item.analysis_id;


                  const score =

                    item.risk_score != null &&

                    Number.isFinite(
                      Number(item.risk_score)
                    )

                      ? Number(
                          item.risk_score
                        ).toFixed(1)

                      : "N/A";


                  return (

                    <button

                      key={item.analysis_id}

                      type="button"

                      disabled={busy}

                      aria-pressed={selected}

                      onClick={() => {

                        setSelectedId(

                          selected

                            ? null

                            : item.analysis_id

                        );

                        setActionError("");

                        setSuccess("");

                      }}

                      className={`w-full text-left p-4 rounded-xl border flex items-center justify-between gap-3 transition-all cursor-pointer ${

                        selected

                          ? "bg-[#F0FDFA] border-[#087F70]"

                          : "bg-white border-[#E2E8F0] hover:bg-[#F8FAFC]"

                      }`}

                    >


                      <div className="flex items-center gap-3 min-w-0 flex-1">


                        {/* Selection Circle */}

                        <span

                          className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${

                            selected

                              ? "border-[#087F70]"

                              : "border-[#CBD5E1]"

                          }`}

                        >

                          {selected && (

                            <span className="w-2 h-2 rounded-full bg-[#087F70]" />

                          )}

                        </span>


                        {/* Analysis Information */}

                        <div className="min-w-0">

                          <p className="text-sm font-bold text-[#0F172A] truncate">

                            {item.title || "Job Circular"}

                          </p>


                          <p className="text-xs text-[#64748B] mt-1">

                            {SOURCE_LABELS[
                              item.source_type
                            ] || "Text"}

                            {" · "}

                            {formatDate(
                              item.created_at
                            )}

                            {" · Score "}

                            {score}

                          </p>

                        </div>

                      </div>


                      {/* Risk Badge */}

                      <span

                        className={`inline-flex px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wide shrink-0 ${risk.style}`}

                      >

                        {risk.label}

                      </span>

                    </button>

                  );

                })}

              </div>

            ) : (

              <div className="py-12 text-center space-y-3">


                <svg

                  className="w-12 h-12 mx-auto text-[#94A3B8]"

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


                <h3 className="text-sm font-bold text-[#0F172A]">

                  No analysis records found

                </h3>


                <p className="text-xs text-[#64748B]">

                  {

                    search ||
                    riskLevel !== "all" ||
                    dateRange !== "all"

                      ? "Try changing your search or filters."

                      : "Analyze a job circular to create your first history record."

                  }

                </p>


                <Link

                  to="/analyze"

                  className="inline-flex px-4 py-2 rounded-lg bg-[#087F70] text-white text-xs font-semibold hover:bg-[#066559]"

                >

                  Analyze Circular

                </Link>

              </div>

            )}

          </div>


          {/* 8. Pagination */}

          {pagination.total_records > 0 && (

            <div className="flex flex-wrap items-center justify-between gap-3">

              <p className="text-xs text-[#64748B]">

                Page {pagination.page} of{" "}

                {pagination.total_pages}

              </p>


              <div className="flex items-center gap-2">

                <button

                  type="button"

                  disabled={
                    !pagination.has_previous ||
                    busy
                  }

                  onClick={() => {

                    setPage(
                      (previous) =>
                        Math.max(1, previous - 1)
                    );

                  }}

                  className="px-4 py-2 rounded-lg border border-[#CBD5E1] bg-white text-xs font-semibold text-[#334155] hover:bg-[#F8FAFC] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"

                >

                  Previous

                </button>


                <button

                  type="button"

                  disabled={
                    !pagination.has_next ||
                    busy
                  }

                  onClick={() => {

                    setPage(
                      (previous) => previous + 1
                    );

                  }}

                  className="px-4 py-2 rounded-lg border border-[#CBD5E1] bg-white text-xs font-semibold text-[#334155] hover:bg-[#F8FAFC] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"

                >

                  Next

                </button>

              </div>

            </div>

          )}


          {/* 9. Action Buttons */}

          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 space-y-4">


            <div>

              <p className="text-xs font-semibold text-[#64748B]">

                Selected Analysis

              </p>

              <p className="text-sm font-bold text-[#0F172A] mt-1 break-words">

                {

                  selectedAnalysis?.title ||

                  "Select an analysis from the list"

                }

              </p>

            </div>


            <div className="flex flex-wrap items-center gap-3">


              {/* View Details */}

              <button

                type="button"

                disabled={!selectedId || busy}

                onClick={() =>
                  openAnalysis(selectedId)
                }

                className="px-5 py-2.5 rounded-xl bg-[#087F70] text-white text-xs font-semibold hover:bg-[#066559] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"

              >

                {

                  actionLoading === "view"

                    ? "Opening..."

                    : "View Details"

                }

              </button>


              {/* Download PDF */}

              <button

                type="button"

                disabled={!selectedId || busy}

                onClick={() =>
                  openAnalysis(selectedId, true)
                }

                className="px-5 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-[#182B36] text-xs font-semibold hover:bg-[#F8FAFC] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"

              >

                {

                  actionLoading === "download"

                    ? "Preparing..."

                    : "Download PDF"

                }

              </button>


              {/* Delete */}

              <button

                type="button"

                disabled={!selectedId || busy}

                onClick={() =>
                  setShowDeleteModal(true)
                }

                className="px-5 py-2.5 rounded-xl border border-[#FCA5A5] bg-white text-[#DC4B4B] text-xs font-semibold hover:bg-[#FEF2F2] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"

              >

                Delete

              </button>

            </div>

          </div>

        </>

      )}


      {/* 10. Delete Confirmation Modal */}

      {showDeleteModal && selectedAnalysis && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">

          <div

            role="dialog"

            aria-modal="true"

            aria-labelledby="delete-title"

            className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl space-y-4"

          >


            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">

              <svg

                className="w-6 h-6 text-red-600"

                fill="none"

                stroke="currentColor"

                viewBox="0 0 24 24"

              >

                <path

                  strokeLinecap="round"

                  strokeLinejoin="round"

                  strokeWidth="2"

                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m4 4v6m6-6v6M4 7h16M10 7V4h4v3"

                />

              </svg>

            </div>


            <h2

              id="delete-title"

              className="text-lg font-bold text-[#0F172A]"

            >

              Delete Analysis?

            </h2>


            <p className="text-sm text-[#64748B] leading-relaxed">

              Are you sure you want to delete this analysis?

              This action cannot be undone.

            </p>


            <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">

              <p className="text-sm font-semibold text-[#334155] break-words">

                {selectedAnalysis.title}

              </p>

            </div>


            <div className="flex items-center justify-end gap-3 pt-2">


              <button

                type="button"

                disabled={Boolean(actionLoading)}

                onClick={() =>
                  setShowDeleteModal(false)
                }

                className="px-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-sm font-semibold text-[#334155] cursor-pointer disabled:opacity-50"

              >

                Cancel

              </button>


              <button

                type="button"

                disabled={Boolean(actionLoading)}

                onClick={handleDelete}

                className="px-4 py-2.5 rounded-xl bg-[#DC4B4B] text-white text-sm font-semibold hover:bg-[#B91C1C] cursor-pointer disabled:opacity-50"

              >

                {

                  actionLoading === "delete"

                    ? "Deleting..."

                    : "Delete Analysis"

                }

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};


export default AnalysisHistory;
