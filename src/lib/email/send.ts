import { Resend } from "resend";

interface EmailMessage {
  to: string;
  subject: string;
  text: string;
}

// Intégration email conditionnelle (cf. plan d'implémentation d'E0/E1) : si RESEND_API_KEY est
// absent (développement local sans compte Resend réel), l'email est simplement journalisé en
// console au lieu d'être envoyé — jamais une erreur au démarrage ni à l'envoi.
export async function sendEmail(message: EmailMessage): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log(
      `[email:local] À: ${message.to} | Sujet: ${message.subject}\n${message.text}`,
    );
    return;
  }

  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM_EMAIL ?? "EduConnect <no-reply@educonnect.fr>";

  await resend.emails.send({
    from,
    to: message.to,
    subject: message.subject,
    text: message.text,
  });
}
