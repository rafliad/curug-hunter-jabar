import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { normalize } from "@/lib/utils/formatters";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ curugId: string }> }
) {
  const { curugId } = await params;
  const curug = await prisma.curug.findUnique({
    where: { id: curugId },
  });
  return NextResponse.json(curug);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ curugId: string }> }
) {
  const { curugId } = await params;
  const body = await request.json();
  const {
    name,
    description,
    imageUrl,
    ticketPrice,
    difficulty,
    tags,
    openingHours,
  } = body;
  let { location } = body;

  if (location) {
    location = normalize(location);
  }

  const price = ticketPrice ? parseInt(String(ticketPrice), 10) : null;
  const tagArray =
    typeof tags === "string"
      ? tags.split(",").map((tag: string) => tag.trim())
      : [];

  const updatedCurug = await prisma.curug.update({
    where: { id: curugId },
    data: {
      name,
      description,
      location,
      imageUrl,
      ticketPrice: price,
      difficulty,
      tags: tagArray,
      openingHours,
    },
  });
  return NextResponse.json(updatedCurug);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ curugId: string }> }
) {
  const { curugId } = await params;
  await prisma.curug.delete({
    where: { id: curugId },
  });
  return new NextResponse(null, { status: 204 });
}
