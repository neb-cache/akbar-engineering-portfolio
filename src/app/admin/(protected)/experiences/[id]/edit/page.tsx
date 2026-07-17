import { notFound } from "next/navigation";
import { ExperienceForm } from "@/components/admin/experience-form";
import { getExperienceById } from "@/lib/services/experiences";

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const x = await getExperienceById(id); if (!x) notFound(); return <div className="space-y-5"><h1 className="text-2xl font-semibold">Edit experience</h1><ExperienceForm id={id} initial={{ company:x.company,title:x.title,employmentType:x.employment_type??"",location:x.location??"",workMode:x.work_mode,startDate:x.start_date,endDate:x.end_date??"",isCurrent:x.is_current,summary:x.summary??"",companyUrl:x.company_url??"",companyLogoUrl:x.company_logo_url??"",sortOrder:x.sort_order,highlights:x.experience_highlights.sort((a,b)=>a.sort_order-b.sort_order).map(v=>v.content),technologies:x.experience_technologies.sort((a,b)=>a.sort_order-b.sort_order).map(v=>v.name)}} /></div>; }
