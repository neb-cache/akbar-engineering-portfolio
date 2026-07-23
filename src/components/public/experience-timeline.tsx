import { experiencePeriod } from "@/lib/public/experience-presenter";
import type { Experience } from "@/types/experience";
import { EmptyState } from "./empty-state";
import { Reveal } from "./reveal";
import { TechnologyList } from "./technology-list";

export function ExperienceTimeline({ experiences, compact = false }: { experiences: Experience[]; compact?: boolean }) {
  const visible = compact ? experiences.slice(0, 3) : experiences;
  if (!visible.length) return <EmptyState title="No appointments published." description="Professional experience records will appear here when available." />;

  return (
    <ol className="relative ml-2 border-l border-[var(--border)] sm:ml-5">
      {visible.map((item, index) => (
        <li key={item.id} className="relative pb-12 pl-6 last:pb-0 sm:pb-14 sm:pl-12">
          <span
            aria-hidden="true"
            className={`absolute -left-[5px] top-2 h-[9px] w-[9px] rotate-45 border transition-shadow duration-[var(--motion-standard)] ${item.is_current ? "border-[var(--accent-gold)] bg-[var(--accent-gold)] shadow-[0_0_0_5px_rgba(181,148,91,.12)]" : "border-[var(--accent-brown)] bg-[var(--background)]"}`}
          />
          <Reveal delay={Math.min(index * 70, 210)}>
            <article className="grid min-w-0 gap-6 lg:grid-cols-[11rem_minmax(0,1fr)]">
              <div>
                <p className="editorial-label">{item.is_current ? "Current appointment" : `Record / ${String(index + 1).padStart(2, "0")}`}</p>
                <p className="mt-3 font-mono text-xs leading-6 text-[var(--text-secondary)]">{experiencePeriod(item.start_date, item.end_date, item.is_current)}</p>
                {item.work_mode && <p className="mt-2 font-mono text-xs uppercase tracking-[.1em] text-[var(--accent-gold)]">{item.work_mode}</p>}
              </div>
              <div className={`interactive-panel min-w-0 ${item.is_current ? "border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-8" : "border-t border-[var(--border)] pt-6"}`}>
                <h3 className="break-words font-serif text-[clamp(2.3rem,6vw,3rem)] leading-[1.02]">{item.title}</h3>
                <p className="mt-2 break-words text-sm font-semibold text-[var(--paper-soft)]">{item.company}{item.location ? ` · ${item.location}` : ""}</p>
                {item.summary && <p className="reading-measure mt-5 text-sm leading-7 text-[var(--text-secondary)]">{item.summary}</p>}
                {!compact && item.experience_highlights.length > 0 && (
                  <ul className="mt-6 grid gap-3 text-sm leading-6 text-[var(--paper-soft)]">
                    {[...item.experience_highlights].sort((a, b) => a.sort_order - b.sort_order).map((highlight) => (
                      <li key={highlight.id} className="grid grid-cols-[1rem_minmax(0,1fr)] gap-2"><span aria-hidden="true" className="text-[var(--accent-gold)]">—</span><span>{highlight.content}</span></li>
                    ))}
                  </ul>
                )}
                <div className="mt-6"><TechnologyList items={[...item.experience_technologies].sort((a, b) => a.sort_order - b.sort_order).map((tech) => tech.name)} limit={compact ? 8 : undefined} /></div>
              </div>
            </article>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
