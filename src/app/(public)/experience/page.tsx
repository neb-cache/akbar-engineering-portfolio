import type { Metadata } from "next";
import { ExperienceTimeline } from "@/components/public/experience-timeline";
import { IncidentResponseFeature } from "@/components/public/incident-response-feature";
import { SectionHeading } from "@/components/public/section-heading";
import { getPublicExperiences, getPublicSiteProfileSafe } from "@/lib/public/data";
import { pageMetadata } from "@/lib/public/metadata";

export const metadata: Metadata = pageMetadata("Experience", "Professional experience across full-stack engineering, enterprise integration, technical leadership, people development, and production operations.", "/experience");

export default async function ExperiencePage() {
  const [experiences, profile] = await Promise.all([getPublicExperiences(), getPublicSiteProfileSafe()]);
  const scopes = [
    ["Systems owned", "Business applications · BFF integration · ERP workflows · mobile products · production infrastructure"],
    ["Leadership scope", "Architecture decisions · technical review · intern development · candidate assessment · escalation"],
    ["Coordination", "Developers · infrastructure personnel · vendors · project managers · business stakeholders"],
    ["Production responsibility", "Release readiness · monitoring · security hardening · incident response · operational handoff"],
  ];
  return <><div className="public-container py-16 sm:py-24"><SectionHeading label="Professional record" title="From full-stack delivery to systems ownership." description="A chronological record spanning application delivery, enterprise integration, architecture, infrastructure coordination, people development, and production escalation."/><div className="mb-14 grid gap-px bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">{scopes.map(([title,copy],index)=><article key={title} className="bg-[var(--surface)] p-6"><span className="font-mono text-xs text-[var(--accent-gold)]">{String(index+1).padStart(2,"0")}</span><h2 className="mt-5 font-serif text-2xl">{title}</h2><p className="mt-3 text-xs leading-6 text-[var(--text-secondary)]">{copy}</p></article>)}</div><section className="mb-16 border-y border-[var(--border)] py-7"><p className="editorial-label">Career progression / PT Sinergia Beaute Indonesia</p><p className="mt-4 max-w-4xl font-serif text-3xl">Full-Stack Engineer — ERP Integration & Business Systems <span className="text-[var(--accent-gold)]">→</span> Principal Full-Stack & Systems Engineer</p><p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-secondary)]">Expanded from ERP integration and application delivery into architecture ownership, infrastructure supervision, multi-platform coordination, and production escalation.</p></section><ExperienceTimeline experiences={experiences}/></div><IncidentResponseFeature incident={profile.incident}/></>;
}
