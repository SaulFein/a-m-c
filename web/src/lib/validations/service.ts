import { z } from "zod";
import { filestackFilesSchema } from "./car";

/**
 * Service Validation Schema
 *
 * Used for editing the Service page content.
 * This is a single-record entity (not a list like cars).
 */

export const serviceFormSchema = z.object({
  description: z.string().min(1, "Description is required"),
  serviceList: z.string().min(1, "Service list is required"),
  special: z.string().optional().nullable(),
  servicePictures: filestackFilesSchema.nullable(),
});

export type ServiceFormData = z.infer<typeof serviceFormSchema>;
export type ServiceFormInput = z.input<typeof serviceFormSchema>;
