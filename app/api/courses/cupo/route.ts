import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        name: true,
        cupo: true,
      },
    });

    const coursesWithAvailability = await Promise.all(
      courses.map(async (course) => {
        const enrolledCount = await prisma.enrollment.count({
          where: { courseId: course.id },
        });

        const availableSeats =
          course.cupo !== null && course.cupo !== undefined
            ? course.cupo - enrolledCount
            : "Ilimitado";

        return {
          id: course.id,
          name: course.name,
          cupo: course.cupo,
          enrolled: enrolledCount,
          availableSeats,
        };
      })
    );

    return NextResponse.json(coursesWithAvailability, { status: 200 });
  } catch (error: unknown) {
    console.error("Error al obtener los cursos y cupos disponibles:", error);
    return NextResponse.json(
      { error: "Error al obtener los cursos" },
      { status: 500 }
    );
  }
}
