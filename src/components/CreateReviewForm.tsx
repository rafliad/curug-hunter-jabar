"use client";

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
  const { data: session, status } = useSession();
  const { register, handleSubmit, reset } = useForm<FieldValues>();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      await axios.post("/api/reviews", { ...data, curugId });
      reset();
      router.refresh();
    } catch (error) {
      console.error("Gagal mengirim ulasan:", error);
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return (
      <p className="text-center p-4 bg-amber-950 rounded-lg">
        Silakan login untuk memberikan ulasan.
      </p>
    );
  }

  return (
    <div className="mt-8 p-4 border-t">
      <h3 className="text-xl font-bold mb-4">Tulis Ulasan Anda</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Textarea
          {...register("content", { required: true })}
          label="Ulasan Anda"
          variant="flat"
        />
        <Input
          {...register("rating", { required: true, min: 1, max: 5 })}
          label="Rating (1-5)"
          type="number"
          variant="flat"
        />
        <Button type="submit" color="primary">
          Kirim Ulasan
        </Button>
      </form>
    </div>
  );
}
