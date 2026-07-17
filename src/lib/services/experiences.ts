import "server-only";

import { createClient } from "@/lib/supabase/server";
import { emptyToNull } from "@/lib/utils";
import type { ExperienceInput } from "@/lib/validation/experience";
import type { Experience } from "@/types/experience";

const experienceSelect = "*, experience_highlights(*), experience_technologies(*)";

function values(input: ExperienceInput) {
  return {
    company: input.company,
    title: input.title,
    employment_type: emptyToNull(input.employmentType),
    location: emptyToNull(input.location),
    work_mode: input.workMode,
    start_date: input.startDate,
    end_date: input.isCurrent ? null : emptyToNull(input.endDate),
    is_current: input.isCurrent,
    summary: emptyToNull(input.summary),
    company_url: emptyToNull(input.companyUrl),
    company_logo_url: emptyToNull(input.companyLogoUrl),
    sort_order: input.sortOrder,
  };
}

export async function getExperiences() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("experiences")
    .select(experienceSelect)
    .order("is_current", { ascending: false })
    .order("start_date", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as Experience[];
}

export async function getExperienceById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("experiences")
    .select(experienceSelect)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as Experience | null;
}

async function replaceChildren(id: string, input: ExperienceInput) {
  const supabase = await createClient();
  const [highlights, technologies] = await Promise.all([
    supabase.from("experience_highlights").delete().eq("experience_id", id),
    supabase.from("experience_technologies").delete().eq("experience_id", id),
  ]);
  if (highlights.error || technologies.error) throw highlights.error ?? technologies.error;
  if (input.highlights.length) {
    const { error } = await supabase.from("experience_highlights").insert(
      input.highlights.map((content, sort_order) => ({ experience_id: id, content, sort_order })),
    );
    if (error) throw error;
  }
  if (input.technologies.length) {
    const { error } = await supabase.from("experience_technologies").insert(
      input.technologies.map((name, sort_order) => ({ experience_id: id, name, sort_order })),
    );
    if (error) throw error;
  }
}

export async function createExperience(input: ExperienceInput) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("experiences").insert(values(input)).select("id").single();
  if (error) throw error;
  try {
    await replaceChildren(data.id, input);
  } catch (error) {
    await supabase.from("experiences").delete().eq("id", data.id);
    throw error;
  }
  return data.id;
}

export async function updateExperience(id: string, input: ExperienceInput) {
  const supabase = await createClient();
  const { error } = await supabase.from("experiences").update(values(input)).eq("id", id);
  if (error) throw error;
  await replaceChildren(id, input);
}

export async function deleteExperience(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("experiences").delete().eq("id", id);
  if (error) throw error;
}

export async function getExperienceCount() {
  const supabase = await createClient();
  const { count, error } = await supabase.from("experiences").select("id", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
}
