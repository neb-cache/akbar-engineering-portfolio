import "server-only";

import { createClient } from "@/lib/supabase/server";
import { emptyToNull } from "@/lib/utils";
import type { ContactMessageInput } from "@/lib/validation/contact-message";
import type { ContactMessageStatus } from "@/types/database";
import type { ContactMessage } from "@/types/contact-message";

export async function getContactMessages(status?: ContactMessageStatus) {
  const supabase = await createClient();
  let query = supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as ContactMessage[];
}

export async function getContactMessageById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("contact_messages").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as ContactMessage | null;
}

export async function updateMessageStatus(id: string, status: ContactMessageStatus) {
  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function getNewMessageCount() {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("contact_messages")
    .select("id", { count: "exact", head: true })
    .eq("status", "new");
  if (error) throw error;
  return count ?? 0;
}

export async function createContactMessage(input: ContactMessageInput) {
  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({
    name: input.name,
    email: input.email,
    company: emptyToNull(input.company),
    subject: input.subject,
    message: input.message,
    status: "new",
    source: "portfolio",
  });
  if (error) throw error;
}
