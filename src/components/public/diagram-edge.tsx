import { ArrowRight } from "lucide-react";
import type { DiagramEdge as DiagramEdgeType } from "@/types/authority";

export function DiagramEdge({ edge, labels, active = false, dimmed = false }: { edge: DiagramEdgeType; labels: Map<string, string>; active?: boolean; dimmed?: boolean }) {
  return <li className={`grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 border-l py-2 pl-3 text-xs transition-[border-color,opacity,background-color] duration-[var(--motion-standard)] sm:gap-3 ${active ? "border-[var(--accent-gold)] bg-[rgba(181,148,91,.08)]" : "border-transparent"} ${dimmed ? "opacity-35" : "opacity-100"}`}><span className="break-words">{labels.get(edge.from) ?? edge.from}</span><span className="flex items-center gap-2 font-mono text-[.7rem] uppercase text-[var(--accent-gold)]"><span className="sr-only sm:not-sr-only">{edge.label}</span><ArrowRight size={13} aria-hidden="true" /></span><span className="break-words text-right">{labels.get(edge.to) ?? edge.to}</span></li>;
}
