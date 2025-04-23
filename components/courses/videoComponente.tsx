"use client";

import { useState, useEffect } from "react";
import HeroVideoDialog from "../ui/hero-video-dialog";

type ZoomRecordingFile = {
  id: string;
  file_type: string;
  recording_type: string;
  download_url?: string;
};

type ZoomMeeting = {
  topic: string;
  start_time: string;
  recording_play_passcode?: string;
  recording_files: ZoomRecordingFile[];
};

// const videos = [
//   {
//     video: "https://www.youtube.com/embed/f02mOEt11OQ",
//     thumbVideo:
//       "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     thumbAlt: "Class Video",
//     name: "Clase 1: Javascript Basics",
//     date: "2024-11-12",
//   },
//   {
//     video: "https://www.youtube.com/embed/cbuZfY2S2UQ",
//     thumbVideo:
//       "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     thumbAlt: "Class Video",
//     name: "Clase 2: Javascript Basics",
//     date: "2024-11-12",
//   },
//   {
//     video: "https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb",
//     thumbVideo:
//       "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     thumbAlt: "Class Video",
//     name: "Clase 3: Javascript Basics",
//     date: "2024-11-12",
//   },
// ];

export default function VideoComponent() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [videos, setVideos] = useState<
  {
    video: string;
    thumbVideo: string;
    thumbAlt: string;
    name: string;
    date: string;
    passcode?: string;
  }[]
>([]);

  useEffect(() => {
    const fetchZoomVideos = async () => {
      try {
        const res = await fetch("/api/zoom/recordings");
        const data = await res.json();
  
        const recordings = (data.meetings as ZoomMeeting[]).map((meeting) => {
          const videoFile = meeting.recording_files.find(
            (file: ZoomRecordingFile) =>
              file.file_type === "MP4" &&
              file.recording_type === "shared_screen_with_speaker_view"
          );
  
          return {
            video: videoFile?.download_url ?? "",
            thumbVideo: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            thumbAlt: meeting.topic,
            name: meeting.topic,
            date: new Date(meeting.start_time).toLocaleDateString("es-GT"),
            passcode: meeting.recording_play_passcode,
          };
        });
  
        setVideos(recordings);
        setIsLoaded(true);
      } catch (error) {
        console.error("Error al obtener grabaciones de Zoom:", error);
      }
    };
  
    fetchZoomVideos();
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center mt-20 flex-col">
        <span className="loading loading-ring loading-lg"></span>
        <p className="mt-4 text-lg text-gray-600">Cargando contenido...</p>
      </div>
    );
  }

  if(videos.length === 0){
    return <div className="flex items-center justify-center">
              <p>NO HAY VIDEOS DISPONIBLES POR EL MOMENTO</p>
           </div>
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
            useNativePlayer
          />
          <HeroVideoDialog
            className="hidden dark:block max-w-[350px]"
            animationStyle="top-in-bottom-out"
            videoSrc={video.video}
            thumbnailSrc={video.thumbVideo}
            thumbnailAlt={video.thumbAlt}
            useNativePlayer
          />
          <p className="mt-3 text-2xl">{video.name}</p>
          <p className="mt-1 text-lg">{video.date}</p>
          
        </div>
      ))}
    </div>
  );
}
