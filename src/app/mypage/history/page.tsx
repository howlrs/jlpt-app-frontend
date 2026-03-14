"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchHistory } from "@/lib/api";

interface HistoryItem {
  id: string;
  question_id: string;
  sub_question_id: number;
  selected_answer: string;
  correct_answer: string;
  is_correct: boolean;
  level_name: string;
  category_name: string;
  sentence: string;
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
        <p className="text-lg mb-2">学習履歴がありません</p>
        <p className="text-sm">クイズに回答すると、ここに履歴が表示されます</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold text-gray-900 mb-4">最近の学習履歴</h2>
      {history.map((item, i) => (
        <div
          key={item.id || i}
          className="bg-white rounded-lg border border-gray-200 p-4 flex items-start gap-3"
        >
          <span className={`text-lg mt-0.5 ${item.is_correct ? "text-green-600" : "text-red-500"}`}>
            {item.is_correct ? "○" : "×"}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <span>{item.level_name}</span>
              <span>/</span>
              <span>{item.category_name}</span>
              <span className="ml-auto">
                {new Date(item.created_at).toLocaleDateString("ja-JP")}
              </span>
            </div>
            <p className="text-sm text-gray-800 truncate">{item.sentence}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
