"use client";

export function ConfirmDeleteDialog({ action, itemName }: { action: () => Promise<void>; itemName: string }) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(`Hapus ${itemName}? Tindakan ini tidak dapat dibatalkan.`)) event.preventDefault();
      }}
    >
      <button type="submit" className="min-h-10 rounded px-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 hover:underline">Hapus</button>
    </form>
  );
}
