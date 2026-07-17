import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { SkillInput } from "@/lib/validation/skill";
import type { Skill } from "@/types/skill";

function values(input: SkillInput) {
  return {
    name: input.name,
    category: input.category,
    proficiency: input.proficiency,
    years_experience: input.yearsExperience,
    featured: input.featured,
    sort_order: input.sortOrder,
  };
}

export async function getSkills(category?: string) {
  const supabase = await createClient();
  let query = supabase.from("skills").select("*").order("category").order("sort_order").order("name");
  if (category) query = query.eq("category", category);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Skill[];
}

export async function getSkillById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("skills").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as Skill | null;
}

export async function createSkill(input: SkillInput) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("skills").insert(values(input)).select("id").single();
  if (error) throw error;
  return data.id;
}

export async function updateSkill(id: string, input: SkillInput) {
  const supabase = await createClient();
  const { error } = await supabase.from("skills").update(values(input)).eq("id", id);
  if (error) throw error;
}

export async function deleteSkill(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("skills").delete().eq("id", id);
  if (error) throw error;
}

export async function getSkillCount() {
  const supabase = await createClient();
  const { count, error } = await supabase.from("skills").select("id", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
}
