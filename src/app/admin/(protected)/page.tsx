import Link from "next/link";
import { getProjectCounts, getProjects } from "@/lib/services/projects";
import { getExperienceCount } from "@/lib/services/experiences";
import { getSkillCount } from "@/lib/services/skills";
import { getContactMessages, getNewMessageCount } from "@/lib/services/contact-messages";
import { formatDate } from "@/lib/utils";

export default async function AdminDashboard() {
  const [projects, projectCounts, experiences, skills, newMessages, messages] = await Promise.all([
    getProjects(), getProjectCounts(), getExperienceCount(), getSkillCount(), getNewMessageCount(), getContactMessages(),
  ]);
  const stats: Array<[string, number]> = [
    ["Total projects", projectCounts.total], ["Published", projectCounts.published], ["Draft", projectCounts.draft],
    ["Experiences", experiences], ["Skills", skills], ["New messages", newMessages],
  ];
  return <div className="space-y-8">
    <div><h1 className="text-2xl font-semibold">Dashboard</h1><p className="text-sm text-slate-500">Ringkasan konten portfolio.</p></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">{stats.map(([label, value]) => <div key={label} className="rounded-lg border bg-white p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p></div>)}</div>
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-lg border bg-white p-5"><div className="flex justify-between"><h2 className="font-semibold">Recent projects</h2><Link className="text-sm underline" href="/admin/projects">Lihat semua</Link></div><ul className="mt-4 divide-y">{projects.slice(0, 5).map(p => <li className="py-3" key={p.id}><p className="font-medium">{p.title}</p><p className="text-xs text-slate-500">{p.status} · {formatDate(p.created_at)}</p></li>)}</ul></section>
      <section className="rounded-lg border bg-white p-5"><div className="flex justify-between"><h2 className="font-semibold">Recent messages</h2><Link className="text-sm underline" href="/admin/messages">Lihat semua</Link></div><ul className="mt-4 divide-y">{messages.slice(0, 5).map(m => <li className="py-3" key={m.id}><p className="font-medium">{m.subject}</p><p className="text-xs text-slate-500">{m.name} · {formatDate(m.created_at)}</p></li>)}</ul></section>
    </div>
  </div>;
}
