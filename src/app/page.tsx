"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { Button } from "@heroui/react";

export default function HomePage() {
  const { data: session, status } = useSession();

  console.log("Data Sesi:", session);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "authenticated") {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Selamat Datang, {session.user?.name}!</h1>
        <p>Anda login sebagai: {session.user?.email}</p>
        <p>Role Anda: {session.user?.role}</p>
        <Image
          src={session.user?.image || ""}
          alt="Foto Profil"
          width={100}
          height={100}
          style={{ borderRadius: "50%" }}
        />

        <br />
        <Button
          color="danger"
          type="button"
          onClick={() => signOut()}
          style={{ marginTop: "10px" }}
        >
          Logout
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Anda Belum Login</h1>
      <p>Silakan login untuk melanjutkan.</p>
      <Button color="primary" type="button" onClick={() => signIn("google")}>
        Login dengan Google
      </Button>
    </div>
  );
}
