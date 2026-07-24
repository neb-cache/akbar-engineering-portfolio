"use server";

import { revalidatePath, updateTag } from "next/cache";
import { publicCacheTags } from "@/lib/public/cache";
import { requireAdmin } from "@/lib/auth";
import { createSkill, deleteSkill, updateSkill } from "@/lib/services/skills";
import { skillSchema, type SkillInput } from "@/lib/validation/skill";
import { invalidResult, safeError } from "./helpers";
import type { ActionResult } from "@/types/action";
import { logServerEvent } from "@/lib/observability/logger";

export async function saveSkillAction(id: string | null, input: SkillInput): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const parsed = skillSchema.safeParse(input);
  if (!parsed.success) return invalidResult(parsed.error);
  try {
    const skillId = id ? (await updateSkill(id, parsed.data), id) : await createSkill(parsed.data);
    revalidatePath("/admin/skills");
    revalidatePath("/");
    updateTag(publicCacheTags.skills);
    return { success: true, data: { id: skillId }, message: "Skill berhasil disimpan." };
  } catch (error) {
    return safeError("Skill gagal disimpan.", error);
  }
}

export async function deleteSkillAction(id: string) {
  await requireAdmin();
  try {
    await deleteSkill(id);
    revalidatePath("/admin/skills");
    updateTag(publicCacheTags.skills);
  } catch (error) {
    logServerEvent("error", {
      category: "database",
      action: "skill_delete_failed",
      error,
    });
  }
}
