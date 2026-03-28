import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as { prisma?: PrismaClient };

function createPrismaClient() {
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL эсвэл DIRECT_URL тохируулаагүй байна.");
  }

  return new PrismaClient({
    datasourceUrl: connectionString,
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
