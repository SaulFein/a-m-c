import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility for merging Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format price for display
 */
export function formatPrice(price: string): string {
  if (!price || price === "Inquire" || price === "N/A") {
    return "Inquire";
  }

  // Remove any existing formatting
  const numericPrice = price.replace(/[^0-9.]/g, "");
  const parsed = parseFloat(numericPrice);

  if (isNaN(parsed)) {
    return price;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(parsed);
}

/**
 * Format mileage for display
 */
export function formatMiles(miles: string): string {
  if (!miles || miles === "N/A") {
    return "N/A";
  }

  const numericMiles = miles.replace(/[^0-9]/g, "");
  const parsed = parseInt(numericMiles, 10);

  if (isNaN(parsed)) {
    return miles;
  }

  return new Intl.NumberFormat("en-US").format(parsed) + " miles";
}

/**
 * Get Filestack CDN URL with transformations
 */
export function getFilestackUrl(
  file: { url?: string; handle?: string } | string | null | undefined,
  options?: {
    width?: number;
    height?: number;
    fit?: "clip" | "crop" | "scale" | "max";
    quality?: number; // 1-100, default is to not transform
  }
): string | null {
  if (!file) return null;

  let handle: string | null = null;

  if (typeof file === "string") {
    // If it's already a full URL, extract the handle
    if (file.includes("filestackcontent.com")) {
      handle = file.split("/").pop() || null;
    } else {
      handle = file;
    }
  } else if (file.handle) {
    handle = file.handle;
  } else if (file.url) {
    handle = file.url.split("/").pop() || null;
  }

  if (!handle) return null;

  // If no options, return original image URL (best quality)
  if (!options || (!options.width && !options.height && !options.quality)) {
    return `https://cdn.filestackcontent.com/${handle}`;
  }

  // Build transformation URL
  const transforms: string[] = [];

  if (options.width || options.height) {
    const resize = [`resize=`];
    if (options.width) resize.push(`width:${options.width}`);
    if (options.height) resize.push(`height:${options.height}`);
    if (options.fit) resize.push(`fit:${options.fit}`);
    transforms.push(resize.join(",").replace("=,", "="));
  }

  // Add quality setting (defaults to high quality when resizing)
  const quality = options.quality ?? 90;
  transforms.push(`output=quality:${quality}`);

  const transformPath = transforms.length > 0 ? transforms.join("/") + "/" : "";

  return `https://cdn.filestackcontent.com/${transformPath}${handle}`;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

/**
 * Generate a car title from make, model, and year
 */
export function getCarTitle(car: {
  year: string;
  make: string;
  model: string;
}): string {
  return `${car.year} ${car.make} ${car.model}`;
}

/**
 * Check if a value is "N/A" or empty
 */
export function isAvailable(value: string | null | undefined): boolean {
  return !!value && value !== "N/A" && value.trim() !== "";
}
