"use client";

import { useEffect } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { Input, Textarea } from "@heroui/react";
import { Button } from "@heroui/button";
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

  useEffect(() => {
    if (curugId) {
      axios.get(`/api/curug/${curugId}`).then((response) => {
        const { name, location, description, imageUrl } = response.data;
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
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium leading-6 text-white-900"
          >
            Nama Curug
          </label>
          <div className="mt-2">
            <Input id="name" {...register("name")} variant="bordered" />
          </div>
        </div>
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium leading-6 text-white-900"
          >
            Lokasi
          </label>
          <div className="mt-2">
            <Input id="location" {...register("location")} variant="bordered" />
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
              id="description"
              {...register("description")}
              variant="bordered"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="imageUrl"
            className="block text-sm font-medium leading-6 text-white-900"
          >
            URL Gambar
          </label>
          <div className="mt-2">
            <Input id="imageUrl" {...register("imageUrl")} variant="bordered" />
          </div>
        </div>
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
