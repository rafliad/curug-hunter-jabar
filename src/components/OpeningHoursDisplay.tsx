"use client";
import { Card, CardBody } from "@heroui/react";

type OpeningHours = {
  [key: string]: string;
};

type OpeningHoursDisplayProps = {
  hours: OpeningHours | null | undefined;
};

export default function OpeningHoursDisplay({
  hours,
}: OpeningHoursDisplayProps) {
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
  const todayIndex = (new Date().getDay() + 6) % 7; // Senin = 0, Minggu = 6
  const todayName = daysOrder[todayIndex];

  return (
    <Card>
      <CardBody>
        <h3 className="text-lg font-semibold mb-3">Jam Operasional</h3>
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
        {hours.catatan && (
          <p className="text-xs text-gray-500 mt-3 pt-3 border-t">
            {hours.catatan}
          </p>
        )}
      </CardBody>
    </Card>
  );
}
