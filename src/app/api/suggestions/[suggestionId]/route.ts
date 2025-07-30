import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Prisma, Difficulty } from "@prisma/client";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ suggestionId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { suggestionId } = await params;
  const body = await request.json();
  const { status, fieldName, newValue, curugId } = body;

  if (status === "APPROVED") {
    const updateData: Prisma.CurugUpdateInput = {};

    // Gunakan switch yang lengkap untuk memastikan type safety
    switch (fieldName) {
      case "ticketPrice":
        updateData.ticketPrice = parseInt(newValue, 10);
        break;
      case "openingHours":
        updateData.openingHours = JSON.parse(newValue);
        break;
      case "difficulty":
        if (Object.values(Difficulty).includes(newValue as Difficulty)) {
          updateData.difficulty = newValue as Difficulty;
        }
        break;
      case "name":
        updateData.name = newValue;
        break;
      case "location":
        updateData.location = newValue;
        break;
      case "description":
        updateData.description = newValue;
        break;
      case "imageUrl":
        updateData.imageUrl = newValue;
        break;
      case "tags":
        updateData.tags = newValue.split(",").map((tag: string) => tag.trim());
        break;
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.curug.update({
        where: { id: curugId },
        data: updateData,
      });
    }
  }

  const updatedSuggestion = await prisma.dataSuggestion.update({
    where: { id: suggestionId },
    data: { status },
  });

  return NextResponse.json(updatedSuggestion);
}
