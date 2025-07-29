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
  const { name, description, imageUrl } = body;
  let { location } = body;

  location = normalizeLocation(location);

  const newCurug = await prisma.curug.create({
    data: {
      name,
      description,
      location,
      imageUrl,
    },
  });

  return NextResponse.json(newCurug);
}
