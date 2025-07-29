import { NextResponse } from "next/server";
import { Resend } from "resend";
import prisma from "@/lib/prisma";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

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
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    const verificationLink = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;
    try {
      const { data, error } = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: [email],
        subject: "Verifikasi Email Anda untuk Curug Hunter Jabar",
        html: `<p>Klik <a href="${verificationLink}">di sini</a> untuk memverifikasi email Anda.</p>`,
      });

      if (error) {
        return Response.json({ error }, { status: 500 });
      }

      return Response.json(data);
    } catch (error) {
      return Response.json({ error }, { status: 500 });
    }
    // await resend.emails.send({
    //   from: "onboarding@resend.dev",
    //   to: [email],
    //   subject: "Verifikasi Email Anda untuk Curug Hunter Jabar",
    //   html: `<p>Klik <a href="${verificationLink}">di sini</a> untuk memverifikasi email Anda.</p>`,
    // });

    // return new NextResponse("Verification email sent", { status: 200 });
  } catch (error) {
    console.error("SEND_VERIFICATION_EMAIL_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
