import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
      const users = await prisma.user.findMany();
      return NextResponse.json(users);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Error fetching users" }, { status: 500 });
    }
  }

export async function POST() {
    return NextResponse.json({ message: "POST request received!" });
}

export async function PUT() {
    return NextResponse.json({ message: "PUT request received!" });
}

export async function DELETE() {
    return NextResponse.json({ message: "DELETE request received!" });
}