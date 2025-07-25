"use client";

import { useEffect, useState } from "react"; // Tambahkan useState
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { Button, Input, Textarea } from "@heroui/react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";

export default function EditCurugPage() {
  const router = useRouter();
  const params = useParams();
  const curugId = params.curugId as string;

  // State baru untuk loading data form
  const [isFormLoading, setIsFormLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      location: "",
      description: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (curugId) {
      setIsFormLoading(true); // Mulai loading
      axios
        .get(`/api/curug/${curugId}`)
        .then((response) => {
          reset(response.data); // Isi form dengan data
        })
        .finally(() => {
          setIsFormLoading(false); // Selesai loading
        });
    }
  }, [curugId, reset]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      await axios.patch(`/api/curug/${curugId}`, data);
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Gagal update data:", error);
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Data Curug</h1>
      {isFormLoading ? (
        <p>Loading form...</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input {...register("name")} label="Nama Curug" variant="flat" />
          <Input {...register("location")} label="Lokasi" variant="flat" />
          <Textarea
            {...register("description")}
            label="Deskripsi"
            variant="flat"
          />
          <Input {...register("imageUrl")} label="URL Gambar" variant="flat" />
          <div className="flex gap-4 pt-4">
            <Button type="submit" color="primary" disabled={isSubmitting}>
              Update
            </Button>
            <Button
              type="button"
              onClick={() => router.back()}
              color="secondary"
            >
              Batal
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
