import { LogOut } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";

export function AdminHeader({ name }: { name: string }) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
      <div>
        <p className="text-sm font-medium text-slate-900">{name}</p>
        <p className="text-xs text-slate-500">Administrator</p>
      </div>
      <form action={logoutAction}>
        <button className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50" type="submit">
          <LogOut size={16} /> Logout
        </button>
      </form>
    </header>
  );
}
