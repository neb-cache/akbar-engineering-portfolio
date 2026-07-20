import { AdminHeader } from "./admin-header";
import { AdminSidebar } from "./admin-sidebar";

export function AdminShell({ children, name }: { children: React.ReactNode; name: string }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 md:flex">
      <AdminSidebar />
      <div className="min-w-0 flex-1">
        <AdminHeader name={name} />
        <main className="mx-auto max-w-7xl p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
