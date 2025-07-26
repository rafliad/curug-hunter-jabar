import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// Fungsi helper untuk memeriksa kepemilikan ulasan
async function checkOwnership(reviewId: string, userId: string) {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });
  return review?.authorId === userId;
}

export async function PATCH(
  request: Request,
  { params }: { params: { reviewId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return new NextResponse("Unauthorized", { status: 401 });

  // Cek apakah pengguna adalah pemilik ulasan
  if (!(await checkOwnership(params.reviewId, session.user.id))) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const body = await request.json();
  const { content, rating } = body;
  if (
    !content ||
    !rating ||
    String(content).trim() === "" ||
    String(rating).trim() === ""
  ) {
    return new NextResponse("Ulasan dan rating tidak boleh kosong", {
      status: 400,
    });
  }
  const updatedReview = await prisma.review.update({
    where: { id: await params.reviewId },
    data: { content, rating: parseInt(rating, 10) },
  });

  return NextResponse.json(updatedReview);
}

export async function DELETE(
  request: Request,
  { params }: { params: { reviewId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return new NextResponse("Unauthorized", { status: 401 });

  // Cek apakah pengguna adalah pemilik ulasan
  if (!(await checkOwnership(params.reviewId, session.user.id))) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  await prisma.review.delete({
    where: { id: params.reviewId },
  });

  return new NextResponse(null, { status: 204 });
}
