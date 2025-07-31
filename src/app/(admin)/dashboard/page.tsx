"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCurugId, setSelectedCurugId] = useState<string | null>(null);

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

  const openDeleteModal = (curugId: string) => {
    setSelectedCurugId(curugId);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedCurugId(null);
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (!selectedCurugId) return;

    try {
      await axios.delete(`/api/curug/${selectedCurugId}`);
      fetchCurugData();
    } catch (error) {
      console.error("Gagal menghapus data:", error);
    } finally {
      closeDeleteModal();
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard - Data Curug</h1>
          <Button color="primary" as={Link} href="/dashboard/add">
            Tambah Curug Baru
          </Button>
        </div>
        <div className="bg-blue-50 shadow rounded-lg">
          <ul role="list" className="divide-y divide-gray-200">
            {curugList.map((curug) => (
              <li
                key={curug.id}
                className="px-6 py-4 flex justify-between items-center"
              >
                <div>
                  <Link href={`/curug/${curug.id}`} className="hover:underline">
                    <p className="font-semibold text-lg text-black">
                      {curug.name}
                    </p>
                  </Link>
                  <p className="text-gray-500">{curug.location}</p>
                </div>
                <div className="flex gap-4">
                  <Button
                    as={Link}
                    href={`/dashboard/edit/${curug.id}`}
                    color="secondary"
                    size="sm"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => openDeleteModal(curug.id)}
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

      <Modal isOpen={isModalOpen} onOpenChange={closeDeleteModal}>
        <ModalContent>
          <ModalHeader>Konfirmasi Penghapusan</ModalHeader>
          <ModalBody>
            <p>
              Apakah Anda yakin ingin menghapus data ini secara permanen?
              Tindakan ini tidak dapat dibatalkan.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={closeDeleteModal}>
              Batal
            </Button>
            <Button color="danger" onClick={handleDelete}>
              Ya, Hapus
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
