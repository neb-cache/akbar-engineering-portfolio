import Link from "next/link";
import { MentorshipRecordEditor } from "@/components/admin/mentorship-record-editor";
import { getAdminMentorshipRecords } from "@/lib/services/authority";
import type { MentorshipCategory } from "@/types/database";

const categories: MentorshipCategory[] = ["candidate-assessment","private-mentorship","intern-development","referral","team-formation","technical-guidance"];
export default async function MentorshipPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const selected = categories.includes(category as MentorshipCategory) ? category as MentorshipCategory : undefined;
  const items = await getAdminMentorshipRecords(selected);
  return <div className="space-y-6"><div><h1 className="text-2xl font-semibold">Mentorship & People Development</h1><p className="mt-1 text-sm text-slate-500">Store public-safe evidence only. Never record private names, contact details, salary data, psychological judgments, or confidential hiring feedback.</p></div><nav className="flex flex-wrap gap-2" aria-label="Mentorship categories"><Link href="/admin/mentorship" className={`rounded-full border px-3 py-1.5 text-xs ${!selected?"bg-slate-900 text-white":"bg-white"}`}>All</Link>{categories.map((item)=><Link key={item} href={`/admin/mentorship?category=${item}`} className={`rounded-full border px-3 py-1.5 text-xs ${selected===item?"bg-slate-900 text-white":"bg-white"}`}>{item}</Link>)}</nav><MentorshipRecordEditor items={items}/></div>;
}
