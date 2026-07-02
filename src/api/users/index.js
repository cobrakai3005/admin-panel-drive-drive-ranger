import api from "../../config/axios";

const unwrap = (res) => res.data;

// ---------- GET all users (with filters, search, pagination) ----------
export async function getUsersApi(params = {}) {
  return api.get("/users/get-users", { params }).then(unwrap);
}

// ---------- GET user by ID ----------
export async function getUserByIdApi(id) {
  return api.get(`/users/${id}`).then(unwrap);
}
// ---------- GET Profile Route ----------
export async function getProfile(id) {
  return api.get(`/users/me`).then(unwrap);
}

// ---------- CREATE user ----------
export const createUserApi = (data) => {
  // data should be FormData if including profile_image, or plain object
  return api.post("/users/create-user", data).then(unwrap);
};

// ---------- UPDATE user ----------
export const updateUserApi = (id, data) => {
  // data can be FormData or plain object
  return api.put(`/users/${id}`, data).then(unwrap);
};
// ---------- UPDATE user ----------
export const changePasswordApi = (data) => {
  // data can be FormData or plain object
  return api.post(`/users/change-password`, data).then(unwrap);
};
// ---------- UPDATE user ----------
export const updateProfileApi = (data) => {
  // data can be FormData or plain object
  return api
    .put(`/users/update-profile`, data, {
      headers: { "Content-Type": "multipart/form-data" }, // optional, axios does it automatically
    })
    .then(unwrap);
};

// ---------- DEACTIVATE user (soft delete) ----------
export async function deactivateUserApi(userId) {
  return api.patch(`/users/deactivate-user/${userId}`).then(unwrap);
}

// ---------- DELETE user (permanent, if needed) ----------
export async function deleteUserApi(id) {
  return api.delete(`/users/${id}`).then(unwrap);
}
