import "server-only";

import { createClient } from "@/lib/supabase/server";
import { imageUploadSchema } from "@/lib/validation/storage";

const BUCKET = "portfolio-media";

const extensionByType = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
} as const;

function sanitizeFilename(name: string, type: keyof typeof extensionByType) {
  const extension = extensionByType[type];
  const base = name
    .replace(/\.[^.]+$/, "")
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .toLowerCase();
  return `${base || "image"}.${extension}`;
}

async function hasExpectedSignature(file: File) {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (file.type === "image/png") {
    return [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
      .every((value, index) => bytes[index] === value);
  }
  if (file.type === "image/jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  if (file.type === "image/webp") {
    return new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" &&
      new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP";
  }
  return false;
}

export async function uploadProjectImage(projectId: string, file: File) {
  const validated = imageUploadSchema.parse({
    projectId,
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
  });
  if (!(await hasExpectedSignature(file))) {
    throw new Error("File signature does not match the selected image type.");
  }
  const path = `projects/${projectId}/${Date.now()}-${sanitizeFilename(file.name, validated.fileType)}`;
  const supabase = await createClient();
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
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
