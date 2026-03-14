"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MypageLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { href: "/mypage/history", label: "学習履歴" },
    { href: "/mypage/analysis", label: "苦手分析" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-blue-600 hover:underline text-sm">&larr; トップへ戻る</Link>
        </div>
        <div className="flex border-b border-gray-200 mb-6">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-6 py-3 font-medium transition ${
                pathname === tab.href
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
        {children}
      </div>
    </div>
  );
}
