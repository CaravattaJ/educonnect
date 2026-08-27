import { redirect } from "next/navigation";
import type { Session } from "next-auth";

import { auth } from "@/lib/auth/config";

export async function requireSession(): Promise<Session> {
  const session = await auth();
  if (!session?.user) {
    redirect("/connexion");
  }
  return session;
}

export async function requireRole(role: "ORGANISATEUR" | "ADMIN"): Promise<Session> {
  const session = await requireSession();
  if (session.user.role !== role) {
    redirect("/");
  }
  return session;
}
