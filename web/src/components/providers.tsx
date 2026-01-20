"use client";

/**
 * Client Providers Component
 *
 * This component wraps the app with all client-side providers.
 * Providers use React Context to share state/functionality across components.
 *
 * Currently includes:
 * - SessionProvider: Makes auth session available to client components
 *
 * WHY A SEPARATE FILE?
 * The root layout.tsx is a server component.
 * Providers need "use client" but we can't add that to layout.tsx
 * without making the whole layout a client component.
 *
 * Solution: Create a client component that wraps children with providers,
 * then use that in the server layout.
 */

import { SessionProvider } from "next-auth/react";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      {/*
        SessionProvider: From next-auth/react
        - Makes useSession() hook available
        - Handles session refresh automatically
        - Required for client-side auth checks

        Note: Server components use auth() directly from @/lib/auth
        Client components use useSession() from next-auth/react
      */}
      {children}
    </SessionProvider>
  );
}
