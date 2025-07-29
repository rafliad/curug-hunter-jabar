import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

// Komponen ini akan melindungi semua halaman di dalam folder (admin)
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Ambil sesi di sisi server
  const session = await getServerSession(authOptions);

  // 2. Cek jika tidak ada sesi ATAU role pengguna bukan ADMIN
  if (!session?.user || session.user.role !== "ADMIN") {
    // Jika tidak valid, lempar ke halaman utama
    redirect("/");
  }

  // 3. Jika valid, tampilkan halaman yang diminta
  return <>{children}</>;
}
