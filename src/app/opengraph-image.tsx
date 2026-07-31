import { ImageResponse } from "next/og";
import { BUSINESS_INFO } from "@/features/marketing/data";

export const alt = `${BUSINESS_INFO.name} | Premium Strength & Fitness Studio`;
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
          background: "#000000",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <div style={{ fontSize: 68, fontWeight: 900, letterSpacing: -2 }}>
            {BUSINESS_INFO.shortName.primary}
          </div>
          <div style={{ fontSize: 68, fontWeight: 900, letterSpacing: -2, color: "#dc2626" }}>
            {BUSINESS_INFO.shortName.secondary}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#a1a1aa", marginTop: 20 }}>
          Premium Strength &amp; Fitness Studio · {BUSINESS_INFO.locality}, {BUSINESS_INFO.region}
        </div>
      </div>
    ),
    { ...size },
  );
}
