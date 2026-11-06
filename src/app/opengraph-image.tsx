import { ImageResponse } from "next/og";

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
          justifyContent: "center",
          padding: "80px",
          background:
            "linear-gradient(135deg, #0a0a12 0%, #140f26 55%, #1d1240 100%)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.45) 0%, rgba(139,92,246,0) 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -160,
            left: -100,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(246,183,60,0.25) 0%, rgba(246,183,60,0) 70%)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg, #a855f7 0%, #7c3aed 55%, #4c1d95 100%)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div
                style={{
                  width: 5,
                  height: 16,
                  borderRadius: 3,
                  background: "#f6b73c",
                }}
              />
              <div
                style={{
                  width: 5,
                  height: 28,
                  borderRadius: 3,
                  background: "#fff",
                }}
              />
              <div
                style={{
                  width: 5,
                  height: 36,
                  borderRadius: 3,
                  background: "#fff",
                }}
              />
              <div
                style={{
                  width: 5,
                  height: 22,
                  borderRadius: 3,
                  background: "#f6b73c",
                }}
              />
            </div>
          </div>
          <div
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: "#f5f3ff",
              display: "flex",
            }}
          >
            NotHuman.ai
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 60,
            fontWeight: 700,
            lineHeight: 1.15,
            color: "#f5f3ff",
            marginTop: 56,
            maxWidth: 980,
          }}
        >
          No-code voice AI agents, built for Bharat.
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#b4acd1",
            marginTop: 28,
            maxWidth: 820,
          }}
        >
          Design, train and deploy voice agents in English and 11 Indian
          languages — no code required.
        </div>
      </div>
    ),
    { ...size }
  );
}
