import { z } from "zod";

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().max(254),
  company: z.string().trim().max(160).optional().default(""),
  subject: z.string().trim().min(3).max(200),
  message: z.string().trim().min(10).max(5000),
  website: z.string().max(0, "Permintaan tidak valid."),
  startedAt: z.number().int().positive(),
}).superRefine((value, context) => {
  const elapsed = Date.now() - value.startedAt;
  if (elapsed < 3_000 || elapsed > 2 * 60 * 60 * 1000) {
    context.addIssue({
      code: "custom",
      path: ["startedAt"],
      message: "Form session is invalid. Refresh the page and try again.",
    });
  }

  const linkCount = value.message.match(/(?:https?:\/\/|www\.)/gi)?.length ?? 0;
  if (linkCount > 6) {
    context.addIssue({
      code: "custom",
      path: ["message"],
      message: "Please include no more than 6 links.",
    });
  }
});

export const messageStatusSchema = z.enum(["new", "read", "replied", "archived"]);
export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
