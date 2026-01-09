import { createAuthClient } from "better-auth/react";

const TOKEN_KEY = "bearer_token";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  fetchOptions: {
    onSuccess: (ctx) => {
      const authToken = ctx.response.headers.get("set-auth-token");
      if (authToken && typeof window !== "undefined") {
        localStorage.setItem(TOKEN_KEY, authToken);
      }
    },
  },
});

export const { signIn, signUp, signOut, useSession } = authClient;

// Helper to get bearer token for API calls
export function getBearerToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

// Clear token on sign out
export async function signOutAndClearToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
  return signOut();
}
