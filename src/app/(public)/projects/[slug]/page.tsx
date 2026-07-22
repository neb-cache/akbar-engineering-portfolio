import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CodeXml, ExternalLink } from "lucide-react";
import { ArchitectureDiagram } from "@/components/public/architecture-diagram";
import { CaseStudySections } from "@/components/public/case-study-sections";
import { ConfidentialityBadge } from "@/components/public/confidentiality-badge";
import { ProjectCard } from "@/components/public/project-card";
import { ProjectGallery } from "@/components/public/project-gallery";
import { ProjectMetrics } from "@/components/public/project-metrics";
import { TechnologyList } from "@/components/public/technology-list";
import { getPublicProjectAuthoritySafe, getPublicProjectBySlug, getPublicProjects } from "@/lib/public/data";
import { absoluteUrl, defaultDescription } from "@/lib/public/metadata";
import { projectYear, publicProjectDescription } from "@/lib/public/project-presenter";

const Github = CodeXml;
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const project = await getPublicProjectBySlug(slug);
    if (!project) return { title: "Project not found", robots: { index: false } };
    return { title: project.title, description: project.short_description, alternates: { canonical: `/projects/${project.slug}` }, openGraph: { title: project.title, description: project.short_description, url: absoluteUrl(`/projects/${project.slug}`), type: "article" }, twitter: { card: "summary_large_image", title: project.title, description: project.short_description } };
  } catch { return { title: "Project record", description: defaultDescription }; }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) notFound();
  const [project, all] = await Promise.all([getPublicProjectBySlug(slug), getPublicProjects()]);
  if (!project) notFound();
  const authority = await getPublicProjectAuthoritySafe(project.id);
  const related = all.filter((item) => item.id !== project.id && (item.project_type === project.project_type || item.project_technologies.some((tech) => project.project_technologies.some((current) => current.name === tech.name)))).slice(0, 2);
  const hasStructuredCaseStudy = authority.sections.length > 0;

  return <article>
    <header className="border-b border-[var(--border)] py-16 sm:py-24"><div className="public-container"><Link href="/projects" className="focus-ring inline-flex items-center gap-2 font-mono text-[.68rem] uppercase tracking-[.12em] text-[var(--text-secondary)] underline"><ArrowLeft size={14}/>Back to archive</Link><div className="mt-12 grid gap-10 lg:grid-cols-[1.35fr_.65fr]"><div><p className="editorial-label">Professional case study / {projectYear(project)}</p>{project.confidential&&<div className="mt-6"><ConfidentialityBadge/></div>}<h1 className="editorial-title mt-7 break-words text-6xl sm:text-8xl lg:text-[7rem]">{project.title}</h1><p className="mt-7 max-w-3xl text-lg leading-8 text-[var(--text-secondary)]">{project.short_description}</p></div><dl className="self-end border-y border-[var(--border)] py-2 text-sm">{[["Classification",project.project_type],["Role",project.role],["Organization",project.company],["Period",projectYear(project)]].map(([label,value])=>value&&<div key={label} className="grid grid-cols-[7rem_1fr] gap-4 border-b border-[var(--border)] py-3 last:border-0"><dt className="editorial-label !text-[.58rem]">{label}</dt><dd>{value}</dd></div>)}</dl></div></div></header>
    <div className="public-container grid gap-14 py-16 lg:grid-cols-[minmax(0,1fr)_16rem] lg:py-24"><div className="min-w-0 space-y-16">
      <ProjectMetrics metrics={authority.metrics}/>
      {hasStructuredCaseStudy ? <CaseStudySections sections={authority.sections}/> : <><section><h2 className="editorial-label">Overview</h2><p className="mt-5 max-w-3xl font-serif text-3xl leading-[1.25] text-[var(--paper)]">{publicProjectDescription(project)}</p>{project.confidential&&<p className="mt-6 border-l border-[var(--accent-gold)] pl-5 text-sm italic leading-7 text-[var(--text-secondary)]">Selected implementation details are omitted due to confidentiality.</p>}</section>{project.project_highlights.length>0&&<section><h2 className="editorial-label">Engineering record</h2><ol className="mt-6 divide-y divide-[var(--border)] border-y border-[var(--border)]">{project.project_highlights.map((highlight,index)=><li key={highlight.id} className="grid grid-cols-[2.5rem_1fr] gap-5 py-5 text-sm leading-7"><span className="font-mono text-[var(--accent-gold)]">{String(index+1).padStart(2,"0")}</span>{highlight.content}</li>)}</ol></section>}</>}
      {authority.diagrams.map((diagram)=><ArchitectureDiagram key={diagram.id} diagram={diagram}/>)}
      <ProjectGallery images={project.project_images} cover={project.cover_image_url} title={project.title}/>
    </div><aside><div className="sticky top-28 border border-[var(--border)] bg-[var(--surface)] p-5"><h2 className="editorial-label">Technology index</h2><div className="mt-5"><TechnologyList items={project.project_technologies.map((item)=>item.name)}/></div>{!project.confidential&&(project.live_url||project.github_url)&&<div className="mt-7 space-y-3 border-t border-[var(--border)] pt-5">{project.live_url&&<a href={project.live_url} target="_blank" rel="noreferrer" className="focus-ring flex items-center gap-2 text-sm underline">Open live project <ExternalLink size={14}/></a>}{project.github_url&&<a href={project.github_url} target="_blank" rel="noreferrer" className="focus-ring flex items-center gap-2 text-sm underline">View source <Github size={14}/></a>}</div>}<p className="mt-7 border-t border-[var(--border)] pt-5 text-xs leading-6 text-[var(--text-secondary)]">Only explicitly approved case-study evidence is included in this public record.</p></div></aside></div>
    {related.length>0&&<section className="editorial-section bg-[var(--surface)]"><div className="public-container"><p className="editorial-label mb-8">Related work</p><div className="grid gap-px bg-[var(--border)] lg:grid-cols-2">{related.map((item,index)=><ProjectCard key={item.id} project={item} index={index}/>)}</div></div></section>}
  </article>;
}
