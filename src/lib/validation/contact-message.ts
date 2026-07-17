import { z } from "zod";

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().max(254),
  company: z.string().trim().max(160).optional().default(""),
  subject: z.string().trim().min(3).max(200),
  message: z.string().trim().min(10).max(5000),
  website: z.string().max(0, "Permintaan tidak valid."),
});

export const messageStatusSchema = z.enum(["new", "read", "replied", "archived"]);
export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
