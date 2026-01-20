import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { Header, Footer } from "@/components/layout";
import { Toaster } from "@/components/ui/sonner";

/**
 * Font Configuration
 *
 * Next.js has built-in font optimization:
 * - Fonts are downloaded at build time
 * - Self-hosted (no external requests to Google Fonts)
 * - Prevents layout shift (FOUT - Flash of Unstyled Text)
 *
 * We're using Inter - a clean, modern sans-serif that works well
 * for both light and dark themes.
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans", // CSS variable name for Tailwind
});

/**
 * Metadata Configuration
 *
 * This replaces the <head> tags in your old index.html.
 * Next.js handles this server-side for better SEO.
 *
 * Benefits over client-side meta tags:
 * - Search engines see the correct title/description immediately
 * - Social media previews work properly (Open Graph)
 * - No flash of wrong title
 */
export const metadata: Metadata = {
  title: {
    default: "Authentic Motorcars",
    template: "%s | Authentic Motorcars", // e.g., "Contact | Authentic Motorcars"
  },
  description:
    "Premium pre-owned vehicles in Redmond, WA. Specializing in quality used cars with exceptional service.",
  keywords: ["used cars", "pre-owned vehicles", "car dealership", "Redmond WA", "authentic motorcars"],
  authors: [{ name: "Authentic Motorcars" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Authentic Motorcars",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * Root Layout Component
 *
 * This is the TOP-LEVEL layout that wraps your entire application.
 * It's like the app.component.ts in Angular - always present.
 *
 * Key concepts:
 * - { children }: The page content that will be rendered inside
 * - This layout wraps ALL pages
 * - You can have nested layouts for sections (e.g., /admin has its own layout)
 *
 * The structure here is:
 * <html>
 *   <body>
 *     <ThemeProvider>    ← Provides dark/light mode context
 *       <Header />       ← Always visible
 *       <main>{page}</main>  ← Page content changes
 *       <Footer />       ← Always visible
 *       <Toaster />      ← Toast notifications
 *     </ThemeProvider>
 *   </body>
 * </html>
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/*
        suppressHydrationWarning:
        The theme provider adds a class to <html> on the client.
        This can cause a hydration mismatch warning.
        This attribute suppresses that specific warning.
      */}
      <body className={`${inter.variable} font-sans antialiased`}>
        {/*
          antialiased: Smooths font rendering
          font-sans: Uses our Inter font (defined via CSS variable)
        */}
        <ThemeProvider>
          <div className="relative flex min-h-screen flex-col">
            {/*
              min-h-screen: Minimum height of viewport
              flex flex-col: Column layout (header, main, footer stack vertically)

              This ensures the footer stays at the bottom even on short pages.
            */}
            <Header />
            <main className="flex-1">
              {/*
                flex-1: Takes up all remaining space
                This pushes the footer to the bottom
              */}
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
          {/*
            Toaster: Toast notification container
            Renders toast popups for success/error messages
          */}
        </ThemeProvider>
      </body>
    </html>
  );
}
