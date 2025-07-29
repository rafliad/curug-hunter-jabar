import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  const body = await request.json();
  const { content, rating, curugId } = body;

  const reviewStatus = user.emailVerified ? "PUBLISHED" : "PENDING";

  if (!user.emailVerified) {
    console.log(
      `User ${user.email} is not verified. A verification email should be sent.`
    );
  }

  const newReview = await prisma.review.create({
    data: {
      content,
      rating: parseInt(rating, 10),
      curugId,
      authorId: session.user.id,
      status: reviewStatus,
    },
  });

  return NextResponse.json(newReview);
}
