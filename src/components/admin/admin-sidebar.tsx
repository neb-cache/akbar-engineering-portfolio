"use client";

import Link from "next/link";
import { BriefcaseBusiness, FolderKanban, Gauge, Mail, Settings, Users, Wrench } from "lucide-react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard", icon: Gauge },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/experiences", label: "Experiences", icon: BriefcaseBusiness },
  { href: "/admin/skills", label: "Skills", icon: Wrench },
  { href: "/admin/mentorship", label: "Mentorship", icon: Users },
  { href: "/admin/settings", label: "Authority Settings", icon: Settings },
  { href: "/admin/messages", label: "Messages", icon: Mail },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const isActive = (href: string) => href === "/admin" ? pathname === href : pathname.startsWith(href);
  return (
    <aside className="border-b border-slate-800 bg-slate-950 text-slate-100 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="border-b border-slate-800 px-6 py-5">
        <p className="font-semibold">Portfolio CMS</p>
        <p className="text-xs text-slate-400">Akbar Aulia Ramadhan</p>
      </div>
      <nav className="flex gap-1 overflow-x-auto p-3 md:flex-col">
        {links.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} aria-current={isActive(href) ? "page" : undefined} className={`flex min-h-11 shrink-0 items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${isActive(href) ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}>
            <Icon size={17} /> {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
