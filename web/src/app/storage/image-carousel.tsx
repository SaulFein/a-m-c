"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFilestackUrl } from "@/lib/utils";

interface ImageCarouselProps {
  images: Array<{ url?: string; handle?: string }>;
}

export function ImageCarousel({ images }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const validImages = images.filter((img) => img.url || img.handle);

  if (validImages.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  const currentImage = validImages[currentIndex];
  // Use original image for maximum quality (no resize transformation)
  const imageUrl = getFilestackUrl(currentImage);

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Main Image */}
      <div className="relative aspect-video w-full bg-muted">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={`Image ${currentIndex + 1}`}
            fill
            className="object-cover"
            sizes="100vw"
            unoptimized
          />
        )}
      </div>

      {/* Navigation Arrows */}
      {validImages.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
            onClick={goToNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {validImages.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-white" : "bg-white/50"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
