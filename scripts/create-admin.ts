/**
 * Script CLI interactif pour créer le tout premier compte Admin (ou un compte Admin
 * supplémentaire), sans passer par l'auto-inscription publique (cf. docs/09-backlog.md E1).
 * Usage : pnpm create-admin
 */
import readline from "node:readline";

import { hashPassword } from "../src/lib/auth/password";
import { prisma } from "../src/lib/db/client";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
// Saisie masquée : on intercepte l'écriture sur stdout pour remplacer les caractères tapés
// par des astérisques, uniquement pendant les questions de mot de passe.
let masking = false;
const anyRl = rl as unknown as { _writeToOutput: (s: string) => void };
anyRl._writeToOutput = (stringToWrite: string) => {
  if (!masking || stringToWrite === "\r\n" || stringToWrite === "\n") {
    process.stdout.write(stringToWrite);
  } else {
    process.stdout.write("*");
  }
};

function ask(question: string): Promise<string> {
  masking = false;
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

function askMasked(question: string): Promise<string> {
  return new Promise((resolve) => {
    masking = true;
    rl.question(question, (answer) => {
      masking = false;
      process.stdout.write("\n");
      resolve(answer);
    });
  });
}

async function main(): Promise<void> {
  console.log("Création d'un compte Administrateur EduConnect\n");

  const email = await ask("Email : ");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.error("Adresse email invalide.");
    process.exitCode = 1;
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.error("Un compte existe déjà avec cette adresse email.");
    process.exitCode = 1;
    return;
  }

  const password = await askMasked("Mot de passe (12 caractères minimum) : ");
  if (password.length < 12) {
    console.error("Le mot de passe doit contenir au moins 12 caractères.");
    process.exitCode = 1;
    return;
  }

  const confirmation = await askMasked("Confirmer le mot de passe : ");
  if (confirmation !== password) {
    console.error("Les mots de passe ne correspondent pas.");
    process.exitCode = 1;
    return;
  }

  const passwordHash = await hashPassword(password);

  await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: "ADMIN",
      accountStatus: "ACTIF",
      emailVerifiedAt: new Date(),
    },
  });

  console.log(`\nCompte Administrateur créé pour ${email}.`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    rl.close();
    void prisma.$disconnect();
  });
