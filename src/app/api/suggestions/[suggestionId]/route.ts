import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: { suggestionId: string } }
) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { suggestionId } = params;
  const body = await request.json();
  const { status, fieldName, newValue, curugId } = body;

  if (status === "APPROVED") {
    let updateData: any = {};

    if (fieldName === "openingHours") {
      updateData[fieldName] = JSON.parse(newValue);
    } else if (fieldName === "ticketPrice") {
      updateData[fieldName] = parseInt(newValue, 10);
    } else {
      updateData[fieldName] = newValue;
    }

    // Update data curugnya
    await prisma.curug.update({
      where: { id: curugId },
      data: updateData,
    });
  }

  // Update status sarannya
  const updatedSuggestion = await prisma.dataSuggestion.update({
    where: { id: suggestionId },
    data: { status },
  });

  return NextResponse.json(updatedSuggestion);
}
