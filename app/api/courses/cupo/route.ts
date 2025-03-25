import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Obtenemos todos los cursos con la información general
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        name: true,
        // Se removió 'cupo' ya que ahora no existe en el modelo Course.
      },
    });

    return NextResponse.json(courses, { status: 200 });
  } catch (error: unknown) {
    console.error("Error al obtener los cursos:", error);
    return NextResponse.json({ error: "Error al obtener los cursos" }, { status: 500 });
  }
}
