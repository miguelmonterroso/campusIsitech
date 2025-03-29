import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json(courses, { status: 200 });
  } catch (error: unknown) {
    console.error("Error al obtener los cursos:", error);
    return NextResponse.json({ error: "Error al obtener los cursos" }, { status: 500 });
  }
}
