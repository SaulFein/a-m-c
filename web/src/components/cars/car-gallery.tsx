import { Car } from "@prisma/client";
import { CarCard, CarCardSkeleton } from "./car-card";

/**
 * CarGallery - Grid display of car cards
 *
 * REUSABLE COMPONENT used in:
 * - /gallery page
 * - /sold page
 * - Home page featured section
 *
 * Just pass an array of cars and it renders them in a responsive grid.
 * The grid automatically adjusts:
 * - Mobile: 1 column
 * - Tablet: 2 columns
 * - Desktop: 3 columns
 * - Large: 4 columns
 */

interface CarGalleryProps {
  cars: Car[];
  emptyMessage?: string;
  showSoldBadge?: boolean;
  linkPrefix?: string; // e.g., "/admin/cars" for admin links
}

export function CarGallery({
  cars,
  emptyMessage = "No vehicles found.",
  showSoldBadge = true,
  linkPrefix,
}: CarGalleryProps) {
  if (cars.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cars.map((car) => (
        <CarCard
          key={car.id}
          car={car}
          href={linkPrefix ? `${linkPrefix}/${car.id}` : undefined}
          showSoldBadge={showSoldBadge}
        />
      ))}
    </div>
  );
}

/**
 * CarGallerySkeleton - Loading state for gallery
 *
 * Shows placeholder cards while data is loading.
 * Used with React Suspense for smooth loading states.
 */
export function CarGallerySkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <CarCardSkeleton key={i} />
      ))}
    </div>
  );
}
