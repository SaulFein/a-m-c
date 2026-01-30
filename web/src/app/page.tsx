import Link from "next/link";
import Image from "next/image";
import { getHome } from "@/actions/home";
import { getAvailableCars } from "@/actions/cars";
import { getFilestackUrl } from "@/lib/utils";

interface FilestackFile {
  url?: string;
  handle?: string;
}

export default async function HomePage() {
  const [home, cars] = await Promise.all([getHome(), getAvailableCars()]);

  // Parse home pictures
  const mainPicture = home?.picture as FilestackFile | null;
  const morePictures = (home?.morePictures as FilestackFile[] | null) || [];

  // Check if we have enough pictures for the collage
  const hasCollageImages = mainPicture && morePictures.length >= 8;

  return (
    <div className="flex flex-col">
      {/* Photo Collage - Clickable to go to inventory */}
      <Link href="/gallery" className="group relative cursor-pointer">
        <div className="px-4 py-2">
          {hasCollageImages ? (
            <>
              {/* First Row: 2 small | 1 large center | 2 small */}
              <div className="flex flex-wrap">
                {/* Left column - 2 stacked images */}
                <div className="hidden md:flex md:w-1/4 flex-col gap-2 pr-1">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={getFilestackUrl(morePictures[0]) || ""}
                      alt="Gallery"
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="25vw"
                      unoptimized
                    />
                  </div>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={getFilestackUrl(morePictures[1]) || ""}
                      alt="Gallery"
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="25vw"
                      unoptimized
                    />
                  </div>
                </div>

                {/* Center column - main large image */}
                <div className="w-full md:w-1/2 px-0 md:px-1">
                  <div className="relative aspect-[4/3] md:aspect-auto md:h-full overflow-hidden">
                    <Image
                      src={getFilestackUrl(mainPicture) || ""}
                      alt="Authentic Motorcars"
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                      unoptimized
                    />
                    {/* Overlay text */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-2xl md:text-4xl font-bold tracking-wider drop-shadow-lg">
                        CLICK TO VIEW INVENTORY
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right column - 2 stacked images */}
                <div className="hidden md:flex md:w-1/4 flex-col gap-2 pl-1">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={getFilestackUrl(morePictures[2]) || ""}
                      alt="Gallery"
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="25vw"
                      unoptimized
                    />
                  </div>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={getFilestackUrl(morePictures[3]) || ""}
                      alt="Gallery"
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="25vw"
                      unoptimized
                    />
                  </div>
                </div>
              </div>

              {/* Second Row: 4 equal images */}
              <div className="hidden md:flex gap-2 mt-2">
                {[4, 5, 6, 7].map((index) => (
                  <div key={index} className="w-1/4 relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={getFilestackUrl(morePictures[index]) || ""}
                      alt="Gallery"
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="25vw"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Fallback: Simple hero section if no collage images */
            <div className="relative aspect-[21/9] md:aspect-[3/1] overflow-hidden rounded-lg bg-gradient-to-r from-zinc-900 to-zinc-700">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  <span className="text-[#f58521]">Authentic</span>{" "}
                  <span className="text-[#00b4dd]">Motorcars</span>
                </h1>
                <p className="text-white/80 text-lg md:text-xl mb-4">
                  Premium Pre-Owned Vehicles
                </p>
                <p className="text-white text-xl font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  CLICK TO VIEW INVENTORY
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Colored Bars */}
        <div className="h-5 bg-[#f58521] mb-1" />
        <div className="h-5 bg-[#00b4dd]" />
      </Link>

      {/* Car Inventory Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <Link
              key={car.id}
              href={`/car/${car.id}`}
              className="group relative overflow-hidden rounded-lg bg-muted aspect-[4/3]"
            >
              {/* Car Image */}
              {car.picture && (
                <Image
                  src={getFilestackUrl(car.picture as FilestackFile) || ""}
                  alt={`${car.year} ${car.make} ${car.model}`}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  unoptimized
                />
              )}

              {/* Sold Badge */}
              {car.sold && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="bg-red-600 text-white px-6 py-2 text-2xl font-bold rotate-[-15deg]">
                    SOLD
                  </span>
                </div>
              )}

              {/* Banner */}
              {car.banner && car.banner !== "" && !car.sold && (
                <div className="absolute top-0 left-0 right-0 bg-[#f58521] text-white text-center py-1 text-sm font-semibold">
                  {car.banner}
                </div>
              )}

              {/* Car Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className={`text-white font-bold text-lg ${car.sold ? "opacity-50" : ""}`}>
                  {car.price}
                </p>
                <p className="text-white text-sm">
                  {car.year} {car.make} {car.model}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {cars.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No vehicles currently available.</p>
            <p className="text-muted-foreground">Check back soon for new inventory!</p>
          </div>
        )}
      </div>
    </div>
  );
}
