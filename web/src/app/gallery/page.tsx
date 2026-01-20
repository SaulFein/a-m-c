import { Suspense } from "react";
import { getAvailableCars } from "@/actions/cars";
import { CarGallery, CarGallerySkeleton } from "@/components/cars";

/**
 * Gallery Page Metadata
 */
export const metadata = {
  title: "Inventory",
  description: "Browse our current inventory of quality pre-owned vehicles.",
};

/**
 * Gallery Page - Shows all available (non-sold) cars
 *
 * This is a SERVER component that:
 * 1. Fetches data directly (no useEffect/fetch needed)
 * 2. Renders on the server for fast initial load
 * 3. SEO-friendly (content is in the HTML)
 *
 * COMPARE TO ANGULARJS:
 * Your old galleryController did:
 *   CarService.getCarsPublic().then(function(res) {
 *     $scope.cars = res.data.filter(car => !car.sold);
 *   });
 *
 * Here we just call the action directly - no $scope, no promises to manage,
 * no loading state boilerplate. The async/await is handled by Next.js.
 */
export default async function GalleryPage() {
  // Fetch cars directly in the component - this runs on the server
  const cars = await getAvailableCars();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Current Inventory</h1>
        <p className="mt-2 text-muted-foreground">
          {cars.length} vehicle{cars.length !== 1 ? "s" : ""} available
        </p>
      </div>

      {/* Car Grid */}
      <Suspense fallback={<CarGallerySkeleton />}>
        <CarGallery
          cars={cars}
          emptyMessage="No vehicles currently available. Check back soon!"
        />
      </Suspense>
    </div>
  );
}
