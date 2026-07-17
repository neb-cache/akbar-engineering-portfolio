import type { ProjectHighlightRow, ProjectRow, ProjectTechnologyRow } from "./database";

export type Project = ProjectRow & {
  project_technologies: ProjectTechnologyRow[];
  project_highlights: ProjectHighlightRow[];
};
