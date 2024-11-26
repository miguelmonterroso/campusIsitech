'use client';

import useAuthStore from "@/store/auth/AuthStore";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { ClipboardCheck, FileTextIcon, UserPen } from "lucide-react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState } from "react";
import AnimatedCircularProgressBar from "@/components/ui/animated-circular-progress-bar";
import CustomTree from "@/components/tree";

type DashboardComponentProps = {
    onSelect: (section: string) => void;
  };

export default function DashboardComponent({ onSelect }: DashboardComponentProps) {
  const { user } = useAuthStore();
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
      onClick: () => onSelect("Configuración"),
      cta: "Ver perfil",
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
      onClick: () => onSelect("Progreso"),
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
      onClick: () => onSelect("Cursos"),
      cta: "Ver Material",
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
      onClick: () => onSelect("Calendario"),
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
    <div>
      <h2 className="text-xl font-semibold">
        Bienvenido {user?.name}
      </h2>
      <div>
        <BentoGrid>
            {features.map((feature, idx) => (
            <BentoCard key={idx} {...feature} />
            ))}
        </BentoGrid>
      </div>
    </div>
  );
}
