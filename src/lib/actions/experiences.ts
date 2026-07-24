"use server";

import { revalidatePath, updateTag } from "next/cache";
import { publicCacheTags } from "@/lib/public/cache";
import { requireAdmin } from "@/lib/auth";
import { createExperience, deleteExperience, updateExperience } from "@/lib/services/experiences";
import { experienceSchema, type ExperienceInput } from "@/lib/validation/experience";
import { invalidResult, safeError } from "./helpers";
import type { ActionResult } from "@/types/action";
import { logServerEvent } from "@/lib/observability/logger";

export async function saveExperienceAction(id: string | null, input: ExperienceInput): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const parsed = experienceSchema.safeParse(input);
  if (!parsed.success) return invalidResult(parsed.error);
  try {
    const experienceId = id ? (await updateExperience(id, parsed.data), id) : await createExperience(parsed.data);
    revalidatePath("/admin/experiences");
    revalidatePath("/");
    updateTag(publicCacheTags.experiences);
    return { success: true, data: { id: experienceId }, message: "Pengalaman berhasil disimpan." };
  } catch (error) {
    return safeError("Pengalaman gagal disimpan.", error);
  }
}

export async function deleteExperienceAction(id: string) {
  await requireAdmin();
  try {
    await deleteExperience(id);
    revalidatePath("/admin/experiences");
    updateTag(publicCacheTags.experiences);
  } catch (error) {
    logServerEvent("error", {
      category: "database",
      action: "experience_delete_failed",
      error,
    });
  }
}
