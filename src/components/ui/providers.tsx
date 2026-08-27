"use client";

import { HeroUIProvider } from "@heroui/react";
import { SessionProvider } from "next-auth/react";
import { type ReactNode, useEffect } from "react";

import { initSentry } from "@/lib/monitoring/sentry";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    initSentry();
  }, []);

  return (
    <HeroUIProvider>
      <SessionProvider>{children}</SessionProvider>
    </HeroUIProvider>
  );
}
