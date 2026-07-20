import type { Metadata } from "next";
import { getPublicEnv } from "@/lib/env-public";

export const defaultDescription = "Full-Stack and Systems Engineer specializing in Golang, Next.js, Flutter, ERP integration, AI automation, and production infrastructure.";

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
