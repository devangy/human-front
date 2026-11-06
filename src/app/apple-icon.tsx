import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #a855f7 0%, #7c3aed 55%, #4c1d95 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 16,
              height: 48,
              borderRadius: 10,
              background: "#f6b73c",
            }}
          />
          <div
            style={{
              width: 16,
              height: 88,
              borderRadius: 10,
              background: "#fff",
            }}
          />
          <div
            style={{
              width: 16,
              height: 112,
              borderRadius: 10,
              background: "#fff",
            }}
          />
          <div
            style={{
              width: 16,
              height: 64,
              borderRadius: 10,
              background: "#f6b73c",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
