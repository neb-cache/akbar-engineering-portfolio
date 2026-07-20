import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projectYear } from "@/lib/public/project-presenter";
import type { PublicProject } from "@/types/project";
import { ConfidentialityBadge } from "./confidentiality-badge";
import { TechnologyList } from "./technology-list";

export function ProjectCard({ project, index, paper = false }: { project: PublicProject; index: number; paper?: boolean }) {
  return <article className={`group relative flex min-h-[25rem] flex-col justify-between border p-6 sm:p-8 ${paper ? "paper-panel border-transparent" : "border-[var(--border)] bg-[var(--surface)]"}`}>
    <div><div className="flex items-start justify-between gap-5"><p className={`editorial-label ${paper ? "!text-[var(--accent-brown)]" : ""}`}>Archive / {String(index + 1).padStart(2,"0")}</p><span className={`font-mono text-xs ${paper ? "text-[var(--accent-brown)]" : "text-[var(--text-secondary)]"}`}>{projectYear(project)}</span></div><div className="mt-8 min-h-10">{project.confidential && <ConfidentialityBadge/>}</div><h3 className="mt-5 font-serif text-4xl font-medium leading-[.95] sm:text-5xl">{project.title}</h3><p className={`mt-6 text-sm leading-7 ${paper ? "text-[rgba(24,19,15,.72)]" : "text-[var(--text-secondary)]"}`}>{project.short_description}</p></div>
    <div className="mt-10"><dl className={`mb-5 grid grid-cols-2 gap-4 border-t pt-4 text-xs ${paper ? "border-[rgba(24,19,15,.25)]" : "border-[var(--border)]"}`}><div><dt className="editorial-label !text-[.58rem]">Record</dt><dd className="mt-1">{project.project_type ?? "Engineering project"}</dd></div><div><dt className="editorial-label !text-[.58rem]">Role</dt><dd className="mt-1">{project.role ?? "Engineer"}</dd></div></dl><TechnologyList items={project.project_technologies.map(item=>item.name)} limit={6} dark={paper}/><Link href={`/projects/${project.slug}`} className={`focus-ring mt-7 inline-flex items-center gap-2 border-b pb-1 text-sm font-semibold ${paper ? "border-[var(--ink)]" : "border-[var(--accent-gold)]"}`}>Open technical record <ArrowUpRight size={15}/></Link></div>
  </article>;
}
