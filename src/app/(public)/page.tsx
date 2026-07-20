import Link from "next/link";
import { CapabilityIndex } from "@/components/public/capability-index";
import { CaseStudyPreview } from "@/components/public/case-study-preview";
import { ContactCta } from "@/components/public/contact-cta";
import { ExperienceTimeline } from "@/components/public/experience-timeline";
import { FeaturedProjects } from "@/components/public/featured-projects";
import { Hero } from "@/components/public/hero";
import { InternationalDelivery } from "@/components/public/international-delivery";
import { SectionHeading } from "@/components/public/section-heading";
import { getPublicExperiences, getPublicProjects, getPublicSiteProfileSafe, getPublicSkills } from "@/lib/public/data";

const chain = [
  ["01", "Frontend", "Interfaces, product workflows, and accessible web experiences."],
  ["02", "Backend", "Golang services, BFF orchestration, APIs, and shared platform contracts."],
  ["03", "Mobile", "Flutter architecture and cross-platform Android/iOS delivery."],
  ["04", "Enterprise", "ERPNext/Frappe integration and business-process translation."],
  ["05", "Automation", "Python and AI-assisted workflows for operational leverage."],
  ["06", "Operations", "Ubuntu, Docker, Rancher, release readiness, and incident response."],
];

export default async function HomePage() {
  const [profile,projects,experiences,skills]=await Promise.all([getPublicSiteProfileSafe(),getPublicProjects(),getPublicExperiences(),getPublicSkills()]);
  return <><Hero profile={profile}/><section className="editorial-section bg-[var(--surface)]"><div className="public-container"><SectionHeading label="Engineering profile" title="One engineer across the entire delivery chain." description="I work across application layers because system outcomes rarely stop at a framework boundary."/><div className="grid border-l border-t border-[var(--border)] sm:grid-cols-2 lg:grid-cols-3">{chain.map(([number,title,description])=><article key={number} className="border-b border-r border-[var(--border)] p-6 sm:p-8"><span className="font-mono text-xs text-[var(--accent-gold)]">{number}</span><h3 className="mt-8 font-serif text-3xl">{title}</h3><p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{description}</p></article>)}</div></div></section><FeaturedProjects projects={projects}/><section className="editorial-section"><div className="public-container"><SectionHeading label="Selected experience" title="A record of expanding system ownership."/><ExperienceTimeline experiences={experiences} compact/><div className="mt-10 text-right"><Link href="/experience" className="focus-ring font-mono text-xs uppercase tracking-[.12em] underline">Complete experience archive →</Link></div></div></section><CapabilityIndex skills={skills}/><CaseStudyPreview available={projects.some(project=>project.slug==="centralized-enterprise-bff")}/><InternationalDelivery/><ContactCta profile={profile}/></>;
}
