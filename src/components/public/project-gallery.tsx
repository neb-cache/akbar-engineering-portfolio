"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { PublicProjectImageRow } from "@/types/database";

export function ProjectGallery({ images, cover, title }: { images: PublicProjectImageRow[]; cover: string | null; title: string }) {
  const records: PublicProjectImageRow[] = cover
    ? [{ id: "cover", image_url: cover, alt_text: `${title} cover image`, caption: null, project_id: "", sort_order: -1, image_category: "interface" }, ...images.filter((image) => image.image_url !== cover)]
    : images;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (activeIndex === null) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!dialog.open) dialog.showModal();
    return () => { document.body.style.overflow = previousOverflow; };
  }, [activeIndex]);

  if (!records.length) return null;
  const activeImage = activeIndex === null ? null : records[activeIndex];

  function openImage(index: number, trigger: HTMLButtonElement) {
    returnFocusRef.current = trigger;
    setActiveIndex(index);
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  function finishClose() {
    setActiveIndex(null);
    requestAnimationFrame(() => returnFocusRef.current?.focus());
  }

  function move(direction: -1 | 1) {
    setActiveIndex((current) => current === null ? null : (current + direction + records.length) % records.length);
  }

  return (
    <section aria-labelledby="project-gallery">
      <h2 id="project-gallery" className="editorial-label mb-5">Visual evidence</h2>
      <div className="grid gap-5 md:grid-cols-2">
        {records.map((image, index) => (
          <figure key={image.id} className={`group min-w-0 ${index === 0 ? "md:col-span-2" : ""}`}>
            <button type="button" aria-haspopup="dialog" aria-label={`Expand ${image.alt_text ?? `${title} project image`}`} onClick={(event) => openImage(index, event.currentTarget)} className="focus-ring relative block aspect-[16/9] w-full overflow-hidden border border-[var(--border)] bg-[var(--surface)] text-left transition-colors duration-[var(--motion-standard)] hover:border-[var(--accent-gold)]">
              <Image src={image.image_url} alt={image.alt_text ?? `${title} project image`} fill sizes={index === 0 ? "(max-width: 1280px) 100vw, 1200px" : "(max-width: 768px) 100vw, 600px"} className="image-treatment object-cover" />
              <span className="absolute right-3 top-3 inline-flex min-h-11 min-w-11 items-center justify-center border border-[var(--border)] bg-[rgba(23,19,15,.88)] text-[var(--paper)]" aria-hidden="true"><Expand size={17} /></span>
            </button>
            <figcaption className="mt-3 flex flex-wrap items-start justify-between gap-3 font-mono text-xs leading-5 text-[var(--text-secondary)]"><span className="max-w-[65ch]">{image.caption || image.alt_text}</span>{image.image_category && <span className="uppercase tracking-[.1em] text-[var(--accent-gold)]">{image.image_category}</span>}</figcaption>
          </figure>
        ))}
      </div>

      <dialog ref={dialogRef} className="gallery-dialog" aria-labelledby="gallery-dialog-title" onCancel={(event) => { event.preventDefault(); closeDialog(); }} onClose={finishClose}>
        {activeImage && (
          <div className="grid max-h-[92dvh] grid-rows-[auto_minmax(0,1fr)_auto]">
            <header className="flex items-center justify-between gap-4 border-b border-[var(--border)] px-4 py-3 sm:px-6">
              <div className="min-w-0"><p className="editorial-label">Visual evidence / {String(activeIndex! + 1).padStart(2, "0")}</p><h2 id="gallery-dialog-title" className="truncate font-serif text-2xl sm:text-3xl">{title}</h2></div>
              <button type="button" className="button-base button-secondary button-icon shrink-0" onClick={closeDialog} aria-label="Close expanded image"><X aria-hidden="true" size={19} /></button>
            </header>
            <div className="relative min-h-[35vh] overflow-hidden bg-black sm:min-h-[55vh]">
              <Image src={activeImage.image_url} alt={activeImage.alt_text ?? `${title} project image`} fill sizes="94vw" className="object-contain" priority />
            </div>
            <footer className="grid gap-4 border-t border-[var(--border)] px-4 py-4 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:px-6">
              <button type="button" className="button-base button-secondary" onClick={() => move(-1)} aria-label="Previous image"><ChevronLeft aria-hidden="true" size={17} /> Previous</button>
              <p className="text-center text-sm leading-6 text-[var(--text-secondary)]">{activeImage.caption || activeImage.alt_text || `${title} project image`}</p>
              <button type="button" className="button-base button-secondary" onClick={() => move(1)} aria-label="Next image">Next <ChevronRight aria-hidden="true" size={17} /></button>
            </footer>
          </div>
        )}
      </dialog>
    </section>
  );
}
