import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { z } from "zod";

const enrollmentSchema = z.object({
  courseId: z.number().int().positive("El ID del curso debe ser un número válido."),
});

export async function POST(req: Request) {
  try {
    // Validación del token de autenticación
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "No autorizado. Se requiere un token." },
        { status: 401 }
      );
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (!decoded || typeof decoded !== "object") {
      return NextResponse.json(
        { error: "Token inválido." },
        { status: 401 }
      );
    }
    const { id: userId, role } = decoded as { id: number; role: string };

    if (role !== "STUDENT") {
      return NextResponse.json(
        { error: "Acceso denegado. Solo los estudiantes pueden inscribirse en cursos." },
        { status: 403 }
      );
    }

    // Validación del body de la solicitud
    const payload = await req.json();
    const { courseId } = enrollmentSchema.parse(payload);

    // Buscar el curso
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json(
        { error: "El curso no existe." },
        { status: 404 }
      );
    }

    // Validar que el curso no haya alcanzado su cupo máximo (si se definió)
    if (course.cupo) {
      const currentEnrollmentCount = await prisma.enrollment.count({
        where: { courseId },
      });
      if (currentEnrollmentCount >= course.cupo) {
        return NextResponse.json(
          { error: "El curso ha alcanzado su cupo máximo de alumnos." },
          { status: 400 }
        );
      }
    }

    // Verificar que el estudiante no esté ya inscrito en el curso
    const alreadyEnrolled = await prisma.enrollment.findFirst({
      where: {
        studentId: userId,
        courseId,
      },
    });

    if (alreadyEnrolled) {
      return NextResponse.json(
        { error: "Ya estás inscrito en este curso." },
        { status: 400 }
      );
    }

    // Crear la factura (Billing) para el curso
    const billing = await prisma.billing.create({
      data: {
        userId,
        courseId,
        amount: course.price,
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        status: "PENDING",
      },
    });

    // Crear la inscripción (Enrollment)
    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: userId,
        courseId,
        billingId: billing.id,
      },
    });

    return NextResponse.json(
      { message: "Inscripción exitosa.", enrollment, billing },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error en el endpoint de inscripción:", error);

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
