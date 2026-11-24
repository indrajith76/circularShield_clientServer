
import { getAuth } from "firebase/auth";


// ==========================================
// 1. Backend API Configuration
// ==========================================

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:5000/api"
).trim().replace(/\/+$/, "");


// ==========================================
// 2. Get Firebase Authentication Token
// ==========================================

const getAuthToken = async () => {
  const user = getAuth().currentUser;

  if (!user) {
    throw new Error(
      "Please log in as an administrator."
    );
  }

  return await user.getIdToken();
};


// ==========================================
// 3. Common Admin API Request
// ==========================================

export const adminRequest = async (
  endpoint,
  options = {}
) => {
  const token = await getAuthToken();

  let response;

  try {
    response = await fetch(
      `${API_URL}${endpoint}`,
      {
        ...options,

        headers: {
          Accept: "application/json",

          ...(options.body
            ? {
                "Content-Type": "application/json",
              }
            : {}),

          ...options.headers,

          Authorization: `Bearer ${token}`,
        },
      }
    );

  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    console.error("Admin API error:", error);

    throw new Error(
      "Cannot connect to the Flask backend. " +
      "Make sure the backend is running on port 5000."
    );
  }

  const data = await response.json().catch(
    () => null
  );

  if (!response.ok || !data?.success) {
    const error = new Error(
      data?.message ||
      `Request failed (${response.status}).`
    );

    error.status = response.status;

    throw error;
  }

  return data;
};


// ==========================================
// 4. Get Admin Dashboard Data
// ==========================================

export const getAdminDashboard = async (
  signal
) => {
  return adminRequest(
    "/admin/dashboard",
    {
      method: "GET",
      signal,
    }
  );
};


// ==========================================
// 5. Update Scam Report Status
// ==========================================

export const updateReportStatus = async (
  reportId,
  status
) => {
  return adminRequest(
    `/admin/reports/${encodeURIComponent(reportId)}/status`,
    {
      method: "PATCH",

      body: JSON.stringify({
        status,
      }),
    }
  );
};


// ==========================================
// 6. Update Organization Status
// ==========================================

export const updateOrganizationStatus = async (
  organizationId,
  status
) => {
  return adminRequest(
    `/admin/organizations/${encodeURIComponent(organizationId)}/status`,
    {
      method: "PATCH",

      body: JSON.stringify({
        status,
      }),
    }
  );
};
