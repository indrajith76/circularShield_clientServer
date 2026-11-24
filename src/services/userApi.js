
const API_URL = import.meta.env.VITE_API_URL;


const handleResponse = async (response) => {

  const data = await response.json().catch(() => null);

  if (!response.ok) {

    const error = new Error(
      data?.message || "Request failed"
    );

    error.status = response.status;

    throw error;
  }

  return data;
};


// Save registered user in MongoDB
export const saveUser = async (firebaseUser, name) => {

  const token = await firebaseUser.getIdToken();

  const response = await fetch(`${API_URL}/users`, {

    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({
      name: name,
    }),

  });

  return handleResponse(response);
};


// Get current user's MongoDB profile
export const getUserProfile = async (firebaseUser) => {

  const token = await firebaseUser.getIdToken();

  const response = await fetch(`${API_URL}/users/me`, {

    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
    },

  });

  return handleResponse(response);
};
