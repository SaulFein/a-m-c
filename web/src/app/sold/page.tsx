import { Suspense } from "react";
import { getSoldCars } from "@/actions/cars";
import { CarGallery, CarGallerySkeleton } from "@/components/cars";

export const metadata = {
  title: "Sold Vehicles",
  description: "View our recently sold vehicles.",
};

/**
 * Sold Page - Shows all sold cars
 *
 * Nearly identical to Gallery page - the only differences are:
 * 1. Different data source (getSoldCars vs getAvailableCars)
 * 2. Different messaging
 *
 * This is the power of shared components - the CarGallery component
 * doesn't care whether cars are sold or available. It just displays them.
 */
export default async function SoldPage() {
  const cars = await getSoldCars();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Sold Vehicles</h1>
        <p className="mt-2 text-muted-foreground">
          {cars.length} vehicle{cars.length !== 1 ? "s" : ""} sold
        </p>
      </div>

      <Suspense fallback={<CarGallerySkeleton />}>
        <CarGallery
          cars={cars}
          emptyMessage="No sold vehicles to display."
          showSoldBadge={false} // Don't show badge - they're all sold
        />
      </Suspense>
    </div>
  );
}
