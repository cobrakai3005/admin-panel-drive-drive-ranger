// pages/VerifyOTP.js
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthProvider } from "../context/AuthContext";
import { toast } from "sonner";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOTP, resendOTP } = useAuthProvider();

  // Get phone & email from location state (passed from Auth page)
  const { phone, email } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone || !otp) {
      toast.error("Phone and OTP are required");
      return;
    }
    setLoading(true);
    try {
      await verifyOTP(phone, otp);
      toast.success("OTP verified! Please login.");
      navigate("/auth");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Email not available for resend");
      return;
    }
    setResendLoading(true);
    try {
      await resendOTP(email);
      toast.success("OTP resent successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Resend failed");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Verify OTP
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          We sent a 6-digit code to your email. Enter it below.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              OTP Code
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-70"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={handleResend}
            disabled={resendLoading}
            className="text-blue-600 hover:underline text-sm disabled:opacity-50"
          >
            {resendLoading ? "Resending..." : "Resend OTP"}
          </button>
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/auth")}
            className="text-sm text-gray-600 hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}