import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const { content, rating, curugId } = body;

  const newReview = await prisma.review.create({
    data: {
      content,
      rating: parseInt(rating, 10),
      curugId,
      authorId: session.user.id,
    },
  });

  return NextResponse.json(newReview);
}
