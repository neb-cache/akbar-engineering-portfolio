export function EditorialDivider({ label }: { label?: string }) {
  return <div className="flex items-center gap-4" aria-hidden="true"><span className="h-px flex-1 bg-[var(--border)]" />{label && <span className="editorial-label">{label}</span>}<span className="h-px w-10 bg-[var(--accent-gold)]" /></div>;
}
