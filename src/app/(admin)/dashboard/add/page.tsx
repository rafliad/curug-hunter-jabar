"use client";

import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { Button, Input, Textarea } from "@heroui/react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AddCurugPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<FieldValues>();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      await axios.post("/api/curug", data);
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Gagal menambah data:", error);
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Tambah Data Curug Baru</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          isRequired
          {...register("name", { required: true })}
          label="Nama Curug"
          variant="flat"
        />
        <Input
          isRequired
          {...register("location", { required: true })}
          label="Lokasi (Contoh: Kab. Bandung Barat)"
          variant="flat"
        />
        <Textarea
          isRequired
          {...register("description", { required: true })}
          label="Deskripsi"
          variant="flat"
        />
        <Input
          {...register("imageUrl")}
          label="URL Gambar (Opsional)"
          variant="flat"
        />
        <div className="flex gap-4 pt-4">
          <Button type="submit" color="primary">
            Simpan
          </Button>
          <Button type="button" onClick={() => router.back()} color="secondary">
            Batal
          </Button>
        </div>
      </form>
    </div>
  );
}
