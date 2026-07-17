"use client";

export default function AdminError({ reset }: { reset: () => void }) {
  return <div className="rounded-lg border border-red-200 bg-red-50 p-6"><h2 className="font-semibold text-red-900">Data admin tidak dapat dimuat</h2><p className="mt-1 text-sm text-red-700">Periksa koneksi dan konfigurasi Supabase, lalu coba lagi.</p><button className="mt-4 rounded-md bg-red-900 px-3 py-2 text-sm text-white" onClick={reset}>Coba lagi</button></div>;
}
