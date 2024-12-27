import { PrismaClient } from "@prisma/client";

// Agregar prisma al ámbito global solo en desarrollo
declare global {
  // Esto asegura que no haya errores de TypeScript
  var prisma: PrismaClient | undefined;
}

// Crear una instancia de PrismaClient
const prisma = global.prisma || new PrismaClient();

// Asegurar una sola instancia en desarrollo
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
