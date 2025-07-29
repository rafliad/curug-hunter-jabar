import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // Import dari "gudang" kita

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
