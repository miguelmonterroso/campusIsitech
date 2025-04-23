export async function getZoomAccessToken(): Promise<string> {
    const res = await fetch(
      `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`,
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
            ).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        cache: "no-store", // Forzamos a que no se cachee la respuesta
      }
    );
  
    if (!res.ok) {
      throw new Error("Error al obtener el token de Zoom");
    }
  
    const data = await res.json();
  
    console.log("🔐 Nuevo token generado:", data.access_token);
  
    return data.access_token;
  }
  