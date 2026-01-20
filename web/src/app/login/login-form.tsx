"use client";

/**
 * Login Form - Client Component
 *
 * This needs to be a client component because:
 * 1. Form state management (useState)
 * 2. Form submission handling
 * 3. Loading states
 *
 * We use Auth.js signIn() function which handles:
 * - OAuth redirects (Google)
 * - Magic link emails
 * - CSRF protection automatically
 */

import * as React from "react";
import { signIn } from "next-auth/react";
import { Loader2, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Google icon as SVG (not in lucide-react)
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

interface LoginFormProps {
  callbackUrl: string;
}

export function LoginForm({ callbackUrl }: LoginFormProps) {
  // Form state
  const [email, setEmail] = React.useState("");
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const [isEmailLoading, setIsEmailLoading] = React.useState(false);
  const [emailSent, setEmailSent] = React.useState(false);

  /**
   * Handle Google Sign In
   *
   * signIn("google") triggers OAuth flow:
   * 1. Redirects to Google
   * 2. User approves
   * 3. Google redirects back with code
   * 4. Auth.js exchanges code for tokens
   * 5. Session created, user redirected to callbackUrl
   */
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl });
    } catch (error) {
      console.error("Google sign in error:", error);
      setIsGoogleLoading(false);
    }
    // Note: No need to setIsGoogleLoading(false) on success
    // because the page will redirect
  };

  /**
   * Handle Magic Link Sign In
   *
   * signIn("nodemailer") sends a magic link email:
   * 1. User enters email
   * 2. Auth.js sends email with secure token link
   * 3. User clicks link in email
   * 4. Auth.js verifies token, creates session
   * 5. User redirected to callbackUrl
   */
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    setIsEmailLoading(true);
    try {
      const result = await signIn("nodemailer", {
        email,
        callbackUrl,
        redirect: false, // Don't redirect, show success message
      });

      if (result?.ok) {
        setEmailSent(true);
      }
    } catch (error) {
      console.error("Email sign in error:", error);
    } finally {
      setIsEmailLoading(false);
    }
  };

  // Show success message after email sent
  if (emailSent) {
    return (
      <div className="rounded-lg border bg-card p-6 text-center">
        <Mail className="mx-auto h-12 w-12 text-primary" />
        <h2 className="mt-4 text-xl font-semibold">Check your email</h2>
        <p className="mt-2 text-muted-foreground">
          We sent a magic link to <strong>{email}</strong>
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Click the link in the email to sign in. The link expires in 24 hours.
        </p>
        <Button
          variant="link"
          className="mt-4"
          onClick={() => {
            setEmailSent(false);
            setEmail("");
          }}
        >
          Use a different email
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      {/* Google Sign In */}
      <Button
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading || isEmailLoading}
      >
        {isGoogleLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <GoogleIcon className="mr-2 h-4 w-4" />
        )}
        Continue with Google
      </Button>

      {/* Divider */}
      <div className="relative my-6">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
          or
        </span>
      </div>

      {/* Email Magic Link Form */}
      <form onSubmit={handleEmailSignIn} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isEmailLoading || isGoogleLoading}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={isEmailLoading || isGoogleLoading || !email}
        >
          {isEmailLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending link...
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Send magic link
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
