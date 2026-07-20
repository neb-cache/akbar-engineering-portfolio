import "server-only";

import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import type { Experience } from "@/types/experience";
import type { PublicProject } from "@/types/project";
import type { Skill } from "@/types/skill";
import type { Json, PublicProjectRow } from "@/types/database";

export type PublicSiteProfile = {
  name: string;
  title: string;
  heroTitle: string;
  heroDescription: string;
  email: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  resumeUrl: string | null;
  location: string;
  availability: string;
};

export const fallbackProfile: PublicSiteProfile = {
  name: "Akbar Aulia Ramadhan",
  title: "Principal Full-Stack & Systems Engineer",
  heroTitle: "Building enterprise platforms across software, integration, automation, and infrastructure.",
  heroDescription: "I design and deliver full-stack systems spanning Golang backends, Next.js applications, Flutter mobile products, ERP integration, AI-assisted automation, and production infrastructure.",
  email: null,
  githubUrl: null,
  linkedinUrl: null,
  resumeUrl: null,
  location: "Bogor, Indonesia",
  availability: "Available for remote and international opportunities",
};

function objectValue(value: Json): Record<string, Json | undefined> {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function stringValue(value: Json | undefined) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export const getPublicSiteProfile = cache(async (): Promise<PublicSiteProfile> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", ["hero", "social_links", "resume_url", "contact", "availability"]);
  if (error) throw error;
  const settings = new Map((data ?? []).map((item) => [item.key, item.value]));
  const hero = objectValue(settings.get("hero") ?? null);
  const social = objectValue(settings.get("social_links") ?? null);
  const contact = objectValue(settings.get("contact") ?? null);
  const availability = objectValue(settings.get("availability") ?? null);
  const resumeSetting = settings.get("resume_url");
  const resume = typeof resumeSetting === "string"
    ? resumeSetting
    : stringValue(objectValue(resumeSetting ?? null).url);

  return {
    name: stringValue(hero.name) ?? fallbackProfile.name,
    title: stringValue(hero.title) ?? fallbackProfile.title,
    heroTitle: stringValue(hero.headline) ?? fallbackProfile.heroTitle,
    heroDescription: stringValue(hero.description) ?? fallbackProfile.heroDescription,
    email: stringValue(contact.email),
    githubUrl: stringValue(social.github),
    linkedinUrl: stringValue(social.linkedin),
    resumeUrl: resume,
    location: stringValue(contact.location) ?? fallbackProfile.location,
    availability: stringValue(availability.message) ?? fallbackProfile.availability,
  };
});

export async function getPublicSiteProfileSafe() {
  try {
    return await getPublicSiteProfile();
  } catch (error) {
    console.error("Public site settings could not be loaded", error);
    return fallbackProfile;
  }
}

async function hydrateProjects(rows: PublicProjectRow[]): Promise<PublicProject[]> {
  if (!rows.length) return [];
  const supabase = createPublicClient();
  const ids = rows.map((project) => project.id);
  const [technologies, highlights, images] = await Promise.all([
    supabase.from("project_technologies").select("*").in("project_id", ids).order("sort_order"),
    supabase.from("project_highlights").select("*").in("project_id", ids).order("sort_order"),
    supabase.from("project_images").select("*").in("project_id", ids).order("sort_order"),
  ]);
  if (technologies.error || highlights.error || images.error) {
    throw technologies.error ?? highlights.error ?? images.error;
  }
  return rows.map((project) => ({
    ...project,
    project_technologies: (technologies.data ?? []).filter((item) => item.project_id === project.id),
    project_highlights: (highlights.data ?? []).filter((item) => item.project_id === project.id),
    project_images: (images.data ?? []).filter((item) => item.project_id === project.id),
  }));
}

export const getPublicProjects = cache(async (): Promise<PublicProject[]> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("public_projects")
    .select("*")
    .order("sort_order")
    .order("created_at", { ascending: false });
  if (!error) return hydrateProjects(data ?? []);

  // Phase 1 compatibility: still serve non-confidential projects before migration 002 is applied.
  if (error.code === "PGRST205" || error.code === "42P01") {
    const fallback = await supabase
      .from("projects")
      .select("*")
      .eq("status", "published")
      .eq("confidential", false)
      .order("sort_order");
    if (fallback.error) throw fallback.error;
    return hydrateProjects(fallback.data ?? []);
  }
  throw error;
});

export const getPublicProjectBySlug = cache(async (slug: string) => {
  const projects = await getPublicProjects();
  return projects.find((project) => project.slug === slug) ?? null;
});

export const getPublicExperiences = cache(async (): Promise<Experience[]> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("experiences")
    .select("*, experience_highlights(*), experience_technologies(*)")
    .order("is_current", { ascending: false })
    .order("start_date", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as Experience[];
});

export const getPublicSkills = cache(async (): Promise<Skill[]> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .order("category")
    .order("sort_order")
    .order("name");
  if (error) throw error;
  return data ?? [];
});
