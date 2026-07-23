import Link from "next/link";
import type { PublicSiteProfile } from "@/lib/public/data";

export function Footer({ profile }: { profile: PublicSiteProfile }) {
  return <footer className="border-t border-[var(--border)] bg-[var(--surface)]"><div className="public-container grid gap-10 py-12 md:grid-cols-[1fr_auto] md:items-end"><div><p className="editorial-label">End of issue / {new Date().getFullYear()}</p><p className="mt-4 max-w-xl font-serif text-3xl leading-tight">Engineering across product, platform, and production.</p></div><div className="text-sm text-[var(--text-secondary)] md:text-right"><p>{profile.location}</p><p className="mt-2">© {new Date().getFullYear()} {profile.name}</p><Link className="button-base button-editorial mt-3" href="/contact">Start a conversation</Link></div></div></footer>;
}
