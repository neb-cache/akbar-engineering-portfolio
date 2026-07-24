import { z } from "zod";

const httpsUrl = z.url("URL tidak valid.").refine(
  (value) => new URL(value).protocol === "https:",
  "Gunakan URL HTTPS.",
);
const optionalUrl = z.union([z.literal(""), httpsUrl]);

export const experienceSchema = z
  .object({
    company: z.string().trim().min(2).max(160),
    title: z.string().trim().min(2).max(160),
    employmentType: z.string().trim().max(80),
    location: z.string().trim().max(160),
    workMode: z.enum(["remote", "hybrid", "on-site"]).nullable(),
    startDate: z.iso.date(),
    endDate: z.union([z.literal(""), z.iso.date()]),
    isCurrent: z.boolean(),
    summary: z.string().trim().max(5000),
    companyUrl: optionalUrl,
    companyLogoUrl: optionalUrl,
    sortOrder: z.number().int().min(0).max(100000),
    highlights: z.array(z.string().trim().min(2).max(1000)).max(50),
    technologies: z.array(z.string().trim().min(1).max(80)).max(50),
  })
  .superRefine((data, ctx) => {
    if (data.isCurrent && data.endDate) {
      ctx.addIssue({ code: "custom", path: ["endDate"], message: "Peran saat ini tidak boleh memiliki tanggal selesai." });
    }
    if (data.endDate && data.endDate < data.startDate) {
      ctx.addIssue({ code: "custom", path: ["endDate"], message: "Tanggal selesai tidak boleh sebelum tanggal mulai." });
    }
  });

export type ExperienceInput = z.infer<typeof experienceSchema>;
