"use client";

import { useState } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { Button, Input, Textarea, Select, SelectItem } from "@heroui/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AddCurugPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<FieldValues>();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsUploading(true);
    let imageUrl = data.imageUrl;

    if (imageFile) {
      const toastId = toast.loading("Mengupload gambar...");
      try {
        const response = await fetch(`/api/upload?filename=${imageFile.name}`, {
          method: "POST",
          body: imageFile,
        });
        const newBlob = await response.json();
        imageUrl = newBlob.url;
        toast.success("Gambar berhasil diupload!", { id: toastId });
      } catch (error) {
        console.error("Gagal mengupload gambar:", error);
        toast.error("Gagal mengupload gambar.", { id: toastId });
        setIsUploading(false);
        return;
      }
    }

    const toastId = toast.loading("Menyimpan data curug...");
    try {
      await axios.post("/api/curug", { ...data, imageUrl });
      toast.success("Data berhasil disimpan!", { id: toastId });
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Gagal menambah data:", error);
      toast.error("Gagal menyimpan data.", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };
  const days = ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu"];

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Tambah Data Curug Baru</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          {...register("name", { required: true })}
          label="Nama Curug"
          variant="flat"
        />
        <Input
          {...register("location", { required: true })}
          label="Lokasi"
          variant="flat"
        />
        <Textarea
          {...register("description", { required: true })}
          label="Deskripsi"
          variant="flat"
        />
        <Input
          {...register("ticketPrice")}
          label="Harga Tiket (cth: 15000)"
          type="number"
          variant="flat"
        />
        <fieldset className="border p-4 rounded-md">
          <legend className="text-sm font-medium text-gray-900 px-1">
            Jam Buka
          </legend>
          <div className="space-y-4 mt-2">
            {days.map((day) => (
              <Input
                key={day}
                {...register(`openingHours.${day}`)}
                label={day.charAt(0).toUpperCase() + day.slice(1)}
                placeholder="cth: 08:00 - 17:00 atau Tutup"
                variant="flat"
              />
            ))}
            <Input
              {...register("openingHours.catatan")}
              label="Catatan Tambahan"
              variant="flat"
            />
          </div>
        </fieldset>
        <Select
          {...register("difficulty")}
          label="Tingkat Kesulitan"
          variant="flat"
        >
          <SelectItem key="MUDAH">Mudah</SelectItem>
          <SelectItem key="SEDANG">Sedang</SelectItem>
          <SelectItem key="SULIT">Sulit</SelectItem>
        </Select>
        <Input
          {...register("tags")}
          label="Tags (pisahkan dengan koma, cth: Ramah Anak, Spot Foto)"
          variant="flat"
        />

        <div>
          <label
            htmlFor="imageUpload"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Upload Gambar
          </label>
          <div className="mt-2">
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        <div className="relative flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500">atau</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <Input
          {...register("imageUrl")}
          label="Masukkan URL Gambar manual"
          variant="flat"
        />

        <div className="flex gap-4 pt-4">
          <Button type="submit" color="primary" disabled={isUploading}>
            {isUploading ? "Menyimpan..." : "Simpan"}
          </Button>
          <Button type="button" onClick={() => router.back()} color="secondary">
            Batal
          </Button>
        </div>
      </form>
    </div>
  );
}
