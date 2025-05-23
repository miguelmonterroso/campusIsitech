'use client';

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { ClipboardCheck, FileTextIcon, UserPen } from "lucide-react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState } from "react";
import AnimatedCircularProgressBar from "@/components/ui/animated-circular-progress-bar";
import CustomTree from "@/components/tree";
import BlurFade from "@/components/ui/blur-fade";


export default function DashboardComponent() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const handleIncrement = (prev: number) => {
      if (prev === 100) {
        return 0;
      }
      return prev + 10;
    };
    setValue(handleIncrement);
    const interval = setInterval(() => setValue(handleIncrement), 2000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      Icon: UserPen,
      name: "Actualiza tu perfil",
      description: "Manten actualizado tu perfil",
      cta: "Ver Perfil",
      href: "/settings",
      className: "col-span-3 lg:col-span-1",
      background: (
          <div>
          </div>
          
      )
    },
    {
      Icon: ClipboardCheck,
      name: "Ver tu progreso",
      description: "No bajes la guardia",
      href:"/progress",
      cta: "Ver Progreso",
      className: "col-span-3 lg:col-span-2",
      background: (
        <div className=" absolute flex items-center justify-center w-full h-full">
          <AnimatedCircularProgressBar
          max={100}
          min={0}
          value={value}
          gaugePrimaryColor="rgb(79 70 229)"
          gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
        />
        </div>

      )
    },
    {
      Icon: FileTextIcon,
      name: "Material de Estudio",
      description: "Acceso rápido a todos los materiales del curso.",
      href:"/courses",
      cta: "Ver Materiales",
      className: "col-span-3 lg:col-span-2",
      background: (
          <div className="absolute flex items-center justify-center w-full h-full ml-15">
              <CustomTree/>
          </div>
      )
  
    },
    {
      Icon: CalendarIcon,
      name: "Calendario de clases",
      description: "Mantente al tanto de tus clases, no pierdas ningun detalle.",
      className: "col-span-3 lg:col-span-1",
      href:"/calendar",
      cta: "Ver Calendario",
      background: (
        <Calendar
          mode="single"
          selected={new Date(2022, 4, 11, 0, 0, 0)}
          className="absolute right-0 top-10 origin-top rounded-md border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:scale-105"
        />
      ),
    },
  ];

  return (
    <BlurFade delay={0.5} inView>
      <div className="p-4">
          <BentoGrid>
              {features.map((feature, idx) => (
              <BentoCard key={idx} {...feature} />
              ))}
          </BentoGrid>
      </div>
    </BlurFade>

  );
}
