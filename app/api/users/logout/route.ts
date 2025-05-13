import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Sesión cerrada." });
  response.cookies.set("refreshToken", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });
  return response;
}
