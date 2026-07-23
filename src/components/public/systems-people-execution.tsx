import type { PublicSiteProfile } from "@/lib/public/data";
import { SectionHeading } from "./section-heading";

export function SystemsPeopleExecution({ profile }: { profile: PublicSiteProfile }) {
  const pillars = [
    { number: "01", title: "Systems", copy: profile.systemsPillar, evidence: "BFF architecture · ERP integration · mobile delivery · automation · observability · incident response" },
    { number: "02", title: "People", copy: profile.peoplePillar, evidence: "Candidate screening · private mentorship · intern development · code review · structured feedback" },
    { number: "03", title: "Execution", copy: profile.executionPillar, evidence: "Vendor coordination · release readiness · stakeholder alignment · production escalation · cross-border delivery" },
  ];
  return <section className="editorial-section bg-[var(--surface)]"><div className="public-container"><SectionHeading label="Authority framework" title="Systems. People. Execution." description="Engineering authority is visible in what gets built, who becomes capable of owning it, and whether the work crosses the production line."/><div className="grid gap-px bg-[var(--border)] lg:grid-cols-3">{pillars.map((pillar)=><article key={pillar.title} className="interactive-panel bg-[var(--background)] p-7 sm:p-9"><span className="font-mono text-xs text-[var(--accent-gold)]">{pillar.number}</span><h3 className="mt-8 font-serif text-[clamp(2.75rem,7vw,3.5rem)]">{pillar.title}</h3><p className="reading-measure mt-5 text-sm leading-7 text-[var(--text-secondary)]">{pillar.copy}</p><p className="mt-8 border-t border-[var(--border)] pt-5 font-mono text-xs uppercase leading-6 tracking-[.06em] text-[var(--paper-soft)]">{pillar.evidence}</p></article>)}</div></div></section>;
}
