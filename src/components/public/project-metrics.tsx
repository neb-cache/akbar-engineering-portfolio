import type { PublicProjectMetricRow } from "@/types/database";
import { Reveal } from "./reveal";

export function ProjectMetrics({ metrics }: { metrics: PublicProjectMetricRow[] }) {
  if (!metrics.length) return null;
  return <section aria-labelledby="project-metrics"><h2 id="project-metrics" className="editorial-label mb-5">Evidence-backed metrics</h2><dl className="grid gap-px bg-[var(--border)] sm:grid-cols-2">{metrics.map((metric,index)=><Reveal key={metric.id} className="interactive-panel paper-panel h-full p-6" delay={Math.min(index*70,210)} variant="scale-subtle"><dt className="editorial-label !text-[var(--accent-brown)]">{metric.label}</dt><dd className="mt-5 break-words font-serif text-[clamp(2.75rem,8vw,4rem)] leading-none">{metric.value}</dd>{metric.context&&<dd className="mt-4 text-sm leading-6 text-[rgba(24,19,15,.68)]">{metric.context}</dd>}</Reveal>)}</dl></section>;
}
