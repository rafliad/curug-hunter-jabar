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
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium leading-6 text-white-900"
          >
            Nama Curug
          </label>
          <div className="mt-2">
            <Input
              isRequired
              id="name"
              {...register("name", { required: true })}
              variant="bordered"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium leading-6 text-white-900"
          >
            Lokasi (Contoh: Kab. Bandung Barat)
          </label>
          <div className="mt-2">
            <Input
              isRequired
              id="location"
              {...register("location", { required: true })}
              variant="bordered"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium leading-6 text-white-900"
          >
            Deskripsi
          </label>
          <div className="mt-2">
            <Textarea
              isRequired
              id="description"
              {...register("description", { required: true })}
              variant="bordered"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="imageUrl"
            className="block text-sm font-medium leading-6 text-white-900"
          >
            URL Gambar (Opsional)
          </label>
          <div className="mt-2">
            <Input id="imageUrl" {...register("imageUrl")} variant="bordered" />
          </div>
        </div>

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
