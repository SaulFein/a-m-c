import { getService } from "@/actions/service";
import { ServiceForm } from "@/components/service/service-form";

export const metadata = {
  title: "Edit Service Page",
};

/**
 * Admin Service Edit Page
 *
 * Allows editing the Service page content.
 * Since Service is a single-record entity (not a list like cars),
 * this page loads the existing record or shows an empty form
 * for creating the first record.
 */
export default async function AdminServicePage() {
  const service = await getService();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Service Page</h1>
        <p className="text-muted-foreground">
          {service
            ? "Update the content displayed on the Service page"
            : "Create the initial content for the Service page"}
        </p>
      </div>

      <ServiceForm service={service} />
    </div>
  );
}
