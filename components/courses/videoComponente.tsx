"use client";

import { useState, useEffect } from "react";
import HeroVideoDialog from "../ui/hero-video-dialog";

type VimeoVideo = {
  uri: string;
  name: string;
  link?: string;
  player_embed_url: string;
  created_time: string;
  pictures?: {
    sizes: { width: number; height: number; link: string }[];
  };
};

export default function VideoComponent() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [videos, setVideos] = useState<
    {
      video: string;
      thumbVideo: string;
      thumbAlt: string;
      name: string;
      date: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchVimeoVideos = async () => {
      try {
        const res = await fetch("/api/videos");
        const data = await res.json();

        const videosMapped = (data.videos as VimeoVideo[]).map((video) => {
          const thumbnail = video.pictures?.sizes?.length
            ? video.pictures.sizes[video.pictures.sizes.length - 1].link
            : "https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

          return {
            video: video.player_embed_url,
            thumbVideo: thumbnail,
            thumbAlt: video.name,
            name: video.name,
            date: new Date(video.created_time).toLocaleDateString("es-GT"),
          };
        });

        setVideos(videosMapped);
        setIsLoaded(true);
      } catch (error) {
        console.error("Error al obtener videos de Vimeo:", error);
      }
    };

    fetchVimeoVideos();
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center mt-20 flex-col">
        <span className="loading loading-ring loading-lg"></span>
        <p className="mt-4 text-lg text-gray-600">Cargando contenido...</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <p>NO HAY VIDEOS DISPONIBLES POR EL MOMENTO</p>
      </div>
    );
  }

  return (
    <div className="mt-4 p-3 border rounded-md flex gap-4 flex-wrap overflow-auto max-h-[450px] lg:max-h-[550px] grow min-h-[50vh]">
      {videos.map((video, index) => (
        <div key={index} className="relative mb-2 max-w-[350px]">
          <HeroVideoDialog
            className="dark:hidden grow"
            animationStyle="top-in-bottom-out"
            videoSrc={video.video}
            thumbnailSrc={video.thumbVideo}
            thumbnailAlt={video.thumbAlt}
          />
          <HeroVideoDialog
            className="hidden dark:block max-w-[350px]"
            animationStyle="top-in-bottom-out"
            videoSrc={video.video}
            thumbnailSrc={video.thumbVideo}
            thumbnailAlt={video.thumbAlt}
          />
          <p className="mt-3 text-2xl">{video.name}</p>
          <p className="mt-1 text-lg">{video.date}</p>
        </div>
      ))}
    </div>
  );
}
