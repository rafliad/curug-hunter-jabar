"use client";

import { HeroUIProvider } from "@heroui/react";
import AuthProvider from "./auth-provider";
import ReduxProvider from "./redux-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ReduxProvider>
        <HeroUIProvider>{children}</HeroUIProvider>
      </ReduxProvider>
    </AuthProvider>
  );
}
