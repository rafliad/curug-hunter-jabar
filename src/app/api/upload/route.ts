import { put } from "@vercel/blob";
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
