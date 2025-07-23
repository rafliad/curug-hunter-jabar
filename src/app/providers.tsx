"use client";

import { HeroUIProvider } from "@heroui/react";
import AuthProvider from "./auth-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <HeroUIProvider>{children}</HeroUIProvider>
    </AuthProvider>
  );
}
