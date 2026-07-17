import { z } from "zod";

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"] as const;

export const imageUploadSchema = z.object({
  projectId: z.uuid(),
  fileName: z.string().trim().min(1).max(255),
  fileType: z.enum(ALLOWED_IMAGE_TYPES),
  fileSize: z.number().int().positive().max(MAX_IMAGE_SIZE),
});
