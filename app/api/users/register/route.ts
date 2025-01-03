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
    const html = `<p>Hola <strong>${name}</strong>,</p><p>Gracias por registrarte en Isitech.</p>`;

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
