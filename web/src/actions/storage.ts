"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { storageFormSchema, type StorageFormInput } from "@/lib/validations/storage";

/**
 * Get storage information
 * PUBLIC - no auth required
 */
export async function getStorage() {
  const storage = await prisma.storage.findFirst({
    orderBy: { createdAt: "desc" },
  });
  return storage;
}

/**
 * Create a new storage record
 * PROTECTED - requires auth
 */
export async function createStorage(data: StorageFormInput) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const validatedData = storageFormSchema.safeParse(data);
  if (!validatedData.success) {
    return {
      error: "Validation failed",
      details: validatedData.error.flatten().fieldErrors,
    };
  }

  try {
    // Type assertion is safe because Zod validates the structure at runtime
    const storageData = {
      description: validatedData.data.description,
      serviceList: validatedData.data.serviceList,
      special: validatedData.data.special ?? undefined,
      specialTitle: validatedData.data.specialTitle ?? undefined,
      storagePictures: validatedData.data.storagePictures,
      pictureDesc: [],
    };
    const storage = await prisma.storage.create({
      data: storageData as Parameters<typeof prisma.storage.create>[0]["data"],
    });

    revalidatePath("/storage");
    revalidatePath("/admin/storage");

    return { success: true, storage };
  } catch (error) {
    console.error("Error creating storage:", error);
    return { error: "Failed to create storage" };
  }
}

/**
 * Update an existing storage record
 * PROTECTED - requires auth
 */
export async function updateStorage(id: string, data: StorageFormInput) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const validatedData = storageFormSchema.safeParse(data);
  if (!validatedData.success) {
    return {
      error: "Validation failed",
      details: validatedData.error.flatten().fieldErrors,
    };
  }

  try {
    // Type assertion is safe because Zod validates the structure at runtime
    const storageData = {
      description: validatedData.data.description,
      serviceList: validatedData.data.serviceList,
      special: validatedData.data.special ?? undefined,
      specialTitle: validatedData.data.specialTitle ?? undefined,
      storagePictures: validatedData.data.storagePictures,
    };
    const storage = await prisma.storage.update({
      where: { id },
      data: storageData as Parameters<typeof prisma.storage.update>[0]["data"],
    });

    revalidatePath("/storage");
    revalidatePath("/admin/storage");

    return { success: true, storage };
  } catch (error) {
    console.error("Error updating storage:", error);
    return { error: "Failed to update storage" };
  }
}

/**
 * Create or update storage (upsert)
 * PROTECTED - requires auth
 *
 * Since Storage is a single-record entity, this creates if none exists
 * or updates the existing record.
 */
export async function upsertStorage(data: StorageFormInput) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const validatedData = storageFormSchema.safeParse(data);
  if (!validatedData.success) {
    return {
      error: "Validation failed",
      details: validatedData.error.flatten().fieldErrors,
    };
  }

  try {
    // Check if a storage record exists
    const existing = await prisma.storage.findFirst({
      orderBy: { createdAt: "desc" },
    });

    let storage;
    // Type assertion is safe because Zod validates the structure at runtime
    if (existing) {
      const updateData = {
        description: validatedData.data.description,
        serviceList: validatedData.data.serviceList,
        special: validatedData.data.special ?? undefined,
        specialTitle: validatedData.data.specialTitle ?? undefined,
        storagePictures: validatedData.data.storagePictures,
      };
      storage = await prisma.storage.update({
        where: { id: existing.id },
        data: updateData as Parameters<typeof prisma.storage.update>[0]["data"],
      });
    } else {
      const createData = {
        description: validatedData.data.description,
        serviceList: validatedData.data.serviceList,
        special: validatedData.data.special ?? undefined,
        specialTitle: validatedData.data.specialTitle ?? undefined,
        storagePictures: validatedData.data.storagePictures,
        pictureDesc: [],
      };
      storage = await prisma.storage.create({
        data: createData as Parameters<typeof prisma.storage.create>[0]["data"],
      });
    }

    revalidatePath("/storage");
    revalidatePath("/admin/storage");

    return { success: true, storage };
  } catch (error) {
    console.error("Error upserting storage:", error);
    return { error: "Failed to save storage" };
  }
}
