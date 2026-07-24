import type { Metadata } from "next";
import { BriefcaseBusiness, CodeXml, Mail, MapPin } from "lucide-react";
import { ContactForm } from "@/components/public/contact-form";
import { SectionHeading } from "@/components/public/section-heading";
import { getPublicSiteProfileSafe } from "@/lib/public/data";
import { pageMetadata } from "@/lib/public/metadata";
import { TrackedAnchor } from "@/components/analytics/tracked-link";

const Github = CodeXml;
const Linkedin = BriefcaseBusiness;

export const metadata: Metadata = pageMetadata("Contact", "Discuss a complex product, platform, integration, automation, or infrastructure challenge with Akbar.", "/contact");

export default async function ContactPage() {
  const profile = await getPublicSiteProfileSafe();
  const links = [
    profile.email && { label: profile.email, href: `mailto:${profile.email}`, icon: Mail },
    profile.linkedinUrl && { label: "LinkedIn", href: profile.linkedinUrl, icon: Linkedin },
    profile.githubUrl && { label: "GitHub", href: profile.githubUrl, icon: Github },
  ].filter(Boolean) as Array<{ label: string; href: string; icon: typeof Mail }>;

  return (
    <div className="public-container py-16 sm:py-24">
      <SectionHeading label="Open correspondence" title="Let’s discuss the system behind it." description="Share the operating problem, the current constraints, and what a successful outcome needs to look like." />
      <div className="grid min-w-0 gap-12 lg:grid-cols-[.7fr_1.3fr]">
        <aside className="min-w-0 border-t border-[var(--accent-gold)] pt-6">
          <p className="font-serif text-3xl">Professional enquiries</p>
          <p className="reading-measure mt-4 text-sm leading-7 text-[var(--text-secondary)]">{profile.availability}</p>
          <div className="mt-8 space-y-3"><p className="flex items-center gap-3 text-sm"><MapPin aria-hidden="true" size={16} className="shrink-0 text-[var(--accent-gold)]" />{profile.location}</p>{links.map(({ label, href, icon: Icon }) => <TrackedAnchor eventName="Social link clicked" eventTarget={href.startsWith("mailto:") ? "email" : label.toLowerCase()} key={href} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} className="button-base button-editorial !flex !w-fit max-w-full !justify-start !normal-case !tracking-normal"><Icon aria-hidden="true" size={16} className="shrink-0 text-[var(--accent-gold)]" /><span className="truncate">{label}</span></TrackedAnchor>)}</div>
          <p className="mt-10 border-l border-[var(--border)] pl-4 font-mono text-xs uppercase leading-6 tracking-[.07em] text-[var(--text-secondary)]">No credentials, private architecture, or sensitive customer information should be included in this form.</p>
        </aside>
        <section className="min-w-0 border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-9"><h2 className="editorial-label mb-8">Message form / Secure record</h2><ContactForm /></section>
      </div>
    </div>
  );
}
