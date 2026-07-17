import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const timestamp = new Date().toISOString();
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("site_settings").select("id").limit(1);
    if (error) throw error;
    return NextResponse.json({ status: "ok", database: "connected", timestamp });
  } catch (error) {
    console.error("Health check failed", error);
    return NextResponse.json({ status: "error", database: "unavailable", timestamp }, { status: 503 });
  }
}
