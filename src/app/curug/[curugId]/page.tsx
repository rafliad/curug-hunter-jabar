import prisma from "@/lib/prisma";
import SafeImage from "@/components/SafeImage";
import CreateReviewForm from "@/components/CreateReviewForm";
import ReviewItem from "@/components/ReviewItem";
// Definisikan tipe untuk params agar lebih aman
type CurugDetailPageProps = {
  params: {
    curugId: string;
  };
};

export default async function CurugDetailPage({
  params,
}: CurugDetailPageProps) {
  const { curugId } = await params;

  // Ambil data curug spesifik DAN semua ulasannya (beserta data penulisnya)
  const curug = await prisma.curug.findUnique({
    where: { id: curugId },
    include: {
      reviews: {
        include: {
          author: true, // Sertakan data penulis untuk setiap ulasan
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
