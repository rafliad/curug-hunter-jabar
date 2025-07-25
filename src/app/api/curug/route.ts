import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const curug = await prisma.curug.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return NextResponse.json(curug);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, description, location, imageUrl } = body;

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
