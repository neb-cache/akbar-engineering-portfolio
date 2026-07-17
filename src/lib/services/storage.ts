import "server-only";

import { createClient } from "@/lib/supabase/server";
import { imageUploadSchema } from "@/lib/validation/storage";

const BUCKET = "portfolio-media";

function sanitizeFilename(name: string) {
  const extension = name.split(".").pop()?.toLowerCase() ?? "bin";
  const base = name
    .replace(/\.[^.]+$/, "")
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .toLowerCase();
  return `${base || "image"}.${extension}`;
}

export async function uploadProjectImage(projectId: string, file: File) {
  imageUploadSchema.parse({
    projectId,
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
  });
  const path = `projects/${projectId}/${Date.now()}-${sanitizeFilename(file.name)}`;
  const supabase = await createClient();
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

export async function deleteProjectImage(pathOrUrl: string) {
  const marker = `/${BUCKET}/`;
  const path = pathOrUrl.includes(marker)
    ? decodeURIComponent(pathOrUrl.split(marker)[1] ?? "")
    : pathOrUrl;
  if (!path.startsWith("projects/")) throw new Error("Invalid project image path.");
  const supabase = await createClient();
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw error;
}
