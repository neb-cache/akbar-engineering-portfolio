"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { saveExperienceAction } from "@/lib/actions/experiences";
import { experienceSchema, type ExperienceInput } from "@/lib/validation/experience";
import { FormSubmitButton } from "./form-submit-button";

type Values = Omit<ExperienceInput, "highlights" | "technologies"> & { highlightsText: string; technologiesText: string };
const cls = "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm";

export function ExperienceForm({ id, initial }: { id?: string; initial?: ExperienceInput }) {
  const router = useRouter(); const [pending, startTransition] = useTransition(); const [message, setMessage] = useState("");
  const { register, handleSubmit, setError, formState: { errors } } = useForm<Values>({ defaultValues: {
    company: initial?.company ?? "", title: initial?.title ?? "", employmentType: initial?.employmentType ?? "",
    location: initial?.location ?? "", workMode: initial?.workMode ?? null, startDate: initial?.startDate ?? "",
    endDate: initial?.endDate ?? "", isCurrent: initial?.isCurrent ?? false, summary: initial?.summary ?? "",
    companyUrl: initial?.companyUrl ?? "", companyLogoUrl: initial?.companyLogoUrl ?? "", sortOrder: initial?.sortOrder ?? 0,
    highlightsText: initial?.highlights.join("\n") ?? "", technologiesText: initial?.technologies.join("\n") ?? "",
  }});
  const err = (key: keyof Values) => errors[key]?.message && <p className="text-xs text-red-600">{String(errors[key]?.message)}</p>;
  return <form className="space-y-6" onSubmit={handleSubmit((v) => {
    const list = (s: string) => s.split("\n").map(x => x.trim()).filter(Boolean);
    const parsed = experienceSchema.safeParse({ ...v, highlights: list(v.highlightsText), technologies: list(v.technologiesText) });
    if (!parsed.success) return parsed.error.issues.forEach(i => setError(i.path[0] as keyof Values, { message: i.message }));
    startTransition(async () => { const result = await saveExperienceAction(id ?? null, parsed.data); setMessage(result.message ?? ""); if (result.success) router.push(`/admin/experiences/${result.data?.id}/edit`); });
  })}>
    {message && <p className="rounded-md bg-slate-100 p-3 text-sm">{message}</p>}
    <section className="grid gap-4 rounded-lg border bg-white p-5 md:grid-cols-2">
      <label className="text-sm">Company<input className={cls} {...register("company")} />{err("company")}</label>
      <label className="text-sm">Title<input className={cls} {...register("title")} />{err("title")}</label>
      <label className="text-sm">Employment type<input className={cls} {...register("employmentType")} /></label>
      <label className="text-sm">Location<input className={cls} {...register("location")} /></label>
      <label className="text-sm">Work mode<select className={cls} {...register("workMode", { setValueAs: v => v || null })}><option value="">—</option><option value="remote">Remote</option><option value="hybrid">Hybrid</option><option value="on-site">On-site</option></select></label>
      <label className="text-sm">Sort order<input type="number" className={cls} {...register("sortOrder", { valueAsNumber: true })} /></label>
      <label className="text-sm">Start date<input type="date" className={cls} {...register("startDate")} />{err("startDate")}</label>
      <label className="text-sm">End date<input type="date" className={cls} {...register("endDate")} />{err("endDate")}</label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register("isCurrent")} /> Current role</label>
      <label className="text-sm md:col-span-2">Summary<textarea rows={5} className={cls} {...register("summary")} /></label>
      <label className="text-sm">Company URL<input className={cls} {...register("companyUrl")} /></label>
      <label className="text-sm">Logo URL<input className={cls} {...register("companyLogoUrl")} /></label>
      <label className="text-sm">Highlights (satu per baris)<textarea rows={8} className={cls} {...register("highlightsText")} /></label>
      <label className="text-sm">Technologies (satu per baris)<textarea rows={8} className={cls} {...register("technologiesText")} /></label>
    </section><FormSubmitButton pending={pending} />
  </form>;
}
