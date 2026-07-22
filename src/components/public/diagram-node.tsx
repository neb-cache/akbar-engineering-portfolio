import type { DiagramNode as DiagramNodeType } from "@/types/authority";
export function DiagramNode({ node }: { node: DiagramNodeType }) { return <li className="border border-[var(--border)] bg-[var(--background)] p-4"><p className="text-sm font-semibold">{node.label}</p>{node.description&&<p className="mt-2 text-xs leading-5 text-[var(--text-secondary)]">{node.description}</p>}</li>; }
