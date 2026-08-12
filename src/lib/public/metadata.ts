import type { Metadata } from "next";
import { getPublicEnv } from "@/lib/env-public";

export const defaultDescription = "Akbar A.R. is a Principal Full-Stack & Systems Engineer building production software, enterprise integrations, automation, infrastructure, and the teams that operate them.";

export function absoluteUrl(path = "/") {
  return new URL(path, getPublicEnv().NEXT_PUBLIC_SITE_URL).toString();
}

export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: absoluteUrl(path), type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}
