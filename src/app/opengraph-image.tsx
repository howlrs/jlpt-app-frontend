import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "JLPT 日本語能力試験 対策学習アプリ";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #3b82f6 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          color: "white",
          padding: "60px",
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 800,
            letterSpacing: "-2px",
            marginBottom: 20,
            display: "flex",
          }}
        >
          JLPT 学習
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 600,
            marginBottom: 40,
            opacity: 0.95,
            display: "flex",
          }}
        >
          日本語能力試験 対策学習アプリ
        </div>
        <div
          style={{
            display: "flex",
            gap: 16,
            marginBottom: 40,
          }}
        >
          {["N5", "N4", "N3", "N2", "N1"].map((level) => (
            <div
              key={level}
              style={{
                background: "rgba(255,255,255,0.2)",
                borderRadius: 12,
                padding: "12px 28px",
                fontSize: 28,
                fontWeight: 700,
                display: "flex",
              }}
            >
              {level}
            </div>
          ))}
        </div>
        <div
          style={{
            fontSize: 28,
            opacity: 0.85,
            display: "flex",
          }}
        >
          18,000問以上の練習問題を無料で学習
        </div>
      </div>
    ),
    { ...size }
  );
}
