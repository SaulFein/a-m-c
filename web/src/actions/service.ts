"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serviceFormSchema, type ServiceFormInput } from "@/lib/validations/service";

/**
 * Get service information
 * PUBLIC - no auth required
 */
export async function getService() {
  const service = await prisma.service.findFirst({
    orderBy: { createdAt: "desc" },
  });
  return service;
}

/**
 * Create a new service record
 * PROTECTED - requires auth
 */
export async function createService(data: ServiceFormInput) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const validatedData = serviceFormSchema.safeParse(data);
  if (!validatedData.success) {
    return {
      error: "Validation failed",
      details: validatedData.error.flatten().fieldErrors,
    };
  }

  try {
    // Type assertion is safe because Zod validates the structure at runtime
    const serviceData = {
      description: validatedData.data.description,
      serviceList: validatedData.data.serviceList,
      special: validatedData.data.special ?? undefined,
      servicePictures: validatedData.data.servicePictures,
      pictureDesc: [],
    };
    const service = await prisma.service.create({
      data: serviceData as Parameters<typeof prisma.service.create>[0]["data"],
    });

    revalidatePath("/service");
    revalidatePath("/admin/service");

    return { success: true, service };
  } catch (error) {
    console.error("Error creating service:", error);
    return { error: "Failed to create service" };
  }
}

/**
 * Update an existing service record
 * PROTECTED - requires auth
 */
export async function updateService(id: string, data: ServiceFormInput) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const validatedData = serviceFormSchema.safeParse(data);
  if (!validatedData.success) {
    return {
      error: "Validation failed",
      details: validatedData.error.flatten().fieldErrors,
    };
  }

  try {
    // Type assertion is safe because Zod validates the structure at runtime
    const serviceData = {
      description: validatedData.data.description,
      serviceList: validatedData.data.serviceList,
      special: validatedData.data.special ?? undefined,
      servicePictures: validatedData.data.servicePictures,
    };
    const service = await prisma.service.update({
      where: { id },
      data: serviceData as Parameters<typeof prisma.service.update>[0]["data"],
    });

    revalidatePath("/service");
    revalidatePath("/admin/service");

    return { success: true, service };
  } catch (error) {
    console.error("Error updating service:", error);
    return { error: "Failed to update service" };
  }
}

/**
 * Create or update service (upsert)
 * PROTECTED - requires auth
 *
 * Since Service is a single-record entity, this creates if none exists
 * or updates the existing record.
 */
export async function upsertService(data: ServiceFormInput) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const validatedData = serviceFormSchema.safeParse(data);
  if (!validatedData.success) {
    return {
      error: "Validation failed",
      details: validatedData.error.flatten().fieldErrors,
    };
  }

  try {
    // Check if a service record exists
    const existing = await prisma.service.findFirst({
      orderBy: { createdAt: "desc" },
    });

    let service;
    // Type assertion is safe because Zod validates the structure at runtime
    if (existing) {
      const updateData = {
        description: validatedData.data.description,
        serviceList: validatedData.data.serviceList,
        special: validatedData.data.special ?? undefined,
        servicePictures: validatedData.data.servicePictures,
      };
      service = await prisma.service.update({
        where: { id: existing.id },
        data: updateData as Parameters<typeof prisma.service.update>[0]["data"],
      });
    } else {
      const createData = {
        description: validatedData.data.description,
        serviceList: validatedData.data.serviceList,
        special: validatedData.data.special ?? undefined,
        servicePictures: validatedData.data.servicePictures,
        pictureDesc: [],
      };
      service = await prisma.service.create({
        data: createData as Parameters<typeof prisma.service.create>[0]["data"],
      });
    }

    revalidatePath("/service");
    revalidatePath("/admin/service");

    return { success: true, service };
  } catch (error) {
    console.error("Error upserting service:", error);
    return { error: "Failed to save service" };
  }
}
