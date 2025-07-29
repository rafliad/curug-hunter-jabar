"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    if (token) {
      axios
        .post("/api/auth/verify-email", { token })
        .then((response) => {
          setStatus(
            "Email Anda telah berhasil diverifikasi! Ulasan Anda sekarang sudah dipublikasikan."
          );
        })
        .catch((error) => {
          setStatus(
            `Verifikasi gagal: ${
              error.response?.data ||
              "Token tidak valid atau sudah kedaluwarsa."
            }`
          );
        });
    } else {
      setStatus("Token verifikasi tidak ditemukan.");
    }
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-8 bg-white shadow-lg rounded-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Status Verifikasi Email</h1>
        <p>{status}</p>
      </div>
    </div>
  );
}
