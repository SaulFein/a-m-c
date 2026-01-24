"use client";

/**
 * CarImageGallery - Image carousel/gallery for car detail page
 *
 * Client component because it needs:
 * - State for current image index
 * - Click handlers for navigation
 *
 * Uses shadcn/ui Carousel component under the hood.
 */

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getFilestackUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface CarImageGalleryProps {
  images: Array<{ url?: string; handle?: string }>;
  alt: string;
}

export function CarImageGallery({ images, alt }: CarImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  // Handle empty images
  if (images.length === 0) {
    return (
      <div className="aspect-[4/3] rounded-lg bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  const currentImage = images[currentIndex];
  // Use original image for maximum quality (no resize transformation)
  const imageUrl = getFilestackUrl(currentImage);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={`${alt} - Image ${currentIndex + 1}`}
            fill
            className="object-contain"
            priority={currentIndex === 0}
            sizes="100vw"
            unoptimized
          />
        )}

        {/* Navigation Arrows (only show if multiple images) */}
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Previous image</span>
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
              onClick={goToNext}
            >
              <ChevronRight className="h-6 w-6" />
              <span className="sr-only">Next image</span>
            </Button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 rounded-full bg-black/60 px-3 py-1 text-sm text-white">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Strip (only show if multiple images) */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => {
            const thumbUrl = getFilestackUrl(image, { width: 150, height: 100, fit: "crop" });
            return (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all",
                  index === currentIndex
                    ? "border-primary"
                    : "border-transparent opacity-70 hover:opacity-100"
                )}
              >
                {thumbUrl && (
                  <Image
                    src={thumbUrl}
                    alt={`${alt} - Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
