"use client";

import { LoaderCircle, Send } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { submitContactMessageAction } from "@/lib/actions/contact-messages";
import { contactMessageSchema, type ContactMessageInput } from "@/lib/validation/contact-message";
import { trackPublicEvent } from "@/components/analytics/track-event";

const fieldClass = "form-field mt-2 px-4 py-3 text-sm";
type VisibleField = Exclude<keyof ContactMessageInput, "website" | "startedAt">;

export function ContactForm() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [initialStartedAt] = useState(() => Date.now());
  const emptyForm = (startedAt: number) => ({ name: "", email: "", company: "", subject: "", message: "", website: "", startedAt });
  const { register, handleSubmit, setError, setFocus, reset, formState: { errors } } = useForm<ContactMessageInput>({ defaultValues: emptyForm(initialStartedAt) });

  const errorFor = (name: VisibleField) => errors[name]?.message
    ? <span id={`${name}-error`} className="mt-2 block text-sm text-[#e3a198]">{errors[name]?.message}</span>
    : null;
  const a11y = (name: VisibleField) => ({
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) => {
        setResult(null);
        const parsed = contactMessageSchema.safeParse(values);
        if (!parsed.success) {
          parsed.error.issues.forEach((issue) => setError(issue.path[0] as keyof ContactMessageInput, { message: issue.message }));
          const firstField = parsed.error.issues[0]?.path[0] as VisibleField | undefined;
          if (firstField) requestAnimationFrame(() => setFocus(firstField));
          return;
        }
        startTransition(async () => {
          const response = await submitContactMessageAction(parsed.data);
          setResult({ success: response.success, message: response.message ?? (response.success ? "Message sent." : "Unable to send message.") });
          if (response.success) {
            trackPublicEvent("Contact form submitted");
            reset(emptyForm(Date.now()));
          }
          else Object.entries(response.fieldErrors ?? {}).forEach(([name, messages]) => setError(name as keyof ContactMessageInput, { message: messages[0] }));
        });
      })}
      className="space-y-6"
      aria-describedby={result ? "contact-result" : undefined}
      aria-busy={pending}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="text-sm font-medium" htmlFor="contact-name">Name<input id="contact-name" {...register("name")} {...a11y("name")} className={fieldClass} autoComplete="name" maxLength={120} required />{errorFor("name")}</label>
        <label className="text-sm font-medium" htmlFor="contact-email">Email<input id="contact-email" {...register("email")} {...a11y("email")} className={fieldClass} type="email" autoComplete="email" maxLength={254} required />{errorFor("email")}</label>
      </div>
      <label className="block text-sm font-medium" htmlFor="contact-company">Company <span className="font-normal text-[var(--text-secondary)]">(optional)</span><input id="contact-company" {...register("company")} {...a11y("company")} className={fieldClass} autoComplete="organization" maxLength={160} />{errorFor("company")}</label>
      <label className="block text-sm font-medium" htmlFor="contact-subject">Subject<input id="contact-subject" {...register("subject")} {...a11y("subject")} className={fieldClass} maxLength={200} required />{errorFor("subject")}</label>
      <label className="block text-sm font-medium" htmlFor="contact-message">Message<textarea id="contact-message" {...register("message")} {...a11y("message")} className={fieldClass} rows={8} maxLength={5000} required />{errorFor("message")}</label>
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true"><label htmlFor="contact-website">Website<input id="contact-website" {...register("website")} tabIndex={-1} autoComplete="off" /></label></div>
      <input type="hidden" {...register("startedAt", { valueAsNumber: true })} />
      {result && <p id="contact-result" role="status" aria-live="polite" className={`border p-4 text-sm ${result.success ? "border-[var(--accent-green)] text-[var(--paper)]" : "border-[var(--danger)] text-[#e3a198]"}`}>{result.message}</p>}
      <button disabled={pending} type="submit" className="button-base button-primary min-w-44" aria-label={pending ? "Sending message" : "Send message"}>
        {pending ? <><LoaderCircle aria-hidden="true" className="animate-spin" size={16} /> Sending…</> : <>Send message <Send aria-hidden="true" size={16} /></>}
      </button>
    </form>
  );
}
