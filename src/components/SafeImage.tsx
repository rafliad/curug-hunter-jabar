"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";

const isValidUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch (_e) {
    return url.startsWith("/");
  }
};

export default function SafeImage(props: ImageProps) {
  const [error, setError] = useState(false);

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
      onError={() => {
        setError(true);
      }}
    />
  );
}
