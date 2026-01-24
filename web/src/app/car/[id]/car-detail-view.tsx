import { Car } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  formatPrice,
  formatMiles,
  getCarTitle,
  isAvailable,
} from "@/lib/utils";
import { CarImageGallery } from "./car-image-gallery";
import { CarInquiryForm } from "./car-inquiry-form";

/**
 * Validate that a URL is safe to use as an href
 * Prevents XSS via javascript: or data: URLs
 */
function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * CarDetailView - Full car detail display
 *
 * REUSABLE COMPONENT that can be used in:
 * - Public car detail page (/car/[id])
 * - Admin preview
 *
 * Layout:
 * - Left: Image gallery (carousel)
 * - Right: Specs + Inquiry form
 * - Below: Description, videos
 */

interface CarDetailViewProps {
  car: Car;
  isAdmin?: boolean; // Different behavior for admin view
}

export function CarDetailView({ car, isAdmin = false }: CarDetailViewProps) {
  // Parse pictures from JSON stored in DB
  const mainPicture = car.picture as { url?: string; handle?: string } | null;
  const additionalPictures = (car.morePictures as Array<{ url?: string; handle?: string }>) || [];
  const allPictures = mainPicture ? [mainPicture, ...additionalPictures] : additionalPictures;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold">{getCarTitle(car)}</h1>
          {car.sold && (
            <Badge variant="destructive" className="text-sm">
              SOLD
            </Badge>
          )}
        </div>
        <p className="mt-2 text-2xl font-semibold text-primary">
          {formatPrice(car.price)}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Images (takes 2 columns on large screens) */}
        <div className="lg:col-span-2">
          <CarImageGallery images={allPictures} alt={getCarTitle(car)} />
        </div>

        {/* Right Column - Specs + Inquiry */}
        <div className="space-y-6">
          {/* Specifications */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">Vehicle Details</h2>
            <dl className="space-y-3">
              <SpecRow label="Year" value={car.year} />
              <SpecRow label="Make" value={car.make} />
              <SpecRow label="Model" value={car.model} />
              <SpecRow label="Mileage" value={formatMiles(car.miles)} />
              <SpecRow label="Exterior Color" value={car.color} />
              <SpecRow label="Interior Color" value={car.interiorColor} />
              <SpecRow label="Engine" value={car.engine} />
              <SpecRow label="Transmission" value={car.transmission} />
              <SpecRow label="VIN" value={car.vin} />
              <SpecRow label="Stock #" value={car.stockNumber} />
            </dl>

            {/* Carfax Link - only render if URL is safe */}
            {isAvailable(car.carfax) && isSafeUrl(car.carfax) && (
              <a
                href={car.carfax}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm text-primary hover:underline"
              >
                View Carfax Report →
              </a>
            )}
          </div>

          {/* Inquiry Form - only show for non-sold cars on public page */}
          {!car.sold && !isAdmin && (
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">Interested?</h2>
              <CarInquiryForm carId={car.id} carTitle={getCarTitle(car)} />
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {isAvailable(car.description) && (
        <div className="mt-8">
          <Separator className="mb-8" />
          <h2 className="mb-4 text-xl font-semibold">Description</h2>
          <div className="prose max-w-none dark:prose-invert">
            {/* Render description - preserving line breaks */}
            {car.description.split("\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      )}

      {/* Highlights */}
      {isAvailable(car.highlights) && (
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">Highlights</h2>
          <div className="prose max-w-none dark:prose-invert">
            {car.highlights.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      )}

      {/* Videos */}
      {(isAvailable(car.video) || isAvailable(car.video2)) && (
        <div className="mt-8">
          <Separator className="mb-8" />
          <h2 className="mb-4 text-xl font-semibold">Videos</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {isAvailable(car.video) && (
              <VideoEmbed url={car.video} title="Vehicle Video 1" />
            )}
            {isAvailable(car.video2) && (
              <VideoEmbed url={car.video2} title="Vehicle Video 2" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * SpecRow - Single specification row
 * Reusable for displaying label/value pairs
 */
function SpecRow({ label, value }: { label: string; value: string }) {
  // Don't render if value is N/A or empty
  if (!isAvailable(value)) return null;

  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

/**
 * VideoEmbed - Embed YouTube/Vimeo videos
 * Parses URL to get embed URL safely
 */
function VideoEmbed({ url, title }: { url: string; title: string }) {
  // Convert YouTube/Vimeo URLs to embed URLs
  let embedUrl: string | null = null;

  try {
    // Validate URL is safe before processing
    if (!isSafeUrl(url)) {
      return null;
    }

    // YouTube - youtube.com/watch?v=xxx
    if (url.includes("youtube.com/watch")) {
      const videoId = new URL(url).searchParams.get("v");
      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    }
    // YouTube - youtu.be/xxx
    else if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    }
    // Vimeo - multiple formats
    else if (url.includes("vimeo.com")) {
      // Already an embed URL - use directly
      if (url.includes("player.vimeo.com/video/")) {
        embedUrl = url.split("?")[0]; // Strip query params for security
      }
      // Standard vimeo.com/video/xxx or vimeo.com/xxx format
      else {
        // Extract video ID - handles vimeo.com/123, vimeo.com/video/123, vimeo.com/123/hash
        const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
        if (match && match[1]) {
          const videoId = match[1];
          // Check for private video hash (vimeo.com/123/abcdef)
          const hashMatch = url.match(/vimeo\.com\/\d+\/([a-zA-Z0-9]+)/);
          if (hashMatch && hashMatch[1]) {
            embedUrl = `https://player.vimeo.com/video/${videoId}?h=${hashMatch[1]}`;
          } else {
            embedUrl = `https://player.vimeo.com/video/${videoId}`;
          }
        }
      }
    }
  } catch {
    // URL parsing failed - don't render video
    return null;
  }

  // If we couldn't parse an embed URL, don't render
  if (!embedUrl) {
    return null;
  }

  return (
    <div className="aspect-video overflow-hidden rounded-lg">
      <iframe
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  );
}
