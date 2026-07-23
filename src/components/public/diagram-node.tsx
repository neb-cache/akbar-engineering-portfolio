import type { DiagramNode as DiagramNodeType } from "@/types/authority";

type Props = {
  node: DiagramNodeType;
  active: boolean;
  highlighted: boolean;
  connected: boolean;
  interactive: boolean;
  onActivate: (id: string) => void;
  onPreview: (id: string | null) => void;
};

export function DiagramNode({ node, active, highlighted, connected, interactive, onActivate, onPreview }: Props) {
  const className = `w-full border p-4 text-left transition-[border-color,background-color,opacity,transform] duration-[var(--motion-standard)] ${active || highlighted ? "border-[var(--accent-gold)] bg-[var(--accent-green)] shadow-[0_0_0_1px_var(--accent-gold)]" : connected ? "border-[var(--accent-gold)] bg-[var(--surface-soft)]" : "border-[var(--border)] bg-[var(--background)]"}`;
  const content = <><p className="break-words text-sm font-semibold">{node.label}</p>{node.description && <p className="mt-2 text-xs leading-5 text-[var(--text-secondary)]">{node.description}</p>}</>;

  return <li className="min-w-0">{interactive ? <button type="button" aria-pressed={active} aria-label={`${node.label}. ${active ? "Clear" : "Show"} connected relationships`} className={`${className} focus-ring min-h-11 cursor-pointer`} onClick={() => onActivate(node.id)} onMouseEnter={() => onPreview(node.id)} onMouseLeave={() => onPreview(null)} onFocus={() => onPreview(node.id)} onBlur={() => onPreview(null)}>{content}</button> : <div className={className}>{content}</div>}</li>;
}
