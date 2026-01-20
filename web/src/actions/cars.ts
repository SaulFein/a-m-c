"use server";

/**
 * Car Server Actions
 *
 * SERVER ACTIONS are functions that run on the server but can be called
 * from client components. They're like API routes but simpler.
 *
 * Benefits:
 * - Automatic request handling (no fetch/axios needed)
 * - Type-safe (TypeScript end-to-end)
 * - Integrated with React (works with forms, revalidation)
 * - Secure by default (runs on server, not exposed to client)
 *
 * In your AngularJS app, you had separate routes in Express.
 * Here, actions are colocated with the code that uses them.
 *
 * SECURITY:
 * - Always validate input (we use Zod)
 * - Always check auth before mutations
 * - Use revalidatePath to update cached pages
 */

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { carFormSchema, type CarFormInput } from "@/lib/validations/car";

/**
 * Get all available (non-sold) cars
 * PUBLIC - no auth required
 */
export async function getAvailableCars() {
  const cars = await prisma.car.findMany({
    where: { sold: false },
    orderBy: { createdAt: "desc" },
  });
  return cars;
}

/**
 * Get all sold cars
 * PUBLIC - no auth required
 */
export async function getSoldCars() {
  const cars = await prisma.car.findMany({
    where: { sold: true },
    orderBy: { createdAt: "desc" },
  });
  return cars;
}

/**
 * Get all cars (for admin)
 * PROTECTED - requires auth
 */
export async function getAllCars() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const cars = await prisma.car.findMany({
    orderBy: { createdAt: "desc" },
  });
  return cars;
}

/**
 * Get a single car by ID
 * PUBLIC - no auth required (for detail page)
 */
export async function getCarById(id: string) {
  const car = await prisma.car.findUnique({
    where: { id },
  });
  return car;
}

/**
 * Create a new car
 * PROTECTED - requires auth
 *
 * This is called by CarForm in "add" mode
 */
export async function createCar(data: CarFormInput) {
  // 1. Check authentication
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  // 2. Validate input data
  const validatedData = carFormSchema.safeParse(data);
  if (!validatedData.success) {
    return {
      error: "Validation failed",
      details: validatedData.error.flatten().fieldErrors,
    };
  }

  try {
    // 3. Create car in database
    const car = await prisma.car.create({
      data: validatedData.data,
    });

    // 4. Revalidate cached pages so they show the new car
    revalidatePath("/gallery");
    revalidatePath("/admin");

    return { success: true, car };
  } catch (error) {
    console.error("Error creating car:", error);
    return { error: "Failed to create car" };
  }
}

/**
 * Update an existing car
 * PROTECTED - requires auth
 *
 * This is called by CarForm in "edit" mode
 */
export async function updateCar(id: string, data: Partial<CarFormInput>) {
  // 1. Check authentication
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  // 2. Validate input data (partial validation for updates)
  const validatedData = carFormSchema.partial().safeParse(data);
  if (!validatedData.success) {
    return {
      error: "Validation failed",
      details: validatedData.error.flatten().fieldErrors,
    };
  }

  try {
    // 3. Update car in database
    const car = await prisma.car.update({
      where: { id },
      data: validatedData.data,
    });

    // 4. Revalidate all pages that might show this car
    revalidatePath("/gallery");
    revalidatePath("/sold");
    revalidatePath(`/car/${id}`);
    revalidatePath("/admin");
    revalidatePath(`/admin/cars/${id}`);

    return { success: true, car };
  } catch (error) {
    console.error("Error updating car:", error);
    return { error: "Failed to update car" };
  }
}

/**
 * Delete a car
 * PROTECTED - requires auth
 */
export async function deleteCar(id: string) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.car.delete({
      where: { id },
    });

    revalidatePath("/gallery");
    revalidatePath("/sold");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Error deleting car:", error);
    return { error: "Failed to delete car" };
  }
}

/**
 * Toggle car sold status
 * PROTECTED - requires auth
 *
 * Convenience action for marking cars sold/available
 */
export async function toggleCarSold(id: string) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  try {
    // Get current status
    const car = await prisma.car.findUnique({
      where: { id },
      select: { sold: true },
    });

    if (!car) {
      return { error: "Car not found" };
    }

    // Toggle the sold status
    const updatedCar = await prisma.car.update({
      where: { id },
      data: { sold: !car.sold },
    });

    // Revalidate pages
    revalidatePath("/gallery");
    revalidatePath("/sold");
    revalidatePath(`/car/${id}`);
    revalidatePath("/admin");

    return { success: true, sold: updatedCar.sold };
  } catch (error) {
    console.error("Error toggling sold status:", error);
    return { error: "Failed to update car" };
  }
}
