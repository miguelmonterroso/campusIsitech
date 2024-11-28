import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import BlurFade from "@/components/ui/blur-fade";
import HeroVideoDialog from "../ui/hero-video-dialog";

type CourseInformationProps = {
  name: string;
  image: string;
  description: string;
  onBack: () => void; 
};

export default function CourseInformation({
  name,
  image,
  description,
  onBack,
}: CourseInformationProps) {
  const [selectedContent, setSelectedContent] = useState<string | null>(null);

  const renderContent = () => {
    switch (selectedContent) {
      case "videos":
        return <div className="mt-4 p-3 border rounded-md flex gap-4 flex-wrap overflow-auto max-h-[450px] lg:max-h-[550px]">  <div className="relative">
        <HeroVideoDialog
          className="dark:hidden "
          animationStyle="top-in-bottom-out"
          videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
          thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
          thumbnailAlt="Hero Video"
        />
        <HeroVideoDialog
          className="hidden dark:block max-w-[300px]"
          animationStyle="top-in-bottom-out"
          videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
          thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
          thumbnailAlt="Hero Video"
        />
        <p>Clase 1</p>
      </div>
      <div className="relative">
        <HeroVideoDialog
          className="dark:hidden "
          animationStyle="top-in-bottom-out"
          videoSrc="https://www.youtube.com/embed/Iczqotmm5sk"
          thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
          thumbnailAlt="Hero Video"
        />
        <HeroVideoDialog
          className="hidden dark:block max-w-[300px]"
          animationStyle="top-in-bottom-out"
          videoSrc="https://www.youtube.com/embed/Iczqotmm5sk"
          thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
          thumbnailAlt="Hero Video"
        />
                <p>Clase 2</p>

      </div>
      <div className="relative">
        <HeroVideoDialog
          className="dark:hidden "
          animationStyle="top-in-bottom-out"
          videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
          thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
          thumbnailAlt="Hero Video"
        />
        <HeroVideoDialog
          className="hidden dark:block max-w-[300px]"
          animationStyle="top-in-bottom-out"
          videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
          thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
          thumbnailAlt="Hero Video"
        />
                <p>Clase 3</p>

      </div>
      <div className="relative">
        <HeroVideoDialog
          className="dark:hidden "
          animationStyle="top-in-bottom-out"
          videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
          thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
          thumbnailAlt="Hero Video"
        />
        <HeroVideoDialog
          className="hidden dark:block max-w-[300px]"
          animationStyle="top-in-bottom-out"
          videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
          thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
          thumbnailAlt="Hero Video"
        />
                <p>Clase 3</p>

      </div>
      <div className="relative">
        <HeroVideoDialog
          className="dark:hidden "
          animationStyle="top-in-bottom-out"
          videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
          thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
          thumbnailAlt="Hero Video"
        />
        <HeroVideoDialog
          className="hidden dark:block max-w-[300px]"
          animationStyle="top-in-bottom-out"
          videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
          thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
          thumbnailAlt="Hero Video"
        />
                <p>Clase 3</p>

      </div>
      <div className="relative">
        <HeroVideoDialog
          className="dark:hidden "
          animationStyle="top-in-bottom-out"
          videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
          thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
          thumbnailAlt="Hero Video"
        />
        <HeroVideoDialog
          className="hidden dark:block max-w-[300px]"
          animationStyle="top-in-bottom-out"
          videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
          thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
          thumbnailAlt="Hero Video"
        />
                <p>Clase 3</p>

      </div>
      <div className="relative">
        <HeroVideoDialog
          className="dark:hidden "
          animationStyle="top-in-bottom-out"
          videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
          thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
          thumbnailAlt="Hero Video"
        />
        <HeroVideoDialog
          className="hidden dark:block max-w-[300px]"
          animationStyle="top-in-bottom-out"
          videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
          thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
          thumbnailAlt="Hero Video"
        />
                <p>Clase 3</p>

      </div>
      <div className="relative">
        <HeroVideoDialog
          className="dark:hidden "
          animationStyle="top-in-bottom-out"
          videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
          thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
          thumbnailAlt="Hero Video"
        />
        <HeroVideoDialog
          className="hidden dark:block max-w-[300px]"
          animationStyle="top-in-bottom-out"
          videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
          thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
          thumbnailAlt="Hero Video"
        />
                <p>Clase 3</p>

      </div>
      <div className="relative">
        <HeroVideoDialog
          className="dark:hidden "
          animationStyle="top-in-bottom-out"
          videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
          thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
          thumbnailAlt="Hero Video"
        />
        <HeroVideoDialog
          className="hidden dark:block max-w-[300px]"
          animationStyle="top-in-bottom-out"
          videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
          thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
          thumbnailAlt="Hero Video"
        />
                <p>Clase 3</p>

      </div></div>;
      case "material":
        return <div className="mt-4 p-4 border rounded-md">Aquí se muestra el material de estudio...</div>;
      case "exercises":
        return <div className="mt-4 p-4 border rounded-md">Aquí se muestran los ejercicios...</div>;
      default:
        return <div className="mt-4 p-4 border rounded-md">Selecciona una opción para ver el contenido.</div>;
    }
  };

  return (
    <BlurFade delay={0.5} inView>
      <div className="p-6 space-y-6 sm:max-w-[50vw] lg:min-w-[70vw]">
        <Button variant="ghost" onClick={onBack}>
          {"< Volver a los Cursos"}
        </Button>

        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-8">
          <div className="flex-1">
            <h2 className="text-3xl font-bold">{name}</h2>
            <p className="mt-2 text-lg text-gray-700">{description}</p>
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

        <div className="flex flex-col md:flex-col lg:flex-row md:gap-4 md:items-start items-center md:justify-center sm:justify-center space-y-4 md:space-y-0 md:space-x-0 mt-6">
          <Button variant="outline" onClick={() => setSelectedContent("videos")}>
            Ver Videos de Clases Anteriores
          </Button>
          <Button variant="outline" onClick={() => setSelectedContent("material")}>
            Material de Estudio
          </Button>
          <Button variant="outline" onClick={() => setSelectedContent("exercises")}>
            Ejercicios
          </Button>
        </div>

        <div className="mt-8">
          {renderContent()}
        </div>
      </div>
    </BlurFade>
  );
}
