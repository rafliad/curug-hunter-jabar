import prisma from "@/lib/prisma";
import CurugDetailClient from "@/components/CurugDetailClient";

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
        where: { status: "PUBLISHED" },
        include: { author: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!curug) {
    return <div className="p-8">Curug tidak ditemukan.</div>;
  }

  return <CurugDetailClient curug={curug} />;
}
