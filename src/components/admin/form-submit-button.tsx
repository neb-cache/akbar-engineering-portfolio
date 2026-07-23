export function FormSubmitButton({ pending, label = "Simpan" }: { pending: boolean; label?: string }) {
  return (
    <button disabled={pending} aria-busy={pending} type="submit" className="min-w-28 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60">
      {pending ? "Menyimpan…" : label}
    </button>
  );
}
