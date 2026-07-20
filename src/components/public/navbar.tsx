"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { publicNavigation } from "@/lib/public/navigation";
import { ResumeLink } from "./resume-link";

export function Navbar({ resumeUrl }: { resumeUrl: string | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[rgba(23,19,15,.94)] backdrop-blur-md">
      <div className="public-container flex min-h-20 items-center justify-between gap-5">
        <Link href="/" className="focus-ring flex items-baseline gap-3" aria-label="Akbar A.R. home">
          <span className="font-serif text-2xl font-semibold">Akbar A.R.</span>
          <span className="hidden font-mono text-[.58rem] uppercase tracking-[.15em] text-[var(--text-secondary)] lg:inline">Full-Stack & Systems Engineer</span>
        </Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-6 lg:flex">
          {publicNavigation.map((item) => (
            <Link key={item.href} href={item.href} aria-current={active(item.href) ? "page" : undefined} className={`focus-ring border-b py-2 font-mono text-[.66rem] uppercase tracking-[.12em] transition-colors ${active(item.href) ? "border-[var(--accent-gold)] text-[var(--text-primary)]" : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>
              {item.label}
            </Link>
          ))}
          <ResumeLink url={resumeUrl}/>
        </nav>
        <button type="button" className="focus-ring inline-flex min-h-11 min-w-11 items-center justify-center border border-[var(--border)] lg:hidden" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close navigation" : "Open navigation"}>
          {open ? <X/> : <Menu/>}
        </button>
      </div>
      {open && (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="border-t border-[var(--border)] bg-[var(--surface)] px-4 py-5 lg:hidden">
          <div className="public-container grid gap-1">
            {publicNavigation.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} aria-current={active(item.href) ? "page" : undefined} className={`focus-ring border-l px-4 py-3 font-serif text-2xl ${active(item.href) ? "border-[var(--accent-gold)] text-[var(--text-primary)]" : "border-[var(--border)] text-[var(--text-secondary)]"}`}>
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
