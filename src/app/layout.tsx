import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Providers } from "@/components/ui/providers";

import "./globals.css";

export const metadata: Metadata = {
  title: "EduConnect",
  description: "Annuaire des activités pédagogiques et de leurs intervenants.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
