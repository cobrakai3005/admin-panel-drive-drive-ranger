// context/AuthContext.js
import { createContext, useContext, useState } from "react";
import * as authApi from "../api/auth"; // adjust import path

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  // ---------- Login ----------
  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await authApi.loginApi(credentials);
      const { token, user } = response.data;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      setUser(user);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ---------- Register ----------
  const register = async (formData) => {
    setLoading(true);
    try {
      const response = await authApi.registerApi(formData);
      return response.data.data; // contains user with phone, email, etc.
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ---------- Verify OTP ----------
  const verifyOTP = async (phone, otp) => {
    setLoading(true);
    try {
      await authApi.verifyOTPApi({ phone, otp });
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ---------- Resend OTP ----------
  const resendOTP = async (email) => {
    setLoading(true);
    try {
      await authApi.resendOtpApi({ email });
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ---------- Forgot Password ----------
  const forgotPassword = async (email, otp, password, confirmPassword) => {
    setLoading(true);
    try {
      await authApi.forgetPasswordApi({
        email,
        otp,
        password,
        confirmPassword,
      });
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ---------- Update Profile Image ----------
  const updateProfileImage = async (formData) => {
    setLoading(true);
    try {
      const response = await authApi.updateProfileImageApi(formData);
      const updatedUser = response.data.data;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ---------- Logout ----------
  const logout = async () => {
    setLoading(true);
    try {
      await authApi.logoutApi();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    verifyOTP,
    resendOTP,
    forgotPassword,
    updateProfileImage,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthProvider = () => useContext(AuthContext);
