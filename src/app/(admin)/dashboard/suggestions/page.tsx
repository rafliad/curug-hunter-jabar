import prisma from "@/lib/prisma";
import SuggestionCard from "@/components/SuggestionCard";

export default async function SuggestionsPage() {
  const pendingSuggestions = await prisma.dataSuggestion.findMany({
    where: { status: "PENDING" },
    include: {
      curug: true,
      suggestedBy: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">
        Saran Perubahan dari Komunitas
      </h1>
      {pendingSuggestions.length > 0 ? (
        <div className="space-y-6">
          {pendingSuggestions.map((suggestion) => (
            <SuggestionCard key={suggestion.id} suggestion={suggestion} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Tidak ada saran baru saat ini.</p>
      )}
    </div>
  );
}
