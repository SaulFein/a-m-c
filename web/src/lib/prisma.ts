import { PrismaClient } from "@prisma/client";

/**
 * Prisma Client Singleton
 *
 * WHY A SINGLETON?
 * In development, Next.js hot-reloads your code frequently.
 * Without this pattern, each reload would create a NEW database connection.
 * This can exhaust your connection pool quickly!
 *
 * This pattern:
 * 1. Stores the client in globalThis (survives hot reloads)
 * 2. Reuses the existing client if it exists
 * 3. Only creates a new client if needed
 *
 * In production, this isn't needed (no hot reloads), but it doesn't hurt.
 *
 * Similar to how you'd use a singleton service in Angular!
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Log queries in development for debugging
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  });

// In development, store in globalThis to survive hot reloads
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
