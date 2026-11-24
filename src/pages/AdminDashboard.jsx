
import { useState, useEffect } from "react";

import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthProvider";

import {
  getAdminDashboard,
  updateReportStatus,
  updateOrganizationStatus,
} from "../services/adminApi";


// =====================================
// 1. Reusable Styles
// =====================================

const CARD =
  "bg-white rounded-2xl p-5 sm:p-6 border border-[#E2E8F0] shadow-xs";

const PRIMARY_BUTTON =
  "px-5 py-2.5 rounded-xl bg-[#087F70] text-white text-xs font-semibold hover:bg-[#066559] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

const DANGER_BUTTON =
  "px-5 py-2.5 rounded-xl bg-[#991B1B] text-white text-xs font-semibold hover:bg-[#7F1D1D] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

const OUTLINE_BUTTON =
  "px-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-xs font-semibold text-[#334155] hover:bg-[#F8FAFC] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";


// =====================================
// 2. Format Date
// =====================================

const formatDate = (value) => {

  if (!value) return "Date unavailable";

  const date = new Date(value);

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
// 3. Metric Card Component
// =====================================

const MetricCard = ({
  title,
  value,
  color = "#0F172A",
  description,
  path,
}) => {

  return (

    <Link

      to={path}

      className={`${CARD} block hover:border-[#087F70]/40 transition-colors`}

    >

      <span className="text-xs font-medium text-[#64748B]">

        {title}

      </span>

      <div

        className="text-3xl font-extrabold mt-2"

        style={{ color }}

      >

        {Number(value ?? 0).toLocaleString()}

      </div>

      <p className="text-[11px] text-[#94A3B8] mt-2">

        {description}

      </p>

    </Link>

  );

};


// =====================================
// 4. Empty Queue Component
// =====================================

const EmptyQueue = ({
  title,
  description,
}) => {

  return (

    <div className="py-10 text-center space-y-3">

      <div className="w-12 h-12 mx-auto rounded-full bg-[#ECFDF5] flex items-center justify-center">

        <svg

          className="w-6 h-6 text-[#087F70]"

          fill="none"

          stroke="currentColor"

          viewBox="0 0 24 24"

        >

          <path

            strokeLinecap="round"

            strokeLinejoin="round"

            strokeWidth="2"

            d="M5 13l4 4L19 7"

          />

        </svg>

      </div>

      <p className="text-sm font-semibold text-[#0F172A]">

        {title}

      </p>

      <p className="text-xs text-[#64748B]">

        {description}

      </p>

    </div>

  );

};


// =====================================
// 5. Admin Dashboard Component
// =====================================

export const AdminDashboard = () => {

  const { user, profile } = useAuth();


  // Dashboard states

  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [actionError, setActionError] =
    useState("");

  const [refreshKey, setRefreshKey] =
    useState(0);


  // Selected queue items

  const [selectedReport, setSelectedReport] =
    useState(null);

  const [selectedOrganization, setSelectedOrganization] =
    useState(null);


  // Moderation states

  const [actionLoading, setActionLoading] =
    useState(false);

  const [confirmation, setConfirmation] =
    useState(null);


  // ===================================
  // 6. Fetch Dashboard Data
  // ===================================

  useEffect(() => {

    if (!user?.uid) {

      setDashboard(null);

      setLoading(false);

      return;

    }

    const controller = new AbortController();

    let active = true;


    const loadDashboard = async () => {

      setLoading(true);

      setError("");

      setSelectedReport(null);

      setSelectedOrganization(null);

      try {

        const response =
          await getAdminDashboard(
            controller.signal
          );

        if (active) {

          setDashboard(response);

        }

      } catch (err) {

        if (
          active &&
          err.name !== "AbortError"
        ) {

          setError(

            err.message ||

            "Unable to load admin dashboard."

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
  // 7. Dashboard Values
  // ===================================

  const statistics =
    dashboard?.statistics || {};

  const detection =
    dashboard?.detection_statistics || {};

  const reports =
    dashboard?.recent_reports || [];

  const organizations =
    dashboard?.recent_organizations || [];


  const activeReport = reports.find(

    (item) => item.id === selectedReport

  );

  const activeOrganization = organizations.find(

    (item) => item.id === selectedOrganization

  );


  const busy = loading || actionLoading;


  // ===================================
  // 8. Refresh Dashboard
  // ===================================

  const handleRefresh = () => {

    setSuccess("");

    setActionError("");

    setRefreshKey(
      (previous) => previous + 1
    );

  };


  // ===================================
  // 9. Request Moderation Confirmation
  // ===================================

  const requestReportAction = (status) => {

    if (!activeReport || busy) return;

    setConfirmation({

      type: "report",

      id: activeReport.id,

      title: activeReport.title,

      status,

    });

  };


  const requestOrganizationAction = (
    status
  ) => {

    if (!activeOrganization || busy) return;

    setConfirmation({

      type: "organization",

      id: activeOrganization.id,

      title: activeOrganization.name,

      status,

    });

  };


  // ===================================
  // 10. Confirm Moderation Action
  // ===================================

  const handleConfirmAction = async () => {

    if (!confirmation || actionLoading) {
      return;
    }

    setActionLoading(true);

    setActionError("");

    setSuccess("");

    try {

      let response;

      if (confirmation.type === "report") {

        response = await updateReportStatus(

          confirmation.id,

          confirmation.status

        );

      } else {

        response = await updateOrganizationStatus(

          confirmation.id,

          confirmation.status

        );

      }


      setSuccess(

        response.message ||

        "Status updated successfully."

      );

      setConfirmation(null);

      setSelectedReport(null);

      setSelectedOrganization(null);


      // Reload statistics and queues

      setRefreshKey(
        (previous) => previous + 1
      );


    } catch (err) {

      setActionError(

        err.message ||

        "Unable to complete moderation action."

      );

      setConfirmation(null);

    } finally {

      setActionLoading(false);

    }

  };


  // ===================================
  // 11. Detection Chart Data
  // ===================================

  const chartItems = [

    {

      label: "Low Risk",

      value: detection.low_risk || 0,

      color: "#16A36A",

    },

    {

      label: "Medium Risk",

      value: detection.medium_risk || 0,

      color: "#D99A28",

    },

    {

      label: "High Risk",

      value: detection.high_risk || 0,

      color: "#DC4B4B",

    },

    {

      label: "Unknown",

      value: detection.unknown_risk || 0,

      color: "#94A3B8",

    },

  ];


  const maxChartValue = Math.max(

    1,

    ...chartItems.map((item) => item.value)

  );


  // ===================================
  // 12. Dashboard UI
  // ===================================

  return (

    <div className="space-y-6">


      {/* Page Header */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">

            Admin Dashboard

          </h1>

          <p className="text-sm font-semibold text-[#087F70] mt-1">

            Welcome, {profile?.name || "Administrator"}

          </p>

          <p className="text-sm text-[#64748B] mt-1">

            Platform overview and moderation.

          </p>

        </div>


        <button

          type="button"

          disabled={busy}

          onClick={handleRefresh}

          className={`${OUTLINE_BUTTON} inline-flex items-center justify-center gap-2`}

        >

          <svg

            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}

            fill="none"

            stroke="currentColor"

            viewBox="0 0 24 24"

          >

            <path

              strokeLinecap="round"

              strokeLinejoin="round"

              strokeWidth="2"

              d="M4 4v6h6M20 20v-6h-6M20 10A8 8 0 006 6l-2 4m16 4l-2 4A8 8 0 014 14"

            />

          </svg>

          {loading ? "Refreshing..." : "Refresh"}

        </button>

      </div>


      {/* Success Message */}

      {success && (

        <div

          role="status"

          className="p-4 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-sm font-medium text-[#087F70]"

        >

          {success}

        </div>

      )}


      {/* Moderation Error */}

      {actionError && (

        <div

          role="alert"

          className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600"

        >

          {actionError}

        </div>

      )}


      {/* Loading State */}

      {loading && (

        <div className="space-y-6 animate-pulse">

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

            {[1, 2, 3, 4].map((item) => (

              <div

                key={item}

                className={`${CARD} h-32 bg-[#F1F5F9]`}

              />

            ))}

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <div className={`${CARD} h-64 bg-[#F1F5F9]`} />

            <div className={`${CARD} h-64 bg-[#F1F5F9]`} />

          </div>

        </div>

      )}


      {/* API Error */}

      {!loading && error && (

        <div

          role="alert"

          className="p-6 rounded-2xl bg-red-50 border border-red-200 space-y-3"

        >

          <h2 className="text-sm font-bold text-red-700">

            Unable to load admin dashboard

          </h2>

          <p className="text-sm text-red-600">

            {error}

          </p>

          <button

            type="button"

            onClick={handleRefresh}

            className={DANGER_BUTTON}

          >

            Try Again

          </button>

        </div>

      )}


      {/* Main Dashboard Content */}

      {!loading && !error && dashboard && (

        <>


          {/* Top Metric Cards */}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

            <MetricCard

              title="Total Users"

              value={statistics.total_users}

              description={`${statistics.total_admins || 0} administrator(s)`}

              path="/admin/users"

            />


            <MetricCard

              title="Circulars Analyzed"

              value={statistics.total_analyses}

              description="All saved platform analyses"

              path="/admin/detection-stats"

            />


            <MetricCard

              title="Pending Reports"

              value={statistics.pending_reports}

              color="#D99A28"

              description="Awaiting moderation"

              path="/admin/scam-reports"

            />


            <MetricCard

              title="Orgs to Verify"

              value={statistics.pending_organizations}

              color="#D99A28"

              description={`${statistics.verified_organizations || 0} verified organizations`}

              path="/admin/organizations"

            />

          </div>


          {/* Moderation Queues */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


            {/* Scam Reports Queue */}

            <div className={`${CARD} space-y-5`}>

              <div className="flex items-center justify-between gap-3">

                <h2 className="text-sm font-bold text-[#0F172A]">

                  Scam Reports Queue

                </h2>

                <Link

                  to="/admin/scam-reports"

                  className="text-xs font-semibold text-[#087F70] hover:underline"

                >

                  View All

                </Link>

              </div>


              {reports.length === 0 ? (

                <EmptyQueue

                  title="No pending scam reports"

                  description="New reports will appear here."

                />

              ) : (

                <div className="space-y-2">

                  {reports.map((report) => (

                    <button

                      key={report.id}

                      type="button"

                      disabled={busy}

                      aria-pressed={
                        selectedReport === report.id
                      }

                      onClick={() => {

                        setSelectedReport(

                          selectedReport === report.id

                            ? null

                            : report.id

                        );

                      }}

                      className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-colors ${

                        selectedReport === report.id

                          ? "bg-[#F0FDFA] border-[#087F70]"

                          : "bg-white border-[#E2E8F0] hover:bg-[#F8FAFC]"

                      }`}

                    >

                      <div className="min-w-0">

                        <p className="text-sm font-bold text-[#0F172A] truncate">

                          {report.title}

                        </p>

                        <p className="text-xs text-[#64748B] mt-1">

                          Evidence: {report.evidence_count} file(s)

                        </p>

                        <p className="text-[11px] text-[#94A3B8] mt-1">

                          {formatDate(report.created_at)}

                        </p>

                      </div>

                      <span className="shrink-0 px-2.5 py-1 rounded-full text-xs font-bold bg-[#FFFBEB] text-[#D99A28]">

                        Pending

                      </span>

                    </button>

                  ))}

                </div>

              )}


              {/* Selected Report Details */}

              {activeReport && (

                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">

                  <p className="text-xs font-semibold text-[#64748B]">

                    Selected Report

                  </p>

                  <p className="text-sm font-bold text-[#0F172A] mt-1">

                    {activeReport.title}

                  </p>

                  <p className="text-xs text-[#64748B] mt-2 break-words whitespace-pre-wrap">

                    {activeReport.description || "No description provided."}

                  </p>

                  <Link

                    to="/admin/scam-reports"

                    className="inline-block mt-3 text-xs font-semibold text-[#087F70] hover:underline"

                  >

                    Review full report and evidence

                  </Link>

                </div>

              )}


              <div className="flex flex-wrap items-center gap-3 pt-2">

                <button

                  type="button"

                  disabled={!activeReport || busy}

                  onClick={() =>
                    requestReportAction("approved")
                  }

                  className={PRIMARY_BUTTON}

                >

                  Approve

                </button>


                <button

                  type="button"

                  disabled={!activeReport || busy}

                  onClick={() =>
                    requestReportAction("rejected")
                  }

                  className={DANGER_BUTTON}

                >

                  Reject

                </button>

              </div>

            </div>


            {/* Organization Verification Queue */}

            <div className={`${CARD} space-y-5`}>

              <div className="flex items-center justify-between gap-3">

                <h2 className="text-sm font-bold text-[#0F172A]">

                  Organization Verification

                </h2>

                <Link

                  to="/admin/organizations"

                  className="text-xs font-semibold text-[#087F70] hover:underline"

                >

                  View All

                </Link>

              </div>


              {organizations.length === 0 ? (

                <EmptyQueue

                  title="No pending organizations"

                  description="New verification requests will appear here."

                />

              ) : (

                <div className="space-y-2">

                  {organizations.map((organization) => (

                    <button

                      key={organization.id}

                      type="button"

                      disabled={busy}

                      aria-pressed={
                        selectedOrganization === organization.id
                      }

                      onClick={() => {

                        setSelectedOrganization(

                          selectedOrganization === organization.id

                            ? null

                            : organization.id

                        );

                      }}

                      className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-colors ${

                        selectedOrganization === organization.id

                          ? "bg-[#F0FDFA] border-[#087F70]"

                          : "bg-white border-[#E2E8F0] hover:bg-[#F8FAFC]"

                      }`}

                    >

                      <div className="min-w-0">

                        <p className="text-sm font-bold text-[#0F172A] truncate">

                          {organization.name}

                        </p>

                        <p className="text-xs text-[#64748B] mt-1 truncate">

                          {organization.website || "Website not provided"}

                        </p>

                        <p className="text-[11px] text-[#94A3B8] mt-1">

                          {formatDate(organization.created_at)}

                        </p>

                      </div>

                      <span className="shrink-0 px-2.5 py-1 rounded-full text-xs font-bold bg-[#FFFBEB] text-[#D99A28]">

                        Review

                      </span>

                    </button>

                  ))}

                </div>

              )}


              {/* Selected Organization */}

              {activeOrganization && (

                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">

                  <p className="text-xs font-semibold text-[#64748B]">

                    Selected Organization

                  </p>

                  <p className="text-sm font-bold text-[#0F172A]">

                    {activeOrganization.name}

                  </p>

                  <p className="text-xs text-[#64748B] break-all">

                    Website: {activeOrganization.website || "Not provided"}

                  </p>

                  <p className="text-xs text-[#64748B] break-all">

                    Email: {activeOrganization.email || "Not provided"}

                  </p>

                  <Link

                    to="/admin/organizations"

                    className="inline-block text-xs font-semibold text-[#087F70] hover:underline"

                  >

                    Review verification details

                  </Link>

                </div>

              )}


              <div className="flex flex-wrap items-center gap-3 pt-2">

                <button

                  type="button"

                  disabled={!activeOrganization || busy}

                  onClick={() =>
                    requestOrganizationAction("verified")
                  }

                  className={PRIMARY_BUTTON}

                >

                  Verify Organization

                </button>


                <button

                  type="button"

                  disabled={!activeOrganization || busy}

                  onClick={() =>
                    requestOrganizationAction("rejected")
                  }

                  className={DANGER_BUTTON}

                >

                  Reject

                </button>

              </div>

            </div>

          </div>


          {/* Detection Statistics */}

          <div className={`${CARD} space-y-5`}>

            <div className="flex items-center justify-between gap-3">

              <div>

                <h2 className="text-sm font-bold text-[#0F172A]">

                  Detection Statistics

                </h2>

                <p className="text-xs text-[#64748B] mt-1">

                  Risk distribution of analyzed job circulars.

                </p>

              </div>

              <Link

                to="/admin/detection-stats"

                className="text-xs font-semibold text-[#087F70] hover:underline"

              >

                View Details

              </Link>

            </div>


            <div className="space-y-5">

              {chartItems.map((item) => (

                <div key={item.label}>

                  <div className="flex items-center justify-between text-xs mb-2">

                    <span className="font-semibold text-[#334155]">

                      {item.label}

                    </span>

                    <span className="font-bold text-[#0F172A]">

                      {item.value.toLocaleString()}

                    </span>

                  </div>


                  <div className="h-3 rounded-full bg-[#F1F5F9] overflow-hidden">

                    <div

                      className="h-full rounded-full transition-all duration-500"

                      style={{

                        width: `${(item.value / maxChartValue) * 100}%`,

                        backgroundColor: item.color,

                      }}

                    />

                  </div>

                </div>

              ))}

            </div>


            <p className="text-xs text-[#94A3B8]">

              Risk classifications are AI-based estimates and do not independently verify circular authenticity.

            </p>

          </div>

        </>

      )}


      {/* Moderation Confirmation Modal */}

      {confirmation && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">

          <div

            role="dialog"

            aria-modal="true"

            aria-labelledby="confirmation-title"

            className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl space-y-4"

          >

            <h2

              id="confirmation-title"

              className="text-lg font-bold text-[#0F172A]"

            >

              Confirm Moderation Action

            </h2>


            <p className="text-sm text-[#64748B]">

              Are you sure you want to mark this {confirmation.type} as {confirmation.status}?

            </p>


            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">

              <p className="text-sm font-bold text-[#334155] break-words">

                {confirmation.title}

              </p>

            </div>


            {confirmation.status !== "rejected" && (

              <p className="text-xs text-[#92400E] bg-[#FFFBEB] rounded-xl p-3">

                Confirm only after reviewing the supporting evidence and relevant official sources.

              </p>

            )}


            <div className="flex items-center justify-end gap-3">

              <button

                type="button"

                disabled={actionLoading}

                onClick={() => setConfirmation(null)}

                className={OUTLINE_BUTTON}

              >

                Cancel

              </button>


              <button

                type="button"

                disabled={actionLoading}

                onClick={handleConfirmAction}

                className={

                  confirmation.status === "rejected"

                    ? DANGER_BUTTON

                    : PRIMARY_BUTTON

                }

              >

                {actionLoading ? "Processing..." : "Confirm"}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};


export default AdminDashboard;
