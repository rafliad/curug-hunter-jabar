import prisma from "@/lib/prisma";

export const normalize = (location: string): string => {
  if (!location) return "";
  return location
    .trim()
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export async function checkOwnership(reviewId: string, userId: string) {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });
  return review?.authorId === userId;
}
