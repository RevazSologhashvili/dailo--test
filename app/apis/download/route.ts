// app/api/download/route.ts
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return new Response("Missing file URL", { status: 400 });
  }

  try {
    const fileResponse = await fetch(url);

    if (!fileResponse.ok || !fileResponse.body) {
      return new Response("Failed to fetch file", { status: 500 });
    }

    const fileName = url.split("/").pop() || "file";

    const headers = new Headers();
    headers.set("Content-Disposition", `attachment; filename="${fileName}"`);
    headers.set(
      "Content-Type",
      fileResponse.headers.get("content-type") || "application/octet-stream"
    );

    return new Response(fileResponse.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("[Download Error]", error);
    return new Response("Error downloading file", { status: 500 });
  }
}