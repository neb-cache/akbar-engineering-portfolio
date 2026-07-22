import type { PublicProjectAuthority } from "@/types/authority";
import { DiagramEdge } from "./diagram-edge";
import { DiagramGroup } from "./diagram-group";
import { DiagramTextAlternative } from "./diagram-text-alternative";

export function ArchitectureDiagram({ diagram }: { diagram: PublicProjectAuthority["diagrams"][number] }) {
  const labels = new Map(diagram.diagram_data.nodes.map((node)=>[node.id,node.label]));
  const grouped = diagram.diagram_data.groups.map((group)=>({ group, nodes: diagram.diagram_data.nodes.filter((node)=>node.group===group.id) }));
  const ungrouped = diagram.diagram_data.nodes.filter((node)=>!node.group);
  return <figure className="technical-grid border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-8"><figcaption><p className="editorial-label">{diagram.diagram_type.replace("-"," ")} / Public-safe diagram</p><h2 className="mt-4 font-serif text-4xl">{diagram.title}</h2>{diagram.description&&<p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{diagram.description}</p>}</figcaption><div className="mt-8 grid min-w-0 gap-6 md:grid-cols-3">{grouped.map(({group,nodes})=><DiagramGroup key={group.id} group={group} nodes={nodes}/>)}{ungrouped.length>0&&<DiagramGroup group={{id:"other",label:"Other"}} nodes={ungrouped}/>}</div>{diagram.diagram_data.edges.length>0&&<div className="mt-8 border-t border-[var(--border)] pt-6"><p className="editorial-label mb-4">Relationships</p><ul className="grid gap-3 sm:grid-cols-2">{diagram.diagram_data.edges.map((edge,index)=><DiagramEdge key={`${edge.from}-${edge.to}-${index}`} edge={edge} labels={labels}/>)}</ul></div>}<DiagramTextAlternative text={diagram.text_alternative}/></figure>;
}
