"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createExperience, deleteExperience, updateExperience } from "@/lib/services/experiences";
import { experienceSchema, type ExperienceInput } from "@/lib/validation/experience";
import { invalidResult, safeError } from "./helpers";
import type { ActionResult } from "@/types/action";

export async function saveExperienceAction(id: string | null, input: ExperienceInput): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const parsed = experienceSchema.safeParse(input);
  if (!parsed.success) return invalidResult(parsed.error);
  try {
    const experienceId = id ? (await updateExperience(id, parsed.data), id) : await createExperience(parsed.data);
    revalidatePath("/admin/experiences");
    revalidatePath("/");
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
  } catch (error) {
    console.error("Experience deletion failed", error);
  }
}
