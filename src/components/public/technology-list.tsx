export function TechnologyList({ items, dark = false, limit }: { items: string[]; dark?: boolean; limit?: number }) {
  const visible = limit ? items.slice(0, limit) : items;
  return <ul className="flex flex-wrap gap-x-3 gap-y-2" aria-label="Technologies">{visible.map(item => <li key={item} className={`font-mono text-xs uppercase tracking-[.07em] ${dark ? "text-[var(--ink)]" : "text-[var(--paper-soft)]"}`}>{item}</li>)}</ul>;
}
