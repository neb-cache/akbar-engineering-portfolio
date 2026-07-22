import type { ProjectHighlightRow, ProjectImageRow, ProjectRow, ProjectTechnologyRow, PublicProjectImageRow, PublicProjectRow } from "./database";

export type Project = ProjectRow & {
  project_technologies: ProjectTechnologyRow[];
  project_highlights: ProjectHighlightRow[];
  project_images: ProjectImageRow[];
};

export type PublicProject = PublicProjectRow & {
  project_technologies: ProjectTechnologyRow[];
  project_highlights: ProjectHighlightRow[];
  project_images: PublicProjectImageRow[];
};
