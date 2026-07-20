import type { Metadata } from "next";
import { Cormorant_Garamond, IBM_Plex_Mono, Inter } from "next/font/google";
import { getPublicEnv } from "@/lib/env-public";
import { defaultDescription } from "@/lib/public/metadata";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getPublicEnv().NEXT_PUBLIC_SITE_URL),
  title: {
    default: "Akbar Aulia Ramadhan — Full-Stack & Systems Engineer",
    template: "%s — Akbar Aulia Ramadhan",
  },
  description: defaultDescription,
  authors: [{ name: "Akbar Aulia Ramadhan" }],
  creator: "Akbar Aulia Ramadhan",
  openGraph: {
    title: "Akbar Aulia Ramadhan — Full-Stack & Systems Engineer",
    description: defaultDescription,
    type: "website",
    locale: "en_US",
    siteName: "Akbar A.R. Engineering Portfolio",
  },
  twitter: { card: "summary_large_image", title: "Akbar Aulia Ramadhan — Full-Stack & Systems Engineer", description: defaultDescription },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
