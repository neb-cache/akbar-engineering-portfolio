"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Send } from "lucide-react";
import { submitContactMessageAction } from "@/lib/actions/contact-messages";
import { contactMessageSchema, type ContactMessageInput } from "@/lib/validation/contact-message";

const fieldClass = "mt-2 w-full border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--accent-brown)] focus:border-[var(--accent-gold)] focus:outline-none";

export function ContactForm() {
  const [pending,startTransition]=useTransition(); const [result,setResult]=useState<{success:boolean;message:string}|null>(null);
  const {register,handleSubmit,setError,reset,formState:{errors}}=useForm<ContactMessageInput>({defaultValues:{name:"",email:"",company:"",subject:"",message:"",website:""}});
  const errorFor=(name:keyof ContactMessageInput)=>errors[name]?.message&&<span className="mt-1 block text-xs text-[var(--danger)]">{errors[name]?.message}</span>;
  return <form noValidate onSubmit={handleSubmit(values=>{setResult(null);const parsed=contactMessageSchema.safeParse(values);if(!parsed.success){parsed.error.issues.forEach(issue=>setError(issue.path[0] as keyof ContactMessageInput,{message:issue.message}));return;}startTransition(async()=>{const response=await submitContactMessageAction(parsed.data);setResult({success:response.success,message:response.message??(response.success?"Message sent.":"Unable to send message.")});if(response.success)reset();else Object.entries(response.fieldErrors??{}).forEach(([name,messages])=>setError(name as keyof ContactMessageInput,{message:messages[0]}));});})} className="space-y-6" aria-describedby={result?"contact-result":undefined}>
    <div className="grid gap-6 sm:grid-cols-2"><label className="text-sm font-medium">Name<input {...register("name")} className={fieldClass} autoComplete="name" maxLength={120} required/>{errorFor("name")}</label><label className="text-sm font-medium">Email<input {...register("email")} className={fieldClass} type="email" autoComplete="email" maxLength={254} required/>{errorFor("email")}</label></div>
    <label className="block text-sm font-medium">Company <span className="font-normal text-[var(--text-secondary)]">(optional)</span><input {...register("company")} className={fieldClass} autoComplete="organization" maxLength={160}/>{errorFor("company")}</label>
    <label className="block text-sm font-medium">Subject<input {...register("subject")} className={fieldClass} maxLength={200} required/>{errorFor("subject")}</label>
    <label className="block text-sm font-medium">Message<textarea {...register("message")} className={fieldClass} rows={8} maxLength={5000} required/>{errorFor("message")}</label>
    <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true"><label>Website<input {...register("website")} tabIndex={-1} autoComplete="off"/></label></div>
    {result&&<p id="contact-result" role="status" className={`border p-4 text-sm ${result.success?"border-[var(--accent-green)] text-[var(--paper)]":"border-[var(--danger)] text-[var(--danger)]"}`}>{result.message}</p>}
    <button disabled={pending} type="submit" className="focus-ring inline-flex items-center gap-3 bg-[var(--paper)] px-6 py-4 text-sm font-semibold text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-60">{pending?"Sending…":"Send message"}<Send size={16}/></button>
  </form>;
}
