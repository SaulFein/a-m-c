import { Car, Service, Storage, Home } from "@prisma/client";

// Re-export Prisma types
export type { Car, Service, Storage, Home };

// Filestack types
export interface FilestackFile {
  url: string;
  filename: string;
  mimetype: string;
  size: number;
  handle: string;
}

// Form data types (for creating/updating)
export interface CarFormData {
  make: string;
  model: string;
  year: string;
  miles?: string;
  color?: string;
  interiorColor?: string;
  price?: string;
  vin?: string;
  highlights?: string;
  description?: string;
  carfax?: string;
  engine?: string;
  transmission?: string;
  picture: FilestackFile | null;
  morePictures?: FilestackFile[];
  video?: string;
  video2?: string;
  banner?: string;
  sold?: boolean;
  stockNumber?: string;
  carfaxFile?: FilestackFile | null;
}

export interface ServiceFormData {
  description?: string;
  servicePictures?: FilestackFile[];
  pictureDesc?: string[];
  special?: string;
  serviceList?: string;
}

export interface StorageFormData {
  description?: string;
  storagePictures?: FilestackFile[];
  pictureDesc?: string[];
  special?: string;
  specialTitle?: string;
  mmcbsTitle?: string;
  mmcbsBlurb?: string;
  serviceList?: string;
}

export interface HomeFormData {
  description?: string;
  picture?: FilestackFile | null;
  morePictures?: FilestackFile[];
  video?: string;
}

// Contact form
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// Car inquiry form
export interface InquiryFormData {
  name: string;
  email: string;
  phone?: string;
  comments?: string;
  carId: string;
}
