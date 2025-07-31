"use client";

import { Card, CardBody, Chip } from "@heroui/react";
import { Curug, Review, User, Prisma } from "@prisma/client";
import SafeImage from "@/components/SafeImage";
import CreateReviewForm from "@/components/CreateReviewForm";
import ReviewItem from "@/components/ReviewItem";
import OpeningHoursDisplay from "@/components/OpeningHoursDisplay";
import SuggestionButton from "./SuggestionButton";

type ReviewWithAuthor = Review & { author: User };
type CurugWithReviews = Curug & { reviews: ReviewWithAuthor[] };

type OpeningHoursStructure = {
  senin?: string;
  selasa?: string;
  rabu?: string;
  kamis?: string;
  jumat?: string;
  sabtu?: string;
  minggu?: string;
  catatan?: string;
};

export default function CurugDetailClient({
  curug,
}: {
  curug: CurugWithReviews;
}) {
  const openingHours =
    curug.openingHours as Prisma.JsonObject as OpeningHoursStructure | null;

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto">
        {curug.imageUrl && (
          <div className="relative w-full h-64 sm:h-96">
            <SafeImage
              src={curug.imageUrl}
              alt={`Foto ${curug.name}`}
              layout="fill"
              objectFit="cover"
            />
          </div>
        )}
        <div className="p-4 sm:p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">
              {curug.name}
            </h1>
            <p className="text-lg text-gray-500">{curug.location}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardBody className="bg-blue-50">
                  <h2 className="text-2xl font-semibold mb-4">Deskripsi</h2>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {curug.description}
                  </p>
                </CardBody>
              </Card>
              <div className="mt-8">
                <h2 className="text-2xl font-bold border-b pb-2 mb-6">
                  Ulasan Pengunjung ({curug.reviews.length})
                </h2>
                <div className="space-y-6">
                  {curug.reviews.length > 0 ? (
                    curug.reviews.map((review) => (
                      <ReviewItem key={review.id} review={review} />
                    ))
                  ) : (
                    <p className="text-gray-500 bg-gray-50 p-4 rounded-lg">
                      Belum ada ulasan untuk curug ini.
                    </p>
                  )}
                </div>
                <CreateReviewForm curugId={curug.id} />
              </div>
            </div>

            <aside className="space-y-6 lg:sticky lg:top-24 self-start">
              <Card>
                <CardBody className="bg-blue-50">
                  <h3 className="text-lg font-semibold mb-3">Info Penting</h3>
                  <div className="space-y-2">
                    <p>
                      <strong>Harga Tiket:</strong>{" "}
                      {curug.ticketPrice
                        ? `Rp ${curug.ticketPrice.toLocaleString("id-ID")}`
                        : "Gratis / Tidak ada data"}
                      <SuggestionButton
                        curugId={curug.id}
                        fieldName="ticketPrice"
                        currentValue={curug.ticketPrice}
                        label="Harga Tiket"
                      />
                    </p>
                    <p>
                      <strong>Tingkat Kesulitan:</strong>{" "}
                      {curug.difficulty
                        ? curug.difficulty.charAt(0) +
                          curug.difficulty.slice(1).toLowerCase()
                        : "Tidak ada data"}
                      <SuggestionButton
                        curugId={curug.id}
                        fieldName="difficulty"
                        currentValue={curug.difficulty}
                        label="Tingkat Kesulitan"
                      />
                    </p>
                  </div>
                </CardBody>
              </Card>
              <OpeningHoursDisplay hours={openingHours} curugId={curug.id} />
              {curug.tags.length > 0 && (
                <Card>
                  <CardBody className="bg-blue-50">
                    <h3 className="text-lg font-semibold mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {curug.tags.map((tag) => (
                        <Chip key={tag}>{tag}</Chip>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              )}
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
