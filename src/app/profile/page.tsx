import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import ProfileClient from "@/components/ProfileClient";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth");
  }

  const userReviews = await prisma.review.findMany({
    where: {
      authorId: session.user.id,
    },
    include: {
      curug: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <ProfileClient session={session} userReviews={userReviews} />;
}
