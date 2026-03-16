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

function shortId(id: string): string {
  return id.slice(0, 8);
}

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [visited, setVisited] = useState<Set<string>>(new Set());

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

    // Restore visited state from localStorage
    try {
      const saved = localStorage.getItem("visited_questions");
      if (saved) setVisited(new Set(JSON.parse(saved)));
    } catch {}
  }, [router]);

  const markVisited = (questionId: string) => {
    setVisited((prev) => {
      const next = new Set(prev);
      next.add(questionId);
      localStorage.setItem("visited_questions", JSON.stringify([...next]));
      return next;
    });
  };

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
      {history.map((item, i) => {
        const isVisited = visited.has(item.question_id);
        return (
          <Link
            key={item.id || i}
            href={`/${item.level_slug}/quiz?question_id=${item.question_id}`}
            onClick={() => markVisited(item.question_id)}
            className={`block rounded-lg border p-4 transition-colors ${
              isVisited
                ? "bg-gray-50 border-gray-200 hover:border-gray-300"
                : "bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${isVisited ? "text-gray-400" : "text-blue-600"}`}>
                  {item.level_name}
                </span>
                <span className="text-gray-300">/</span>
                <span className={`text-sm ${isVisited ? "text-gray-400" : "text-gray-600"}`}>
                  {item.category_name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <code className={`text-xs font-mono ${isVisited ? "text-gray-300" : "text-gray-400"}`}>
                  #{shortId(item.question_id)}
                </code>
                <span className={`text-xs ${isVisited ? "text-gray-300" : "text-gray-400"}`}>
                  {new Date(item.created_at).toLocaleDateString("ja-JP")}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
