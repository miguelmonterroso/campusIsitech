import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import BlurFade from "@/components/ui/blur-fade";
import VideoComponent from "./videoComponente";

type CourseInformationProps = {
  name: string;
  image: string;
  description: string;
  zoomLink?: string;
  onBack: () => void;
};

export default function CourseInformation({
  name,
  image,
  description,
  zoomLink,
  onBack,
}: CourseInformationProps) {
  const [selectedContent, setSelectedContent] = useState("videos");



  const renderContent = () => {
    switch (selectedContent) {
      case "videos":
        return (
          <VideoComponent/>
        );
      case "material":
        return (
          <div className="mt-4 p-4 border rounded-md">
            Aquí se muestra el material de estudio...
          </div>
        );
      case "exercises":
        return (
          <div className="mt-4 p-4 border rounded-md">
            Aquí se muestran los ejercicios...
          </div>
        );
      default:
        return (
          <div className="mt-4 p-4 border rounded-md">
            Selecciona una opción para ver el contenido.
          </div>
        );
    }
  };

  return (
    <BlurFade delay={0.5} inView>
      <div className="p-6 space-y-6 grow">
        <Button variant="ghost" onClick={onBack}>
          {"< Volver a los Cursos"}
        </Button>

        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-8">
          <div className="flex-1">
            <h2 className="text-3xl font-bold">{name}</h2>
            <p className="mt-2 text-lg text-gray-700">{description}</p>
            {zoomLink && (
                <Button className="mt-2">
                  <a
                    href={zoomLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block hover:underline"
                  >
                    Ir a mi clase
                  </a>
                </Button>
            )}
          </div>
          <div className="hidden md:block lg:block">
            <Image
              src={image}
              alt={`Imagen del curso ${name}`}
              width={200}
              height={200}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-col lg:flex-row md:gap-4 md:items-start lg:items-center md:justify-center sm:justify-start items-start space-y-4 md:space-y-0 md:space-x-0 mt-6">
          <Button
            variant="outline"
            onClick={() => setSelectedContent("videos")}
          >
            Ver Videos de Clases Anteriores
          </Button>
          {/* <Button
            variant="outline"
            onClick={() => setSelectedContent("material")}
          >
            Material de Estudio
          </Button>
          <Button
            variant="outline"
            onClick={() => setSelectedContent("exercises")}
          >
            Ejercicios
          </Button> */}
        </div>

        <div className="mt-8">{renderContent()}</div>
      </div>
    </BlurFade>
  );
}
