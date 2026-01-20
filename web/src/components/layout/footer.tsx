import Link from "next/link";
import { Facebook } from "lucide-react";

/**
 * Footer Component - Site footer with contact info and social links
 *
 * This is a SERVER component (no "use client").
 * The footer is static - no interactivity needed.
 *
 * Benefits of server component:
 * - Smaller JavaScript bundle (this code doesn't ship to browser)
 * - Faster page loads
 * - Better SEO (content is in initial HTML)
 */
export function Footer() {
  // Get current year dynamically
  // In your AngularJS app, you had a <date-year> directive for this
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      {/*
        In dark mode, bg-background will be dark.
        In light mode, it will be light.
        This is handled automatically by Tailwind's dark mode.
      */}

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center space-y-4 text-center">
          {/* Social Media Links */}
          <div className="flex space-x-4">
            <Link
              href="https://www.facebook.com/authenticmotorcars/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-primary"
              /*
                target="_blank": Opens in new tab
                rel="noopener noreferrer": Security best practice for external links
                - noopener: Prevents new page from accessing window.opener
                - noreferrer: Doesn't send referrer header

                This prevents a security vulnerability called "tabnapping"
                where a malicious site could redirect your original tab.
              */
            >
              <Facebook className="h-6 w-6" />
              <span className="sr-only">Facebook</span>
            </Link>
            {/* Add more social links here if needed */}
          </div>

          {/* Address */}
          <address className="text-sm text-muted-foreground not-italic">
            {/*
              <address> is semantic HTML for contact info
              not-italic: Tailwind class to override default italic style
            */}
            17351 NE 70th Street, Redmond, WA 98052
          </address>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Authentic Motorcars. All rights reserved.
          </p>

          {/* Optional: Quick Links */}
          <nav className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              href="/gallery"
              className="text-muted-foreground hover:text-primary"
            >
              Inventory
            </Link>
            <Link
              href="/service"
              className="text-muted-foreground hover:text-primary"
            >
              Service
            </Link>
            <Link
              href="/contact"
              className="text-muted-foreground hover:text-primary"
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>

      {/* Brand accent stripes at bottom */}
      <div className="h-1 bg-[#00b4dd]" />
      <div className="h-1 bg-[#f58521]" />
    </footer>
  );
}
