import { notFound } from "next/navigation";
import { CaseStudySectionEditor } from "@/components/admin/case-study-section-editor";
import { ProjectDiagramEditor } from "@/components/admin/project-diagram-editor";
import { ProjectForm } from "@/components/admin/project-form";
import { ProjectMediaEditor } from "@/components/admin/project-media-editor";
import { ProjectMetricEditor } from "@/components/admin/project-metric-editor";
import { getAdminCaseStudySections, getAdminProjectDiagrams, getAdminProjectImages, getAdminProjectMetrics } from "@/lib/services/authority";
import { getProjectById } from "@/lib/services/projects";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();
  const [sections, metrics, diagrams, images] = await Promise.all([getAdminCaseStudySections(id), getAdminProjectMetrics(id), getAdminProjectDiagrams(id), getAdminProjectImages(id)]);
  return <div className="space-y-8"><div><h1 className="text-2xl font-semibold">Edit project</h1><p className="mt-1 text-sm text-slate-500">Core record, structured authority evidence, and explicit public visibility controls.</p></div><ProjectForm id={id} initial={{
    title: project.title, slug: project.slug, shortDescription: project.short_description, description: project.description,
    role: project.role ?? "", company: project.company ?? "", clientName: project.client_name ?? "", projectType: project.project_type ?? "",
    status: project.status, yearStart: project.year_start, yearEnd: project.year_end, featured: project.featured, confidential: project.confidential,
    coverImageUrl: project.cover_image_url ?? "", liveUrl: project.live_url ?? "", githubUrl: project.github_url ?? "", caseStudyUrl: project.case_study_url ?? "",
    sortOrder: project.sort_order, technologies: project.project_technologies.sort((a,b)=>a.sort_order-b.sort_order).map((item)=>item.name),
    highlights: project.project_highlights.sort((a,b)=>a.sort_order-b.sort_order).map((item)=>item.content),
  }}/><div className="space-y-6 border-t-4 border-slate-900 pt-8"><div><h2 className="text-xl font-semibold">Authority content</h2><p className="mt-1 text-sm text-slate-500">Every child record is private by default and independently publishable.</p></div><CaseStudySectionEditor projectId={id} items={sections}/><ProjectMetricEditor projectId={id} items={metrics}/><ProjectDiagramEditor projectId={id} items={diagrams}/><ProjectMediaEditor projectId={id} items={images}/></div></div>;
}
