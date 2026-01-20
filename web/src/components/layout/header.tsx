import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav } from "./mobile-nav";
import { DesktopNav } from "./desktop-nav";

/**
 * Header Component - The main site navigation
 *
 * KEY CONCEPT: This is a SERVER component (no "use client" directive).
 *
 * Why server component?
 * 1. We need to check if user is logged in (auth() runs on server)
 * 2. No interactivity needed in the header itself
 * 3. Better performance - HTML is generated on server
 *
 * Comparison to your AngularJS app:
 * - Your old app checks `ng-if="adminUser"` which was set from sessionStorage
 * - Here, we check the session on the SERVER before sending HTML
 * - This is more secure - the admin link isn't even in the HTML if not logged in
 *
 * The interactive parts (mobile menu, theme toggle, dropdowns) are in
 * separate client components that we import.
 */
export async function Header() {
  // auth() is an async function that checks the session
  // This runs on the SERVER, not in the browser
  const session = await auth();
  const isAdmin = !!session?.user;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/*
        Tailwind CSS classes explained:
        - sticky top-0: Sticks to top when scrolling (like position: sticky)
        - z-50: High z-index so it stays above other content
        - bg-background/95: Background color at 95% opacity
        - backdrop-blur: Blurs content behind (glassmorphism effect)
        - supports-[...]: Only applies if browser supports backdrop-filter

        In your old CSS, you'd write this in separate .css files.
        Tailwind puts styles directly on elements - controversial but productive!
      */}

      <div className="container mx-auto px-4">
        {/*
          container: Sets max-width based on breakpoints
          mx-auto: margin-left/right auto (centers it)
          px-4: padding-left/right of 1rem (16px)
        */}

        <div className="flex h-20 items-center justify-between">
          {/*
            flex: display: flex
            h-20: height: 5rem (80px) - matches your current nav height
            items-center: align-items: center
            justify-between: space-between logo and nav
          */}

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            {/*
              Next.js <Link>: Like Angular's routerLink
              - Prefetches pages for instant navigation
              - No full page reload (SPA behavior)
              - Automatically handles active states
            */}
            <Image
              src="/images/logo.png"
              alt="Authentic Motorcars"
              width={200}
              height={60}
              className="h-14 w-auto dark:brightness-110"
              priority // Load this image first (it's above the fold)
            />
            {/*
              Next.js <Image>: Like <img> but optimized
              - Automatically lazy loads
              - Serves WebP/AVIF when browser supports it
              - Prevents layout shift (requires width/height)
              - "priority" disables lazy loading for critical images
            */}
          </Link>

          {/* Desktop Navigation - hidden on mobile */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {/*
              hidden: display: none (mobile)
              md:flex: display: flex (768px and up)

              This is "mobile-first" responsive design:
              - Default styles are for mobile
              - md:, lg:, xl: prefixes add styles for larger screens
            */}
            <DesktopNav isAdmin={isAdmin} />
            <ThemeToggle />
          </div>

          {/* Mobile Navigation - visible only on mobile */}
          <div className="flex items-center md:hidden">
            <ThemeToggle />
            <MobileNav isAdmin={isAdmin} />
          </div>
        </div>
      </div>

      {/* Accent stripes - your signature orange and blue */}
      <div className="h-1.5 bg-[#f58521]" /> {/* Orange: Pantone 151 C */}
      <div className="h-1.5 bg-[#00b4dd]" /> {/* Blue: Your brand cyan */}
      {/*
        Custom colors using arbitrary values [#hexcode]
        These match your current brand colors exactly.

        We could also define these in tailwind.config.js as:
        colors: {
          brand: {
            orange: '#f58521',
            blue: '#00b4dd',
          }
        }
        Then use: bg-brand-orange, bg-brand-blue
      */}
    </header>
  );
}
