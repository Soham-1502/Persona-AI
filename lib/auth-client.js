// lib/auth-client.js (Client-side usage ONLY)

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
