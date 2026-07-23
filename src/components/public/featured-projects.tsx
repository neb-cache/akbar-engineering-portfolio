import Link from "next/link";
import type { PublicProject } from "@/types/project";
import { EmptyState } from "./empty-state";
import { ProjectCard } from "./project-card";
import { SectionHeading } from "./section-heading";

export function FeaturedProjects({ projects }: { projects: PublicProject[] }) {
  const featured = projects.filter(project => project.featured).slice(0,6);
  return <section className="editorial-section"><div className="public-container"><SectionHeading label="Selected work" title="Systems built for real operational constraints." description="A selection of enterprise platforms, integrated applications, mobile delivery, and intelligent systems."/>{featured.length ? <div className="grid gap-px bg-[var(--border)] lg:grid-cols-2">{featured.map((project,index)=><ProjectCard key={project.id} project={project} index={index} paper={index===0}/>)}</div> : <EmptyState title="The archive is being prepared." description="Published project records will appear here once available."/>}<div className="mt-8 text-right"><Link href="/projects" className="button-base button-editorial">View complete project archive →</Link></div></div></section>;
}
