"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { publicNavigation } from "@/lib/public/navigation";
import { ResumeLink } from "./resume-link";

export function Navbar({ resumeUrl }: { resumeUrl: string | null }) {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const menuRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const active = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  function closeMenu(returnFocus = true) {
    setOpenPath(null);
    if (returnFocus) requestAnimationFrame(() => triggerRef.current?.focus());
  }

  useEffect(() => {
    if (!open) return;
    const menu = menuRef.current;
    if (!menu) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = () => Array.from(menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'));
    requestAnimationFrame(() => focusable()[0]?.focus());

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[rgba(23,19,15,.94)] backdrop-blur-md">
      <div className="public-container flex min-h-20 items-center justify-between gap-5">
        <Link href="/" className="focus-ring flex items-baseline gap-3" aria-label="Akbar A.R. home">
          <span className="font-serif text-2xl font-semibold">Akbar A.R.</span>
          <span className="hidden font-mono text-xs uppercase tracking-[.1em] text-[var(--text-secondary)] xl:inline">Full-Stack & Systems Engineer</span>
        </Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-6 lg:flex">
          {publicNavigation.map((item) => (
            <Link key={item.href} href={item.href} aria-current={active(item.href) ? "page" : undefined} className={`nav-link focus-ring py-2 font-mono text-xs uppercase tracking-[.1em] transition-colors duration-[var(--motion-fast)] ${active(item.href) ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>
              {item.label}
            </Link>
          ))}
          <ResumeLink url={resumeUrl}/>
        </nav>
        <button ref={triggerRef} type="button" className="button-base button-secondary button-icon lg:hidden" onClick={() => open ? closeMenu() : setOpenPath(pathname)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close navigation" : "Open navigation"}>
          {open ? <X aria-hidden="true"/> : <Menu aria-hidden="true"/>}
        </button>
      </div>
      {open && (
        <nav ref={menuRef} id="mobile-navigation" aria-label="Mobile navigation" className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-[var(--border)] bg-[var(--surface)] px-4 py-5 shadow-2xl lg:hidden">
          <div className="public-container grid gap-1">
            {publicNavigation.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => closeMenu(false)} aria-current={active(item.href) ? "page" : undefined} className={`focus-ring min-h-12 border-l px-4 py-3 font-serif text-2xl transition-colors duration-[var(--motion-fast)] ${active(item.href) ? "border-[var(--accent-gold)] bg-[var(--surface-soft)] text-[var(--text-primary)]" : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent-brown)] hover:text-[var(--text-primary)]"}`}>
                {item.label}
              </Link>
            ))}
            <div className="mt-4"><ResumeLink url={resumeUrl}/></div>
          </div>
        </nav>
      )}
    </header>
  );
}
