import prisma from '../lib/prisma';

async function main() {
  const instructor = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'securepassword', // Cambiar a una contraseña encriptada en producción
      role: 'INSTRUCTOR',
    },
  });

  const course = await prisma.course.create({
    data: {
      name: 'Introducción a la Programación',
      description: 'Un curso para aprender los fundamentos de programación.',
      price: 100.0,
      image: 'https://via.placeholder.com/150',
      instructorId: instructor.id,
    },
  });

  const student = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      password: 'anothersecurepassword', // Cambiar a una contraseña encriptada en producción
      role: 'STUDENT',
      courses: {
        connect: { id: course.id },
      },
    },
  });

  const lessons = await prisma.lesson.createMany({
    data: [
      {
        title: 'Introducción',
        description: 'Conoce los objetivos del curso.',
        videoUrl: 'https://example.com/intro.mp4',
        courseId: course.id,
      },
      {
        title: 'Variables y Tipos de Datos',
        description: 'Aprende sobre las bases de las variables.',
        videoUrl: 'https://example.com/variables.mp4',
        courseId: course.id,
      },
    ],
  });

  const billing = await prisma.billing.create({
    data: {
      userId: student.id,
      amount: 100.0,
      dueDate: new Date('2024-12-31'),
      status: 'PAID',
    },
  });

  console.log('Seed data created:', { instructor, course, student, lessons, billing });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
