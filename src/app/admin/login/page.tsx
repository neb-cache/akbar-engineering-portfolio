import { LoginForm } from "@/components/admin/login-form";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 p-5 text-slate-900">
      <div className="w-full max-w-md rounded-xl border bg-white p-7 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Portfolio CMS</p>
        <h1 className="mt-1 text-2xl font-semibold">Admin login</h1>
        <p className="mb-6 mt-2 text-sm text-slate-600">Masuk menggunakan akun Supabase Auth yang memiliki role admin.</p>
        <LoginForm />
      </div>
    </main>
  );
}
