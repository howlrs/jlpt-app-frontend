"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetchBadQuestions, adminDeleteQuestion, BadQuestion } from "@/lib/api";

export default function AdminVotesPage() {
  const [questions, setQuestions] = useState<BadQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;
    adminFetchBadQuestions(token)
      .then(setQuestions)
      .catch(() => setError("データの取得に失敗しました"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;
    setDeletingId(id);
    const ok = await adminDeleteQuestion(token, id);
    if (ok) {
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    }
    setDeletingId(null);
    setConfirmId(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-gray-500">読み込み中...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center py-20 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">投票レビュー</h2>
        <Link href="/admin" className="text-blue-600 hover:underline text-sm">ダッシュボードに戻る</Link>
      </div>

      {questions.length === 0 ? (
        <p className="text-gray-500">問題のある質問はありません。</p>
      ) : (
        <div className="space-y-3">
          {questions.map((q) => (
            <div key={q.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-500 mb-1">{q.category_name} / {q.level_name}</p>
                  <p className="text-gray-800 truncate">{q.sentence}</p>
                  <div className="flex gap-3 mt-2 text-sm text-gray-500">
                    <span className="text-green-600">Good: {q.good_count}</span>
                    <span className="text-red-600">Bad: {q.bad_count}</span>
                    <span>Bad率: {(q.bad_rate * 100).toFixed(1)}%</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
                  >
                    {expandedId === q.id ? "閉じる" : "詳細"}
                  </button>
                  {confirmId === q.id ? (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleDelete(q.id)}
                        disabled={deletingId === q.id}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                      >
                        {deletingId === q.id ? "..." : "確認"}
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
                      >
                        取消
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmId(q.id)}
                      className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                    >
                      削除
                    </button>
                  )}
                </div>
              </div>

              {expandedId === q.id && (
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <p className="text-gray-700 whitespace-pre-wrap mb-3">{q.sentence}</p>
                  {q.prerequisites && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-3 text-sm text-gray-600 whitespace-pre-wrap">
                      {q.prerequisites}
                    </div>
                  )}
                  {q.sub_questions?.map((sub) => (
                    <div key={sub.id} className="mb-4">
                      {sub.sentence && <p className="font-medium text-gray-900 mb-2">{sub.sentence}</p>}
                      <div className="space-y-1">
                        {sub.select_answer.map((sa) => (
                          <div
                            key={sa.key}
                            className={`px-3 py-2 rounded-lg text-sm ${
                              sa.key === sub.answer
                                ? "bg-green-50 border border-green-300 text-green-800 font-medium"
                                : "bg-gray-50 text-gray-600"
                            }`}
                          >
                            <span className="font-medium mr-2">{sa.key}.</span>
                            {sa.value}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
