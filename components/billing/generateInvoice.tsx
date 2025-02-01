'use client';

import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Button } from '../ui/button';
import { Download } from 'lucide-react';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import BlurFade from '../ui/blur-fade';
  
interface Invoice {
  id: number;
  courseId: number;
  amount: number;
  dueDate: string;
  status: string;
  createdAt: string;
}

interface InvoicePDFProps {
  invoice: Invoice;
}

const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoice }) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [courseName, setCourseName] = useState('');

  useEffect(() => {
    async function fetchCourseName() {
      try {
        const response = await fetch('api/courses/all');
        console.log(response)
        if (!response.ok) {
          throw new Error('Error al obtener los cursos');
        }
        const courses = await response.json();
        const course = courses.find((c: { id: number; name: string }) => c.id === invoice.courseId);
        if (course) {
          setCourseName(course.name);
        }
      } catch (error) {
        console.error('Error fetching course name:', error);
      }
    }
    fetchCourseName();
  }, [invoice.courseId]);

  const handleDownload = async () => {
    if (!invoiceRef.current) return;

    try {
      const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();

      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdfWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`factura_${invoice.id}.pdf`);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    }
  };

  return (
    <BlurFade inView delay={0.3}>
    <div className="flex flex-col items-center">
      <div
        ref={invoiceRef}
        className="w-full bg-black p-8 shadow-md text-white rounded-lg border border-gray-600"
      >
        <Image src="/isitech.png" width={100} height={100} alt="logo" />
        <h1 className="text-2xl font-bold mb-4 mt-4 font-mono">
          Factura ISI-{invoice.id}
        </h1>
        <hr className="mb-6" />
        <div className="space-y-2">
        <BlurFade inView delay={0.4}>
          <Table>
            <TableCaption>Detalle de tu factura #{invoice.id}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Factura</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Descripcion</TableHead>
                <TableHead className="text-right">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">ISI-{invoice.id}</TableCell>
                <TableCell>
                  {invoice.status === 'PENDING'
                    ? 'Pendiente'
                    : invoice.status === 'PAID'
                    ? 'Pagado'
                    : invoice.status === 'OVERDUE'
                    ? 'Atrasada'
                    : ''}
                </TableCell>
                <TableCell>{courseName ? courseName : invoice.courseId}</TableCell>
                <TableCell className="text-right">Q{invoice.amount}.00</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          </BlurFade>
        </div>
        <div className="mt-10 text-center">
          <p className="text-gray-400">¡Gracias por tu compra!</p>
        </div>
      </div>
      <Button
        onClick={handleDownload}
        className="mt-6 px-4 py-2 text-black rounded transition-colors bg-white font-bold hover:bg-gray-300"
      >
        Descargar PDF
        <Download />
      </Button>
    </div>
    </BlurFade>
  );
};

export default InvoicePDF;
