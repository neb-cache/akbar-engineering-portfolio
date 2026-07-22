"use client";

import { useState, useTransition } from "react";
import { saveAuthoritySettingsAction } from "@/lib/actions/authority";
import type { AuthoritySettingsInput } from "@/lib/validation/authority";
import type { ActionResult } from "@/types/action";
import { AuthorityResult, authorityInputClass } from "./authority-editor-utils";

const identityFields: Array<[keyof AuthoritySettingsInput,string]> = [["professionalName","Professional name"],["fullName","Full name"],["title","Current title"],["secondaryIdentity","Secondary identity"]];
const contactFields: Array<[keyof AuthoritySettingsInput,string]> = [["email","Professional email"],["location","Location"],["availability","Availability"],["githubUrl","GitHub URL"],["linkedinUrl","LinkedIn URL"],["resumeUrl","Resume URL"]];
const incidentFields: Array<[keyof AuthoritySettingsInput,string]> = [["incidentMetricLabel","Metric label"],["incidentMetricValue","Metric value"],["incidentMetricContext","Metric context"]];

export function SiteSettingsForm({ initial }: { initial: AuthoritySettingsInput }) {
  const [pending,startTransition]=useTransition();
  const [result,setResult]=useState<ActionResult|null>(null);
  return <form className="space-y-6" onSubmit={(event)=>{
    event.preventDefault(); const data=new FormData(event.currentTarget); const value=(name:keyof AuthoritySettingsInput)=>String(data.get(name)??"");
    startTransition(async()=>setResult(await saveAuthoritySettingsAction({
      professionalName:value("professionalName"),fullName:value("fullName"),title:value("title"),secondaryIdentity:value("secondaryIdentity"),
      heroHeadline:value("heroHeadline"),heroDescription:value("heroDescription"),email:value("email"),location:value("location"),availability:value("availability"),
      githubUrl:value("githubUrl"),linkedinUrl:value("linkedinUrl"),resumeUrl:value("resumeUrl"),builderStatement:value("builderStatement"),systemsPillar:value("systemsPillar"),
      peoplePillar:value("peoplePillar"),executionPillar:value("executionPillar"),recruiterCta:value("recruiterCta"),incidentTitle:value("incidentTitle"),
      incidentSummary:value("incidentSummary"),incidentMetricLabel:value("incidentMetricLabel"),incidentMetricValue:value("incidentMetricValue"),incidentMetricContext:value("incidentMetricContext"),
    })));
  }}>
    <AuthorityResult result={result}/>
    <section className="grid gap-4 rounded-lg border bg-white p-5 md:grid-cols-2"><h2 className="font-semibold md:col-span-2">Professional identity</h2>{identityFields.map(([name,label])=><label key={name} className="text-sm">{label}<input name={name} defaultValue={initial[name]} className={authorityInputClass}/></label>)}</section>
    <section className="grid gap-4 rounded-lg border bg-white p-5"><h2 className="font-semibold">Hero & recruiter path</h2><label className="text-sm">Headline<textarea name="heroHeadline" defaultValue={initial.heroHeadline} rows={3} className={authorityInputClass}/></label><label className="text-sm">Supporting copy<textarea name="heroDescription" defaultValue={initial.heroDescription} rows={4} className={authorityInputClass}/></label><label className="text-sm">Recruiter CTA<textarea name="recruiterCta" defaultValue={initial.recruiterCta} rows={2} className={authorityInputClass}/></label></section>
    <section className="grid gap-4 rounded-lg border bg-white p-5"><h2 className="font-semibold">Authority framework</h2><label className="text-sm">Builder statement<textarea name="builderStatement" defaultValue={initial.builderStatement} rows={3} className={authorityInputClass}/></label>{[["systemsPillar","Systems pillar"],["peoplePillar","People pillar"],["executionPillar","Execution pillar"]].map(([name,label])=><label key={name} className="text-sm">{label}<textarea name={name} defaultValue={initial[name as keyof AuthoritySettingsInput]} rows={4} className={authorityInputClass}/></label>)}</section>
    <section className="grid gap-4 rounded-lg border bg-white p-5 md:grid-cols-2"><h2 className="font-semibold md:col-span-2">Contact, social & resume</h2>{contactFields.map(([name,label])=><label key={name} className={`text-sm ${name==="availability"?"md:col-span-2":""}`}>{label}<input name={name} defaultValue={initial[name]} className={authorityInputClass}/></label>)}<p className="text-xs text-slate-500 md:col-span-2">Leave the resume URL empty to show the accessible unavailable state. Use an approved HTTPS document URL; no local path is generated.</p></section>
    <section className="grid gap-4 rounded-lg border bg-white p-5 md:grid-cols-2"><h2 className="font-semibold md:col-span-2">Incident response evidence</h2><label className="text-sm md:col-span-2">Title<input name="incidentTitle" defaultValue={initial.incidentTitle} className={authorityInputClass}/></label><label className="text-sm md:col-span-2">Public-safe summary<textarea name="incidentSummary" defaultValue={initial.incidentSummary} rows={4} className={authorityInputClass}/></label>{incidentFields.map(([name,label])=><label key={name} className="text-sm">{label}<input name={name} defaultValue={initial[name]} className={authorityInputClass}/></label>)}</section>
    <button disabled={pending} className="rounded bg-slate-900 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50">{pending?"Saving…":"Save authority settings"}</button>
  </form>;
}
