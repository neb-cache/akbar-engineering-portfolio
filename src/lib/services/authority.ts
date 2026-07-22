import "server-only";

import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";
import { emptyToNull } from "@/lib/utils";
import type { CaseStudySectionInput, MentorshipRecordInput, ProjectDiagramInput, ProjectImageMetadataInput, ProjectMetricInput, ReorderInput } from "@/lib/validation/authority";
import type { DiagramData } from "@/types/authority";
import type { MentorshipRecordRow, ProjectCaseStudySectionRow, ProjectDiagramRow, ProjectImageRow, ProjectMetricRow, PublicCaseStudySectionRow, PublicMentorshipRecordRow, PublicProjectDiagramRow, PublicProjectImageRow, PublicProjectMetricRow } from "@/types/database";

async function orderedAdminRows<T>(table: "project_case_study_sections" | "project_metrics" | "project_diagrams" | "project_images", projectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from(table).select("*").eq("project_id", projectId).order("sort_order");
  if (error) throw error;
  return (data ?? []) as T[];
}

async function orderedPublicRows<T>(view: "public_project_case_study_sections" | "public_project_metrics" | "public_project_diagrams" | "public_project_images", projectId: string) {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from(view).select("*").eq("project_id", projectId).order("sort_order");
  if (error) throw error;
  return (data ?? []) as T[];
}

export const getAdminCaseStudySections = (projectId: string) => orderedAdminRows<ProjectCaseStudySectionRow>("project_case_study_sections", projectId);
export const getPublicCaseStudySections = (projectId: string) => orderedPublicRows<PublicCaseStudySectionRow>("public_project_case_study_sections", projectId);
export const getAdminProjectMetrics = (projectId: string) => orderedAdminRows<ProjectMetricRow>("project_metrics", projectId);
export const getPublicProjectMetrics = (projectId: string) => orderedPublicRows<PublicProjectMetricRow>("public_project_metrics", projectId);
export const getAdminProjectDiagrams = (projectId: string) => orderedAdminRows<ProjectDiagramRow>("project_diagrams", projectId);
export const getPublicProjectDiagrams = async (projectId: string) => (await orderedPublicRows<PublicProjectDiagramRow>("public_project_diagrams", projectId)).map((row) => ({ ...row, diagram_data: row.diagram_data as DiagramData }));
export const getAdminProjectImages = (projectId: string) => orderedAdminRows<ProjectImageRow>("project_images", projectId);
export const getPublicProjectImages = (projectId: string) => orderedPublicRows<PublicProjectImageRow>("public_project_images", projectId);

function sectionValues(input: CaseStudySectionInput) { return { project_id: input.projectId, section_key: input.sectionKey, section_type: input.sectionType, title: input.title, content: input.content, is_public: input.isPublic, sort_order: input.sortOrder }; }
function metricValues(input: ProjectMetricInput) { return { project_id: input.projectId, metric_key: input.metricKey, label: input.label, value: input.value, context: emptyToNull(input.context), is_public: input.isPublic, sort_order: input.sortOrder }; }
function diagramValues(input: ProjectDiagramInput) { return { project_id: input.projectId, diagram_key: input.diagramKey, title: input.title, description: emptyToNull(input.description), diagram_type: input.diagramType, diagram_data: input.diagramData, text_alternative: input.textAlternative, is_public: input.isPublic, sort_order: input.sortOrder }; }
function mentorshipValues(input: MentorshipRecordInput) { return { record_key: input.recordKey, title: input.title, category: input.category, summary: input.summary, method: emptyToNull(input.method), outcome: emptyToNull(input.outcome), is_public: input.isPublic, sort_order: input.sortOrder }; }
function imageValues(input: ProjectImageMetadataInput) { return { project_id: input.projectId, image_url: input.imageUrl, alt_text: input.altText, caption: emptyToNull(input.caption), image_category: input.imageCategory, is_public: input.isPublic, sort_order: input.sortOrder }; }

async function createRow(table: "project_case_study_sections" | "project_metrics" | "project_diagrams" | "mentorship_records" | "project_images", values: object) {
  const supabase = await createClient(); const { data, error } = await supabase.from(table).insert(values).select("id").single(); if (error) throw error; return data.id;
}
async function updateRow(table: "project_case_study_sections" | "project_metrics" | "project_diagrams" | "mentorship_records" | "project_images", id: string, values: object) {
  const supabase = await createClient(); const { error } = await supabase.from(table).update(values).eq("id", id); if (error) throw error;
}
async function deleteRow(table: "project_case_study_sections" | "project_metrics" | "project_diagrams" | "mentorship_records" | "project_images", id: string) {
  const supabase = await createClient(); const { error } = await supabase.from(table).delete().eq("id", id); if (error) throw error;
}
async function reorderRows(table: "project_case_study_sections" | "project_metrics" | "project_diagrams" | "mentorship_records", input: ReorderInput) {
  const supabase = await createClient(); const results = await Promise.all(input.items.map((item) => supabase.from(table).update({ sort_order: item.sortOrder }).eq("id", item.id))); const failed = results.find((result) => result.error); if (failed?.error) throw failed.error;
}

export const createCaseStudySection = (input: CaseStudySectionInput) => createRow("project_case_study_sections", sectionValues(input));
export const updateCaseStudySection = (id: string, input: CaseStudySectionInput) => updateRow("project_case_study_sections", id, sectionValues(input));
export const deleteCaseStudySection = (id: string) => deleteRow("project_case_study_sections", id);
export const reorderCaseStudySections = (input: ReorderInput) => reorderRows("project_case_study_sections", input);
export const createProjectMetric = (input: ProjectMetricInput) => createRow("project_metrics", metricValues(input));
export const updateProjectMetric = (id: string, input: ProjectMetricInput) => updateRow("project_metrics", id, metricValues(input));
export const deleteProjectMetric = (id: string) => deleteRow("project_metrics", id);
export const reorderProjectMetrics = (input: ReorderInput) => reorderRows("project_metrics", input);
export const createProjectDiagram = (input: ProjectDiagramInput) => createRow("project_diagrams", diagramValues(input));
export const updateProjectDiagram = (id: string, input: ProjectDiagramInput) => updateRow("project_diagrams", id, diagramValues(input));
export const deleteProjectDiagram = (id: string) => deleteRow("project_diagrams", id);
export const reorderProjectDiagrams = (input: ReorderInput) => reorderRows("project_diagrams", input);

export async function getAdminMentorshipRecords(category?: MentorshipRecordRow["category"]) { const supabase = await createClient(); let query = supabase.from("mentorship_records").select("*").order("sort_order"); if (category) query = query.eq("category", category); const { data, error } = await query; if (error) throw error; return (data ?? []) as MentorshipRecordRow[]; }
export async function getPublicMentorshipRecords() { const supabase = createPublicClient(); const { data, error } = await supabase.from("public_mentorship_records").select("*").order("sort_order"); if (error) throw error; return (data ?? []) as PublicMentorshipRecordRow[]; }
export const createMentorshipRecord = (input: MentorshipRecordInput) => createRow("mentorship_records", mentorshipValues(input));
export const updateMentorshipRecord = (id: string, input: MentorshipRecordInput) => updateRow("mentorship_records", id, mentorshipValues(input));
export const deleteMentorshipRecord = (id: string) => deleteRow("mentorship_records", id);
export const reorderMentorshipRecords = (input: ReorderInput) => reorderRows("mentorship_records", input);

export const createProjectImage = (input: ProjectImageMetadataInput) => createRow("project_images", imageValues(input));
export const updateProjectImageMetadata = (id: string, input: ProjectImageMetadataInput) => updateRow("project_images", id, imageValues(input));
export const deleteProjectImage = (id: string) => deleteRow("project_images", id);
