import Link from "next/link";
import { AdminTable } from "@/components/admin/admin-table";
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { EmptyState } from "@/components/admin/empty-state";
import { StatusBadge } from "@/components/admin/status-badge";
import { deleteProjectAction } from "@/lib/actions/projects";
import { getProjects } from "@/lib/services/projects";

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <div className="space-y-5"><div className="flex items-center justify-between"><div><h1 className="text-2xl font-semibold">Projects</h1><p className="text-sm text-slate-500">Kelola project, teknologi, highlights, dan status publikasi.</p></div><Link className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white" href="/admin/projects/new">Tambah</Link></div>
    {!projects.length ? <EmptyState title="Belum ada project" description="Tambahkan project pertama untuk mulai mengisi portfolio." /> : <AdminTable><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-3">Title</th><th className="p-3">Status</th><th className="p-3">Year</th><th className="p-3">Actions</th></tr></thead><tbody className="divide-y">{projects.map(p => <tr key={p.id}><td className="p-3"><p className="font-medium">{p.title}</p><p className="text-xs text-slate-500">/{p.slug}</p></td><td className="p-3"><StatusBadge status={p.status} /></td><td className="p-3">{p.year_start ?? "—"}</td><td className="p-3"><div className="flex gap-3"><Link className="font-medium hover:underline" href={`/admin/projects/${p.id}/edit`}>Edit</Link><ConfirmDeleteDialog action={deleteProjectAction.bind(null, p.id)} itemName={p.title} /></div></td></tr>)}</tbody></AdminTable>}
  </div>;
}
