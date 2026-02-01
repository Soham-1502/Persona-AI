'use client';

import React, { useState, Suspense } from "react";
// ✅ Next.js replacement for react-router-dom
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import "./ResetPassword.css";

const ResetPasswordForm = () => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  
  // ✅ Extract email from URL: /reset-password?email=...
  const email = searchParams.get("email");

  const handleResetPassword = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-reset-otp",
        {
          email,
          otp,
          newPassword,
        }
      );
      setMessage(res.data.message || "Password reset successfully!");
      setError("");
      setTimeout(() => {
        router.push("/login"); // ✅ Next.js navigation
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password.");
      setMessage("");
    }
  };

  return (
    <div className="container">
      <div className="box">
        <h2>Reset Password</h2>
        <input
          type="text"
          placeholder="Enter OTP" /* ✅ Original Placeholder Restored */
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="input"
        />
        <input
          type="password"
          placeholder="Enter new password" /* ✅ Original Placeholder Restored */
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="input"
        />
        <button className="button" onClick={handleResetPassword}>
          Reset Password
        </button>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

// ✅ Suspense is required in Next.js when using useSearchParams
export default function ResetPassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}