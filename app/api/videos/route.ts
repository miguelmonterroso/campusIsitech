import { NextResponse } from "next/server";

type VimeoVideo = {
    uri: string;
    name: string;
    created_time: string;
    pictures?: {
      sizes: { width: number; height: number; link: string }[];
    };
    files?: {
      quality: string;
      type: string;
      link: string;
    }[];
  };
type VimeoResponse = {
  data: VimeoVideo[];
  paging: {
    next?: string;
  };
};

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const token = process.env.VIMEO_ACCESS_TOKEN as string;
    const baseUrl = `https://api.vimeo.com/me/videos`;

    let nextPageUri: string | null = baseUrl;
    const allVideos: VimeoVideo[] = [];

    while (nextPageUri) {
      const response = await fetch(nextPageUri, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Error al obtener los videos de Vimeo");
      }

      const data: VimeoResponse = await response.json();

      allVideos.push(...(data.data ?? []));
      nextPageUri = data.paging?.next ?? null;
    }

    return NextResponse.json({ videos: allVideos }, { status: 200 });
  } catch (error) {
    console.error("Error en /api/vimeo/videos:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al obtener los videos." },
      { status: 500 }
    );
  }
}
