import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers"; // Import providers

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Curug Hunter Jabar",
  description: "Jelajahi keindahan curug tersembunyi di Jawa Barat",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>{" "}
        {/* Bungkus children dengan Providers */}
      </body>
    </html>
  );
}
