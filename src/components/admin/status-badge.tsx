const colors: Record<string, string> = {
  published: "bg-emerald-100 text-emerald-800",
  draft: "bg-amber-100 text-amber-800",
  archived: "bg-slate-200 text-slate-700",
  new: "bg-blue-100 text-blue-800",
  read: "bg-slate-100 text-slate-700",
  replied: "bg-emerald-100 text-emerald-800",
};

export function StatusBadge({ status }: { status: string }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${colors[status] ?? colors.archived}`}>{status}</span>;
}
