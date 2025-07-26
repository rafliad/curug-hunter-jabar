import { UserRole } from "@prisma/client";
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Mendefinisikan ulang tipe Session untuk menyertakan properti 'role'.
   */
  interface Session {
    user: {
      id: string;
      role: UserRole; // Tambahkan properti role di sini
    } & DefaultSession["user"]; // Gabungkan dengan tipe user bawaan
  }

  /**
   * Mendefinisikan ulang tipe User untuk menyertakan properti 'role'.
   */
  interface User {
    role: UserRole;
  }
}
