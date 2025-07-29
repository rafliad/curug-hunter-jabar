import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return new NextResponse("Token not found", { status: 400 });
    }

    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken || verificationToken.expires < new Date()) {
      return new NextResponse("Token is invalid or has expired", {
        status: 400,
      });
    }

    const user = await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() },
    });

    // Update semua ulasan 'PENDING' dari pengguna ini menjadi 'PUBLISHED'
    await prisma.review.updateMany({
      where: { authorId: user.id, status: "PENDING" },
      data: { status: "PUBLISHED" },
    });

    // Hapus token yang sudah digunakan
    await prisma.verificationToken.delete({
      where: { token },
    });

    return new NextResponse("Email verified successfully", { status: 200 });
  } catch (error) {
    console.error("VERIFY_EMAIL_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
