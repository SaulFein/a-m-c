import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getCarById } from "@/actions/cars";
import { getCarTitle } from "@/lib/utils";
import { CarDetailView } from "./car-detail-view";

/**
 * Dynamic Metadata
 *
 * For car pages, we want the title to be the car name.
 * generateMetadata is called at build/request time with the route params.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const car = await getCarById(id);

  if (!car) {
    return { title: "Car Not Found" };
  }

  return {
    title: getCarTitle(car),
    description: car.description !== "N/A" ? car.description : `${getCarTitle(car)} for sale at Authentic Motorcars`,
    openGraph: {
      title: getCarTitle(car),
      description: car.description !== "N/A" ? car.description : undefined,
      type: "website",
    },
  };
}

/**
 * Car Detail Page
 *
 * DYNAMIC ROUTE: [id] in the folder name means this handles /car/123, /car/456, etc.
 * The id comes from params.
 *
 * Similar to your old detailController.js but much simpler:
 * - No $routeParams.$route.current.params.id
 * - No $scope
 * - No manual loading states
 *
 * The CarDetailView is a separate component for organization.
 * All the rendering logic is there, this page just handles routing/data.
 */
export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const car = await getCarById(id);

  // If car doesn't exist, show 404 page
  if (!car) {
    notFound();
  }

  return <CarDetailView car={car} />;
}
