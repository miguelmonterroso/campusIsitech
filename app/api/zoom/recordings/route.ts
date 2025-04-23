import { NextResponse } from "next/server";
import { getZoomAccessToken } from "@/lib/zoomToken";

type ZoomRecordingFile = {
    id: string;
    file_type: string;
    recording_type: string;
    play_url?: string;
    download_url?: string;
  };
  
  type ZoomMeeting = {
    uuid: string;
    id: number;
    topic: string;
    start_time: string;
    recording_files: ZoomRecordingFile[];
    recording_play_passcode?: string;
  };

export async function GET() {
  try {
    const token = await getZoomAccessToken();
    const fromDate = "2024-01-01";
    const toDate = "2025-12-31";
    const baseUrl = `https://api.zoom.us/v2/users/me/recordings?from=${fromDate}&to=${toDate}`;

    let nextPageToken = "";
    let allMeetings: ZoomMeeting[] = [];

    do {
      const url = `${baseUrl}${nextPageToken ? `&next_page_token=${nextPageToken}` : ""}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener las grabaciones de Zoom");
      }

      const data = await response.json();

      allMeetings = [...allMeetings, ...(data.meetings as ZoomMeeting[] ?? [])];
      nextPageToken = data.next_page_token;
    } while (nextPageToken);

    return NextResponse.json({ meetings: allMeetings }, { status: 200 });
  } catch (error) {
    console.error("Error en /api/zoom/recordings:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al obtener las grabaciones." },
      { status: 500 }
    );
  }
}
