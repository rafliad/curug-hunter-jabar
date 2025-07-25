"use client";

import { useEffect } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { Button, Input, Textarea } from "@heroui/react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";

export default function EditCurugPage() {
  const router = useRouter();
  const params = useParams();
  const curugId = params.curugId as string;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isLoading },
  } = useForm<FieldValues>();

  // useEffect untuk mengambil data curug saat halaman dimuat
  useEffect(() => {
    if (curugId) {
      axios.get(`/api/curug/${curugId}`).then((response) => {
        const { name, location, description, imageUrl } = response.data;
        // Gunakan setValue untuk mengisi form dengan data yang ada
        setValue("name", name);
        setValue("location", location);
        setValue("description", description);
        setValue("imageUrl", imageUrl);
      });
    }
  }, [curugId, setValue]);

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
          <Button type="submit" color="primary" disabled={isLoading}>
            Update
          </Button>
          <Button type="button" onClick={() => router.back()} color="secondary">
            Batal
          </Button>
        </div>
      </form>
    </div>
  );
}
