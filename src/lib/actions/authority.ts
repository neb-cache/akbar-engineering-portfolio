"use server";

import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import {
  createCaseStudySection, createMentorshipRecord, createProjectDiagram, createProjectImage, createProjectMetric,
  deleteCaseStudySection, deleteMentorshipRecord, deleteProjectDiagram, deleteProjectImage, deleteProjectMetric,
  reorderCaseStudySections, reorderMentorshipRecords, reorderProjectDiagrams, reorderProjectMetrics,
  updateCaseStudySection, updateMentorshipRecord, updateProjectDiagram, updateProjectImageMetadata, updateProjectMetric,
} from "@/lib/services/authority";
import { updateAuthoritySettings } from "@/lib/services/site-settings";
import {
  authoritySettingsSchema, caseStudySectionSchema, mentorshipRecordSchema, projectDiagramSchema, projectImageMetadataSchema,
  projectMetricSchema, reorderSchema, type AuthoritySettingsInput, type CaseStudySectionInput, type MentorshipRecordInput,
  type ProjectDiagramInput, type ProjectImageMetadataInput, type ProjectMetricInput, type ReorderInput,
} from "@/lib/validation/authority";
import type { ActionResult } from "@/types/action";
import { invalidResult, safeError } from "./helpers";
import { publicCacheTags } from "@/lib/public/cache";

const idSchema = z.uuid();
function refreshProjectAuthority() {
  updateTag(publicCacheTags.authority);
  updateTag(publicCacheTags.projects);
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/projects/[slug]", "page");
  revalidatePath("/admin/projects/[id]/edit", "page");
}

async function validatedSave<T>(schema: z.ZodType<T>, input: T, id: string | null, create: (data: T) => Promise<string>, update: (id: string, data: T) => Promise<void>, label: string): Promise<ActionResult<{ id: string }>> {
  await requireAdmin(); const parsed = schema.safeParse(input); if (!parsed.success) return invalidResult(parsed.error);
  if (id && !idSchema.safeParse(id).success) return { success: false, message: "ID tidak valid." };
  try { const savedId = id ? (await update(id, parsed.data), id) : await create(parsed.data); refreshProjectAuthority(); return { success: true, data: { id: savedId }, message: `${label} berhasil disimpan.` }; }
  catch (error) { return safeError(`${label} gagal disimpan.`, error); }
}

export async function saveCaseStudySectionAction(id: string | null, input: CaseStudySectionInput) { return validatedSave(caseStudySectionSchema, input, id, createCaseStudySection, updateCaseStudySection, "Bagian case study"); }
export async function saveProjectMetricAction(id: string | null, input: ProjectMetricInput) { return validatedSave(projectMetricSchema, input, id, createProjectMetric, updateProjectMetric, "Metric"); }
export async function saveProjectDiagramAction(id: string | null, input: ProjectDiagramInput) { return validatedSave(projectDiagramSchema, input, id, createProjectDiagram, updateProjectDiagram, "Diagram"); }
export async function saveProjectImageAction(id: string | null, input: ProjectImageMetadataInput) { return validatedSave(projectImageMetadataSchema, input, id, createProjectImage, updateProjectImageMetadata, "Media evidence"); }

async function validatedDelete(id: string, remove: (id: string) => Promise<void>, label: string): Promise<ActionResult> {
  await requireAdmin(); if (!idSchema.safeParse(id).success) return { success: false, message: "ID tidak valid." };
  try { await remove(id); refreshProjectAuthority(); return { success: true, message: `${label} berhasil dihapus.` }; }
  catch (error) { return safeError(`${label} gagal dihapus.`, error); }
}

export async function deleteCaseStudySectionAction(id: string) { return validatedDelete(id, deleteCaseStudySection, "Bagian case study"); }
export async function deleteProjectMetricAction(id: string) { return validatedDelete(id, deleteProjectMetric, "Metric"); }
export async function deleteProjectDiagramAction(id: string) { return validatedDelete(id, deleteProjectDiagram, "Diagram"); }
export async function deleteProjectImageRecordAction(id: string) { return validatedDelete(id, deleteProjectImage, "Media evidence"); }

export async function reorderProjectAuthorityAction(kind: "sections" | "metrics" | "diagrams", input: ReorderInput): Promise<ActionResult> {
  await requireAdmin(); const parsed = reorderSchema.safeParse(input); if (!parsed.success) return invalidResult(parsed.error);
  try { const services = { sections: reorderCaseStudySections, metrics: reorderProjectMetrics, diagrams: reorderProjectDiagrams }; await services[kind](parsed.data); refreshProjectAuthority(); return { success: true, message: "Urutan berhasil diperbarui." }; }
  catch (error) { return safeError("Urutan gagal diperbarui.", error); }
}

export async function saveMentorshipRecordAction(id: string | null, input: MentorshipRecordInput): Promise<ActionResult<{ id: string }>> {
  const result = await validatedSave(mentorshipRecordSchema, input, id, createMentorshipRecord, updateMentorshipRecord, "Mentorship record");
  updateTag(publicCacheTags.mentorship);
  revalidatePath("/admin/mentorship"); revalidatePath("/about"); return result;
}
export async function deleteMentorshipRecordAction(id: string) { const result = await validatedDelete(id, deleteMentorshipRecord, "Mentorship record"); updateTag(publicCacheTags.mentorship); revalidatePath("/admin/mentorship"); revalidatePath("/about"); return result; }
export async function reorderMentorshipRecordsAction(input: ReorderInput): Promise<ActionResult> {
  await requireAdmin(); const parsed = reorderSchema.safeParse(input); if (!parsed.success) return invalidResult(parsed.error);
  try { await reorderMentorshipRecords(parsed.data); updateTag(publicCacheTags.mentorship); revalidatePath("/admin/mentorship"); revalidatePath("/about"); return { success: true, message: "Urutan berhasil diperbarui." }; }
  catch (error) { return safeError("Urutan gagal diperbarui.", error); }
}

export async function saveAuthoritySettingsAction(input: AuthoritySettingsInput): Promise<ActionResult> {
  await requireAdmin(); const parsed = authoritySettingsSchema.safeParse(input); if (!parsed.success) return invalidResult(parsed.error);
  try { await updateAuthoritySettings(parsed.data); updateTag(publicCacheTags.profile); revalidatePath("/", "layout"); return { success: true, message: "Authority settings berhasil disimpan." }; }
  catch (error) { return safeError("Authority settings gagal disimpan.", error); }
}
