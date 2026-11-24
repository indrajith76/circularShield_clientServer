
import { getAuth } from "firebase/auth";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:5000/api"
).trim().replace(/\/+$/, "");


// =====================================
// 1. Get Firebase Authentication Token
// =====================================

const getAuthToken = async () => {
  const user = getAuth().currentUser;

  if (!user) {
    throw new Error("Please log in to continue.");
  }

  return await user.getIdToken();
};


// =====================================
// 2. Handle API Response
// =====================================

const handleResponse = async (response) => {
  const data = await response.json().catch(() => null);

  if (response.status === 401) {
    throw new Error(
      "Your session has expired. Please log in again."
    );
  }

  if (!response.ok || !data || data.success === false) {
    throw new Error(
      data?.message ||
      `Request failed (${response.status}).`
    );
  }

  return data;
};


// =====================================
// 3. Common API Request
// =====================================

const apiRequest = async (endpoint, options = {}) => {
  let response;

  try {
    response = await fetch(
      `${API_URL}${endpoint}`,
      options
    );
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    throw new Error(
      "Cannot connect to the Flask backend. " +
      "Make sure the backend is running on port 5000."
    );
  }

  return handleResponse(response);
};


// =====================================
// 4. Backend Health Check
// =====================================

export const checkBackendHealth = async () => {
  return apiRequest("/health", {
    method: "GET",
  });
};


// =====================================
// 5. Extract Text from PDF or Image
// =====================================

export const extractCircularText = async (
  file,
  language = "en"
) => {
  const token = await getAuthToken();

  const formData = new FormData();

  formData.append("file", file);
  formData.append("language", language);

  return apiRequest("/extract", {
    method: "POST",

    headers: {
      Authorization: `Bearer ${token}`,
    },

    body: formData,
  });
};


// =====================================
// 6. Extract Text from URL
// =====================================

export const extractCircularFromUrl = async (
  url,
  language = "en"
) => {
  const token = await getAuthToken();

  return apiRequest("/extract-url", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({
      url,
      language,
    }),
  });
};


// =====================================
// 7. Analyze Job Circular
// =====================================

export const analyzeCircular = async (
  text,
  language = "en",
  sourceType = "text",
  metadata = {}
) => {
  const token = await getAuthToken();

  return apiRequest("/analyze", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({
      text,
      language,

      source_type: sourceType,

      source_url: metadata.sourceUrl || null,

      file_name: metadata.fileName || null,

      url_title: metadata.urlTitle || null,
    }),
  });
};
