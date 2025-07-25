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
