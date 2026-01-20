import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Admin Layout - Protected Route Wrapper
 *
 * This layout wraps all pages under /admin/*.
 * It checks authentication and redirects to login if not authenticated.
 *
 * KEY CONCEPT: Nested Layouts
 * - Root layout (app/layout.tsx) wraps EVERYTHING
 * - This admin layout wraps only /admin/* pages
 * - Both layouts are applied (they nest)
 *
 * The check happens on the SERVER before any HTML is sent.
 * This is more secure than client-side checks because:
 * 1. Unauthenticated users never see admin content
 * 2. No flash of protected content
 * 3. Can't bypass with browser dev tools
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication on the server
  const session = await auth();

  // If not logged in, redirect to login
  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  // User is authenticated - render admin content
  return (
    <div className="min-h-[calc(100vh-200px)]">
      {/* Admin Header/Banner */}
      <div className="border-b bg-muted/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Logged in as {session.user.email}
              </p>
            </div>
            {/* Sign out handled by Header component */}
          </div>
        </div>
      </div>

      {/* Admin Content */}
      <div className="container mx-auto px-4 py-6">
        {children}
      </div>
    </div>
  );
}
