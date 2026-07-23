import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projectYear } from "@/lib/public/project-presenter";
import type { PublicProject } from "@/types/project";
import { ConfidentialityBadge } from "./confidentiality-badge";
import { Reveal } from "./reveal";
import { TechnologyList } from "./technology-list";

export function ProjectCard({ project, index, paper = false }: { project: PublicProject; index: number; paper?: boolean }) {
  return <Reveal className="h-full" delay={Math.min(index * 60, 180)}><article className={`interactive-panel group relative flex min-h-[22rem] h-full flex-col justify-between border p-6 sm:min-h-[25rem] sm:p-8 ${paper ? "paper-panel border-transparent" : "border-[var(--border)] bg-[var(--surface)]"}`}>
    <div><div className="flex items-start justify-between gap-5"><p className={`editorial-label ${paper ? "!text-[var(--accent-brown)]" : ""}`}>Archive / {String(index + 1).padStart(2,"0")}</p><span className={`font-mono text-xs ${paper ? "text-[var(--accent-brown)]" : "text-[var(--text-secondary)]"}`}>{projectYear(project)}</span></div><div className="mt-7 min-h-9">{project.confidential && <ConfidentialityBadge/>}</div><h3 className="interactive-title mt-5 font-serif text-[clamp(2.5rem,7vw,3.35rem)] font-medium leading-[.95]">{project.title}</h3><p className={`reading-measure mt-6 text-sm leading-7 ${paper ? "text-[rgba(24,19,15,.72)]" : "text-[var(--text-secondary)]"}`}>{project.short_description}</p></div>
    <div className="mt-10"><dl className={`mb-5 grid gap-4 border-t pt-4 text-xs min-[390px]:grid-cols-2 ${paper ? "border-[rgba(24,19,15,.25)]" : "border-[var(--border)]"}`}><div><dt className={`font-mono text-xs uppercase tracking-[.1em] ${paper ? "text-[var(--accent-brown)]" : "text-[var(--accent-gold)]"}`}>Record</dt><dd className="mt-1 break-words">{project.project_type ?? "Engineering project"}</dd></div><div><dt className={`font-mono text-xs uppercase tracking-[.1em] ${paper ? "text-[var(--accent-brown)]" : "text-[var(--accent-gold)]"}`}>Role</dt><dd className="mt-1 break-words">{project.role ?? "Engineer"}</dd></div></dl><TechnologyList items={project.project_technologies.map(item=>item.name)} limit={6} dark={paper}/><Link href={`/projects/${project.slug}`} className={`button-base button-editorial mt-7 ${paper ? "!border-[var(--ink)]" : ""}`}>Open technical record <ArrowUpRight size={15}/></Link></div>
  </article></Reveal>;
}
