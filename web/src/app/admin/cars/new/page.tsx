import { CarForm } from "@/components/cars/car-form";

export const metadata = {
  title: "Add Vehicle",
};

/**
 * Add Car Page
 *
 * Uses the shared CarForm component WITHOUT a car prop.
 * This tells CarForm to operate in "add" mode with an empty form.
 *
 * Notice how simple this page is! All the form logic is in CarForm.
 * This is the DRY principle in action.
 */
export default function AddCarPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add New Vehicle</h1>
        <p className="text-muted-foreground">
          Enter the details for the new vehicle
        </p>
      </div>

      {/* No car prop = add mode */}
      <CarForm />
    </div>
  );
}
