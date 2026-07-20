import { FileDown } from "lucide-react";

export function ResumeLink({ url, inverse = false }: { url: string | null; inverse?: boolean }) {
  const classes = inverse ? "border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--paper)]" : "border-[var(--accent-gold)] text-[var(--text-primary)] hover:bg-[var(--accent-gold)] hover:text-[var(--ink)]";
  if (!url) return <span aria-disabled="true" title="Resume URL has not been configured" className={`inline-flex cursor-not-allowed items-center gap-2 border px-4 py-3 text-xs uppercase tracking-[.1em] opacity-45 ${classes}`}><FileDown size={15}/> Resume unavailable</span>;
  return <a href={url} target="_blank" rel="noreferrer" aria-label="Download Akbar Aulia Ramadhan resume (opens in a new tab)" className={`focus-ring inline-flex items-center gap-2 border px-4 py-3 text-xs font-medium uppercase tracking-[.1em] transition-colors ${classes}`}><FileDown size={15}/> Download resume</a>;
}
