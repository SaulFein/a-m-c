import { notFound } from "next/navigation";
import { getCarById } from "@/actions/cars";
import { CarForm } from "@/components/cars/car-form";
import { getCarTitle } from "@/lib/utils";

interface EditCarPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditCarPageProps) {
  const { id } = await params;
  const car = await getCarById(id);

  if (!car) {
    return { title: "Car Not Found" };
  }

  return {
    title: `Edit ${getCarTitle(car)}`,
  };
}

/**
 * Edit Car Page
 *
 * Uses the SAME CarForm component as the Add page, but passes
 * the existing car data. This tells CarForm to operate in "edit" mode.
 *
 * The [id] in the folder name is a dynamic route segment.
 * Next.js passes it via the params prop.
 *
 * In Next.js 15+, params is a Promise that must be awaited.
 */
export default async function EditCarPage({ params }: EditCarPageProps) {
  const { id } = await params;
  const car = await getCarById(id);

  // If car doesn't exist, show 404
  if (!car) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Vehicle</h1>
        <p className="text-muted-foreground">
          {getCarTitle(car)}
        </p>
      </div>

      {/* Car prop = edit mode (pre-filled form) */}
      <CarForm car={car} />
    </div>
  );
}
