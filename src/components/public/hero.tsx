import Link from "next/link";
import { ArrowDownRight } from "lucide-react";
import type { PublicSiteProfile } from "@/lib/public/data";
import { ResumeLink } from "./resume-link";

export function Hero({ profile }: { profile: PublicSiteProfile }) {
  const records = [profile.location, profile.availability, "Systems Engineering", "Enterprise Integration", "Technical Leadership", "Infrastructure & Operations", profile.secondaryIdentity, "Professional English"];
  return <section className="hero-sequence relative overflow-hidden py-14 sm:py-24 lg:py-28"><div className="public-container grid gap-12 lg:grid-cols-[1.55fr_.75fr] lg:gap-16">
    <div><p data-hero-step="1" className="editorial-label">{profile.title}</p><p data-hero-step="2" className="mt-3 font-mono text-xs uppercase tracking-[.14em] text-[var(--accent-gold)]">{profile.secondaryIdentity}</p><h1 data-hero-step="3" className="editorial-title mt-6 max-w-5xl text-[clamp(3.25rem,9.2vw,7.4rem)]">{profile.heroTitle}</h1><p data-hero-step="4" className="reading-measure mt-7 text-base leading-8 text-[var(--text-secondary)] sm:text-lg">{profile.heroDescription}</p><div data-hero-step="4" className="mt-8 flex flex-wrap gap-3"><Link href="/projects" className="button-base button-primary">View selected work <ArrowDownRight size={16}/></Link><Link href="/experience" className="button-base button-editorial">Read engineering record</Link><ResumeLink url={profile.resumeUrl}/><Link href="/contact" className="button-base button-ghost">Contact me</Link></div></div>
    <aside data-hero-step="5" className="technical-grid relative self-end border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8"><p className="editorial-label">Engineering dossier / 2026</p><p className="mt-7 font-serif text-[clamp(2.25rem,5vw,3rem)] leading-none">{profile.professionalName}<br/><span className="text-[var(--accent-gold)]">Authority index</span></p><ol className="mt-8 grid gap-x-5 sm:grid-cols-2 lg:grid-cols-1">{records.map((record,index)=><li key={record} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 border-t border-[var(--border)] py-3 text-xs leading-5"><span className="font-mono text-[var(--accent-gold)]">{String(index+1).padStart(2,"0")}</span><span className="break-words text-[var(--paper-soft)]">{record}</span></li>)}</ol></aside>
  </div></section>;
}
