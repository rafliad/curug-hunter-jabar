"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Button,
  Textarea,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import SafeImage from "./SafeImage";
import toast from "react-hot-toast";

// Definisikan tipe data yang lebih lengkap
type ReviewWithAuthor = {
  id: string;
  content: string;
  rating: number;
  createdAt: Date;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

type ReviewItemProps = {
  review: ReviewWithAuthor;
};

export default function ReviewItem({ review }: ReviewItemProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(review.content);
  const [editedRating, setEditedRating] = useState(review.rating.toString());
  const [validationError, setValidationError] = useState<string | null>(null);

  // State baru untuk modal delete
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isOwner = session?.user?.id === review.author.id;

  const confirmDelete = async () => {
    const toastId = toast.loading("Menghapus ulasan...");
    try {
      await axios.delete(`/api/reviews/${review.id}`);
      toast.success("Ulasan berhasil dihapus.", { id: toastId });
      router.refresh();
    } catch (error) {
      toast.error("Gagal menghapus ulasan.", { id: toastId });
      console.error("Gagal menghapus ulasan:", error);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handleUpdate = async () => {
    if (!editedContent.trim() || !editedRating.trim()) {
      setValidationError("Ulasan dan rating tidak boleh kosong.");
      return;
    }
    setValidationError(null);

    const toastId = toast.loading("Memperbarui ulasan...");
    try {
      await axios.patch(`/api/reviews/${review.id}`, {
        content: editedContent,
        rating: editedRating,
      });
      toast.success("Ulasan berhasil diperbarui.", { id: toastId });
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast.error("Gagal memperbarui ulasan.", { id: toastId });
      console.error("Gagal mengupdate ulasan:", error);
    }
  };

  return (
    <>
      <div className="bg-blue-50 p-4 rounded-lg shadow">
        {/* ... (bagian info penulis tetap sama) ... */}
        <div className="flex items-center mb-2">
          <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center overflow-hidden">
            {review.author.image ? (
              <SafeImage
                src={review.author.image}
                alt={review.author.name || "User"}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <span className="text-lg font-bold text-gray-500">
                {review.author.name?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <p className="font-semibold">{review.author.name}</p>
            <p className="text-xs text-gray-400">
              {new Date(review.createdAt).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4 mt-2">
            <Textarea
              value={editedContent}
              onValueChange={setEditedContent}
              variant="flat"
              label="Ulasan"
            />
            <Input
              value={editedRating}
              onValueChange={setEditedRating}
              type="number"
              variant="flat"
              label="Rating (1-5)"
            />
            {validationError && (
              <p className="text-sm text-red-500">{validationError}</p>
            )}
            <div className="flex gap-2">
              <Button onClick={handleUpdate} color="primary" size="sm">
                Simpan
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                color="secondary"
                size="sm"
              >
                Batal
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-gray-800">{review.content}</p>
        )}

        {isOwner && !isEditing && (
          <div className="flex gap-2 mt-2">
            <Button
              onClick={() => setIsEditing(true)}
              color="secondary"
              size="sm"
            >
              Edit
            </Button>
            <Button
              onClick={() => setIsDeleteModalOpen(true)}
              color="danger"
              size="sm"
            >
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Modal Konfirmasi Delete */}
      <Modal isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <ModalContent>
          <ModalHeader>Konfirmasi Penghapusan</ModalHeader>
          <ModalBody>
            <p>Apakah Anda yakin ingin menghapus ulasan ini secara permanen?</p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Batal
            </Button>
            <Button color="danger" onClick={confirmDelete}>
              Ya, Hapus
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
