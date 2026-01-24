import { getStorage } from "@/actions/storage";
import { StorageForm } from "@/components/storage/storage-form";

export const metadata = {
  title: "Edit Storage Page",
};

/**
 * Admin Storage Edit Page
 *
 * Allows editing the Storage page content.
 * Since Storage is a single-record entity (not a list like cars),
 * this page loads the existing record or shows an empty form
 * for creating the first record.
 */
export default async function AdminStoragePage() {
  const storage = await getStorage();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Storage Page</h1>
        <p className="text-muted-foreground">
          {storage
            ? "Update the content displayed on the Storage page"
            : "Create the initial content for the Storage page"}
        </p>
      </div>

      <StorageForm storage={storage} />
    </div>
  );
}
