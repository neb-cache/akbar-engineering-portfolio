import { z } from "zod";

export const skillSchema = z.object({
  name: z.string().trim().min(1).max(100),
  category: z.string().trim().min(2).max(100),
  proficiency: z.number().int().min(0).max(100).nullable(),
  yearsExperience: z.number().min(0).max(80).nullable(),
  featured: z.boolean(),
  sortOrder: z.number().int().min(0).max(100000),
});

export type SkillInput = z.infer<typeof skillSchema>;
