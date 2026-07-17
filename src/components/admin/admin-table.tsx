export function AdminTable({ children }: { children: React.ReactNode }) {
  return <div className="overflow-x-auto rounded-lg border bg-white"><table className="w-full text-left text-sm">{children}</table></div>;
}
