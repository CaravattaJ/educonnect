import type { ReactNode } from "react";

import { requireRole } from "@/lib/permissions/session";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireRole("ADMIN");

  return (
    <div>
      <nav className="border-b bg-slate-900 px-6 py-4 text-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <span className="font-bold">EduConnect — Administration</span>
          <a href="/inscriptions" className="text-sm">
            Inscriptions en attente
          </a>
        </div>
      </nav>
      <div className="mx-auto max-w-4xl px-6 py-8">{children}</div>
    </div>
  );
}
