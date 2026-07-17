"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { saveProjectAction } from "@/lib/actions/projects";
import { projectSchema, type ProjectInput } from "@/lib/validation/project";
import { slugify } from "@/lib/utils";
import { FormSubmitButton } from "./form-submit-button";
import { ImageUpload } from "./image-upload";

type FormValues = Omit<ProjectInput, "technologies" | "highlights"> & { technologiesText: string; highlightsText: string };
const inputClass = "mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm";

export function ProjectForm({ id, initial }: { id?: string; initial?: ProjectInput }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const defaults: FormValues = {
    title: initial?.title ?? "", slug: initial?.slug ?? "", shortDescription: initial?.shortDescription ?? "",
    description: initial?.description ?? "", role: initial?.role ?? "", company: initial?.company ?? "",
    clientName: initial?.clientName ?? "", projectType: initial?.projectType ?? "", status: initial?.status ?? "draft",
    yearStart: initial?.yearStart ?? null, yearEnd: initial?.yearEnd ?? null, featured: initial?.featured ?? false,
    confidential: initial?.confidential ?? false, coverImageUrl: initial?.coverImageUrl ?? "", liveUrl: initial?.liveUrl ?? "",
    githubUrl: initial?.githubUrl ?? "", caseStudyUrl: initial?.caseStudyUrl ?? "", sortOrder: initial?.sortOrder ?? 0,
    technologiesText: initial?.technologies.join("\n") ?? "", highlightsText: initial?.highlights.join("\n") ?? "",
  };
  const { register, handleSubmit, setError, setValue, getValues, formState: { errors } } = useForm<FormValues>({ defaultValues: defaults });
  const error = (name: keyof FormValues) => errors[name]?.message && <p className="mt-1 text-xs text-red-600">{String(errors[name]?.message)}</p>;
  const lineList = (value: string) => value.split("\n").map((item) => item.trim()).filter(Boolean);

  return (
    <form className="space-y-6" onSubmit={handleSubmit((values) => {
      const input: ProjectInput = { ...values, technologies: lineList(values.technologiesText), highlights: lineList(values.highlightsText) };
      const parsed = projectSchema.safeParse(input);
      if (!parsed.success) {
        parsed.error.issues.forEach((issue) => setError(issue.path[0] as keyof FormValues, { message: issue.message }));
        return;
      }
      startTransition(async () => {
        const result = await saveProjectAction(id ?? null, parsed.data);
        setMessage(result.message ?? "");
        if (!result.success) {
          Object.entries(result.fieldErrors ?? {}).forEach(([name, messages]) => setError(name as keyof FormValues, { message: messages[0] }));
        } else router.push(`/admin/projects/${result.data?.id}/edit`);
      });
    })}>
      {message && <p className="rounded-md bg-slate-100 p-3 text-sm">{message}</p>}
      <section className="grid gap-4 rounded-lg border bg-white p-5 md:grid-cols-2">
        <h2 className="md:col-span-2 font-semibold">Konten utama</h2>
        <label className="text-sm">Judul<input className={inputClass} {...register("title", { required: true, onBlur: (e) => { if (!getValues("slug")) setValue("slug", slugify(e.target.value)); } })} />{error("title")}</label>
        <label className="text-sm">Slug<input className={inputClass} {...register("slug")} />{error("slug")}</label>
        <label className="text-sm md:col-span-2">Deskripsi singkat<textarea className={inputClass} rows={3} {...register("shortDescription")} />{error("shortDescription")}</label>
        <label className="text-sm md:col-span-2">Deskripsi lengkap<textarea className={inputClass} rows={9} {...register("description")} />{error("description")}</label>
        <label className="text-sm">Role<input className={inputClass} {...register("role")} /></label>
        <label className="text-sm">Company<input className={inputClass} {...register("company")} /></label>
        <label className="text-sm">Client<input className={inputClass} {...register("clientName")} /></label>
        <label className="text-sm">Tipe proyek<input className={inputClass} {...register("projectType")} /></label>
      </section>
      <section className="grid gap-4 rounded-lg border bg-white p-5 md:grid-cols-3">
        <h2 className="md:col-span-3 font-semibold">Publikasi</h2>
        <label className="text-sm">Status<select className={inputClass} {...register("status")}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
        <label className="text-sm">Tahun mulai<input type="number" className={inputClass} {...register("yearStart", { setValueAs: (v) => v === "" ? null : Number(v) })} />{error("yearStart")}</label>
        <label className="text-sm">Tahun selesai<input type="number" className={inputClass} {...register("yearEnd", { setValueAs: (v) => v === "" ? null : Number(v) })} />{error("yearEnd")}</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register("featured")} /> Featured</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register("confidential")} /> Confidential</label>
        <label className="text-sm">Urutan<input type="number" className={inputClass} {...register("sortOrder", { valueAsNumber: true })} /></label>
      </section>
      <section className="grid gap-4 rounded-lg border bg-white p-5 md:grid-cols-2">
        <h2 className="md:col-span-2 font-semibold">Media & tautan</h2>
        <label className="text-sm md:col-span-2">Cover image URL<input className={inputClass} {...register("coverImageUrl")} />{error("coverImageUrl")}</label>
        {id && <div className="md:col-span-2"><ImageUpload projectId={id} onUploaded={(url) => setValue("coverImageUrl", url, { shouldDirty: true })} /></div>}
        {!id && <p className="md:col-span-2 text-xs text-slate-500">Simpan proyek terlebih dahulu untuk mengunggah gambar.</p>}
        <label className="text-sm">Live URL<input className={inputClass} {...register("liveUrl")} /></label>
        <label className="text-sm">GitHub URL<input className={inputClass} {...register("githubUrl")} /></label>
        <label className="text-sm md:col-span-2">Case study URL<input className={inputClass} {...register("caseStudyUrl")} /></label>
      </section>
      <section className="grid gap-4 rounded-lg border bg-white p-5 md:grid-cols-2">
        <label className="text-sm">Teknologi (satu per baris)<textarea className={inputClass} rows={8} {...register("technologiesText")} /></label>
        <label className="text-sm">Highlights (satu per baris)<textarea className={inputClass} rows={8} {...register("highlightsText")} /></label>
      </section>
      <FormSubmitButton pending={pending} />
    </form>
  );
}
