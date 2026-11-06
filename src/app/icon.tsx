import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
        <div style={{ display: "flex", alignItems: "center", gap: 2.5 }}>
          <div
            style={{
              width: 3,
              height: 9,
              borderRadius: 2,
              background: "#f6b73c",
            }}
          />
          <div
            style={{
              width: 3,
              height: 16,
              borderRadius: 2,
              background: "#fff",
            }}
          />
          <div
            style={{
              width: 3,
              height: 20,
              borderRadius: 2,
              background: "#fff",
            }}
          />
          <div
            style={{
              width: 3,
              height: 12,
              borderRadius: 2,
              background: "#f6b73c",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
