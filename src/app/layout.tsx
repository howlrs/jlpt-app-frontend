import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import UserNav from "@/components/UserNav";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  metadataBase: new URL("https://jlpt.howlrs.net"),
  title: {
    default: "JLPT 日本語能力試験 対策学習アプリ | 18,000問以上の無料練習問題",
    template: "%s | JLPT学習",
  },
  description: "JLPT N1〜N5の練習問題を18,000問以上無料で学習。語彙・文法・読解・聴解の全カテゴリ対応。カテゴリ別の苦手分析機能付き。",
  keywords: ["JLPT", "日本語能力試験", "N1", "N2", "N3", "N4", "N5", "練習問題", "Japanese", "日本語学習", "無料", "模擬試験"],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: { url: "/icon-192.png" },
  },
  openGraph: {
    title: "JLPT 日本語能力試験 対策学習アプリ",
    description: "N1〜N5の練習問題を18,000問以上無料で学習。語彙・文法・読解・聴解の全カテゴリ対応。",
    url: "https://jlpt.howlrs.net",
    siteName: "JLPT学習",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "JLPT 日本語能力試験 対策学習アプリ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JLPT 日本語能力試験 対策学習アプリ",
    description: "N1〜N5の練習問題を18,000問以上無料で学習",
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "JLPT 日本語能力試験 対策学習アプリ",
    url: "https://jlpt.howlrs.net",
    description: "JLPT N1〜N5の練習問題を18,000問以上無料で学習",
    inLanguage: "ja",
  };

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "JLPT 日本語能力試験 対策練習",
    description: "JLPT N1〜N5の練習問題を18,000問以上収録。語彙・文法・読解・聴解の全カテゴリ対応。",
    provider: {
      "@type": "Organization",
      name: "JLPT学習",
      url: "https://jlpt.howlrs.net",
    },
    isAccessibleForFree: true,
    availableLanguage: "ja",
  };

  return (
    <html lang="ja">
      <head>
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="gtag-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{page_path:window.location.pathname});`}
            </Script>
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
        />
      </head>
      <body>
        <UserNav />
        {children}
      </body>
    </html>
  );
}
