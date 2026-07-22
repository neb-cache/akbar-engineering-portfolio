"use client";
import { useTransition } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

export function ReorderControls({ index, count, onMove }: { index: number; count: number; onMove: (direction: -1 | 1) => Promise<void> }) {
  const [pending,startTransition]=useTransition();
  return <div className="flex gap-1" aria-label="Reorder controls"><button type="button" disabled={pending||index===0} onClick={()=>startTransition(()=>onMove(-1))} className="rounded border p-1.5 disabled:opacity-30" aria-label="Move up"><ArrowUp size={14}/></button><button type="button" disabled={pending||index===count-1} onClick={()=>startTransition(()=>onMove(1))} className="rounded border p-1.5 disabled:opacity-30" aria-label="Move down"><ArrowDown size={14}/></button></div>;
}
