"use server";

import { prisma } from "@/lib/prisma";

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
