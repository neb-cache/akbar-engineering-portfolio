import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logServerEvent } from "@/lib/observability/logger";

export async function GET() {
  const timestamp = new Date().toISOString();
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("site_settings").select("id").limit(1);
    if (error) throw error;
    return NextResponse.json(
      { status: "ok", database: "connected", timestamp },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    logServerEvent("error", {
      category: "health",
      action: "database_check_failed",
      route: "/api/health",
      error,
    });
    return NextResponse.json(
      { status: "error", database: "unavailable", timestamp },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
