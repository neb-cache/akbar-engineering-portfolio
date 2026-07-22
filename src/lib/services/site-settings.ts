import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { AuthoritySettingsInput } from "@/lib/validation/authority";
import type { Json, SiteSettingRow } from "@/types/database";

const authorityKeys = ["professional_identity", "hero", "social_links", "resume", "authority_framework", "contact_profile"];

export async function getAdminAuthoritySettings() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_settings").select("*").in("key", authorityKeys);
  if (error) throw error;
  return (data ?? []) as SiteSettingRow[];
}

export async function updateAuthoritySettings(input: AuthoritySettingsInput) {
  const supabase = await createClient();
  const rows: Array<{ key: string; value: Json }> = [
    { key: "professional_identity", value: { professionalName: input.professionalName, fullName: input.fullName, title: input.title, secondaryIdentity: input.secondaryIdentity } },
    { key: "hero", value: { name: input.fullName, title: input.title, headline: input.heroHeadline, description: input.heroDescription } },
    { key: "social_links", value: { github: input.githubUrl || null, linkedin: input.linkedinUrl || null } },
    { key: "resume", value: { url: input.resumeUrl || null } },
    { key: "authority_framework", value: { builderStatement: input.builderStatement, systems: input.systemsPillar, people: input.peoplePillar, execution: input.executionPillar, recruiterCta: input.recruiterCta, incident: { title: input.incidentTitle, summary: input.incidentSummary, metricLabel: input.incidentMetricLabel, metricValue: input.incidentMetricValue, metricContext: input.incidentMetricContext } } },
    { key: "contact_profile", value: { email: input.email || null, location: input.location, availability: input.availability } },
  ];
  const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
  if (error) throw error;
}
