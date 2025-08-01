"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";

type WelcomeGuideProps = {
  role: "ADMIN" | "USER";
};

export default function WelcomeGuide({ role }: WelcomeGuideProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 5100);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const isAdmin = role === "ADMIN";
  const title = isAdmin
    ? "Selamat Datang, Admin!"
    : "Selamat Datang di Curug Hunter!";
  const description = isAdmin
    ? "Anda memiliki akses penuh. Jelajahi menu di samping untuk mengelola data curug dan meninjau saran dari komunitas."
    : "Anda sekarang bisa mulai berkontribusi! Jelajahi curug, tulis ulasan, dan bantu kami menjaga data tetap akurat.";

  return (
    <div
      className={`fixed bottom-5 left-10 z-50 w-full max-w-sm transition-all duration-500 ease-in-out ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <Card className="bg-green-50 border-green-200 shadow-2xl">
        <CardHeader>
          <h3 className="text-lg font-semibold text-green-800">{title}</h3>
        </CardHeader>
        <CardBody>
          <p className="text-green-700">{description}</p>
        </CardBody>
      </Card>
    </div>
  );
}
