import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const verifyAdmin = cache(async () => {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email, role")
    .eq("id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  return profile ? { user, profile } : null;
});

export async function requireAdmin() {
  const admin = await verifyAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
