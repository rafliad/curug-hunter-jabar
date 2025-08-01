import prisma from "@/lib/prisma";
import CurugBrowser from "@/components/CurugBrowser";
import WelcomeGuide from "@/components/WelcomeGuide";

export default async function HomePage() {
  const allCurugData = await prisma.curug.findMany({
    orderBy: { name: "asc" },
  });

  const allCurug = JSON.parse(JSON.stringify(allCurugData));

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8">
      <WelcomeGuide role="USER" />
      <h1 className="text-4xl font-bold mb-8 text-center">
        Jelajahi Surga Tersembunyi di Jawa Barat
      </h1>
      <CurugBrowser initialCurug={allCurug} />
    </div>
  );
}
