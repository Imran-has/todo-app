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
        console.log("[Auth] Token saved from header");
      }
    },
  },
});

export const { signIn, signUp, signOut, useSession } = authClient;

// Helper to get bearer token for API calls
// Falls back to session token if bearer token not available
export function getBearerToken(): string | null {
  if (typeof window === "undefined") return null;

  // First try bearer token
  const bearerToken = localStorage.getItem(TOKEN_KEY);
  if (bearerToken) {
    return bearerToken;
  }

  // Fallback: try to get session token from better-auth cookie name pattern
  // Better Auth stores session in a cookie, we can read the token from there
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "better-auth.session_token" || name === "__Secure-better-auth.session_token") {
      if (value) {
        console.log("[Auth] Using session cookie as token");
        return value;
      }
    }
  }

  return null;
}

// Clear token on sign out
export async function signOutAndClearToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
  return signOut();
}
