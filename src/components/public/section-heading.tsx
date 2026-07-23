import { Reveal } from "./reveal";

export function SectionHeading({ label, title, description }: { label: string; title: string; description?: string }) {
  return <Reveal variant="fade-up"><header className="mb-10 grid gap-5 md:grid-cols-[10rem_1fr] md:gap-10">
    <p className="editorial-label pt-2">{label}</p>
    <div><h2 className="editorial-title max-w-3xl text-[clamp(2.65rem,6vw,4rem)]">{title}</h2>{description && <p className="reading-measure mt-5 text-sm leading-7 text-[var(--text-secondary)] sm:text-base">{description}</p>}</div>
  </header></Reveal>;
}
