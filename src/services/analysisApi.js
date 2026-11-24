
import { getAuth } from "firebase/auth";
import app from "../firebase/firebase.config";


const auth = getAuth(app);

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/+$/, "");


// Get Firebase authentication token
const getAuthToken = async () => {

  const user = auth.currentUser;

  if (!user) {
    throw new Error(
      "Please log in to continue."
    );
  }

  return await user.getIdToken();
};


// Handle backend API responses
const handleResponse = async (response) => {

  const data = await response
    .json()
    .catch(() => null);

  if (!response.ok || data?.success === false) {

    const error = new Error(
      data?.message ||
      data?.error ||
      `Request failed (${response.status})`
    );

    error.status = response.status;

    throw error;
  }

  if (!data) {
    throw new Error(
      "Invalid response from server."
    );
  }

  return data;
};


// 1. Check backend health
export const checkBackendHealth = async () => {

  const response = await fetch(
    `${API_URL}/health`
  );

  return handleResponse(response);
};


// 2. Extract text from PDF or Image
export const extractCircularText = async (
  file,
  language = "en"
) => {

  const token = await getAuthToken();

  const formData = new FormData();

  formData.append("file", file);
  formData.append("language", language);

  const response = await fetch(
    `${API_URL}/extract`,
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${token}`,
      },

      body: formData,
    }
  );

  return handleResponse(response);
};


// 3. Extract text from URL
export const extractCircularFromUrl = async (
  url,
  language = "en"
) => {

  const token = await getAuthToken();

  const response = await fetch(
    `${API_URL}/extract-url`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        url: url,
        language: language,
      }),
    }
  );

  return handleResponse(response);
};


// 4. Analyze circular text
export const analyzeCircular = async (
  text,
  language = "en",
  sourceType = "text",
  sourceUrl = null
) => {

  const token = await getAuthToken();

  const response = await fetch(
    `${API_URL}/analyze`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        text: text,
        language: language,
        source_type: sourceType,
        source_url: sourceUrl,
      }),
    }
  );

  return handleResponse(response);
};
