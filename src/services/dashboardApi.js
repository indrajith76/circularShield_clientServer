
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
// 2. Get Firebase Authentication Token
// =====================================

const getAuthToken = async () => {

  const auth = getAuth();

  const user = auth.currentUser;

  if (!user) {

    throw new Error(
      "Please log in to access your dashboard."
    );

  }

  return await user.getIdToken();

};


// =====================================
// 3. Check Backend Connection
// =====================================

export const checkDashboardBackend = async (
  signal
) => {

  let response;

  try {

    response = await fetch(
      `${API_URL}/health`,
      {
        method: "GET",
        signal,
      }
    );

  } catch (error) {

    if (error.name === "AbortError") {
      throw error;
    }

    throw new Error(
      `Cannot connect to Flask backend at ${API_URL}. ` +
      "Make sure the backend is running and CORS is configured."
    );

  }

  const data = await response.json().catch(
    () => null
  );

  if (!response.ok) {

    throw new Error(
      data?.message ||
      "Backend or MongoDB connection is unavailable."
    );

  }

  return data;

};


// =====================================
// 4. Get Dashboard Data
// =====================================

export const getDashboardData = async (
  signal
) => {

  const token = await getAuthToken();

  const endpoint = `${API_URL}/dashboard`;

  let response;

  try {

    response = await fetch(endpoint, {

      method: "GET",

      headers: {

        Authorization: `Bearer ${token}`,

        Accept: "application/json",

      },

      signal,

    });

  } catch (error) {

    if (error.name === "AbortError") {
      throw error;
    }

    console.error(
      "Dashboard connection failed:",
      endpoint,
      error
    );

    throw new Error(
      `Cannot connect to the dashboard API at ${endpoint}. ` +
      "Check whether Flask is running on port 5000 and CORS allows your frontend."
    );

  }


  // Read JSON response

  const data = await response.json().catch(
    () => null
  );


  // Authentication error

  if (response.status === 401) {

    throw new Error(
      "Your session is invalid or expired. Please log in again."
    );

  }


  // Permission error

  if (response.status === 403) {

    throw new Error(
      data?.message ||
      "You do not have permission to access this dashboard."
    );

  }


  // Endpoint not found

  if (response.status === 404) {

    throw new Error(
      data?.message ||
      "Dashboard API not found. Check blueprint registration."
    );

  }


  // Backend error

  if (response.status >= 500) {

    throw new Error(
      data?.message ||
      "Backend server error. Check your Flask terminal."
    );

  }


  // Other errors

  if (!response.ok || !data?.success) {

    throw new Error(
      data?.message ||
      `Dashboard request failed (${response.status}).`
    );

  }


  return data;

};
