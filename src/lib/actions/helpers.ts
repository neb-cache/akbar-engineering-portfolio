import type { ZodError } from "zod";
import type { ActionResult } from "@/types/action";
import { logServerEvent } from "@/lib/observability/logger";

export function invalidResult(error: ZodError): ActionResult<never> {
  return {
    success: false,
    message: "Periksa kembali data yang dimasukkan.",
    fieldErrors: error.flatten().fieldErrors as Record<string, string[]>,
  };
}

export function safeError(message: string, error: unknown): ActionResult<never> {
  logServerEvent("error", {
    category: "database",
    action: "server_action_failed",
    error,
  });
  return { success: false, message };
}
