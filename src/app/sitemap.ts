import type { MetadataRoute } from "next";
import { getPublicProjects } from "@/lib/public/data";
import { absoluteUrl } from "@/lib/public/metadata";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    { path: "/", priority: 1 },
    { path: "/projects", priority: 0.9 },
    { path: "/experience", priority: 0.8 },
    { path: "/about", priority: 0.7 },
    { path: "/contact", priority: 0.7 },
  ];
  let projects: Awaited<ReturnType<typeof getPublicProjects>> = [];
  try {
    projects = await getPublicProjects();
  } catch {
    // A public sitemap remains valid if project data is temporarily unavailable.
  }
  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route.path),
      changeFrequency: "monthly" as const,
      priority: route.priority,
    })),
    ...projects.map((project) => ({
      url: absoluteUrl(`/projects/${project.slug}`),
      lastModified: new Date(project.updated_at),
      changeFrequency: "monthly" as const,
      priority: project.featured ? 0.8 : 0.6,
    })),
  ];
}
