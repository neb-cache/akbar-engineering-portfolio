"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createContactMessage, updateMessageStatus } from "@/lib/services/contact-messages";
import { contactMessageSchema, messageStatusSchema, type ContactMessageInput } from "@/lib/validation/contact-message";
import { invalidResult, safeError } from "./helpers";
import type { ActionResult } from "@/types/action";

export async function submitContactMessageAction(input: ContactMessageInput): Promise<ActionResult> {
  if (input.website?.trim()) {
    return { success: true, message: "Pesan berhasil dikirim." };
  }
  const parsed = contactMessageSchema.safeParse(input);
  if (!parsed.success) return invalidResult(parsed.error);
  try {
    await createContactMessage(parsed.data);
    revalidatePath("/admin/messages");
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
    console.error("Message status update failed", error);
  }
}
