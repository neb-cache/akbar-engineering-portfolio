import "server-only";

import { cache } from "react";
import { unstable_cache } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import type { Experience } from "@/types/experience";
import type { PublicProject } from "@/types/project";
import type { Skill } from "@/types/skill";
import type { PublicProjectAuthority } from "@/types/authority";
import type { Json, PublicMentorshipRecordRow, PublicProjectRow } from "@/types/database";
import { getPublicCaseStudySections, getPublicMentorshipRecords, getPublicProjectDiagrams, getPublicProjectMetrics } from "@/lib/services/authority";
import { logServerEvent } from "@/lib/observability/logger";
import { PUBLIC_CACHE_REVALIDATE_SECONDS, publicCacheTags } from "@/lib/public/cache";

export type PublicSiteProfile = {
  name: string;
  professionalName: string;
  title: string;
  secondaryIdentity: string;
  heroTitle: string;
  heroDescription: string;
  email: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  resumeUrl: string | null;
  location: string;
  availability: string;
  builderStatement: string;
  systemsPillar: string;
  peoplePillar: string;
  executionPillar: string;
  recruiterCta: string;
  incident: { title: string; summary: string; metricLabel: string; metricValue: string; metricContext: string };
};

export const fallbackProfile: PublicSiteProfile = {
  name: "Akbar Aulia Ramadhan",
  professionalName: "Akbar A.R",
  title: "Principal Full-Stack & Systems Engineer",
  secondaryIdentity: "Builder of Systems & People",
  heroTitle: "Building systems, teams, and operational capability across software, integration, automation, and infrastructure.",
  heroDescription: "I design and deliver business-critical systems across Golang backends, Next.js applications, Flutter products, ERP integration, automation, and production infrastructure—while developing the people and teams responsible for operating them.",
  email: null,
  githubUrl: null,
  linkedinUrl: null,
  resumeUrl: null,
  location: "Bogor, Indonesia",
  availability: "Available for remote and international opportunities",
  builderStatement: "Building systems is only half of engineering leadership. The other half is building the people capable of owning, improving, and operating them.",
  systemsPillar: "I design systems that connect business processes, applications, infrastructure, and operational teams. My work spans frontend, backend, mobile, ERP, automation, and production environments.",
  peoplePillar: "I identify technical potential beyond surface-level knowledge, develop junior talent through practical ownership and structured feedback, and help place people where they can become effective contributors.",
  executionPillar: "I take responsibility for delivery across technical and organizational boundaries, coordinating developers, infrastructure personnel, vendors, and stakeholders until systems are ready for production use.",
  recruiterCta: "Inspect the selected systems record, review the engineering timeline, download the current resume, or start a direct conversation.",
  incident: { title: "Unauthorized Crypto-Mining Incident Remediation", summary: "Resolved an unauthorized crypto-mining infrastructure incident that had driven CPU utilization to approximately 100%, reducing utilization to approximately 5% through root-cause analysis, containment, remediation, security hardening, and improved operational controls.", metricLabel: "CPU Utilization", metricValue: "~100% → ~5%", metricContext: "After remediation and hardening" },
};

function objectValue(value: Json): Record<string, Json | undefined> {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function stringValue(value: Json | undefined) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

const getPublicSiteProfileCached = unstable_cache(async (): Promise<PublicSiteProfile> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", ["hero", "social_links", "resume_url", "contact", "availability", "professional_identity", "resume", "authority_framework", "contact_profile"]);
  if (error) throw error;
  const settings = new Map((data ?? []).map((item) => [item.key, item.value]));
  const hero = objectValue(settings.get("hero") ?? null);
  const social = objectValue(settings.get("social_links") ?? null);
  const contact = objectValue(settings.get("contact") ?? null);
  const availability = objectValue(settings.get("availability") ?? null);
  const identity = objectValue(settings.get("professional_identity") ?? null);
  const authority = objectValue(settings.get("authority_framework") ?? null);
  const contactProfile = objectValue(settings.get("contact_profile") ?? null);
  const incident = objectValue(authority.incident ?? null);
  const resumeSetting = settings.get("resume_url");
  const legacyResume = typeof resumeSetting === "string"
    ? resumeSetting
    : stringValue(objectValue(resumeSetting ?? null).url);
  const resume = stringValue(objectValue(settings.get("resume") ?? null).url) ?? legacyResume;

  return {
    name: stringValue(identity.fullName) ?? stringValue(hero.name) ?? fallbackProfile.name,
    professionalName: stringValue(identity.professionalName) ?? fallbackProfile.professionalName,
    title: stringValue(identity.title) ?? stringValue(hero.title) ?? fallbackProfile.title,
    secondaryIdentity: stringValue(identity.secondaryIdentity) ?? fallbackProfile.secondaryIdentity,
    heroTitle: stringValue(hero.headline) ?? fallbackProfile.heroTitle,
    heroDescription: stringValue(hero.description) ?? fallbackProfile.heroDescription,
    email: stringValue(contactProfile.email) ?? stringValue(contact.email),
    githubUrl: stringValue(social.github),
    linkedinUrl: stringValue(social.linkedin),
    resumeUrl: resume,
    location: stringValue(contactProfile.location) ?? stringValue(contact.location) ?? fallbackProfile.location,
    availability: stringValue(contactProfile.availability) ?? stringValue(availability.message) ?? fallbackProfile.availability,
    builderStatement: stringValue(authority.builderStatement) ?? fallbackProfile.builderStatement,
    systemsPillar: stringValue(authority.systems) ?? fallbackProfile.systemsPillar,
    peoplePillar: stringValue(authority.people) ?? fallbackProfile.peoplePillar,
    executionPillar: stringValue(authority.execution) ?? fallbackProfile.executionPillar,
    recruiterCta: stringValue(authority.recruiterCta) ?? fallbackProfile.recruiterCta,
    incident: { title: stringValue(incident.title) ?? fallbackProfile.incident.title, summary: stringValue(incident.summary) ?? fallbackProfile.incident.summary, metricLabel: stringValue(incident.metricLabel) ?? fallbackProfile.incident.metricLabel, metricValue: stringValue(incident.metricValue) ?? fallbackProfile.incident.metricValue, metricContext: stringValue(incident.metricContext) ?? fallbackProfile.incident.metricContext },
  };
}, ["public-site-profile-v1"], {
  tags: [publicCacheTags.profile],
  revalidate: PUBLIC_CACHE_REVALIDATE_SECONDS,
});

export const getPublicSiteProfile = cache(getPublicSiteProfileCached);

export async function getPublicSiteProfileSafe() {
  try {
    return await getPublicSiteProfile();
  } catch (error) {
    logServerEvent("error", {
      category: "public-data",
      action: "site_profile_load_failed",
      error,
    });
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
    supabase.from("public_project_images").select("*").in("project_id", ids).order("sort_order"),
  ]);
  const missingImageView = images.error && (images.error.code === "PGRST205" || images.error.code === "42P01");
  const imageRows = missingImageView ? [] : images.data ?? [];
  if (technologies.error || highlights.error || (images.error && !missingImageView)) {
    throw technologies.error ?? highlights.error ?? images.error;
  }
  return rows.map((project) => ({
    ...project,
    project_technologies: (technologies.data ?? []).filter((item) => item.project_id === project.id),
    project_highlights: (highlights.data ?? []).filter((item) => item.project_id === project.id),
    project_images: imageRows.filter((item) => item.project_id === project.id),
  }));
}

const getPublicProjectsCached = unstable_cache(async (): Promise<PublicProject[]> => {
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
}, ["public-projects-v1"], {
  tags: [publicCacheTags.projects],
  revalidate: PUBLIC_CACHE_REVALIDATE_SECONDS,
});

export const getPublicProjects = cache(getPublicProjectsCached);

export const getPublicProjectBySlug = cache(async (slug: string) => {
  const projects = await getPublicProjects();
  return projects.find((project) => project.slug === slug) ?? null;
});

const getPublicExperiencesCached = unstable_cache(async (): Promise<Experience[]> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("experiences")
    .select("*, experience_highlights(*), experience_technologies(*)")
    .order("is_current", { ascending: false })
    .order("start_date", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as Experience[];
}, ["public-experiences-v1"], {
  tags: [publicCacheTags.experiences],
  revalidate: PUBLIC_CACHE_REVALIDATE_SECONDS,
});

export const getPublicExperiences = cache(getPublicExperiencesCached);

const getPublicSkillsCached = unstable_cache(async (): Promise<Skill[]> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .order("category")
    .order("sort_order")
    .order("name");
  if (error) throw error;
  return data ?? [];
}, ["public-skills-v1"], {
  tags: [publicCacheTags.skills],
  revalidate: PUBLIC_CACHE_REVALIDATE_SECONDS,
});

export const getPublicSkills = cache(getPublicSkillsCached);

const getPublicProjectAuthoritySafeCached = unstable_cache(async (projectId: string): Promise<PublicProjectAuthority> => {
  try {
    const [sections, metrics, diagrams] = await Promise.all([getPublicCaseStudySections(projectId), getPublicProjectMetrics(projectId), getPublicProjectDiagrams(projectId)]);
    return { sections, metrics, diagrams };
  } catch (error) {
    const code = typeof error === "object" && error !== null && "code" in error ? error.code : null;
    if (code !== "PGRST205" && code !== "42P01") {
      logServerEvent("error", {
        category: "public-data",
        action: "project_authority_load_failed",
        error,
      });
    }
    return { sections: [], metrics: [], diagrams: [] };
  }
}, ["public-project-authority-v1"], {
  tags: [publicCacheTags.authority],
  revalidate: PUBLIC_CACHE_REVALIDATE_SECONDS,
});

export const getPublicProjectAuthoritySafe = cache(getPublicProjectAuthoritySafeCached);

const getPublicMentorshipRecordsSafeCached = unstable_cache(async (): Promise<PublicMentorshipRecordRow[]> => {
  try { return await getPublicMentorshipRecords(); }
  catch (error) {
    const code = typeof error === "object" && error !== null && "code" in error ? error.code : null;
    if (code !== "PGRST205" && code !== "42P01") {
      logServerEvent("error", {
        category: "public-data",
        action: "mentorship_load_failed",
        error,
      });
    }
    return [];
  }
}, ["public-mentorship-v1"], {
  tags: [publicCacheTags.mentorship],
  revalidate: PUBLIC_CACHE_REVALIDATE_SECONDS,
});

export const getPublicMentorshipRecordsSafe = cache(getPublicMentorshipRecordsSafeCached);
