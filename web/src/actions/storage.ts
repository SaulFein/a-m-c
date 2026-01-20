"use server";

import { prisma } from "@/lib/prisma";

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
