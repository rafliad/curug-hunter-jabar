import prisma from "@/lib/prisma";
import SafeImage from "@/components/SafeImage";
import CreateReviewForm from "@/components/CreateReviewForm";
import ReviewItem from "@/components/ReviewItem";

export default async function CurugDetailPage({
  params,
}: {
  params: Promise<{ curugId: string }>;
}) {
  const { curugId } = await params;

  const curug = await prisma.curug.findUnique({
    where: { id: curugId },
    include: {
      reviews: {
        where: {
          status: "PUBLISHED",
        },
        include: {
          author: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!curug) {
    return <div className="p-8">Curug tidak ditemukan.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      {/* Bagian Header Curug */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{curug.name}</h1>
        <p className="text-lg text-gray-500">{curug.location}</p>
        {curug.imageUrl && (
          <div className="mt-4 relative w-full h-96">
            <SafeImage
              src={curug.imageUrl}
              alt={`Foto ${curug.name}`}
              layout="fill"
              objectFit="cover"
              className="rounded-lg shadow-lg"
            />
          </div>
        )}
        <p className="mt-6 text-gray-700 whitespace-pre-wrap">
          {curug.description}
        </p>
      </div>
      <div>
        {/* ... */}
        <CreateReviewForm curugId={curug.id} />
      </div>
      {/* Bagian Ulasan */}
      <div>
        <h2 className="text-2xl font-bold border-b pb-2 mb-4">
          Ulasan Pengunjung
        </h2>
        <div className="space-y-6">
          {curug.reviews.length > 0 ? (
            curug.reviews.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))
          ) : (
            <p className="text-gray-500">Belum ada ulasan untuk curug ini.</p>
          )}
        </div>
      </div>
    </div>
  );
}
