// This is app/lib/auth.js

import jwt from "jsonwebtoken";
import { User } from "@/models/User";
import connectDB from "@/lib/db";

export async function authenticate(req) {
  await connectDB();

  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    throw new Error("No token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔍 Decoded token:", decoded); // ✅ Add this

    // Try both 'id' and 'userId' for backwards compatibility
    const userId = decoded.userId || decoded.id;

    if (!userId) {
      throw new Error("Invalid token format");
    }

    const user = await User.findById(userId).select("-password");

    if (!user || !user.isActive) {
      throw new Error("Invalid user");
    }

    return user;
  } catch (error) {
    console.error("Auth error:", error.message);
    throw new Error("Authentication failed");
  }
}

// lib/auth.js or utils/auth.js

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  if (typeof window === "undefined") return false;

  try {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    return !!(token && user);
  } catch {
    return false;
  }
}

/**
 * Get current user from localStorage
 */
export function getCurrentUser() {
  if (typeof window === "undefined") return null;

  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
}

/**
 * Get auth token
 */
export function getAuthToken() {
  if (typeof window === "undefined") return null;

  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
}

/**
 * Clear all auth data
 */
export function clearAuth() {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  } catch (error) {
    console.error("Error clearing auth:", error);
  }
}

/**
 * Set auth data
 */
export function setAuth(token, user) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("token", token);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  } catch (error) {
    console.error("Error setting auth:", error);
  }
}
