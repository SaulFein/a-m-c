import Link from "next/link";
import { Plus } from "lucide-react";
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
 */
export default async function AdminPage() {
  const cars = await getAllCars();

  const availableCount = cars.filter((c) => !c.sold).length;
  const soldCount = cars.filter((c) => c.sold).length;

  return (
    <div className="space-y-6">
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
