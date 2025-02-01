"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useAuthStore from "@/store/auth/AuthStore";
import { CircleX, Eye } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import InvoicePDF from "@/components/billing/generateInvoice";
import PaymentModal from "@/components/billing/paymentModal";
import BlurFade from "@/components/ui/blur-fade";
interface Invoice {
  id: number;
  courseId: number;
  amount: number;
  dueDate: string;
  status: string;
  createdAt: string;
}

export default function Billing() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!user?.token) return;

      try {
        const response = await fetch("/api/billing", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener las facturas.");
        }

        const data: Invoice[] = await response.json();
        setInvoices(data);
      } catch (error) {
        console.error("Error al obtener las facturas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [user?.token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center mt-20 flex-col h-screen">
        <span className="loading loading-ring loading-lg"></span>
        <p className="mt-4 text-lg text-gray-600">Cargando facturas...</p>
      </div>
    );
  }

  return (
    <BlurFade inView delay={0.5}>
      <div className="p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-4">Mis Facturas</h2>
        {invoices.length === 0 ? (
          <p className="text-lg text-gray-500">
            No tienes facturas disponibles.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {invoices.map((invoice) => (
              <Card key={invoice.id} className="border rounded-lg shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">
                      Factura ISI-{invoice.id}
                    </CardTitle>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger
                          onClick={() => setSelectedInvoice(invoice)}
                        >
                          {invoice.status != "PAID" ? (
                            ""
                          ) : (
                            <Eye className="cursor-pointer" />
                          )}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Ver factura</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <CardDescription className="text-sm text-gray-500">
                    Curso ID: {invoice.courseId}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Monto:{" "}
                    <span className="font-semibold">
                      ${invoice.amount.toFixed(2)}
                    </span>
                  </p>
                  <p className="text-sm">
                    Fecha de vencimiento:{" "}
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </p>
                  <div className="flex justify-between items-center flex-wrap">
                    <Badge
                      variant={
                        invoice.status === "PAID" ? "default" : "destructive"
                      }
                      className="mt-5"
                    >
                      {invoice.status === "PAID" ? "PAGADO" : "PENDIENTE"}
                    </Badge>
                    {invoice.status != "PAID" ? <PaymentModal /> : ""}
                  </div>
                </CardContent>
                <CardFooter className="text-sm text-gray-500">
                  Creado el: {new Date(invoice.createdAt).toLocaleDateString()}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {selectedInvoice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 h-[98vh]">
            <BlurFade inView delay={0.3}>
              <div className="p-4 rounded-lg relative flex flex-col items-end">
                <CircleX
                  className="text-white absolute mr-4 mt-4 z-50"
                  onClick={() => setSelectedInvoice(null)}
                />
                <InvoicePDF invoice={selectedInvoice} />
              </div>
            </BlurFade>
          </div>
        )}
      </div>
    </BlurFade>
  );
}
