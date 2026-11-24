
import { adminRequest } from "./adminApi";


// ==========================================
// 1. Retrieve Registered Users
// ==========================================

export const getAdminUsers = async (
  {
    search = "",
    role = "all",
    status = "all",
    page = 1,
    limit = 10,
  } = {},
  signal
) => {
  const params = new URLSearchParams({
    search,
    role,
    status,
    page: String(page),
    limit: String(limit),
  });

  return adminRequest(
    `/admin/users?${params.toString()}`,
    {
      method: "GET",
      signal,
    }
  );
};


// ==========================================
// 2. Create New User
// ==========================================

export const createAdminUser = async (
  userData
) => {
  return adminRequest(
    "/admin/users",
    {
      method: "POST",

      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role,
      }),
    }
  );
};


// ==========================================
// 3. Update User Role
// ==========================================

export const updateAdminUserRole = async (
  uid,
  role
) => {
  return adminRequest(
    `/admin/users/${encodeURIComponent(uid)}/role`,
    {
      method: "PATCH",

      body: JSON.stringify({
        role,
      }),
    }
  );
};


// ==========================================
// 4. Suspend or Activate User
// ==========================================

export const updateAdminUserStatus = async (
  uid,
  status
) => {
  return adminRequest(
    `/admin/users/${encodeURIComponent(uid)}/status`,
    {
      method: "PATCH",

      body: JSON.stringify({
        status,
      }),
    }
  );
};
