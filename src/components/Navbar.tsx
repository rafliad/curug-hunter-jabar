"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@heroui/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link
              href="/dashboard"
              className="text-2xl font-bold text-gray-800"
            >
              Curug Hunter
            </Link>
          </div>
          <div className="flex items-center">
            <div className="ml-4 flex items-center md:ml-6">
              {status === "loading" ? (
                <p>Loading...</p>
              ) : session ? (
                <>
                  <span className="mr-4 text-gray-700">
                    Halo, {session.user?.name}
                  </span>
                  <Button
                    color="danger"
                    size="sm"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button as={Link} href="/" color="primary" size="sm">
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
