'use client';

import { useState } from "react";
import { Progress } from "@/components/ui/progress"
import Image from "next/image";
import { Card } from "@/components/ui/card";
import BlurFade from "@/components/ui/blur-fade";
import CourseInformation from "@/components/courses/courseInformation";

const courses = [
  {
    id: 1,
    name: "Curso de JavaScript Básico",
    image: "/icons/javascript.svg",
    description: "Aprende los fundamentos de JavaScript desde cero.",
    progress: 50,
  },
  {
    id: 2,
    name: "Curso de React Avanzado",
    image: "/icons/react.svg",
    description: "Domina las técnicas avanzadas de React para desarrollar aplicaciones modernas.",
    progress: 30,
  }
];

export default function CoursesComponent() {
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);

  if (selectedCourse !== null) {
    const course = courses.find((c) => c.id === selectedCourse);
    return (
      <CourseInformation
        name={course?.name ?? ""}
        image={course?.image ?? ""}
        description={course?.description ?? ""}
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
              <Image src={course.image} alt={course.name} width={100} height={100}/>
              <h3 className="text-lg font-semibold">{course.name}</h3>
              <p className="text-sm text-gray-500">{course.description}</p>
              <div className="mt-4">
                <Progress value={course.progress}/>
                <p className="text-sm mt-2">{`Progreso: ${course.progress}%`}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </BlurFade>
  );
}
