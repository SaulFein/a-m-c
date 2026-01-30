"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { homeFormSchema, type HomeFormInput } from "@/lib/validations/home";

/**
 * Get home page data
 * PUBLIC - no auth required
 */
export async function getHome() {
  const home = await prisma.home.findFirst({
    orderBy: { createdAt: "desc" },
  });
  return home;
}

/**
 * Create or update home (upsert)
 * PROTECTED - requires auth
 *
 * Since Home is a single-record entity, this creates if none exists
 * or updates the existing record.
 */
export async function upsertHome(data: HomeFormInput) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const validatedData = homeFormSchema.safeParse(data);
  if (!validatedData.success) {
    return {
      error: "Validation failed",
      details: validatedData.error.flatten().fieldErrors,
    };
  }

  try {
    // Check if a home record exists
    const existing = await prisma.home.findFirst({
      orderBy: { createdAt: "desc" },
    });

    let home;
    // Type assertion is safe because Zod validates the structure at runtime
    if (existing) {
      const updateData = {
        picture: validatedData.data.picture,
        morePictures: validatedData.data.morePictures,
      };
      home = await prisma.home.update({
        where: { id: existing.id },
        data: updateData as Parameters<typeof prisma.home.update>[0]["data"],
      });
    } else {
      const createData = {
        picture: validatedData.data.picture,
        morePictures: validatedData.data.morePictures,
      };
      home = await prisma.home.create({
        data: createData as Parameters<typeof prisma.home.create>[0]["data"],
      });
    }

    revalidatePath("/");
    revalidatePath("/admin/home");

    return { success: true, home };
  } catch (error) {
    console.error("Error upserting home:", error);
    return { error: "Failed to save home page" };
  }
}
