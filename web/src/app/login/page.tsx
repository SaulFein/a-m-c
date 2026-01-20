import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "./login-form";

/**
 * Login Page Metadata
 *
 * Each page can export its own metadata that merges with the root layout.
 * The template in layout.tsx will produce: "Login | Authentic Motorcars"
 */
export const metadata = {
  title: "Login",
  description: "Sign in to access the admin dashboard",
};

/**
 * Login Page - Server Component
 *
 * WHY SERVER COMPONENT FOR A LOGIN PAGE?
 * 1. We check if user is already logged in (server-side)
 * 2. If logged in, redirect immediately (no flash of login form)
 * 3. The actual form is a client component (imported below)
 *
 * This pattern is common:
 * - Server component handles data/auth checks
 * - Client component handles interactivity
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  // Check if user is already authenticated
  const session = await auth();

  // If already logged in, redirect to admin
  if (session?.user) {
    redirect("/admin");
  }

  // Get error and callback URL from query params
  // In Next.js 15+, searchParams is a Promise
  const params = await searchParams;
  const error = params.error;
  const callbackUrl = params.callbackUrl || "/admin";

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
      {/*
        min-h-[calc(100vh-200px)]: Full height minus header/footer
        This centers the login form vertically
      */}
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Admin Login</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to manage your inventory
          </p>
        </div>

        {/* Error Messages */}
        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center text-sm text-destructive">
            {error === "AccessDenied" ? (
              <>
                <strong>Access Denied</strong>
                <p className="mt-1">
                  Your email is not authorized for admin access.
                </p>
              </>
            ) : error === "Configuration" ? (
              <>
                <strong>Configuration Error</strong>
                <p className="mt-1">
                  There&apos;s an issue with the authentication setup.
                </p>
              </>
            ) : (
              <>
                <strong>Sign In Error</strong>
                <p className="mt-1">An error occurred during sign in.</p>
              </>
            )}
          </div>
        )}

        {/* Login Form (Client Component) */}
        <LoginForm callbackUrl={callbackUrl} />

        {/* Info Notice */}
        <p className="text-center text-xs text-muted-foreground">
          Only authorized administrators can access this area.
          <br />
          Contact the site owner if you need access.
        </p>
      </div>
    </div>
  );
}
