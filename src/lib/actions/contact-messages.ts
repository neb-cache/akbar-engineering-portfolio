"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createContactMessage, updateMessageStatus } from "@/lib/services/contact-messages";
import { allowContactSubmission, isDuplicateContact } from "@/lib/contact/protection";
import { sendContactNotification } from "@/lib/contact/notification";
import { logServerEvent } from "@/lib/observability/logger";
import { contactMessageSchema, messageStatusSchema, type ContactMessageInput } from "@/lib/validation/contact-message";
import { invalidResult, safeError } from "./helpers";
import type { ActionResult } from "@/types/action";

export async function submitContactMessageAction(input: ContactMessageInput): Promise<ActionResult> {
  if (input.website?.trim()) {
    return { success: true, message: "Pesan berhasil dikirim." };
  }
  if (!(await allowContactSubmission())) {
    return {
      success: false,
      message: "Terlalu banyak percobaan. Tunggu beberapa menit lalu coba lagi.",
    };
  }
  const parsed = contactMessageSchema.safeParse(input);
  if (!parsed.success) return invalidResult(parsed.error);
  if (await isDuplicateContact(parsed.data)) {
    return { success: true, message: "Pesan sudah diterima." };
  }
  try {
    await createContactMessage(parsed.data);
    revalidatePath("/admin/messages");
    const notification = await sendContactNotification(parsed.data);
    logServerEvent("info", {
      category: "contact",
      action: "message_persisted",
      detail: {
        notificationConfigured: notification.configured,
        notificationSent: notification.sent,
      },
    });
    return { success: true, message: "Pesan berhasil dikirim." };
  } catch (error) {
    return safeError("Pesan gagal dikirim.", error);
  }
}

export async function updateMessageStatusAction(id: string, status: string) {
  await requireAdmin();
  const parsed = messageStatusSchema.safeParse(status);
  if (!parsed.success) return;
  try {
    await updateMessageStatus(id, parsed.data);
    revalidatePath("/admin/messages");
  } catch (error) {
    logServerEvent("error", {
      category: "contact",
      action: "message_status_update_failed",
      error,
    });
  }
}
