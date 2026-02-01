"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./LoginStyle.css";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ Changed to Next.js API route
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (!res.ok) {
        setError(responseData.message || "Login failed");
        return;
      }

      localStorage.setItem("token", responseData.data);
      if (responseData.user) {
        localStorage.setItem("user", JSON.stringify(responseData.user));
      }

      console.log("✅ Login successful");
      router.push("/Home");
    } catch (error) {
      console.error("❌ Login error:", error);
      setError("Cannot reach server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);

      // ✅ Changed to Next.js API route
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: decoded.email,
          name: decoded.name,
          picture: decoded.picture,
          googleId: decoded.sub,
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        setError(responseData.message || "Google login failed");
        return;
      }

      localStorage.setItem("token", responseData.data);
      if (responseData.user) {
        localStorage.setItem("user", JSON.stringify(responseData.user));
      }

      router.push("/Home");
    } catch (error) {
      console.error("Google login error:", error);
      setError("Failed to login with Google");
    }
  };

  return (
    <div className="login_container">
      <div className="login_form_container">
        <div className="left">
          <form className="form_container" onSubmit={handleLoginSubmit}>
            <h1>Login to Your Account</h1>

            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
              className="input"
            />

            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={data.password}
              required
              className="input"
            />

            <div style={{ width: "100%", textAlign: "right", marginBottom: "10px" }}>
              <Link href="/forgot-password" style={{ fontSize: "14px", color: "#1e90ff" }}>
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="green_btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            {error && <div className="error_msg">{error}</div>}

            <div className="google_btn">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => setError("Google login failed")}
              />
            </div>
          </form>
        </div>

        <div className="right">
          <h1>New Here ?</h1>
          <Link href="/signup">
            <button type="button" className="white_btn">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;