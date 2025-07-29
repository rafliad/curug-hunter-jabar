"use client";

import { HeroUIProvider } from "@heroui/react";
import AuthProvider from "./auth-provider";
import ReduxProvider from "./redux-provider";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ReduxProvider>
        <HeroUIProvider>
          {children}
          <Toaster />
        </HeroUIProvider>
      </ReduxProvider>
    </AuthProvider>
  );
}
