import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/auth";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const { profile, user } = await requireAdmin();
  return <AdminShell name={profile.full_name ?? profile.email ?? user.email ?? "Admin"}>{children}</AdminShell>;
}
