import type { PublicProjectMetricRow } from "@/types/database";

export function ProjectMetrics({ metrics }: { metrics: PublicProjectMetricRow[] }) {
  if (!metrics.length) return null;
  return <section aria-labelledby="project-metrics"><h2 id="project-metrics" className="editorial-label mb-5">Evidence-backed metrics</h2><dl className="grid gap-px bg-[var(--border)] sm:grid-cols-2">{metrics.map((metric)=><div key={metric.id} className="paper-panel p-6"><dt className="editorial-label !text-[var(--accent-brown)]">{metric.label}</dt><dd className="mt-5 font-serif text-5xl leading-none">{metric.value}</dd>{metric.context&&<dd className="mt-4 text-xs leading-6 text-[rgba(24,19,15,.68)]">{metric.context}</dd>}</div>)}</dl></section>;
}
