import { getHome } from "@/actions/home";
import { HomeForm } from "@/components/home/home-form";

export const metadata = {
  title: "Edit Home Page",
};

/**
 * Admin Home Page Editor
 *
 * Allows editing the home page content including the photo collage images.
 */
export default async function AdminHomePage() {
  const home = await getHome();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Home Page</h1>
        <p className="text-muted-foreground">
          Manage the photo collage and content on the home page
        </p>
      </div>

      <HomeForm home={home} />
    </div>
  );
}
