import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { checkOwnership } from "@/lib/utils/formatters";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return new NextResponse("Unauthorized", { status: 401 });

  if (!(await checkOwnership((await params).reviewId, session.user.id))) {
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
    where: { id: await (await params).reviewId },
    data: { content, rating: parseInt(rating, 10) },
  });

  return NextResponse.json(updatedReview);
}

export async function DELETE(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ reviewId: string }>;
  }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return new NextResponse("Unauthorized", { status: 401 });

  if (!(await checkOwnership((await params).reviewId, session.user.id))) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  await prisma.review.delete({
    where: { id: (await params).reviewId },
  });

  return new NextResponse(null, { status: 204 });
}
