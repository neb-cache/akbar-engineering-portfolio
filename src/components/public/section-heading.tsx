export function SectionHeading({ label, title, description }: { label: string; title: string; description?: string }) {
  return <header className="mb-10 grid gap-5 md:grid-cols-[10rem_1fr] md:gap-10">
    <p className="editorial-label pt-2">{label}</p>
    <div><h2 className="editorial-title max-w-3xl text-4xl sm:text-5xl lg:text-6xl">{title}</h2>{description && <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--text-secondary)] sm:text-base">{description}</p>}</div>
  </header>;
}
