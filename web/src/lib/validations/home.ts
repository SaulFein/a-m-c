import { z } from "zod";
import { filestackFileSchema, filestackFilesSchema } from "./car";

/**
 * Home Page Validation Schema
 *
 * Used for editing the Home page content.
 * This is a single-record entity (not a list like cars).
 * Only includes picture fields - description and video are not displayed on the page.
 */

export const homeFormSchema = z.object({
  picture: filestackFileSchema.nullable(),
  morePictures: filestackFilesSchema.nullable(),
});

export type HomeFormData = z.infer<typeof homeFormSchema>;
export type HomeFormInput = z.input<typeof homeFormSchema>;
