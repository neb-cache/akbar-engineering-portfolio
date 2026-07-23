"use client";

import { useMemo, useState } from "react";
import type { PublicProjectAuthority } from "@/types/authority";
import { DiagramEdge } from "./diagram-edge";
import { DiagramGroup } from "./diagram-group";
import { DiagramTextAlternative } from "./diagram-text-alternative";

export function ArchitectureDiagram({ diagram }: { diagram: PublicProjectAuthority["diagrams"][number] }) {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [previewNode, setPreviewNode] = useState<string | null>(null);
  const currentNode = previewNode ?? activeNode;
  const labels = useMemo(() => new Map(diagram.diagram_data.nodes.map((node) => [node.id, node.label])), [diagram.diagram_data.nodes]);
  const grouped = diagram.diagram_data.groups.map((group) => ({ group, nodes: diagram.diagram_data.nodes.filter((node) => node.group === group.id) }));
  const ungrouped = diagram.diagram_data.nodes.filter((node) => !node.group);
  const connectedIds = new Set(
    diagram.diagram_data.edges.flatMap((edge) => edge.from === currentNode ? [edge.to] : edge.to === currentNode ? [edge.from] : []),
  );
  const activeLabel = activeNode ? labels.get(activeNode) : null;

  return (
    <figure className="technical-grid min-w-0 overflow-hidden border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-8">
      <figcaption>
        <p className="editorial-label">{diagram.diagram_type.replace("-", " ")} / Public-safe diagram</p>
        <h2 className="mt-4 break-words font-serif text-[clamp(2.5rem,7vw,3.25rem)] leading-tight">{diagram.title}</h2>
        {diagram.description && <p className="reading-measure mt-3 text-sm leading-7 text-[var(--text-secondary)]">{diagram.description}</p>}
      </figcaption>

      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-y border-[var(--border)] py-3 font-mono text-xs uppercase tracking-[.08em] text-[var(--text-secondary)]" aria-label="Diagram legend">
        <span><i aria-hidden="true" className="mr-2 inline-block h-2 w-2 bg-[var(--accent-gold)]" />Selected</span>
        <span><i aria-hidden="true" className="mr-2 inline-block h-2 w-2 border border-[var(--accent-gold)]" />Connected</span>
        <span>Activate a node to trace relationships</span>
      </div>

      <div className="mt-8 grid min-w-0 gap-6 md:grid-cols-3">
        {grouped.map(({ group, nodes }) => (
          <DiagramGroup
            key={group.id}
            group={group}
            nodes={nodes}
            activeNode={activeNode}
            highlightedNode={currentNode}
            connectedIds={connectedIds}
            connectedNodeIds={new Set(diagram.diagram_data.edges.flatMap((edge) => [edge.from, edge.to]))}
            onActivate={(id) => setActiveNode((current) => current === id ? null : id)}
            onPreview={setPreviewNode}
          />
        ))}
        {ungrouped.length > 0 && (
          <DiagramGroup
            group={{ id: "other", label: "Other" }}
            nodes={ungrouped}
            activeNode={activeNode}
            highlightedNode={currentNode}
            connectedIds={connectedIds}
            connectedNodeIds={new Set(diagram.diagram_data.edges.flatMap((edge) => [edge.from, edge.to]))}
            onActivate={(id) => setActiveNode((current) => current === id ? null : id)}
            onPreview={setPreviewNode}
          />
        )}
      </div>

      {activeLabel && <p role="status" aria-live="polite" className="mt-5 border-l border-[var(--accent-gold)] pl-4 text-sm text-[var(--paper-soft)]"><strong>{activeLabel}</strong> is selected. Its connected relationships are emphasized.</p>}

      {diagram.diagram_data.edges.length > 0 && (
        <div className="mt-8 border-t border-[var(--border)] pt-6">
          <p className="editorial-label mb-4">Relationships</p>
          <ul className="grid gap-3 lg:grid-cols-2">
            {diagram.diagram_data.edges.map((edge, index) => <DiagramEdge key={`${edge.from}-${edge.to}-${index}`} edge={edge} labels={labels} active={Boolean(currentNode && (edge.from === currentNode || edge.to === currentNode))} dimmed={Boolean(currentNode && edge.from !== currentNode && edge.to !== currentNode)} />)}
          </ul>
        </div>
      )}
      <DiagramTextAlternative text={diagram.text_alternative} />
    </figure>
  );
}
