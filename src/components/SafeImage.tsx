"use client";

import { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";

// Fungsi untuk validasi URL
const isValidUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch (e) {
    // Juga anggap path internal (seperti /placeholder.png) valid
    return url.startsWith("/");
  }
};

export default function SafeImage(props: ImageProps) {
  const [error, setError] = useState(false);

  // 1. Cek validitas URL di awal
  if (!isValidUrl(props.src as string) || error) {
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
        <span className="text-gray-500 text-xs text-center">
          Gambar tidak valid
        </span>
      </div>
    );
  }

  return (
    <Image
      {...props}
      // 2. onError tetap ada sebagai lapisan keamanan kedua (untuk 404, dll)
      onError={() => {
        setError(true);
      }}
    />
  );
}
