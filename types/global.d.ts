import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export {}; // Esto asegura que TypeScript trate el archivo como un módulo
