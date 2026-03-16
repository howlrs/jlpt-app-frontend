"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchHistory } from "@/lib/api";

interface HistoryItem {
  id: string;
  question_id: string;
  level_name: string;
  level_slug: string;
  category_name: string;
  created_at: string;
}

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (!token) {
      sessionStorage.setItem("login_redirect", "/mypage/history");
      router.replace("/login");
      return;
    }
    fetchHistory(token, 50)
      .then((data) => {
        setHistory(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  if (loading) return <div className="text-center py-12 text-gray-500">読み込み中...</div>;

  if (history.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg mb-2">間違えた問題はありません</p>
        <p className="text-sm">不正解の問題がここに表示されます</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold text-gray-900 mb-4">間違えた問題</h2>
      {history.map((item, i) => (
        <Link
          key={item.id || i}
          href={`/${item.level_slug}/quiz?question_id=${item.question_id}`}
          className="block bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-600">{item.level_name}</span>
              <span className="text-gray-300">/</span>
              <span className="text-sm text-gray-600">{item.category_name}</span>
            </div>
            <span className="text-xs text-gray-400">
              {new Date(item.created_at).toLocaleDateString("ja-JP")}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
