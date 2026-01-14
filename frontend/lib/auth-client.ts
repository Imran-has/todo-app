import { createAuthClient } from "better-auth/react";

const TOKEN_KEY = "bearer_token";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  fetchOptions: {
    onSuccess: (ctx) => {
      // Try to get token from header
      const authToken = ctx.response.headers.get("set-auth-token");
      if (authToken && typeof window !== "undefined") {
        localStorage.setItem(TOKEN_KEY, authToken);
        console.log("[Auth] Token saved from header:", authToken.substring(0, 20) + "...");
      }
    },
  },
});

export const { signIn, signUp, signOut, useSession } = authClient;

// Helper to get bearer token for API calls
export function getBearerToken(): string | null {
  if (typeof window === "undefined") return null;

  // First try bearer token from localStorage
  const bearerToken = localStorage.getItem(TOKEN_KEY);
  if (bearerToken) {
    console.log("[Auth] Using localStorage token");
    return bearerToken;
  }

  // Fallback: try to get session token from better-auth cookies
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const trimmed = cookie.trim();
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;

    const name = trimmed.substring(0, eqIndex);
    const value = trimmed.substring(eqIndex + 1);

    // Better Auth cookie names
    if (
      name === "better-auth.session_token" ||
      name === "__Secure-better-auth.session_token" ||
      name === "better-auth_session_token"
    ) {
      if (value) {
        console.log("[Auth] Using session cookie:", name);
        return decodeURIComponent(value);
      }
    }
  }

  console.log("[Auth] No token found. Cookies:", document.cookie);
  return null;
}

// Store token manually (call after successful login)
export function setAuthToken(token: string) {
  if (typeof window !== "undefined" && token) {
    localStorage.setItem(TOKEN_KEY, token);
    console.log("[Auth] Token manually saved");
  }
}

// Clear token on sign out
export async function signOutAndClearToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
  return signOut();
}
