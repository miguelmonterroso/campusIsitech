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
  email: z
    .string()
    .email({ message: "El email no tiene un formato válido." }),
  password: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
      { message: "La contraseña debe incluir al menos una mayúscula, una minúscula, un número y un carácter especial." }),
  role: z.enum(["STUDENT", "INSTRUCTOR"]).default("STUDENT"),
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

    const { name, email, password, role } = parsedData.data;

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

    const subject = "¡Bienvenido a Isitech!";
    const text = `Hola ${name}, gracias por registrarte en Isitech.`;
    const html = `
<html>
  <head>
    <style>
      /* Estilos generales */
      body {
        font-family: Arial, sans-serif;
        background-color: #101541;
        margin: 0;
        padding: 0;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background-color: #101541;
        background-image: url('https://campus-isitech.vercel.app/bg.png');
        background-repeat: no-repeat;
        background-size: cover;
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      .header {
        background: rgb(161,38,250);
        background: linear-gradient(90deg, rgba(161,38,250,1) 35%, rgba(15,77,250,1) 100%);
        padding: 20px;
        color: #ffffff;
        text-align: center;
        border-radius: 8px 8px 0 0;
      }
      .button {
        display: inline-block;
        padding: 10px 20px;
        background: rgb(161,38,250);
        background: linear-gradient(90deg, rgba(161,38,250,1) 35%, rgba(15,77,250,1) 100%);
        color: #ffff;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
      }
      .footer {
        background-color: #093151 !important;
        text-align: center;
        padding: 10px;
        font-size: 12px;
        color: white;
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
          <p><a href="https://campus-isitech.vercel.app/" class="button" style="color: white;" >Comienza tu aventura aquí</a></p>
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
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
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
