import Link from "next/link";
import { ArrowDownRight } from "lucide-react";
import type { PublicSiteProfile } from "@/lib/public/data";
import { ResumeLink } from "./resume-link";

export function Hero({ profile }: { profile: PublicSiteProfile }) {
  const records = [profile.location, profile.availability, "3+ years of professional engineering experience"];
  return <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32"><div className="public-container grid gap-14 lg:grid-cols-[1.55fr_.75fr] lg:gap-16">
    <div><p className="editorial-label">Principal Full-Stack & Systems Engineer</p><h1 className="editorial-title mt-7 max-w-5xl text-[clamp(3.8rem,8vw,7.8rem)]">{profile.heroTitle}</h1><p className="mt-8 max-w-2xl text-base leading-8 text-[var(--text-secondary)] sm:text-lg">{profile.heroDescription}</p><div className="mt-10 flex flex-wrap gap-3"><Link href="/projects" className="focus-ring inline-flex items-center gap-2 bg-[var(--paper)] px-5 py-3 text-xs font-semibold uppercase tracking-[.1em] text-[var(--ink)] hover:bg-[var(--paper-soft)]">View selected work <ArrowDownRight size={16}/></Link><ResumeLink url={profile.resumeUrl}/><Link href="/contact" className="focus-ring px-4 py-3 text-xs uppercase tracking-[.1em] text-[var(--text-secondary)] underline hover:text-[var(--text-primary)]">Contact me</Link></div></div>
    <aside className="technical-grid relative self-end border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8"><p className="editorial-label">Engineering index / 2026</p><p className="mt-8 font-serif text-4xl leading-none">Cross-layer<br/>delivery record</p><ol className="mt-10 divide-y divide-[var(--border)]">{records.map((record,index)=><li key={record} className="grid grid-cols-[2rem_1fr] gap-3 py-4 text-sm leading-6"><span className="font-mono text-[var(--accent-gold)]">0{index+1}</span><span className="text-[var(--paper-soft)]">{record}</span></li>)}</ol><div className="mt-8 grid grid-cols-2 gap-3 border-t border-[var(--accent-gold)] pt-5 font-mono text-[.65rem] uppercase tracking-[.12em] text-[var(--text-secondary)]"><span>Golang / Next.js</span><span>Flutter / ERP</span><span>Automation / AI</span><span>Docker / Ubuntu</span></div></aside>
  </div></section>;
}
