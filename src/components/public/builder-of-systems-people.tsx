import type { PublicSiteProfile } from "@/lib/public/data";
import type { PublicMentorshipRecordRow } from "@/types/database";
import { EmptyState } from "./empty-state";
import { SectionHeading } from "./section-heading";

export function BuilderOfSystemsPeople({ profile, records }: { profile: PublicSiteProfile; records: PublicMentorshipRecordRow[] }) {
  return <section className="editorial-section"><div className="public-container"><SectionHeading label={profile.secondaryIdentity} title={profile.builderStatement}/>{records.length ? <div className="grid gap-px bg-[var(--border)] lg:grid-cols-3">{records.map((record,index)=><article key={record.id} className="interactive-panel bg-[var(--surface)] p-7 sm:p-9"><p className="editorial-label">Evidence / {String(index+1).padStart(2,"0")}</p><h3 className="mt-7 break-words font-serif text-[clamp(2.25rem,6vw,3rem)] leading-tight">{record.title}</h3><p className="reading-measure mt-5 text-sm leading-7 text-[var(--text-secondary)]">{record.summary}</p>{record.method&&<div className="mt-6 border-l border-[var(--accent-gold)] pl-4"><p className="editorial-label">Method</p><p className="mt-2 text-xs leading-6 text-[var(--paper-soft)]">{record.method}</p></div>}{record.outcome&&<p className="mt-6 text-sm italic leading-6 text-[var(--text-secondary)]">{record.outcome}</p>}</article>)}</div> : <EmptyState title="Authority records are not yet published." description="Mentorship evidence will appear only after explicit public approval."/>}</div></section>;
}
