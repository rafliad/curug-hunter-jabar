"use client";

import { useEffect, useState } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { Button, Input, Textarea, Select, SelectItem } from "@heroui/react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import SafeImage from "@/components/SafeImage";

export default function EditCurugPage() {
  const router = useRouter();
  const params = useParams();
  const curugId = params.curugId as string;

  const [isFormLoading, setIsFormLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, watch, getValues } =
    useForm<FieldValues>();

  const currentImageUrl = watch("imageUrl");

  const days = ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu"];

  useEffect(() => {
    if (curugId) {
      setIsFormLoading(true);
      axios
        .get(`/api/curug/${curugId}`)
        .then((response) => {
          const data = response.data;
          if (data.tags && Array.isArray(data.tags)) {
            data.tags = data.tags.join(", ");
          }
          reset(data);
        })
        .finally(() => setIsFormLoading(false));
    }
  }, [curugId, reset]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsSubmitting(true);
    const oldImageUrl = getValues("imageUrl");
    let newImageUrl = data.imageUrl;

    // Jika ada file baru yang diupload, proses upload terlebih dahulu
    if (imageFile) {
      const uploadToastId = toast.loading("Mengupload gambar baru...");
      try {
        const response = await fetch(`/api/upload?filename=${imageFile.name}`, {
          method: "POST",
          body: imageFile,
        });
        const newBlob = await response.json();
        newImageUrl = newBlob.url;
        toast.success("Gambar berhasil diupload!", { id: uploadToastId });
      } catch (error) {
        console.error("Gagal mengupload gambar:", error);
        toast.error("Gagal mengupload gambar.", { id: uploadToastId });
        setIsSubmitting(false);
        return;
      }
    }

    const saveToastId = toast.loading("Memperbarui data curug...");
    try {
      // Update database dengan URL gambar yang baru
      await axios.patch(`/api/curug/${curugId}`, {
        ...data,
        imageUrl: newImageUrl,
      });
      toast.success("Data berhasil diperbarui!", { id: saveToastId });

      // Jika gambar berubah dan gambar lama ada di Vercel Blob, hapus gambar lama
      if (
        oldImageUrl &&
        oldImageUrl !== newImageUrl &&
        oldImageUrl.includes("blob.vercel-storage.com")
      ) {
        console.log(`Menghapus gambar lama: ${oldImageUrl}`);
        await fetch(`/api/upload?url=${encodeURIComponent(oldImageUrl)}`, {
          method: "DELETE",
        });
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Gagal memperbarui data:", error);
      toast.error("Gagal memperbarui data.", { id: saveToastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Data Curug</h1>
      {isFormLoading ? (
        <p>Loading form...</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* ... (input lainnya tetap sama) ... */}
          <Input {...register("name")} label="Nama Curug" variant="flat" />
          <Input {...register("location")} label="Lokasi" variant="flat" />
          <Textarea
            {...register("description")}
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

          {currentImageUrl && (
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Gambar Saat Ini
              </label>
              <div className="mt-2 relative w-full h-48">
                <SafeImage
                  src={currentImageUrl}
                  alt="Pratinjau Gambar"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="imageUpload"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Upload Gambar Baru (Opsional)
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

          <Input
            {...register("imageUrl")}
            label="Atau ganti dengan URL Gambar manual"
            variant="flat"
          />

          <div className="flex gap-4 pt-4">
            <Button type="submit" color="primary" disabled={isSubmitting}>
              {isSubmitting ? "Memperbarui..." : "Update"}
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
