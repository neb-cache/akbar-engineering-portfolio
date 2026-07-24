import "server-only";

import { createHash } from "node:crypto";
import { getContactOperationsEnv } from "@/lib/env";
import { logServerEvent } from "@/lib/observability/logger";
import type { ContactMessageInput } from "@/lib/validation/contact-message";

export async function sendContactNotification(input: ContactMessageInput) {
  const env = getContactOperationsEnv();
  if (
    !env.RESEND_API_KEY ||
    !env.CONTACT_NOTIFICATION_EMAIL ||
    !env.CONTACT_FROM_EMAIL
  ) {
    return { configured: false, sent: false };
  }

  const idempotencyKey = createHash("sha256")
    .update(`${input.email}|${input.subject}|${input.message}`)
    .digest("hex");
  const text = [
    "A new portfolio contact message was saved.",
    "",
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Company: ${input.company || "Not provided"}`,
    `Subject: ${input.subject}`,
    "",
    input.message,
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `portfolio-contact-${idempotencyKey}`,
        "User-Agent": "akbar-engineering-portfolio/1.0",
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: [env.CONTACT_NOTIFICATION_EMAIL],
        reply_to: input.email,
        subject: `[Portfolio] ${input.subject}`,
        text,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(6_000),
    });
    if (!response.ok) throw new Error(`Resend request failed (${response.status}).`);
    return { configured: true, sent: true };
  } catch (error) {
    logServerEvent("error", {
      category: "contact",
      action: "notification_failed_after_persistence",
      error,
    });
    return { configured: true, sent: false };
  }
}
