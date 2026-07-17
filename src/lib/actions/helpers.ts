import type { ZodError } from "zod";
import type { ActionResult } from "@/types/action";

export function invalidResult(error: ZodError): ActionResult<never> {
  return {
    success: false,
    message: "Periksa kembali data yang dimasukkan.",
    fieldErrors: error.flatten().fieldErrors as Record<string, string[]>,
  };
}

export function safeError(message: string, error: unknown): ActionResult<never> {
  console.error(message, error);
  return { success: false, message };
}
