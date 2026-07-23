import type { Metadata } from "next";
import { BuilderOfSystemsPeople } from "@/components/public/builder-of-systems-people";
import { ContactCta } from "@/components/public/contact-cta";
import { SectionHeading } from "@/components/public/section-heading";
import { getPublicMentorshipRecordsSafe, getPublicSiteProfileSafe, getPublicSkills } from "@/lib/public/data";
import { pageMetadata } from "@/lib/public/metadata";

export const metadata: Metadata = pageMetadata("About", "How Akbar approaches systems engineering, people development, technical leadership, AI-assisted delivery, and production accountability.", "/about");

export default async function AboutPage() {
  const [profile, skills, mentorship] = await Promise.all([getPublicSiteProfileSafe(), getPublicSkills(), getPublicMentorshipRecordsSafe()]);
  const technologies = [...new Set(skills.map((skill) => skill.name))];
  const records = [
    ["How I work", "I use official documentation, source code, and AI-assisted engineering tools to accelerate implementation while remaining responsible for architecture, validation, debugging, security, and production reliability."],
    ["Systems thinking", "I decompose requirements into system relationships, integration boundaries, operational constraints, failure modes, and explicit trade-offs before choosing implementation details."],
    ["Building people", profile.peoplePillar],
    ["Leadership & collaboration", "I coordinate developers, infrastructure personnel, vendors, project managers, business stakeholders, and international clients. This includes Malaysia-based project management collaboration and cross-border delivery."],
    ["Current focus", "Systems architecture, enterprise integration, delivery leadership, operational capability, and technical people development."],
  ];

  return (
    <>
      <div className="public-container py-16 sm:py-24">
        <SectionHeading label="About the engineer" title="Systems thinking, practical delivery, accountable ownership." />
        <section className="paper-panel grid gap-8 p-7 sm:p-12 lg:grid-cols-[.7fr_1.3fr]"><div><p className="editorial-label !text-[var(--accent-brown)]">Professional overview</p><p className="mt-7 font-serif text-[clamp(2.5rem,7vw,3.25rem)] leading-[1.05]">Engineer and technical leader building systems, people, and operational capability.</p></div><p className="reading-measure text-base leading-8 text-[rgba(24,19,15,.72)]">I am a full-stack and systems engineer focused on connecting software, business processes, infrastructure, and people. My work spans Golang services, Next.js platforms, Flutter applications, ERP integration, automation, and production operations.</p></section>
        <div className="mt-16 divide-y divide-[var(--border)] border-y border-[var(--border)]">{records.map(([title, content], index) => <section key={title} className="interactive-panel grid gap-5 py-9 md:grid-cols-[4rem_15rem_minmax(0,1fr)]"><span className="font-mono text-xs text-[var(--accent-gold)]">{String(index + 1).padStart(2, "0")}</span><h2 className="break-words font-serif text-3xl">{title}</h2><p className="reading-measure text-sm leading-7 text-[var(--text-secondary)]">{content}</p></section>)}</div>
        <section className="mt-16"><p className="editorial-label">Technology range</p><div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 border-y border-[var(--border)] py-6 font-mono text-xs uppercase tracking-[.06em] text-[var(--paper-soft)]">{technologies.map((item) => <span key={item}>{item}</span>)}</div></section>
      </div>
      <BuilderOfSystemsPeople profile={profile} records={mentorship} />
      <ContactCta profile={profile} />
    </>
  );
}
