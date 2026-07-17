export function FormSubmitButton({ pending, label = "Simpan" }: { pending: boolean; label?: string }) {
  return (
    <button disabled={pending} type="submit" className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60">
      {pending ? "Menyimpan…" : label}
    </button>
  );
}
