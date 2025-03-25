import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { z } from "zod";

// Interfaz para el payload del token JWT
interface JwtPayload {
  id: number;
  role: string;
  iat?: number;
  exp?: number;
}

// Esquema para crear una opción de horario (CourseSchedule)
const createCourseScheduleSchema = z.object({
  courseId: z.number().int().positive("El ID del curso es requerido"),
  instructorId: z.number().int().positive("El ID del instructor debe ser un número válido").optional(),
  dayPattern: z.string().min(3, "El patrón de días es requerido"), // Ej: "Lunes y Miércoles"
  startDate: z.string().datetime({ offset: true }),
  cupo: z.number().int().positive("El cupo debe ser mayor a 0"),
  zoomLink: z.string().url("El Zoom link debe ser una URL válida").optional(),
});

// Método POST: Crear una nueva opción de horario para un curso
export async function POST(req: Request) {
  try {
    // Validación del token
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "No autorizado. Se requiere un token." },
        { status: 401 }
      );
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    if (!decoded) {
      return NextResponse.json(
        { error: "Token inválido." },
        { status: 401 }
      );
    }
    // Solo los instructores pueden crear opciones de horario
    if (decoded.role !== "INSTRUCTOR") {
      return NextResponse.json(
        { error: "Acceso denegado. Solo los instructores pueden crear opciones de horario." },
        { status: 403 }
      );
    }

    // Validar el body de la solicitud
    const payload = await req.json();
    const data = createCourseScheduleSchema.parse(payload);

    // Crear la opción de horario
    const schedule = await prisma.courseSchedule.create({
      data: {
        course: { connect: { id: data.courseId } },
        instructor: data.instructorId ? { connect: { id: data.instructorId } } : undefined,
        dayPattern: data.dayPattern,
        startDate: new Date(data.startDate),
        cupo: data.cupo,
        zoomLink: data.zoomLink,
      },
    });

    return NextResponse.json(
      { message: "Opción de horario creada exitosamente.", schedule },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error en el endpoint POST de course-schedules:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: "Token inválido o expirado." },
        { status: 401 }
      );
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Ocurrió un error desconocido." },
      { status: 500 }
    );
  }
}

// Método GET: Listar todas las opciones de horario disponibles
export async function GET() {
  try {
    const schedules = await prisma.courseSchedule.findMany({
      include: {
        course: {
          select: { id: true, name: true },
        },
        instructor: {
          select: { id: true, name: true, email: true },
        },
      },
    });
    return NextResponse.json(schedules, { status: 200 });
  } catch (error: unknown) {
    console.error("Error en el endpoint GET de course-schedules:", error);
    return NextResponse.json(
      { error: "Error al obtener las opciones de horario." },
      { status: 500 }
    );
  }
}
