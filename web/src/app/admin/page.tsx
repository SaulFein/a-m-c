import Link from "next/link";
import { Plus, Wrench, Warehouse, Home } from "lucide-react";
import { getAllCars } from "@/actions/cars";
import { Button } from "@/components/ui/button";
import { AdminCarTable } from "./admin-car-table";

export const metadata = {
  title: "Admin Dashboard",
};

/**
 * Admin Dashboard - Inventory Management
 *
 * Shows all cars (both available and sold) in a table.
 * Allows adding new cars and links to edit existing ones.
 * Also provides links to edit Service and Storage pages.
 */
export default async function AdminPage() {
  const cars = await getAllCars();

  const availableCount = cars.filter((c) => !c.sold).length;
  const soldCount = cars.filter((c) => c.sold).length;

  return (
    <div className="space-y-6">
      {/* Page Management Links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/home"
          className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
        >
          <div className="rounded-full bg-primary/10 p-2">
            <Home className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Edit Home Page</h3>
            <p className="text-sm text-muted-foreground">
              Update photo collage and content
            </p>
          </div>
        </Link>

        <Link
          href="/admin/service"
          className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
        >
          <div className="rounded-full bg-primary/10 p-2">
            <Wrench className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Edit Service Page</h3>
            <p className="text-sm text-muted-foreground">
              Update service information and images
            </p>
          </div>
        </Link>

        <Link
          href="/admin/storage"
          className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
        >
          <div className="rounded-full bg-primary/10 p-2">
            <Warehouse className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Edit Storage Page</h3>
            <p className="text-sm text-muted-foreground">
              Update storage information and images
            </p>
          </div>
        </Link>
      </div>

      {/* Header with stats and add button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Inventory</h2>
          <p className="text-muted-foreground">
            {availableCount} available · {soldCount} sold · {cars.length} total
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/cars/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Vehicle
          </Link>
        </Button>
      </div>

      {/* Car Table */}
      <AdminCarTable cars={cars} />
    </div>
  );
}
