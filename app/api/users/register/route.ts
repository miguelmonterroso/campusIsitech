import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";
import { z } from "zod";
import { sendMail } from "@/lib/mailer";

const registerSchema = z.object({
  name: z
    .string()
    .min(1, { message: "El nombre es obligatorio." })
    .refine(
      (name) => !/[^a-zA-Z\s]/.test(name),
      { message: "El nombre solo puede contener letras y espacios." }
    ),
  email: z.string().email({ message: "El email no tiene un formato válido." }),
  password: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      { message: "La contraseña debe incluir al menos una mayúscula, una minúscula, un número y un carácter especial." }
    ),
  role: z.enum(["STUDENT", "INSTRUCTOR"]).default("STUDENT"),
  courseScheduleId: z.number({ required_error: "El courseScheduleId es requerido." }),
  isScholarship: z.boolean().optional()
});

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "https://www.isitech.com.gt",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedData = registerSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        { errors: parsedData.error.errors },
        { 
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "https://www.isitech.com.gt",
          }
        }
      );
    }

    const { name, email, password, role, courseScheduleId, isScholarship = false } = parsedData.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "El email ya está registrado." },
        { 
          status: 409, 
          headers: {
            "Access-Control-Allow-Origin": "https://www.isitech.com.gt",
          }
        }
      );
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        isScholarship
      },
    });

    const schedule = await prisma.courseSchedule.findUnique({
      where: { id: courseScheduleId },
      include: { course: true },
    });
    if (!schedule) {
      return NextResponse.json(
        { error: "Horario del curso no encontrado." },
        { 
          status: 404, 
          headers: {
            "Access-Control-Allow-Origin": "https://www.isitech.com.gt",
          }
         }
      );
    }

    const billing = await prisma.billing.create({
      data: {
        user: { connect: { id: newUser.id } },
        course: { connect: { id: schedule.course.id } },
        amount: isScholarship ? 0 : schedule.course.price,
        dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
        status: isScholarship ? "PAID" : "PAID", // solo si agregaste ese estado
      },
    });

    const enrollment = await prisma.enrollment.create({
      data: {
        student: { connect: { id: newUser.id } },
        courseSchedule: { connect: { id: schedule.id } },
        billing: { connect: { id: billing.id } },
      },
    });

    const subject = "¡Bienvenido a Isitech!";
    const text = `Hola ${name}, gracias por registrarte en Isitech.`;
    const html = `
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #0B0E23;
        margin: 0;
        padding: 0;
        color: #ffffff;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 30px auto;
        background-color: #101541;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 0 25px rgba(161, 38, 250, 0.2);
      }
      .header {
        background: linear-gradient(135deg, #0F4DFA, #A126FA);
        text-align: center;
        padding: 30px 20px;
      }
      .header h1 {
        margin: 0;
        font-size: 26px;
        color: #ffffff;
      }
      .content {
        padding: 30px 20px;
        text-align: center;
      }
      .content h2 {
        color: #FC9741;
        font-size: 22px;
        margin-bottom: 15px;
      }
      .content p {
        font-size: 16px;
        line-height: 1.5;
        color: #ddd;
      }
      .button {
        display: inline-block;
        margin-top: 25px;
        padding: 14px 28px;
        background: linear-gradient(to right, #A126FA, #0F4DFA);
        color: #fff;
        text-decoration: none;
        border-radius: 8px;
        font-weight: bold;
        font-size: 15px;
      }
      .footer {
        text-align: center;
        background-color: #0F4DFA;
        padding: 20px;
        font-size: 12px;
        color: #ffffff;
      }
      .footer img {
        width: 120px;
        margin-bottom: 10px;
      }
      @media only screen and (max-width: 600px) {
        .container {
          margin: 10px;
        }
        .button {
          width: 100%;
          display: block;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>¡Bienvenido a Isitech, ${name}!</h1>
      </div>
      <div class="content">
        <h2>Estás a punto de transformar tu futuro</h2>
        <p>Gracias por registrarte. En Isitech aprenderás habilidades que te abrirán nuevas oportunidades profesionales. 🚀</p>
        <p>Haz clic en el siguiente botón para acceder a tu cuenta y comenzar tu camino en tecnología:</p>
        <a href="https://www.isitech.codes/auth" class="button">Empezar ahora</a>
      </div>
      <div class="footer">
        <img src="https://campus-isitech.vercel.app/isitech.png" alt="Isitech Logo">
        <p>Este es un correo automático. Si necesitas ayuda, contáctanos en cualquier momento.</p>
      </div>
    </div>
  </body>
</html>
    `;

    try {
      await sendMail({
        to: email,
        subject,
        text,
        html,
      });
    } catch (emailError) {
      console.error("No se pudo enviar el correo de bienvenida:", emailError);
    }

    return NextResponse.json(
      {
        message: "Usuario registrado con éxito.",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
        enrollment,
        billing,
      },
      {
        status: 201,
        headers: {
          "Access-Control-Allow-Origin": "https://www.isitech.com.gt",
        }
      }
    );
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al registrar el usuario." },
      { status: 500 }
    );
  }
}
