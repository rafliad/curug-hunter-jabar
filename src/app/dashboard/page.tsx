"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import Link from "next/link";
import axios from "axios";

// Definisikan tipe untuk data curug agar lebih aman
type Curug = {
  id: string;
  name: string;
  location: string;
};

export default function DashboardPage() {
  const [curugList, setCurugList] = useState<Curug[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Gunakan useEffect untuk mengambil data saat komponen pertama kali dimuat
  useEffect(() => {
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

    fetchCurugData();
  }, []);

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
                <Button color="secondary" size="sm">
                  Edit
                </Button>
                <Button color="danger" size="sm">
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
