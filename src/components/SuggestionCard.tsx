"use client";

import { useState } from "react";
import { Card, CardBody, CardFooter, Button, Chip } from "@heroui/react";
import axios from "axios";
import toast from "react-hot-toast";

type Suggestion = {
  id: string;
  fieldName: string;
  oldValue: string | null;
  newValue: string;
  curug: { id: string; name: string };
  suggestedBy: { name: string | null };
};

export default function SuggestionCard({
  suggestion,
}: {
  suggestion: Suggestion;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isHandled, setIsHandled] = useState(false);

  const handleAction = async (status: "APPROVED" | "REJECTED") => {
    setIsLoading(true);
    const toastId = toast.loading(`Memproses saran...`);
    try {
      await axios.patch(`/api/suggestions/${suggestion.id}`, {
        status,
        fieldName: suggestion.fieldName,
        newValue: suggestion.newValue,
        curugId: suggestion.curug.id,
      });
      toast.success(
        `Saran telah di-${status === "APPROVED" ? "setujui" : "tolak"}.`,
        { id: toastId }
      );
      setIsHandled(true);
    } catch (_error) {
      toast.error("Gagal memproses saran.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  if (isHandled) {
    return null;
  }

  return (
    <Card className="shadow-md">
      <CardBody>
        <p className="text-sm text-gray-500">
          Saran untuk <span className="font-bold">{suggestion.curug.name}</span>
        </p>
        <p className="text-sm text-gray-500">
          Dari:{" "}
          <span className="font-semibold">{suggestion.suggestedBy.name}</span>
        </p>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="font-semibold capitalize">
            {suggestion.fieldName.replace(/([A-Z])/g, " $1")}
          </p>
          <div className="flex items-center gap-4 mt-2">
            <Chip color="danger" variant="bordered" size="sm">
              Lama: {suggestion.oldValue || "Kosong"}
            </Chip>
            <span className="font-bold">→</span>
            <Chip color="success" variant="bordered" size="sm">
              Baru: {suggestion.newValue}
            </Chip>
          </div>
        </div>
      </CardBody>
      <CardFooter className="flex justify-end gap-2">
        <Button
          size="sm"
          color="danger"
          variant="light"
          onClick={() => handleAction("REJECTED")}
          disabled={isLoading}
        >
          Tolak
        </Button>
        <Button
          size="sm"
          color="success"
          variant="light"
          onClick={() => handleAction("APPROVED")}
          disabled={isLoading}
        >
          Setujui
        </Button>
      </CardFooter>
    </Card>
  );
}
