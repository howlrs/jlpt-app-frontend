import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "JLPT 日本語能力試験 対策学習アプリ",
    template: "%s | JLPT学習",
  },
  description: "JLPT N1〜N5の練習問題を無料で学習。語彙・文法・読解・聴解の全カテゴリ対応。",
  keywords: ["JLPT", "日本語能力試験", "N1", "N2", "N3", "N4", "N5", "練習問題", "Japanese"],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: { url: "/icon-192.png" },
  },
  openGraph: {
    title: "JLPT 日本語能力試験 対策学習アプリ",
    description: "N1〜N5の練習問題を無料で学習",
    url: "https://jlpt.howlrs.net",
    siteName: "JLPT Learning",
    locale: "ja_JP",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
