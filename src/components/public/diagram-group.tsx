import type { DiagramGroup as DiagramGroupType, DiagramNode as DiagramNodeType } from "@/types/authority";
import { DiagramNode } from "./diagram-node";

type Props = {
  group: DiagramGroupType;
  nodes: DiagramNodeType[];
  activeNode: string | null;
  highlightedNode: string | null;
  connectedIds: Set<string>;
  connectedNodeIds: Set<string>;
  onActivate: (id: string) => void;
  onPreview: (id: string | null) => void;
};

export function DiagramGroup({ group, nodes, activeNode, highlightedNode, connectedIds, connectedNodeIds, onActivate, onPreview }: Props) {
  return <section className="min-w-0 border-t border-[var(--accent-gold)] pt-4"><h3 className="font-mono text-xs uppercase tracking-[.1em] text-[var(--accent-gold)]">{group.label}</h3><ul className="mt-4 grid gap-3">{nodes.map((node) => <DiagramNode key={node.id} node={node} active={activeNode === node.id} highlighted={highlightedNode === node.id} connected={connectedIds.has(node.id)} interactive={Boolean(node.description) || connectedNodeIds.has(node.id)} onActivate={onActivate} onPreview={onPreview} />)}</ul></section>;
}
