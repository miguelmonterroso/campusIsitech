import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
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
    console.error("Error al obtener los cursos:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al obtener los cursos disponibles." },
      { status: 500 }
    );
  }
}
