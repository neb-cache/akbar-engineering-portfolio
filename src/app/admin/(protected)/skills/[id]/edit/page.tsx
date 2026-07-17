import { notFound } from "next/navigation";
import { SkillForm } from "@/components/admin/skill-form";
import { getSkillById } from "@/lib/services/skills";
export default async function EditSkillPage({params}:{params:Promise<{id:string}>}){const{id}=await params;const x=await getSkillById(id);if(!x)notFound();return <div className="space-y-5"><h1 className="text-2xl font-semibold">Edit skill</h1><SkillForm id={id} initial={{name:x.name,category:x.category,proficiency:x.proficiency,yearsExperience:x.years_experience,featured:x.featured,sortOrder:x.sort_order}}/></div>}
