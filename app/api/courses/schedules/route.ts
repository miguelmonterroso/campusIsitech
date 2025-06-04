import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { getCorsHeaders } from "@/lib/cors";

interface JwtPayload {
  id: number;
  role: string;
  iat?: number;
  exp?: number;
}

const createCourseScheduleSchema = z.object({
  courseId: z.number().int().positive("El ID del curso es requerido"),
  instructorId: z.number().int().positive("El ID del instructor debe ser un número válido").optional(),
  dayPattern: z.string().min(3, "El patrón de días es requerido"),
  startDate: z.string().datetime({ offset: true }),
  cupo: z.number().int().positive("El cupo debe ser mayor a 0"),
  zoomLink: z.string().url("El Zoom link debe ser una URL válida").optional(),
});

export async function OPTIONS(req: Request) {
  const headers = getCorsHeaders(req);
  return new Response(null, {
    status: 204,
    headers,
  });
}

export async function POST(req: Request) {
  const headers = getCorsHeaders(req);
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "No autorizado. Se requiere un token." },
        { status: 401, headers }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    if (!decoded) {
      return NextResponse.json(
        { error: "Token inválido." },
        { status: 401, headers }
      );
    }

    if (decoded.role !== "INSTRUCTOR") {
      return NextResponse.json(
        { error: "Acceso denegado. Solo los instructores pueden crear opciones de horario." },
        { status: 403, headers }
      );
    }

    const payload = await req.json();
    const data = createCourseScheduleSchema.parse(payload);

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
      { status: 201, headers }
    );
  } catch (error: unknown) {
    console.error("Error en el endpoint POST de course-schedules:", error);
    const message = error instanceof Error ? error.message : "Error desconocido";
    const status = error instanceof jwt.JsonWebTokenError ? 401 : 500;
    return NextResponse.json({ error: message }, { status, headers });
  }
}

export async function GET(req: Request) {
  const headers = getCorsHeaders(req);
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    const schedules = await prisma.courseSchedule.findMany({
      where: {
        ...(courseId ? { courseId: parseInt(courseId) } : {}),
        startDate: {
          gte: new Date(),
        },
        cupo: {
          gt: 0,
        },
      },
      include: {
        course: {
          select: { id: true, name: true },
        },
      },
      orderBy: {
        startDate: "asc",
      },
    });

    return NextResponse.json(schedules, { status: 200, headers });
  } catch (error) {
    console.error("Error en el endpoint GET de course-schedules:", error);
    return NextResponse.json(
      { error: "Error al obtener las opciones de horario." },
      { status: 500, headers }
    );
  }
}

export async function DELETE(req: Request) {
  const headers = getCorsHeaders(req);
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Falta el ID del horario a eliminar." }, { status: 400, headers });
    }

    const schedule = await prisma.courseSchedule.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json({ message: "Horario eliminado exitosamente.", schedule }, { status: 200, headers });
  } catch (error: unknown) {
    console.error("Error al eliminar el horario:", error);
    return NextResponse.json(
      { error: "Error al eliminar el horario. Asegúrate de que el ID exista." },
      { status: 500, headers }
    );
  }
}
