import type { Skill } from "@/types/skill";
import { SectionHeading } from "./section-heading";

const order = ["Backend","Frontend","Mobile","AI & Automation","ERP & Integration","Infrastructure & DevOps","Database","Engineering Leadership"];

export function CapabilityIndex({ skills }: { skills: Skill[] }) {
  const grouped = new Map<string,Skill[]>(); skills.forEach(skill=>grouped.set(skill.category,[...(grouped.get(skill.category)??[]),skill]));
  return <section className="editorial-section bg-[var(--surface)]"><div className="public-container"><SectionHeading label="Engineering index" title="Capability across the delivery chain." description="Technology is selected around the operating problem, integration boundary, and long-term ownership model."/><div className="grid border-l border-t border-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">{order.map((category,index)=><article key={category} className="interactive-panel min-h-64 border-b border-r border-[var(--border)] p-6"><div className="flex justify-between gap-4"><p className="editorial-label">{String(index+1).padStart(2,"0")}</p><span className="font-serif text-4xl text-[var(--accent-brown)]">{index+1}</span></div><h3 className="mt-5 font-serif text-2xl leading-none">{category}</h3><ul className="mt-6 space-y-2 font-mono text-xs uppercase tracking-[.06em] text-[var(--text-secondary)]">{(grouped.get(category)??[]).map(skill=><li key={skill.id}>{skill.name}</li>)}</ul></article>)}</div></div></section>;
}
