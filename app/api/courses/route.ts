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

const createCourseSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres."),
  price: z.number().positive("El precio debe ser mayor a 0."),
  image: z.string().url("La imagen debe ser una URL válida."),
  durationMonths: z.number().int().positive("La duración debe ser un número entero positivo."),
  instructorId: z.number().int().positive("El instructor ID debe ser un número válido."),
});

export async function GET(req: Request) {
  try {
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

    const userId = decoded.id;

    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: userId },
      select: { courseId: true },
    });

    if (enrollments.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const courseIds = enrollments.map((enrollment) => enrollment.courseId);
    const courses = await prisma.course.findMany({
      where: { id: { in: courseIds } },
      include: {
        lessons: true,
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    console.error("Error en el endpoint de cursos:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al obtener los cursos." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
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

    const { role } = decoded;
    if (role !== "INSTRUCTOR") {
      return NextResponse.json(
        { error: "Acceso denegado. Solo los instructores pueden crear cursos." },
        { status: 403 }
      );
    }

    const payload = await req.json();
    const data = createCourseSchema.parse(payload);

    const course = await prisma.course.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        image: data.image,
        durationMonths: data.durationMonths,
        instructorId: data.instructorId,
      },
    });

    return NextResponse.json({ message: "Curso creado exitosamente.", course });
  } catch (error: unknown) {
    console.error("Error en el endpoint POST:", error);

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: "Token inválido o expirado." },
        { status: 401 }
      );
    }
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Ocurrió un error desconocido." },
      { status: 500 }
    );
  }
}
