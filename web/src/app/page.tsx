/**
 * Home Page - The landing page at "/"
 *
 * FILE ROUTING EXPLAINED:
 * In Next.js App Router, the file path determines the URL:
 *
 * - src/app/page.tsx         → /
 * - src/app/about/page.tsx   → /about
 * - src/app/car/[id]/page.tsx → /car/123 (dynamic route)
 *
 * This is similar to QwikCity's file-based routing!
 * In Angular, you'd define routes in app-routing.module.ts.
 *
 * Special files:
 * - page.tsx    → The actual page content
 * - layout.tsx  → Wrapper that persists across pages
 * - loading.tsx → Loading UI while page loads
 * - error.tsx   → Error boundary
 * - not-found.tsx → 404 page
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Car, Wrench, Warehouse } from "lucide-react";

/**
 * This is a SERVER component (default in App Router).
 *
 * In your AngularJS app, the home page was a "partial" loaded via ng-view.
 * Here, it's a full React component that renders on the server.
 *
 * Later, we'll fetch data from your database here to show featured cars.
 * For now, it's a simple placeholder to test the layout.
 */
export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-background to-muted py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
            Welcome to{" "}
            <span className="text-[#f58521]">Authentic</span>{" "}
            <span className="text-[#00b4dd]">Motorcars</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Premium pre-owned vehicles in Redmond, WA. Quality cars with
            exceptional service.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="bg-[#f58521] hover:bg-[#e07410]">
              <Link href="/gallery">
                View Inventory
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Our Services</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature Card 1 */}
            <div className="rounded-lg border bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-[#f58521]/10 p-3">
                  <Car className="h-8 w-8 text-[#f58521]" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Quality Vehicles</h3>
              <p className="text-muted-foreground">
                Hand-selected pre-owned cars that meet our high standards.
              </p>
              <Button asChild variant="link" className="mt-4">
                <Link href="/gallery">Browse Inventory →</Link>
              </Button>
            </div>

            {/* Feature Card 2 */}
            <div className="rounded-lg border bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-[#00b4dd]/10 p-3">
                  <Wrench className="h-8 w-8 text-[#00b4dd]" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Expert Service</h3>
              <p className="text-muted-foreground">
                Professional maintenance and repair services for your vehicle.
              </p>
              <Button asChild variant="link" className="mt-4">
                <Link href="/service">Learn More →</Link>
              </Button>
            </div>

            {/* Feature Card 3 */}
            <div className="rounded-lg border bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-[#f58521]/10 p-3">
                  <Warehouse className="h-8 w-8 text-[#f58521]" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Car Storage</h3>
              <p className="text-muted-foreground">
                Secure indoor and outdoor storage options for your vehicles.
              </p>
              <Button asChild variant="link" className="mt-4">
                <Link href="/storage">Learn More →</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">
            Ready to find your next car?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
            Visit our showroom or browse our online inventory. We&apos;re here to
            help you find the perfect vehicle.
          </p>
          <Button asChild size="lg">
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
