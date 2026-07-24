import type { MetadataRoute } from "next";
import { defaultDescription } from "@/lib/public/metadata";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Akbar A.R. Antapradja — Engineering Portfolio",
    short_name: "Akbar A.R.",
    description: defaultDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#10110f",
    theme_color: "#10110f",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
