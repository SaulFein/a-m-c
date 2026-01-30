import { z } from "zod";
import { filestackFileSchema, filestackFilesSchema } from "./car";

/**
 * Home Page Validation Schema
 *
 * Used for editing the Home page content.
 * This is a single-record entity (not a list like cars).
 */

export const homeFormSchema = z.object({
  description: z.string().optional().nullable(),
  picture: filestackFileSchema.nullable(),
  morePictures: filestackFilesSchema.nullable(),
  video: z.string().optional().nullable(),
});

export type HomeFormData = z.infer<typeof homeFormSchema>;
export type HomeFormInput = z.input<typeof homeFormSchema>;
