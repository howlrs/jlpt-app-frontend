import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "JLPT レベル別練習問題";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const levelColors: Record<string, string> = {
  n1: "#ef4444",
  n2: "#f97316",
  n3: "#eab308",
  n4: "#3b82f6",
  n5: "#22c55e",
};

const levelDescriptions: Record<string, string> = {
  n1: "上級 - 高度な日本語を理解",
  n2: "中上級 - 幅広い場面の日本語",
  n3: "中級 - 日常的な日本語を理解",
  n4: "初中級 - 基本的な日本語を理解",
  n5: "初級 - 基本的な日本語",
};

export default async function Image({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params;
  const name = level.toUpperCase();
  const color = levelColors[level] || "#3b82f6";
  const desc = levelDescriptions[level] || "";

  return new ImageResponse(
    (
      <div
        style={{
          background: `linear-gradient(135deg, #1e293b 0%, ${color} 100%)`,
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
            fontSize: 32,
            opacity: 0.8,
            marginBottom: 20,
            display: "flex",
          }}
        >
          JLPT 日本語能力試験
        </div>
        <div
          style={{
            fontSize: 120,
            fontWeight: 800,
            marginBottom: 20,
            display: "flex",
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: 32,
            opacity: 0.9,
            marginBottom: 40,
            display: "flex",
          }}
        >
          {desc}
        </div>
        <div
          style={{
            fontSize: 26,
            opacity: 0.75,
            display: "flex",
          }}
        >
          無料練習問題で合格を目指そう
        </div>
      </div>
    ),
    { ...size }
  );
}
