import type { UserRole } from "@prisma/client";
import NextAuth, { CredentialsSignin } from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { verifyPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/db/client";
import { loginSchema } from "@/lib/validation/organisateur";

// Erreur distincte de "identifiants invalides" pour permettre à l'écran de connexion
// d'afficher un message adapté (cf. docs/07-securite.md §6 : vérification d'email avant
// activation complète du compte, indépendamment du statut de validation admin).
export class EmailNotVerifiedError extends CredentialsSignin {
  override code = "EmailNotVerified";
}

// Le provider Google n'est ajouté que si les identifiants sont configurés (cf. .env.example) :
// le projet doit pouvoir démarrer en local sans compte Google réel (D14, cf. plan d'E0).
const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/connexion",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      authorize: async (rawCredentials) => {
        const parsed = loginSchema.safeParse(rawCredentials);
        if (!parsed.success) {
          return null;
        }

        const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
        if (!user?.passwordHash) {
          return null;
        }

        const passwordMatches = await verifyPassword(parsed.data.password, user.passwordHash);
        if (!passwordMatches) {
          return null;
        }

        if (!user.emailVerifiedAt) {
          throw new EmailNotVerifiedError();
        }

        return { id: user.id, email: user.email, role: user.role };
      },
    }),
    ...(googleEnabled
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
