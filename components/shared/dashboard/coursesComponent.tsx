"use client";

import { useEffect, useState } from "react";
// import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import BlurFade from "@/components/ui/blur-fade";
import CourseInformation from "@/components/courses/courseInformation";
import useAuthStore from "@/store/auth/AuthStore";

interface Course {
  id: number;
  name: string;
  image: string;
  description: string;
  progress: number;
  zoomLink: string | null;
}

export default function CoursesComponent() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user?.token) return;

      try {
        const response = await fetch("/api/courses", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener los cursos.");
        }

        const data: Course[] = await response.json();
        setCourses(data);
        console.log(data);
      } catch (error) {
        console.error("Error al obtener los cursos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user?.token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center mt-20 flex-col h-screen">
        <span className="loading loading-ring loading-lg"></span>
        <p className="mt-4 text-lg text-gray-600">Cargando cursos...</p>
      </div>
    );
  }

  if (selectedCourse !== null) {
    const course = courses.find((c) => c.id === selectedCourse);
    return (
      <CourseInformation
        name={course?.name ?? ""}
        image={course?.image ?? ""}
        description={course?.description ?? ""}
        zoomLink={course?.zoomLink ?? ""}
        onBack={() => setSelectedCourse(null)}
      />
    );
  }

  return (
    <BlurFade delay={0.5} inView>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Mis Cursos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="flex flex-col p-4 space-y-4 cursor-pointer shadow-2xl grow"
              onClick={() => setSelectedCourse(course.id)}
            >
              <Image
                src={course.image}
                alt={course.name}
                width={100}
                height={100}
              />
              <h3 className="text-lg font-semibold">{course.name}</h3>
              <p className="text-sm text-gray-500">{course.description}</p>
              {/* <div className="mt-4">
                <Progress value={course.progress} />
                <p className="text-sm mt-2">{`Progreso: ${course.progress}%`}</p>
              </div> */}
            </Card>
          ))}
        </div>
      </div>
    </BlurFade>
  );
}
