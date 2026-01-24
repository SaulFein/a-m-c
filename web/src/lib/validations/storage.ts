import { z } from "zod";
import { filestackFilesSchema } from "./car";

/**
 * Storage Validation Schema
 *
 * Used for editing the Storage page content.
 * This is a single-record entity (not a list like cars).
 */

export const storageFormSchema = z.object({
  description: z.string().min(1, "Description is required"),
  serviceList: z.string().min(1, "Service list is required"),
  special: z.string().optional().nullable(),
  specialTitle: z.string().optional().nullable(),
  storagePictures: filestackFilesSchema.nullable(),
});

export type StorageFormData = z.infer<typeof storageFormSchema>;
export type StorageFormInput = z.input<typeof storageFormSchema>;
