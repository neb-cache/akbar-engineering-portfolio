import type { PublicProject } from "@/types/project";

export function projectYear(project: PublicProject) {
  if (!project.year_start) return "Undated";
  if (!project.year_end || project.year_end === project.year_start) return String(project.year_start);
  return `${project.year_start}—${project.year_end}`;
}

export function publicProjectDescription(project: PublicProject) {
  return project.confidential ? project.short_description : (project.description ?? project.short_description);
}
