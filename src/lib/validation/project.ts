import { z } from "zod";

const httpsUrl = z.url("URL tidak valid.").refine(
  (value) => new URL(value).protocol === "https:",
  "Gunakan URL HTTPS.",
);
const optionalUrl = z.union([z.literal(""), httpsUrl]);

export const projectSchema = z
  .object({
    title: z.string().trim().min(2).max(160),
    slug: z.string().trim().max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Gunakan slug huruf kecil dan tanda hubung.").or(z.literal("")),
    shortDescription: z.string().trim().min(10).max(320),
    description: z.string().trim().min(20).max(20000),
    role: z.string().trim().max(160),
    company: z.string().trim().max(160),
    clientName: z.string().trim().max(160),
    projectType: z.string().trim().max(120),
    status: z.enum(["draft", "published", "archived"]),
    yearStart: z.number().int().min(1990).max(2100).nullable(),
    yearEnd: z.number().int().min(1990).max(2100).nullable(),
    featured: z.boolean(),
    confidential: z.boolean(),
    coverImageUrl: optionalUrl,
    liveUrl: optionalUrl,
    githubUrl: optionalUrl,
    caseStudyUrl: optionalUrl,
    sortOrder: z.number().int().min(0).max(100000),
    technologies: z.array(z.string().trim().min(1).max(80)).max(50),
    highlights: z.array(z.string().trim().min(2).max(1000)).max(50),
  })
  .refine((data) => !data.yearStart || !data.yearEnd || data.yearEnd >= data.yearStart, {
    path: ["yearEnd"],
    message: "Tahun selesai tidak boleh sebelum tahun mulai.",
  });

export type ProjectInput = z.infer<typeof projectSchema>;
