import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer } from "better-auth/plugins";
import { db } from "./db";
import * as schema from "./schema";

// Build trusted origins for production
const trustedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

if (process.env.NEXT_PUBLIC_APP_URL) {
  trustedOrigins.push(process.env.NEXT_PUBLIC_APP_URL);
}

// Add Hugging Face backend URL if set (for cross-origin requests)
if (process.env.NEXT_PUBLIC_API_URL) {
  trustedOrigins.push(process.env.NEXT_PUBLIC_API_URL);
}

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET!,
  trustedOrigins,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  plugins: [
    bearer({
      // Expose token in response header for client storage
      exposeAccessToken: true,
    }),
  ],
  advanced: {
    // Ensure cross-origin cookies work
    crossSubDomainCookies: {
      enabled: false, // Different domains, not subdomains
    },
  },
});
