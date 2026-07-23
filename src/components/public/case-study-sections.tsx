import type { PublicCaseStudySectionRow } from "@/types/database";
import { Reveal } from "./reveal";

export function CaseStudySections({ sections }: { sections: PublicCaseStudySectionRow[] }) {
  if (!sections.length) return null;
  return (
    <div className="space-y-14 sm:space-y-16">
      {sections.map((section, index) => (
        <Reveal key={section.id} delay={Math.min(index * 35, 140)}>
          <section aria-labelledby={`section-${section.id}`} className="grid min-w-0 gap-4 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-5">
            <span className="font-mono text-xs text-[var(--accent-gold)]">{String(index + 1).padStart(2, "0")}</span>
            <div className="min-w-0">
              <p className="editorial-label">{section.section_type}</p>
              <h2 id={`section-${section.id}`} className="mt-3 break-words font-serif text-[clamp(2.5rem,6vw,3.25rem)] leading-tight">{section.title}</h2>
              <div className="reading-measure mt-5 whitespace-pre-line text-sm leading-8 text-[var(--text-secondary)]">{section.content}</div>
            </div>
          </section>
        </Reveal>
      ))}
    </div>
  );
}
