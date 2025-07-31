"use client";

import { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Input,
  Checkbox,
  Select,
  SelectItem,
} from "@heroui/react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { normalize } from "@/lib/utils/formatters";

type SuggestionButtonProps = {
  curugId: string;
  fieldName: string;
  currentValue: string | number | null | undefined;
  label: string;
};

export default function SuggestionButton({
  curugId,
  fieldName,
  currentValue,
  label,
}: SuggestionButtonProps) {
  const { status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [isNegative, setIsNegative] = useState(false);

  const handlePriceChange = (val: string) => {
    const num = Number(val);
    if (val === "") {
      setIsNegative(false);
      setNewValue(val);
      return;
    }

    // Kalau angka valid tapi negatif
    if (!isNaN(num) && num < 0) {
      setIsNegative(true);
    } else {
      setIsNegative(false);
      setNewValue(val);
    }
  };

  const handleFreeChange = (checked: boolean) => {
    setIsFree(checked);
    setNewValue(checked ? "0" : "");
  };

  const handleSubmit = async () => {
    if (!isFree && !newValue.trim()) {
      toast.error("Silakan masukkan nilai baru.");
      return;
    }

    const toastId = toast.loading("Mengirim saran...");
    try {
      await axios.post("/api/suggestions", {
        curugId,
        fieldName,
        oldValue: String(currentValue || ""),
        newValue: isFree ? "0" : newValue,
      });
      toast.success("Terima kasih! Saran Anda telah terkirim.", {
        id: toastId,
      });
      setIsOpen(false);
      setNewValue("");
      setIsFree(false);
    } catch (_error) {
      toast.error("Gagal mengirim saran.", { id: toastId });
    }
  };

  if (status !== "authenticated") return null;

  // Fungsi untuk merender input yang sesuai
  const renderInput = () => {
    switch (fieldName) {
      case "ticketPrice":
        return (
          <div className="space-y-4">
            <Input
              label={`Masukkan ${label} yang baru`}
              value={newValue}
              onValueChange={handlePriceChange}
              variant="bordered"
              type="number"
              disabled={isFree}
              isInvalid={isNegative}
              color={isNegative ? "danger" : "default"}
              errorMessage={isNegative ? "Harga tidak boleh di bawah 0" : ""}
            />
            <Checkbox isSelected={isFree} onValueChange={handleFreeChange}>
              Gratis
            </Checkbox>
          </div>
        );
      case "difficulty":
        return (
          <Select
            label="Pilih Tingkat Kesulitan Baru"
            selectedKeys={[newValue]}
            onSelectionChange={(keys) =>
              setNewValue(Array.from(keys)[0] as string)
            }
            variant="bordered"
          >
            <SelectItem key="MUDAH">Mudah</SelectItem>
            <SelectItem key="SEDANG">Sedang</SelectItem>
            <SelectItem key="SULIT">Sulit</SelectItem>
          </Select>
        );
      default:
        return (
          <Input
            label={`Masukkan ${label} yang baru`}
            value={newValue}
            onValueChange={setNewValue}
            variant="bordered"
          />
        );
    }
  };

  return (
    <>
      <Button
        size="sm"
        variant="light"
        onClick={() => setIsOpen(true)}
        className="ml-2 text-xs"
      >
        Sarankan Perubahan
      </Button>

      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <ModalContent>
          <ModalHeader>Sarankan Perubahan untuk {label}</ModalHeader>
          <ModalBody>
            <p className="text-sm mb-1">
              Nilai saat ini:{" "}
              <strong>
                {normalize(String(currentValue || "Tidak ada data"))}
              </strong>
            </p>
            {renderInput()}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setIsOpen(false)}>
              Batal
            </Button>
            <Button color="primary" onClick={handleSubmit}>
              Kirim Saran
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
