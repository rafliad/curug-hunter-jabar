import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const { curugId, fieldName, oldValue, newValue } = body;

  if (!curugId || !fieldName || !newValue) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  const suggestion = await prisma.dataSuggestion.create({
    data: {
      curugId,
      fieldName,
      oldValue,
      newValue,
      suggestedById: session.user.id,
    },
  });

  return NextResponse.json(suggestion);
}
