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
  courseId: z.number({ required_error: "El courseId es requerido." }),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedData = registerSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        { errors: parsedData.error.errors },
        { status: 400 }
      );
    }

    const { name, email, password, role, courseId } = parsedData.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "El email ya está registrado." },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      return NextResponse.json(
        { error: "Curso no encontrado." },
        { status: 404 }
      );
    }

    const billing = await prisma.billing.create({
      data: {
        user: { connect: { id: newUser.id } },
        course: { connect: { id: course.id } },
        amount: course.price,
        dueDate: new Date(new Date().setDate(new Date().getDate() + 7)), // Vencimiento a 7 días
      },
    });

    const enrollment = await prisma.enrollment.create({
      data: {
        student: { connect: { id: newUser.id } },
        course: { connect: { id: course.id } },
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
        background-color: #f4f4f4; 
        margin: 0;
        padding: 0;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff; 
        color: #333333; 
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      .header {
        background: linear-gradient(90deg, #FC9741 55%, #FB504F 100%);
        padding: 20px;
        text-align: center;
        border-radius: 8px 8px 0 0;
      }
      .button {
        display: inline-block;
        padding: 10px 20px;
        background: linear-gradient(90deg, #FC9741 55%, #FB504F 100%);
        color: #fff;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
      }
      .footer {
        background-color: #e2e2e2;
        text-align: center;
        padding: 10px;
        font-size: 12px;
      }
      @media only screen and (max-width: 600px) {
        .container {
          width: 100% !important;
          padding: 10px;
        }
        .header {
          font-size: 18px !important;
        }
        .button {
          width: 100% !important;
          padding: 15px;
          text-align: center;
        }
        .footer {
          padding: 20px !important;
        }
        img {
          width: 100% !important;
          max-width: 250px;
          height: auto !important;
        }
      }
    </style>
  </head>
  <body>
    <table class="container">
      <tr>
        <td class="header">
          <h1>Bienvenido a Isitech, ${name}!</h1>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px;">
          <h2>Gracias por registrarte en Isitech.</h2>
          <p>Estamos muy emocionados de que formes parte de nuestra comunidad de aprendizaje ;)</p>
          <p><a href="https://campus-isitech.vercel.app/" class="button">Comienza tu aventura aquí</a></p>
        </td>
      </tr>
      <tr>
        <td class="footer">
          <img src="https://campus-isitech.vercel.app/isitech.png" alt="logo.png">
          <p>Este es un correo automático. Si tienes alguna duda, no dudes en contactarnos.</p>
        </td>
      </tr>
    </table>
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
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al registrar el usuario." },
      { status: 500 }
    );
  }
}
