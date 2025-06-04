import { NextRequest } from "next/server";

export function getCorsHeaders(req: NextRequest | Request): HeadersInit {
  const origin = req.headers.get("origin");

  const allowedOrigins = [
    "http://localhost:3000",
    "https://isitech.com.gt",
  ];

  const headers: HeadersInit = {
    "Access-Control-Allow-Origin": allowedOrigins.includes(origin ?? "")
      ? origin!
      : "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };

  return headers;
}
