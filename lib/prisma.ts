import { PrismaClient } from '@prisma/client';

// Temporary local compatibility; deployments must define DATABASE_URL.
if (!process.env.DATABASE_URL && process.env.Database_URL) process.env.DATABASE_URL = process.env.Database_URL;

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ datasourceUrl: process.env.DATABASE_URL });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
