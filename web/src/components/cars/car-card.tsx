import Link from "next/link";
import Image from "next/image";
import { Car } from "@prisma/client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatMiles, getCarTitle, getFilestackUrl } from "@/lib/utils";

/**
 * CarCard - Displays a car in a grid/gallery view
 *
 * REUSABLE COMPONENT used in:
 * - /gallery (available cars)
 * - /sold (sold cars)
 * - /admin (inventory list)
 * - Home page featured cars
 *
 * Props:
 * - car: The car data from database
 * - href: Where to link (different for public vs admin)
 * - showSoldBadge: Whether to show "SOLD" badge
 *
 * By making href a prop, the same component works for:
 * - Public: links to /car/[id]
 * - Admin: links to /admin/cars/[id]
 */

interface CarCardProps {
  car: Car;
  href?: string;
  showSoldBadge?: boolean;
}

export function CarCard({ car, href, showSoldBadge = true }: CarCardProps) {
  // Default link is public car detail page
  const linkHref = href || `/car/${car.id}`;

  // Get the main image URL with optimized size
  // Cast car.picture since Prisma stores it as Json type
  const picture = car.picture as { url?: string; handle?: string } | null;
  const imageUrl = getFilestackUrl(picture, { width: 400, height: 300, fit: "crop" });

  return (
    <Link href={linkHref} className="group">
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={getCarTitle(car)}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            // Placeholder when no image
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}

          {/* Sold Badge */}
          {showSoldBadge && car.sold && (
            <Badge
              variant="destructive"
              className="absolute right-2 top-2 text-sm font-bold"
            >
              SOLD
            </Badge>
          )}

          {/* Price Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <p className="text-lg font-bold text-white">
              {formatPrice(car.price)}
            </p>
          </div>
        </div>

        {/* Card Content */}
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-1">
            {getCarTitle(car)}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {formatMiles(car.miles)}
          </p>
          {car.color && car.color !== "N/A" && (
            <p className="text-sm text-muted-foreground">
              {car.color}
              {car.interiorColor && car.interiorColor !== "N/A" && (
                <> / {car.interiorColor} Interior</>
              )}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

/**
 * CarCardSkeleton - Loading placeholder
 *
 * Used while cars are loading (Suspense fallback)
 * Matches the layout of CarCard for smooth transition
 */
export function CarCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[4/3] animate-pulse bg-muted" />
      <CardContent className="p-4 space-y-2">
        <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
      </CardContent>
    </Card>
  );
}
