import { env } from "@/env";
import { PrismaClient, Prisma } from "@prisma/client";

export const prisma = new PrismaClient({
    log: env.NODE_ENV === "dev" ? ['query'] : [] as (Prisma.LogLevel | Prisma.LogDefinition)[],
});
