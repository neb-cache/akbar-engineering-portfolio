import type { Metadata } from "next";
import { ExperienceTimeline } from "@/components/public/experience-timeline";
import { SectionHeading } from "@/components/public/section-heading";
import { getPublicExperiences } from "@/lib/public/data";
import { pageMetadata } from "@/lib/public/metadata";

export const metadata:Metadata=pageMetadata("Experience","Professional experience across full-stack engineering, enterprise integration, technical leadership, and production operations.","/experience");
export default async function ExperiencePage(){const experiences=await getPublicExperiences();return <div className="public-container py-16 sm:py-24"><SectionHeading label="Professional record" title="From full-stack delivery to systems ownership." description="A chronological record of roles spanning application development, ERP integration, platform architecture, infrastructure coordination, and engineering leadership."/><div className="mb-16 grid gap-5 border-y border-[var(--border)] py-7 md:grid-cols-3"><p className="font-serif text-2xl">Full-Stack Engineering</p><p className="font-serif text-2xl">Systems & Integration Ownership</p><p className="font-serif text-2xl text-[var(--accent-gold)]">Principal Engineering</p></div><ExperienceTimeline experiences={experiences}/></div>}
