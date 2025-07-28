import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import SafeImage from "@/components/SafeImage";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  // Jika tidak ada sesi, redirect ke halaman login
  if (!session?.user) {
    redirect("/");
  }

  // Ambil semua ulasan yang ditulis oleh pengguna yang sedang login
  const userReviews = await prisma.review.findMany({
    where: {
      authorId: session.user.id,
    },
    include: {
      curug: true, // Sertakan data curug untuk setiap ulasan
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <div className="flex items-center gap-6 mb-8 pb-8 border-b">
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          <SafeImage
            src={session.user.image || ""}
            alt={session.user.name || "User"}
            width={96}
            height={96}
            className="rounded-full"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{session.user.name}</h1>
          <p className="text-lg text-gray-500">{session.user.email}</p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">
          Ulasan Anda ({userReviews.length})
        </h2>
        <div className="space-y-4">
          {userReviews.length > 0 ? (
            userReviews.map((review) => (
              <div key={review.id} className="bg-white p-4 rounded-lg shadow">
                <p className="text-sm text-gray-500 mb-2">
                  Ulasan untuk:
                  <Link
                    href={`/curug/${review.curug.id}`}
                    className="font-semibold text-blue-600 hover:underline ml-1"
                  >
                    {review.curug.name}
                  </Link>
                </p>
                <p className="text-gray-800">{review.content}</p>
                <p className="text-right text-xs text-gray-400 mt-2">
                  Rating: {review.rating}/5
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Anda belum membuat ulasan apa pun.</p>
          )}
        </div>
      </div>
    </div>
  );
}
