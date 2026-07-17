"use client";

import { useRef, useState, useTransition } from "react";
import { uploadProjectImageAction } from "@/lib/actions/projects";

export function ImageUpload({ projectId, onUploaded }: { projectId: string; onUploaded: (url: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-md border border-dashed border-slate-300 p-4">
      <input ref={ref} type="file" accept="image/png,image/jpeg,image/webp" />
      <button type="button" disabled={pending} className="ml-2 rounded-md border px-3 py-2 text-sm" onClick={() => {
        const file = ref.current?.files?.[0];
        if (!file) return setMessage("Pilih gambar terlebih dahulu.");
        const data = new FormData();
        data.set("file", file);
        startTransition(async () => {
          const result = await uploadProjectImageAction(projectId, data);
          setMessage(result.message ?? (result.success ? "Upload selesai." : "Upload gagal."));
          if (result.success && result.data) onUploaded(result.data.publicUrl);
        });
      }}>{pending ? "Mengunggah…" : "Upload gambar"}</button>
      {message && <p className="mt-2 text-xs text-slate-600">{message}</p>}
      <p className="mt-2 text-xs text-slate-500">PNG, JPEG, atau WebP. Maksimal 5 MB.</p>
    </div>
  );
}
