import prisma from "@/lib/prisma";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";

export default async function HomePage() {
  const allCurug = await prisma.curug.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Jelajahi Surga Tersembunyi di Jawa Barat
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {allCurug.map((curug) => (
          <Link href={`/curug/${curug.id}`} key={curug.id} className="group">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 group-hover:scale-105">
              <div className="relative w-full h-48">
                <SafeImage
                  src={curug.imageUrl || ""}
                  alt={`Foto ${curug.name}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-1">{curug.name}</h3>
                <p className="text-gray-500">{curug.location}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
