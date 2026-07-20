import "server-only";

import { createClient } from "@/lib/supabase/server";
import { emptyToNull, slugify } from "@/lib/utils";
import type { ProjectInput } from "@/lib/validation/project";
import type { Project } from "@/types/project";

const projectSelect = "*, project_technologies(*), project_highlights(*), project_images(*)";

function projectValues(input: ProjectInput) {
  return {
    title: input.title,
    slug: input.slug || slugify(input.title),
    short_description: input.shortDescription,
    description: input.description,
    role: emptyToNull(input.role),
    company: emptyToNull(input.company),
    client_name: emptyToNull(input.clientName),
    project_type: emptyToNull(input.projectType),
    status: input.status,
    year_start: input.yearStart,
    year_end: input.yearEnd,
    featured: input.featured,
    confidential: input.confidential,
    cover_image_url: emptyToNull(input.coverImageUrl),
    live_url: emptyToNull(input.liveUrl),
    github_url: emptyToNull(input.githubUrl),
    case_study_url: emptyToNull(input.caseStudyUrl),
    sort_order: input.sortOrder,
  };
}

export async function getProjects() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(projectSelect)
    .order("sort_order")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as Project[];
}

export async function getPublishedProjects() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(projectSelect)
    .eq("status", "published")
    .eq("confidential", false)
    .order("sort_order");
  if (error) throw error;
  return (data ?? []) as unknown as Project[];
}

export async function getProjectById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(projectSelect)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as Project | null;
}

export async function getProjectBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(projectSelect)
    .eq("slug", slug)
    .eq("status", "published")
    .eq("confidential", false)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as Project | null;
}

async function replaceProjectChildren(id: string, input: ProjectInput) {
  const supabase = await createClient();
  const { error: deleteTechError } = await supabase
    .from("project_technologies")
    .delete()
    .eq("project_id", id);
  if (deleteTechError) throw deleteTechError;
  const { error: deleteHighlightError } = await supabase
    .from("project_highlights")
    .delete()
    .eq("project_id", id);
  if (deleteHighlightError) throw deleteHighlightError;

  if (input.technologies.length) {
    const { error } = await supabase.from("project_technologies").insert(
      input.technologies.map((name, sort_order) => ({ project_id: id, name, sort_order })),
    );
    if (error) throw error;
  }
  if (input.highlights.length) {
    const { error } = await supabase.from("project_highlights").insert(
      input.highlights.map((content, sort_order) => ({ project_id: id, content, sort_order })),
    );
    if (error) throw error;
  }
}

export async function createProject(input: ProjectInput) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .insert(projectValues(input))
    .select("id")
    .single();
  if (error) throw error;
  try {
    await replaceProjectChildren(data.id, input);
  } catch (error) {
    await supabase.from("projects").delete().eq("id", data.id);
    throw error;
  }
  return data.id;
}

export async function updateProject(id: string, input: ProjectInput) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").update(projectValues(input)).eq("id", id);
  if (error) throw error;
  await replaceProjectChildren(id, input);
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}

export async function getProjectCounts() {
  const supabase = await createClient();
  const count = (status?: "published" | "draft") => {
    let query = supabase.from("projects").select("id", { count: "exact", head: true });
    if (status) query = query.eq("status", status);
    return query;
  };
  const [total, published, draft] = await Promise.all([
    count(),
    count("published"),
    count("draft"),
  ]);
  if (total.error || published.error || draft.error) {
    throw total.error ?? published.error ?? draft.error;
  }
  return { total: total.count ?? 0, published: published.count ?? 0, draft: draft.count ?? 0 };
}
