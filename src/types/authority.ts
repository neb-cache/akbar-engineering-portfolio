import type {
  PublicCaseStudySectionRow,
  PublicProjectDiagramRow,
  PublicProjectMetricRow,
} from "./database";

export type DiagramNode = { id: string; label: string; group?: string; description?: string };
export type DiagramEdge = { from: string; to: string; label?: string };
export type DiagramGroup = { id: string; label: string };
export type DiagramData = { nodes: DiagramNode[]; edges: DiagramEdge[]; groups: DiagramGroup[] };

export type PublicProjectAuthority = {
  sections: PublicCaseStudySectionRow[];
  metrics: PublicProjectMetricRow[];
  diagrams: Array<Omit<PublicProjectDiagramRow, "diagram_data"> & { diagram_data: DiagramData }>;
};
