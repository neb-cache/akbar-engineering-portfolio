import type { Metadata } from "next";
import { Cormorant_Garamond, IBM_Plex_Mono, Inter } from "next/font/google";
import { Observability } from "@/components/analytics/observability";
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
  weight: ["400", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getPublicEnv().NEXT_PUBLIC_SITE_URL),
  title: {
    default: "Akbar A.R — Principal Full-Stack & Systems Engineer",
    template: "%s — Akbar A.R",
  },
  description: defaultDescription,
  applicationName: "Akbar A.R. Engineering Portfolio",
  authors: [{ name: "Akbar A.R" }],
  creator: "Akbar A.R",
  category: "technology",
  keywords: [
    "Principal Full-Stack Engineer",
    "Systems Engineer",
    "Golang",
    "Next.js",
    "Flutter",
    "ERP integration",
    "production infrastructure",
    "engineering leadership",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Akbar A.R — Principal Full-Stack & Systems Engineer",
    description: defaultDescription,
    url: "/",
    type: "website",
    locale: "en_US",
    siteName: "Akbar A.R. Engineering Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Akbar A.R — Principal Full-Stack & Systems Engineer",
    description: defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
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
      <body className="min-h-full flex flex-col">
        {children}
        <Observability />
      </body>
    </html>
  );
}
