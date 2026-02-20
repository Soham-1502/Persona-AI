'use client';

import React, { useState } from "react";
import axios from "axios";
// ✅ Fix 1: Change 'react-router-dom' to 'next/navigation'
import { useRouter } from "next/navigation"; 

// ✅ Fix 2: Ensure this CSS file exists in the same folder.
// Note: In Next.js, standard CSS imports only work in layout.js 
// unless you use CSS Modules (e.g., ForgotPassword.module.css)
import "./ForgotPassword.css"; 

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ✅ Fix 3: Use the Next.js router
  const router = useRouter();

  const handleSendOtp = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );
      setMessage(res.data.message || "OTP sent successfully!");
      setError("");

      setTimeout(() => {
        // ✅ Fix 4: Next.js uses router.push()
        // We pass email via query params because router.push doesn't take 'state'
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setMessage("");
    }
  };

  return (
    <div className="container">
      <div className="box">
        <h2>Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />
        <button className="button" onClick={handleSendOtp}>
          Send OTP
        </button>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;