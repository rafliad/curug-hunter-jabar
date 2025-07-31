import { UserRole } from "@prisma/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Mendefinisikan ulang tipe Session untuk menyertakan properti 'role'.
   */
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  /**
   * Mendefinisikan ulang tipe User untuk menyertakan properti 'role'.
   */
  interface User {
    role: UserRole;
  }
}
