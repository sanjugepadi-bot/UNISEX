import { ImageResponse } from "next/og";

export const alt = "AI Gym SaaS";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "black",
          color: "white",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700 }}>AI Gym SaaS</div>
        <div style={{ fontSize: 28, color: "#a1a1aa", marginTop: 16 }}>
          Members, attendance, plans, and AI-powered workout &amp; diet planning
        </div>
      </div>
    ),
    { ...size },
  );
}
