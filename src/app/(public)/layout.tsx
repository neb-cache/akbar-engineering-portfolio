import { Footer } from "@/components/public/footer";
import { Navbar } from "@/components/public/navbar";
import { getPublicSiteProfileSafe } from "@/lib/public/data";

export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const profile = await getPublicSiteProfileSafe();
  return <div className="public-shell"><a className="skip-link focus-ring" href="#main-content">Skip to content</a><Navbar resumeUrl={profile.resumeUrl}/><main id="main-content" tabIndex={-1}>{children}</main><Footer profile={profile}/></div>;
}
