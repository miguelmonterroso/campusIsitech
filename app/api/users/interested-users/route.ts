import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const interestedUserSchema = z.object({
  name: z
    .string()
    .min(1, { message: "El nombre es obligatorio." })
    .refine(
      (name) => !/[^a-zA-Z\s]/.test(name),
      { message: "El nombre solo puede contener letras y espacios." }
    ),
  email: z.string().email({ message: "El email no tiene un formato válido." }),
  phone: z.string().min(8, { message: "El teléfono debe tener al menos 8 dígitos." }),
  message: z.string().optional(),
  referral: z.string().optional(),
});

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "https://www.isitech.com.gt",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Credentials": "true"
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = interestedUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.errors },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "https://www.isitech.com.gt",
          },
        }
      );
    }

    const { name, email, phone, message, referral } = parsed.data;

    const existingUser = await prisma.interestedUser.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Este email ya fue registrado como interesado." },
        {
          status: 409,
          headers: {
            "Access-Control-Allow-Origin": "https://www.isitech.com.gt",
          },
        }
      );
    }

    await prisma.interestedUser.create({
      data: {
        name,
        email,
        phone,
        message,
        referral,
      },
    });

    return NextResponse.json(
      { message: "Interesado registrado correctamente." },
      {
        status: 201,
        headers: {
          "Access-Control-Allow-Origin": "https://www.isitech.com.gt",
        },
      }
    );
  } catch (error) {
    console.error("Error al registrar interesado:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al registrar el interesado." },
      { status: 500 }
    );
  }
}
