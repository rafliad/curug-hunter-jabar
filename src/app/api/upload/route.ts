import { put, del } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  if (!filename || !request.body) {
    return new NextResponse("Filename is required", { status: 400 });
  }

  // `request.body` berisi file itu sendiri
  const blob = await put(filename, request.body, {
    access: "public",
  });

  return NextResponse.json(blob);
}

export async function DELETE(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const urlToDelete = searchParams.get("url");

  if (!urlToDelete) {
    return new NextResponse("URL is required", { status: 400 });
  }

  try {
    await del(urlToDelete);
    return new NextResponse("Blob deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Gagal menghapus blob:", error);
    return new NextResponse("Failed to delete blob", { status: 500 });
  }
}
