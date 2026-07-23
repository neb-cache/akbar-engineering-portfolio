import { FileDown } from "lucide-react";

export function ResumeLink({ url, inverse = false }: { url: string | null; inverse?: boolean }) {
  const classes = inverse ? "border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--paper)]" : "button-secondary";
  if (!url) return <span aria-disabled="true" title="Resume URL has not been configured" className={`button-base ${classes}`}><FileDown size={15}/> Resume unavailable</span>;
  return <a href={url} target="_blank" rel="noreferrer" aria-label="Download Akbar Aulia Ramadhan resume (opens in a new tab)" className={`button-base ${classes}`}><FileDown size={15}/> Download resume</a>;
}
