import prisma from "@/lib/prisma";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import CurugBrowser from "@/components/CurugBrowser";

export default async function HomePage() {
  const allCurug = await prisma.curug.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Jelajahi Surga Tersembunyi di Jawa Barat
      </h1>
      <CurugBrowser initialCurug={allCurug} />
    </div>
  );
}
