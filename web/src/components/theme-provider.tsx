"use client";
// ☝️ This directive tells Next.js this is a CLIENT component.
//
// In Next.js 16 (App Router), components are SERVER components by default.
// Server components:
//   - Run on the server only (like QwikCity's routeLoader$)
//   - Can directly access databases, file system, etc.
//   - Cannot use React hooks (useState, useEffect) or browser APIs
//
// Client components:
//   - Run in the browser (and pre-render on server for SEO)
//   - Can use hooks and interactivity
//   - Need "use client" at the top
//
// Theme switching needs browser APIs (localStorage, system preference),
// so it MUST be a client component.

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// This type comes from next-themes - it defines what props the provider accepts
type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

/**
 * ThemeProvider wraps your app and provides dark/light mode functionality.
 *
 * How it works:
 * 1. Checks localStorage for saved preference
 * 2. Falls back to system preference (prefers-color-scheme)
 * 3. Adds a class to <html> element ("light" or "dark")
 * 4. Tailwind CSS uses this class to apply the right colors
 *
 * In Angular, you might do this with a service + renderer.
 * In Qwik, you'd use useContextProvider.
 * In React/Next.js, we use Context providers.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"        // Adds class to <html> (Tailwind needs this)
      defaultTheme="system"    // Use system preference by default
      enableSystem             // Allow system preference detection
      disableTransitionOnChange // Prevents flash during theme switch
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
