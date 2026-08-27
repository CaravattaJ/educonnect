import { PrismaClient } from "@prisma/client";

// Évite de recréer une connexion Prisma à chaque rechargement en développement (HMR Next.js).
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
