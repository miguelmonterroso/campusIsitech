import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import FlyonuiScript from "@/components/scripts/FlyonuiScript";
import { AppSidebar } from "@/components/shared/sidebar/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Isitech Campus",
  description:
    "Isitech Campus es la plataforma educativa ideal para aprender programación desde cero hasta nivel avanzado. Accede a cursos interactivos, material exclusivo y tutorías personalizadas. Únete a una comunidad que fomenta el aprendizaje continuo y la innovación tecnológica.",
  openGraph: {
    title: "Isitech Campus - Aprende a Programar Isi",
    description:
      "Isitech Campus ofrece una experiencia de aprendizaje única en programación. Explora nuestros cursos, tutoriales y recursos exclusivos para convertirte en un experto en desarrollo de software.",
    url: "campus-isitech.vercel.app",
    type: "website",
    images: [
      {
        url: "campus-isitech.vercel.app/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Isitech Campus - Aprende a Programar con los Mejores Recursos",
      },
    ],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="isitech-dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SidebarProvider>
          <AppSidebar />
          <SidebarTrigger />
          <main className="w-full">
            <div>{children}</div>
          </main>
        </SidebarProvider>
        <FlyonuiScript />
        <Toaster />
      </body>
    </html>
  );
}
