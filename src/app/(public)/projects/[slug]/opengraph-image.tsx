import { ImageResponse } from "next/og";
import { getPublicProjectBySlug } from "@/lib/public/data";

export const alt = "Public engineering project case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function ProjectOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);
  const title = project?.title ?? "Engineering Project";
  const category = project?.project_type ?? "Professional case study";
  const summary = project?.short_description ?? "A public engineering record by Akbar A.R";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#10110f",
        color: "#f0eee5",
        padding: "68px 76px",
        borderLeft: "22px solid #d5a94e",
      }}
    >
      <div style={{ display: "flex", color: "#d5a94e", fontSize: 24, letterSpacing: 3 }}>
        {category.toUpperCase()} / PUBLIC RECORD
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontSize: title.length > 42 ? 58 : 72, lineHeight: 1.05, fontWeight: 700 }}>
          {title}
        </div>
        <div style={{ display: "flex", marginTop: 26, maxWidth: 980, fontSize: 28, lineHeight: 1.35, color: "#c9c6bb" }}>
          {summary.slice(0, 190)}
        </div>
      </div>
      <div style={{ display: "flex", fontSize: 22, color: "#d5a94e" }}>
        Akbar A.R · Principal Full-Stack &amp; Systems Engineer
      </div>
    </div>,
    size,
  );
}
