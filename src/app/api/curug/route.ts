import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { normalizeLocation } from "@/lib/utils/formatters";

export async function GET() {
  const curug = await prisma.curug.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return NextResponse.json(curug);
}

export async function POST(request: Request) {
  const body = await request.json();
  const {
    name,
    description,
    imageUrl,
    ticketPrice,
    openingHours,
    difficulty,
    tags,
  } = body;
  let { location } = body;

  // Konversi dan bersihkan data sebelum disimpan
  const price = ticketPrice ? parseInt(ticketPrice, 10) : null;
  const tagArray = tags ? tags.split(",").map((tag: string) => tag.trim()) : [];

  location = normalizeLocation(location);

  const newCurug = await prisma.curug.create({
    data: {
      name,
      description,
      location,
      imageUrl,
      ticketPrice: price,
      openingHours,
      difficulty,
      tags: tagArray,
    },
  });

  return NextResponse.json(newCurug);
}
