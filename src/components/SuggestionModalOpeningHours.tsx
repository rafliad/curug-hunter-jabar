"use client";

import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Input,
} from "@heroui/react";
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect } from "react";

type OpeningHours = { [key: string]: string };

type SuggestionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  curugId: string;
  currentHours: OpeningHours | null | undefined;
};

export default function SuggestionModalOpeningHours({
  isOpen,
  onClose,
  curugId,
  currentHours,
}: SuggestionModalProps) {
  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: currentHours || {},
  });

  useEffect(() => {
    if (isOpen) {
      reset(currentHours || {});
    }
  }, [isOpen, currentHours, reset]);

  const days = ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu"];

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const toastId = toast.loading("Mengirim saran...");
    try {
      await axios.post("/api/suggestions", {
        curugId,
        fieldName: "openingHours",
        oldValue: JSON.stringify(currentHours || {}),
        newValue: JSON.stringify(data),
      });
      toast.success("Terima kasih! Saran Anda telah terkirim.", {
        id: toastId,
      });
      onClose();
    } catch (_error) {
      toast.error("Gagal mengirim saran.", { id: toastId });
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>Sarankan Perubahan Jam Operasional</ModalHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <div className="space-y-4">
              {days.map((day) => (
                <Input
                  key={day}
                  {...register(day)}
                  label={day.charAt(0).toUpperCase() + day.slice(1)}
                  variant="bordered"
                />
              ))}
              <Input
                {...register("catatan")}
                label="Catatan Tambahan"
                variant="bordered"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={onClose}>
              Batal
            </Button>
            <Button color="primary" type="submit">
              Kirim Saran
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
