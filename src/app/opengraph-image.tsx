import { ImageResponse } from "next/og";

export const alt = "Akbar A.R. Antapradja engineering portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
        padding: "70px 78px",
        border: "18px solid #d5a94e",
      }}
    >
      <div style={{ display: "flex", color: "#d5a94e", fontSize: 24, letterSpacing: 4 }}>
        ENGINEERING RECORD / 2026
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontSize: 74, lineHeight: 1.05, fontWeight: 700 }}>
          Akbar A.R. Antapradja
        </div>
        <div style={{ display: "flex", marginTop: 26, fontSize: 34, color: "#c9c6bb" }}>
          Principal Full-Stack &amp; Systems Engineer
        </div>
      </div>
      <div style={{ display: "flex", fontSize: 26, color: "#d5a94e" }}>
        Builder of Systems &amp; People
      </div>
    </div>,
    size,
  );
}
