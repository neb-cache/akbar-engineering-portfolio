import type { DiagramGroup as DiagramGroupType, DiagramNode as DiagramNodeType } from "@/types/authority";
import { DiagramNode } from "./diagram-node";
export function DiagramGroup({ group, nodes }: { group: DiagramGroupType; nodes: DiagramNodeType[] }) { return <section className="min-w-0 border-t border-[var(--accent-gold)] pt-4"><h3 className="font-mono text-[.65rem] uppercase tracking-[.12em] text-[var(--accent-gold)]">{group.label}</h3><ul className="mt-4 grid gap-3">{nodes.map((node)=><DiagramNode key={node.id} node={node}/>)}</ul></section>; }
