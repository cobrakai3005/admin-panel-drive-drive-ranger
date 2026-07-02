import { useState } from "react";
import {
  loginApi,
  registerApi,
  logoutApi,
  verifyOTPApi,
  resendOtpApi,
  forgetPasswordApi,
  updateProfileImageApi,
} from "../../api/auth/";

export default function useAuth() {
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [verifyOTPLoading, setVerifyOTPLoading] = useState(false);
  const [resendOtpLoading, setResendOtpLoading] = useState(false);
  const [forgetPasswordLoading, setForgetPasswordLoading] = useState(false);
  const [updateProfileImageLoading, setUpdateProfileImageLoading] =
    useState(false);

  const [loginError, setLoginError] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const [logoutError, setLogoutError] = useState(null);
  const [verifyOTPError, setVerifyOTPError] = useState(null);
  const [resendOtpError, setResendOtpError] = useState(null);
  const [forgetPasswordError, setForgetPasswordError] = useState(null);
  const [updateProfileImageError, setUpdateProfileImageError] = useState(null);

  // Login function
  const login = async (formData) => {
    setLoginLoading(true);
    setLoginError(null);
    try {
      const response = await loginApi(formData);
      // You can add token storage logic here if needed

      // localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      setLoginError(error);
      throw error;
    } finally {
      setLoginLoading(false);
    }
  };

  // Register function
  const register = async (formData) => {
    setRegisterLoading(true);
    setRegisterError(null);
    try {
      const response = await registerApi(formData);
      return response;
    } catch (error) {
      setRegisterError(error);
      throw error;
    } finally {
      setRegisterLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLogoutLoading(true);
    setLogoutError(null);
    try {
      const response = await logoutApi();
      // Clear stored token on logout
      // localStorage.removeItem('token');
      return response;
    } catch (error) {
      setLogoutError(error);
      throw error;
    } finally {
      setLogoutLoading(false);
    }
  };

  // Verify OTP function
  const verifyOTP = async (otpData) => {
    setVerifyOTPLoading(true);
    setVerifyOTPError(null);
    try {
      const response = await verifyOTPApi(otpData);
      return response;
    } catch (error) {
      setVerifyOTPError(error);
      throw error;
    } finally {
      setVerifyOTPLoading(false);
    }
  };

  // Resend OTP function
  const resendOtp = async (emailData) => {
    setResendOtpLoading(true);
    setResendOtpError(null);
    try {
      const response = await resendOtpApi(emailData);
      return response;
    } catch (error) {
      setResendOtpError(error);
      throw error;
    } finally {
      setResendOtpLoading(false);
    }
  };

  // Forget password function
  const forgetPassword = async (emailData) => {
    setForgetPasswordLoading(true);
    setForgetPasswordError(null);
    try {
      const response = await forgetPasswordApi(emailData);
      return response;
    } catch (error) {
      setForgetPasswordError(error);
      throw error;
    } finally {
      setForgetPasswordLoading(false);
    }
  };

  // Update profile image function
  const updateProfileImage = async (formData) => {
    setUpdateProfileImageLoading(true);
    setUpdateProfileImageError(null);
    try {
      const response = await updateProfileImageApi(formData);
      return response;
    } catch (error) {
      setUpdateProfileImageError(error);
      throw error;
    } finally {
      setUpdateProfileImageLoading(false);
    }
  };

  return {
    // Functions
    login,
    register,
    logout,
    verifyOTP,
    resendOtp,
    forgetPassword,
    updateProfileImage,

    // Loading states
    loginLoading,
    registerLoading,
    logoutLoading,
    verifyOTPLoading,
    resendOtpLoading,
    forgetPasswordLoading,
    updateProfileImageLoading,

    // Error states
    loginError,
    registerError,
    logoutError,
    verifyOTPError,
    resendOtpError,
    forgetPasswordError,
    updateProfileImageError,

    // Reset error functions (optional)
    resetLoginError: () => setLoginError(null),
    resetRegisterError: () => setRegisterError(null),
    resetLogoutError: () => setLogoutError(null),
    resetVerifyOTPError: () => setVerifyOTPError(null),
    resetResendOtpError: () => setResendOtpError(null),
    resetForgetPasswordError: () => setForgetPasswordError(null),
    resetUpdateProfileImageError: () => setUpdateProfileImageError(null),
  };
}
