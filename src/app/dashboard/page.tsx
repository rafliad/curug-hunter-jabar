"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import Link from "next/link";
import axios from "axios";

type Curug = {
  id: string;
  name: string;
  location: string;
};

export default function DashboardPage() {
  const [curugList, setCurugList] = useState<Curug[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurugData = async () => {
    try {
      const response = await axios.get("/api/curug");
      setCurugList(response.data);
    } catch (error) {
      console.error("Gagal mengambil data curug:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurugData();
  }, []);

  const handleDelete = async (curugId: string) => {
    // Tambahkan konfirmasi sebelum menghapus
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        await axios.delete(`/api/curug/${curugId}`);
        // Refresh data setelah berhasil menghapus
        fetchCurugData();
      } catch (error) {
        console.error("Gagal menghapus data:", error);
      }
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard - Data Curug</h1>
        <Button color="primary" as={Link} href="/dashboard/add">
          Tambah Curug Baru
        </Button>
      </div>
      <div className="bg-white shadow rounded-lg">
        <ul role="list" className="divide-y divide-gray-200">
          {curugList.map((curug) => (
            <li
              key={curug.id}
              className="px-6 py-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-lg">{curug.name}</p>
                <p className="text-gray-500">{curug.location}</p>
              </div>
              <div className="flex gap-4">
                {/* Tombol Edit sekarang menjadi Link */}
                <Button
                  as={Link}
                  href={`/dashboard/edit/${curug.id}`}
                  color="secondary"
                  size="sm"
                >
                  Edit
                </Button>
                {/* Tombol Delete sekarang memanggil fungsi handleDelete */}
                <Button
                  onClick={() => handleDelete(curug.id)}
                  color="danger"
                  size="sm"
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
