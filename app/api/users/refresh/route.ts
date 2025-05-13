import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: "No se encontró refresh token." }, { status: 401 });
    }

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { id: string };

    const user = await prisma.user.findUnique({ where: { id: Number(payload.id) } });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado." }, { status: 401 });
    }

    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    return NextResponse.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Error al renovar token:", error);
    return NextResponse.json({ error: "Token inválido o expirado." }, { status: 401 });
  }
}
