import { z } from "zod";

/**
 * Car Validation Schema
 *
 * SINGLE SOURCE OF TRUTH for car data validation.
 * Used by:
 * 1. Client-side form validation (react-hook-form + zod)
 * 2. Server action validation (before database operations)
 * 3. TypeScript types (inferred from schema)
 *
 * WHY ZOD?
 * - Runtime validation (catches bad data)
 * - TypeScript integration (infer types from schema)
 * - Works on both client and server
 * - Great error messages
 *
 * In Angular, you'd have separate validation in template + controller.
 * With Zod, it's defined once and used everywhere.
 */

/**
 * File object type for uploaded images/files
 *
 * Supports both formats:
 * - Old Filepicker format: has `id` (number)
 * - New Filestack format: has `handle` (string)
 *
 * The only truly required field is `url` for display.
 */
export interface FilestackFile {
  url: string;
  filename?: string;
  mimetype?: string;
  size?: number;
  // Old Filepicker format
  id?: number;
  client?: string;
  isWriteable?: boolean;
  // New Filestack format
  handle?: string;
  [key: string]: unknown; // Allow other fields
}

/**
 * Runtime validator for file objects
 * Only requires `url` field - supports both old and new formats
 */
function isValidFilestackFile(value: unknown): value is FilestackFile {
  if (!value || typeof value !== "object") return false;
  const obj = value as Record<string, unknown>;
  // Only require url - that's all we need to display images
  return typeof obj.url === "string" && obj.url.length > 0;
}

/**
 * Zod schema for Filestack file - validates at runtime
 * Uses z.custom() for Prisma Json type compatibility
 */
export const filestackFileSchema = z.custom<FilestackFile>(
  (val) => val === null || isValidFilestackFile(val),
  { message: "Invalid file format - must have a url" }
);

/**
 * Zod schema for array of Filestack files
 */
export const filestackFilesSchema = z.custom<FilestackFile[]>(
  (val) => val === null || (Array.isArray(val) && val.every(isValidFilestackFile)),
  { message: "Invalid files format" }
);

/**
 * Car form schema - used for create and update
 *
 * All fields except make/model/year/picture are optional
 * to match your existing MongoDB schema defaults.
 */
export const carFormSchema = z.object({
  // Required fields
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().min(4, "Year must be 4 digits").max(4),

  // Optional fields with defaults handled by database
  miles: z.string().optional().default("N/A"),
  color: z.string().optional().default("N/A"),
  interiorColor: z.string().optional().default("N/A"),
  price: z.string().optional().default("Inquire"),
  vin: z.string().optional().default("N/A"),
  highlights: z.string().optional().default("N/A"),
  description: z.string().optional().default("N/A"),
  carfax: z.string().optional().default("N/A"),
  engine: z.string().optional().default("N/A"),
  transmission: z.string().optional().default("N/A"),
  stockNumber: z.string().optional().default("N/A"),

  // Media - using custom Filestack schemas with runtime validation
  // These validate structure while remaining Prisma Json compatible
  picture: filestackFileSchema.nullable(),
  morePictures: filestackFilesSchema.nullable(),
  video: z.string().optional().default("N/A"),
  video2: z.string().optional().default("N/A"),
  banner: z.string().optional().default(""),
  carfaxFile: filestackFileSchema.nullable(),

  // Status
  sold: z.boolean().optional().default(false),
});

// Type inferred from schema - use this throughout the app
// z.infer gives the OUTPUT type (after defaults applied)
export type CarFormData = z.infer<typeof carFormSchema>;

// Input type for the form (before defaults applied)
// Use this with react-hook-form since it accepts the raw input
export type CarFormInput = z.input<typeof carFormSchema>;

/**
 * Schema for updating a car (all fields optional except id)
 * This allows partial updates
 */
export const carUpdateSchema = carFormSchema.partial();
export type CarUpdateData = z.infer<typeof carUpdateSchema>;

/**
 * Contact/Inquiry form schema
 */
export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Car inquiry form schema (from car detail page)
 */
export const inquiryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  comments: z.string().optional(),
  carId: z.string(),
  carTitle: z.string(), // e.g., "2020 Porsche 911"
});

export type InquiryFormData = z.infer<typeof inquiryFormSchema>;
