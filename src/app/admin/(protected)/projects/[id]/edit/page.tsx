import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/project-form";
import { getProjectById } from "@/lib/services/projects";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const project = await getProjectById(id); if (!project) notFound();
  return <div className="space-y-5"><h1 className="text-2xl font-semibold">Edit project</h1><ProjectForm id={id} initial={{
    title: project.title, slug: project.slug, shortDescription: project.short_description, description: project.description,
    role: project.role ?? "", company: project.company ?? "", clientName: project.client_name ?? "", projectType: project.project_type ?? "",
    status: project.status, yearStart: project.year_start, yearEnd: project.year_end, featured: project.featured, confidential: project.confidential,
    coverImageUrl: project.cover_image_url ?? "", liveUrl: project.live_url ?? "", githubUrl: project.github_url ?? "", caseStudyUrl: project.case_study_url ?? "",
    sortOrder: project.sort_order, technologies: project.project_technologies.sort((a,b) => a.sort_order-b.sort_order).map(x => x.name),
    highlights: project.project_highlights.sort((a,b) => a.sort_order-b.sort_order).map(x => x.content),
  }} /></div>;
}
