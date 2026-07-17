"use client";

export function ConfirmDeleteDialog({ action, itemName }: { action: () => Promise<void>; itemName: string }) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(`Hapus ${itemName}? Tindakan ini tidak dapat dibatalkan.`)) event.preventDefault();
      }}
    >
      <button type="submit" className="text-sm font-medium text-red-700 hover:underline">Hapus</button>
    </form>
  );
}
