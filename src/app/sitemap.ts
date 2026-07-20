import type { MetadataRoute } from "next";
import { getPublicProjects } from "@/lib/public/data";
import { absoluteUrl } from "@/lib/public/metadata";

export default async function sitemap():Promise<MetadataRoute.Sitemap>{const staticRoutes=[{path:"/",priority:1},{path:"/projects",priority:.9},{path:"/experience",priority:.8},{path:"/about",priority:.7},{path:"/contact",priority:.7}];let projects:Awaited<ReturnType<typeof getPublicProjects>>=[];try{projects=await getPublicProjects()}catch(error){console.error("Project routes omitted from sitemap",error)}return[...staticRoutes.map(route=>({url:absoluteUrl(route.path),lastModified:new Date(),changeFrequency:"monthly" as const,priority:route.priority})),...projects.map(project=>({url:absoluteUrl(`/projects/${project.slug}`),lastModified:new Date(project.updated_at),changeFrequency:"monthly" as const,priority:project.featured?.8:.6}))]}
