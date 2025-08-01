"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@heroui/react";
import SafeImage from "./SafeImage";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="bg-blue-50 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
            >
              Curug Hunter
            </Link>
          </div>
          <div className="flex items-center">
            <div className="ml-4 flex items-center md:ml-6">
              {status === "loading" ? (
                <div className="w-24 h-10 bg-gray-200 animate-pulse rounded-full" />
              ) : session ? (
                <div className="flex items-center gap-4">
                  <Link href="/profile" title="Lihat Profil">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer ring-2 ring-offset-2 ring-transparent hover:ring-blue-500 transition-all">
                      {session.user?.image ? (
                        <SafeImage
                          src={session.user.image}
                          alt={session.user.name || "Profile Picture"}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <span className="text-lg font-bold text-gray-500">
                          {session.user?.name?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </Link>
                  <Button
                    color="danger"
                    size="sm"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button as={Link} href="/auth" color="primary" size="sm">
                  Login / Register
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
