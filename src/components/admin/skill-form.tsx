"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { saveSkillAction } from "@/lib/actions/skills";
import { skillSchema, type SkillInput } from "@/lib/validation/skill";
import { FormSubmitButton } from "./form-submit-button";

const categories = ["Backend", "Frontend", "Mobile", "AI & Automation", "ERP & Integration", "Infrastructure & DevOps", "Database", "Engineering Leadership"];
const cls = "mt-1 w-full rounded-md border border-slate-300 px-3 py-2";

export function SkillForm({ id, initial }: { id?: string; initial?: SkillInput }) {
  const router = useRouter(); const [pending, startTransition] = useTransition(); const [message, setMessage] = useState("");
  const { register, handleSubmit, setError, formState: { errors } } = useForm<SkillInput>({ defaultValues: initial ?? { name: "", category: "Backend", proficiency: null, yearsExperience: null, featured: false, sortOrder: 0 } });
  return <form className="max-w-2xl space-y-5 rounded-lg border bg-white p-5" onSubmit={handleSubmit((value) => {
    const parsed = skillSchema.safeParse(value); if (!parsed.success) return parsed.error.issues.forEach(i => setError(i.path[0] as keyof SkillInput, { message: i.message }));
    startTransition(async () => { const result = await saveSkillAction(id ?? null, parsed.data); setMessage(result.message ?? ""); if (result.success) router.push(`/admin/skills/${result.data?.id}/edit`); });
  })}>
    {message && <p className="rounded-md bg-slate-100 p-3 text-sm">{message}</p>}
    <label className="block text-sm">Name<input className={cls} {...register("name")} />{errors.name && <span className="text-xs text-red-600">{errors.name.message}</span>}</label>
    <label className="block text-sm">Category<select className={cls} {...register("category")}>{categories.map(c => <option key={c}>{c}</option>)}</select></label>
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="text-sm">Proficiency (0–100)<input type="number" className={cls} {...register("proficiency", { setValueAs: v => v === "" ? null : Number(v) })} /></label>
      <label className="text-sm">Years experience<input type="number" step="0.5" className={cls} {...register("yearsExperience", { setValueAs: v => v === "" ? null : Number(v) })} /></label>
      <label className="text-sm">Sort order<input type="number" className={cls} {...register("sortOrder", { valueAsNumber: true })} /></label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register("featured")} /> Featured</label>
    </div><FormSubmitButton pending={pending} />
  </form>;
}
