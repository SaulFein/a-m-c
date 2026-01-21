import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Provider } from "next-auth/providers";
import { prisma } from "./prisma";

// Parse admin emails from environment variable
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

// Warn if no admin emails configured (in development)
if (ADMIN_EMAILS.length === 0 && process.env.NODE_ENV === "development") {
  console.warn(
    "⚠️  No ADMIN_EMAILS configured. Nobody will be able to log in. " +
    "Set ADMIN_EMAILS in your .env file."
  );
}

// Build providers array - only include configured providers
const providers: Provider[] = [];

// Google OAuth - only add if credentials are configured
if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    })
  );
}

// Email (Magic Link) - only add if email server is configured
const emailPort = parseInt(process.env.EMAIL_SERVER_PORT || "", 10);
if (
  process.env.EMAIL_SERVER_HOST &&
  !isNaN(emailPort) &&
  process.env.EMAIL_SERVER_USER &&
  process.env.EMAIL_SERVER_PASSWORD &&
  process.env.EMAIL_FROM
) {
  providers.push(
    Nodemailer({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: emailPort,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    })
  );
}

// Warn if no providers configured
if (providers.length === 0 && process.env.NODE_ENV === "development") {
  console.warn(
    "⚠️  No auth providers configured. Set up Google OAuth or Email in your .env file."
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user }) {
      // Only allow pre-approved admin emails to sign in
      const email = user.email?.toLowerCase();
      if (!email) {
        return false;
      }

      // Check if email is in admin list
      if (!ADMIN_EMAILS.includes(email)) {
        // Return URL with error for unauthorized users
        return "/login?error=AccessDenied";
      }

      return true;
    },
    async session({ session, user }) {
      // Add user ID to session for convenience
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  // Security settings
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
});

// Type augmentation for session
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
