"use client";

import { useState, useMemo } from "react"; // Import useState
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { Button, Textarea, Input } from "@heroui/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type CreateReviewFormProps = {
  curugId: string;
};

export default function CreateReviewForm({ curugId }: CreateReviewFormProps) {
  const router = useRouter();
  const { status } = useSession();
  const { register, handleSubmit, reset } = useForm<FieldValues>();
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [rateValue, setRateValue] = useState("");
  const isInvalid = useMemo(() => {
    if (rateValue == "") return false;
    const num = Number(rateValue);
    return !(num >= 1 && num <= 5);
  }, [rateValue]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const response = await axios.post("/api/reviews", { ...data, curugId });
      reset();
      router.refresh();

      if (response.data.status === "PENDING") {
        setSubmitMessage(
          "Ulasan Anda telah disimpan! Silakan periksa email Anda untuk verifikasi agar ulasan dapat dipublikasikan."
        );
      } else {
        setSubmitMessage(
          "Terima kasih! Ulasan Anda telah berhasil dipublikasikan."
        );
      }
    } catch (error) {
      console.error("Gagal mengirim ulasan:", error);
      setSubmitMessage("Terjadi kesalahan saat mengirim ulasan.");
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return (
      <p className="text-center p-4 bg-yellow-100 rounded-lg">
        Silakan login untuk memberikan ulasan.
      </p>
    );
  }

  if (submitMessage) {
    return (
      <p className="text-center p-4 bg-green-100 text-green-800 rounded-lg">
        {submitMessage}
      </p>
    );
  }

  return (
    <div className="mt-8 p-4 border-t">
      <h3 className="text-xl font-bold mb-4">Tulis Ulasan Anda</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Textarea
          isRequired
          {...register("content", { required: true })}
          label="Ulasan Anda"
          variant="bordered"
        />
        <Input
          isRequired
          {...register("rating", { required: true, min: 1, max: 5 })}
          label="Rating (1-5)"
          type="number"
          variant="bordered"
          color={isInvalid ? "danger" : "default"}
          errorMessage="Tolong isi angka di antara 1 sampai 5"
          isInvalid={isInvalid}
          value={rateValue}
          onValueChange={setRateValue}
        />
        <Button type="submit" color="primary">
          Kirim Ulasan
        </Button>
      </form>
    </div>
  );
}
