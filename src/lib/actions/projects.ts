"use server";

import { revalidatePath, updateTag } from "next/cache";
import { publicCacheTags } from "@/lib/public/cache";
import { requireAdmin } from "@/lib/auth";
import { createProject, deleteProject, updateProject } from "@/lib/services/projects";
import { deleteProjectImage, uploadProjectImage } from "@/lib/services/storage";
import { projectSchema, type ProjectInput } from "@/lib/validation/project";
import { invalidResult, safeError } from "./helpers";
import type { ActionResult } from "@/types/action";
import { logServerEvent } from "@/lib/observability/logger";

export async function saveProjectAction(id: string | null, input: ProjectInput): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) return invalidResult(parsed.error);
  try {
    const projectId = id ? (await updateProject(id, parsed.data), id) : await createProject(parsed.data);
    revalidatePath("/admin/projects");
    revalidatePath("/");
    updateTag(publicCacheTags.projects);
    return { success: true, data: { id: projectId }, message: "Proyek berhasil disimpan." };
  } catch (error) {
    const duplicate = typeof error === "object" && error !== null && "code" in error && error.code === "23505";
    if (duplicate) return { success: false, message: "Slug sudah digunakan.", fieldErrors: { slug: ["Slug sudah digunakan."] } };
    return safeError("Proyek gagal disimpan.", error);
  }
}

export async function deleteProjectAction(id: string) {
  await requireAdmin();
  try {
    await deleteProject(id);
    revalidatePath("/admin/projects");
    updateTag(publicCacheTags.projects);
  } catch (error) {
    logServerEvent("error", {
      category: "database",
      action: "project_delete_failed",
      error,
    });
  }
}

export async function uploadProjectImageAction(projectId: string, formData: FormData): Promise<ActionResult<{ publicUrl: string }>> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File)) return { success: false, message: "Pilih file gambar." };
  try {
    const data = await uploadProjectImage(projectId, file);
    return { success: true, data: { publicUrl: data.publicUrl } };
  } catch (error) {
    return safeError("Gambar gagal diunggah. Pastikan format dan ukuran file sesuai.", error);
  }
}

export async function deleteProjectImageAction(pathOrUrl: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await deleteProjectImage(pathOrUrl);
    return { success: true, message: "Gambar dihapus." };
  } catch (error) {
    return safeError("Gambar gagal dihapus.", error);
  }
}
