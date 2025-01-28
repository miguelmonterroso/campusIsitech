import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request) {
    try {
      const authHeader = req.headers.get("Authorization");
  
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json(
          { error: "No autorizado. Se requiere un token." },
          { status: 401 }
        );
      }
  
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
  
      if (!decoded || typeof decoded !== "object") {
        return NextResponse.json(
          { error: "Token inválido." },
          { status: 401 }
        );
      }
  
      const { id: userId, role } = decoded as { id: number; role: string };
  
      if (role !== "STUDENT") {
        return NextResponse.json(
          { error: "Acceso denegado. Solo los estudiantes pueden actualizar pagos." },
          { status: 403 }
        );
      }
  
      const payload = await req.json();
      const { billingId } = payload;
  
      const billing = await prisma.billing.findUnique({
        where: { id: billingId },
      });
  
      if (!billing) {
        return NextResponse.json(
          { error: "La factura no existe." },
          { status: 404 }
        );
      }
  
      if (billing.userId !== userId) {
        return NextResponse.json(
          { error: "No puedes actualizar una factura que no te pertenece." },
          { status: 403 }
        );
      }
  
      if (billing.status === "PAID") {
        return NextResponse.json(
          { error: "La factura ya está pagada." },
          { status: 400 }
        );
      }
  
      const updatedBilling = await prisma.billing.update({
        where: { id: billingId },
        data: { status: "PAID" },
      });
  
      const updatedEnrollment = await prisma.enrollment.updateMany({
        where: { billingId },
        data: { status: "ACTIVE" },
      });
  
      return NextResponse.json({
        message: "Pago registrado exitosamente.",
        billing: updatedBilling,
        enrollment: updatedEnrollment,
      });
    } catch (error: unknown) {
      console.error("Error en el endpoint de actualización de pagos:", error);
  
      if (error instanceof jwt.JsonWebTokenError) {
        return NextResponse.json(
          { error: "Token inválido o expirado." },
          { status: 401 }
        );
      }
  
      if (error instanceof Error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }
  
      return NextResponse.json(
        { error: "Ocurrió un error desconocido." },
        { status: 500 }
      );
    }
}

export async function GET(req: Request) {
    try {
      const authHeader = req.headers.get("Authorization");

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json(
          { error: "No autorizado. Se requiere un token." },
          { status: 401 }
        );
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);

      if (!decoded || typeof decoded !== "object") {
        return NextResponse.json(
          { error: "Token inválido." },
          { status: 401 }
        );
      }

      const { id: userId, role } = decoded as { id: number; role: string };

      if (role !== "STUDENT") {
        return NextResponse.json(
          { error: "Acceso denegado. Solo los estudiantes pueden ver sus facturas." },
          { status: 403 }
        );
      }

      const billings = await prisma.billing.findMany({
        where: { userId },
        select: {
          id: true,
          courseId: true,
          amount: true,
          dueDate: true,
          status: true,
          createdAt: true,
        },
      });

      return NextResponse.json(billings, { status: 200 });
    } catch (error: unknown) {
      console.error("Error en el endpoint de facturación:", error);

      if (error instanceof jwt.JsonWebTokenError) {
        return NextResponse.json(
          { error: "Token inválido o expirado." },
          { status: 401 }
        );
      }

      if (error instanceof Error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { error: "Ocurrió un error desconocido." },
        { status: 500 }
      );
    }
}
