
import { getAuth } from "firebase/auth";


// =====================================
// 1. Backend Configuration
// =====================================

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:5000/api"
)
  .trim()
  .replace(/\/+$/, "");


// =====================================
// 2. Authenticated API Request
// =====================================

const authenticatedRequest = async (
  endpoint,
  options = {}
) => {

  const user = getAuth().currentUser;

  if (!user) {

    throw new Error(
      "Please log in to continue."
    );

  }

  const token = await user.getIdToken();

  let response;

  try {

    response = await fetch(
      `${API_URL}${endpoint}`,
      {

        ...options,

        headers: {

          ...options.headers,

          Authorization: `Bearer ${token}`,

          Accept: "application/json",

        },

      }
    );

  } catch (error) {

    if (error.name === "AbortError") {
      throw error;
    }

    throw new Error(
      "Cannot connect to the backend. " +
      "Make sure Flask is running on port 5000."
    );

  }

  const data = await response.json().catch(
    () => null
  );

  if (response.status === 401) {

    throw new Error(
      "Your session has expired. Please log in again."
    );

  }

  if (!response.ok || !data?.success) {

    throw new Error(

      data?.message ||

      `Request failed (${response.status})`

    );

  }

  return data;

};


// =====================================
// 3. Get Analysis History
// =====================================

export const getAnalysisHistory = async (
  {
    search = "",
    riskLevel = "all",
    dateRange = "all",
    page = 1,
    limit = 10,
  } = {},
  signal
) => {

  const params = new URLSearchParams({

    search,

    risk_level: riskLevel,

    date_range: dateRange,

    page: String(page),

    limit: String(limit),

  });

  return authenticatedRequest(

    `/history?${params.toString()}`,

    {
      method: "GET",
      signal,
    }

  );

};


// =====================================
// 4. Get Single Analysis
// =====================================

export const getAnalysisById = async (
  analysisId
) => {

  return authenticatedRequest(

    `/history/${encodeURIComponent(analysisId)}`,

    {
      method: "GET",
    }

  );

};


// =====================================
// 5. Delete Analysis
// =====================================

export const deleteAnalysis = async (
  analysisId
) => {

  return authenticatedRequest(

    `/history/${encodeURIComponent(analysisId)}`,

    {
      method: "DELETE",
    }

  );

};
