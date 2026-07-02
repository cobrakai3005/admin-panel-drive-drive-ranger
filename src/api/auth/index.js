// api/auth.js
import api from "../../config/axios";

export async function getMe() {
  return api.get("/auth/me").then((res) => res.data);
}
export async function loginApi(formData) {
  return api.post("/auth/login", formData);
}

export async function registerApi(formData) {
  // If you want to support file upload, you can detect FormData
  if (formData instanceof FormData) {
    return api.post("/auth/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  return api.post("/auth/register", formData);
}

export async function logoutApi() {
  return api.post("/auth/logout");
}

export async function verifyOTPApi(otpData) {
  return api.post("/auth/verify-otp", otpData);
}

export async function resendOtpApi(emailData) {
  return api.post("/auth/resend", emailData);
}

export async function forgetPasswordApi(emailData) {
  return api.post("/auth/forget-password", emailData);
}

export async function updateProfileImageApi(formData) {
  return api.patch("/update-profile-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
