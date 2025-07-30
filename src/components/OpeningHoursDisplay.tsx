"use client";

import { useState } from "react";
import { Card, CardBody, Button } from "@heroui/react";
import { useSession } from "next-auth/react";
import SuggestionModalOpeningHours from "./SuggestionModalOpeningHours";

type OpeningHours = { [key: string]: string };

type OpeningHoursDisplayProps = {
  hours: OpeningHours | null | undefined;
  curugId: string; // Tambahkan prop curugId
};

export default function OpeningHoursDisplay({
  hours,
  curugId,
}: OpeningHoursDisplayProps) {
  const { status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!hours) return null;

  const daysOrder = [
    "senin",
    "selasa",
    "rabu",
    "kamis",
    "jumat",
    "sabtu",
    "minggu",
  ];
  const todayIndex = (new Date().getDay() + 6) % 7;
  const todayName = daysOrder[todayIndex];

  return (
    <>
      <Card>
        <CardBody>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Jam Operasional</h3>
            {status === "authenticated" && (
              <Button
                variant="light"
                size="sm"
                onClick={() => setIsModalOpen(true)}
                className="text-xs"
              >
                Sarankan Perubahan
              </Button>
            )}
          </div>
          <ul className="space-y-1 text-gray-600">
            {daysOrder.map((day) => (
              <li
                key={day}
                className={`flex justify-between ${day === todayName ? "font-bold text-blue-600" : ""}`}
              >
                <span>{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                <span>{hours[day] || "Tutup"}</span>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      {status === "authenticated" && (
        <SuggestionModalOpeningHours
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          curugId={curugId}
          currentHours={hours}
        />
      )}
    </>
  );
}
