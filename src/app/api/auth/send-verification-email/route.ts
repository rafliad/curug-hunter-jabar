import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";
import crypto from "crypto";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return new NextResponse("Email not found", { status: 404 });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(new Date().getTime() + 3600 * 1000); // Token berlaku 1 jam

    await prisma.verificationToken.create({
      data: { identifier: email, token, expires },
    });

    const verificationLink = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;

    await transporter.sendMail({
      from: process.env.GMAIL_EMAIL,
      to: email,
      subject: "Verifikasi Email Anda untuk Curug Hunter Jabar",
      html: `<p>Klik <a href="${verificationLink}">di sini</a> untuk memverifikasi email Anda dan mempublikasikan ulasan Anda.</p>`,
    });

    return new NextResponse("Verification email sent", { status: 200 });
  } catch (error) {
    console.error("SEND_VERIFICATION_EMAIL_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
