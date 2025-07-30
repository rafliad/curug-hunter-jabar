import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-slate-900 text-white p-6 shrink-0">
        <h2 className="text-lg font-semibold mb-4">Admin Menu</h2>
        <nav className="space-y-2">
          <Link
            href="/dashboard"
            className="block py-2 px-4 rounded hover:bg-slate-700 transition-colors"
          >
            Data Curug
          </Link>
          <Link
            href="/dashboard/suggestions"
            className="block py-2 px-4 rounded hover:bg-slate-700 transition-colors"
          >
            Saran Pengguna
          </Link>
        </nav>
      </aside>
      <main className="flex-1 bg-gray-100 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
