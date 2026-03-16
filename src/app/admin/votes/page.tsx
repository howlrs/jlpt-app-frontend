"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { adminFetchBadQuestions, adminDeleteQuestion, adminBulkDelete, BadQuestion } from "@/lib/api";

const LEVEL_COLORS: Record<string, string> = {
  N1: "border-l-red-500",
  N2: "border-l-orange-500",
  N3: "border-l-yellow-500",
  N4: "border-l-blue-500",
  N5: "border-l-green-500",
};

export default function AdminVotesPage() {
  const [questions, setQuestions] = useState<BadQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  // Bulk select
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);

  // Filters
  const [levelFilter, setLevelFilter] = useState("全レベル");
  const [categoryFilter, setCategoryFilter] = useState("全カテゴリ");
  const [searchText, setSearchText] = useState("");

  // Copied ID feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    adminFetchBadQuestions()
      .then(setQuestions)
      .catch(() => setError("データの取得に失敗しました"))
      .finally(() => setLoading(false));
  }, []);

  // Derive unique levels and categories from data
  const levels = useMemo(() => {
    const set = new Set(questions.map((q) => q.level_name));
    return Array.from(set).sort();
  }, [questions]);

  const categories = useMemo(() => {
    const set = new Set(questions.map((q) => q.category_name));
    return Array.from(set).sort();
  }, [questions]);

  // Filtered list
  const filtered = useMemo(() => {
    return questions.filter((q) => {
      if (levelFilter !== "全レベル" && q.level_name !== levelFilter) return false;
      if (categoryFilter !== "全カテゴリ" && q.category_name !== categoryFilter) return false;
      if (searchText && !q.sentence.toLowerCase().includes(searchText.toLowerCase())) return false;
      return true;
    });
  }, [questions, levelFilter, categoryFilter, searchText]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const ok = await adminDeleteQuestion(id);
    if (ok) {
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
    setDeletingId(null);
    setConfirmId(null);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    const confirmed = window.confirm(`${selectedIds.size}件の問題を削除しますか？`);
    if (!confirmed) return;
    setBulkDeleting(true);
    try {
      const ids = Array.from(selectedIds);
      await adminBulkDelete(ids);
      setQuestions((prev) => prev.filter((q) => !selectedIds.has(q.id)));
      setSelectedIds(new Set());
    } catch {
      alert("一括削除に失敗しました");
    } finally {
      setBulkDeleting(false);
    }
  };

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = () => {
    setSelectedIds(new Set(filtered.map((q) => q.id)));
  };

  const deselectAll = () => {
    setSelectedIds(new Set());
  };

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-gray-500">読み込み中...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center py-20 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          投票レビュー
          {selectedIds.size > 0 && (
            <span className="ml-2 text-base font-normal text-blue-600">
              ({selectedIds.size}件選択中)
            </span>
          )}
        </h2>
        <Link href="/admin" className="text-blue-600 hover:underline text-sm">ダッシュボードに戻る</Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
        >
          <option>全レベル</option>
          {levels.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
        >
          <option>全カテゴリ</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="問題文を検索..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm flex-1 min-w-[200px]"
        />
      </div>

      {/* Bulk actions */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={selectAll} className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
          全選択
        </button>
        <button onClick={deselectAll} className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
          選択解除
        </button>
        {selectedIds.size > 0 && (
          <button
            onClick={handleBulkDelete}
            disabled={bulkDeleting}
            className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
          >
            {bulkDeleting ? "削除中..." : `🗑 選択した問題を削除 (${selectedIds.size}件)`}
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500">問題のある質問はありません。</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((q) => {
            const borderColor = LEVEL_COLORS[q.level_name] || "border-l-gray-300";
            return (
              <div
                key={q.id}
                className={`bg-white rounded-xl shadow-sm border border-gray-200 border-l-4 ${borderColor} p-4`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedIds.has(q.id)}
                      onChange={() => toggleSelect(q.id)}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="text-sm text-gray-500">{q.category_name} / {q.level_name}</p>
                        {q.generated_by && (
                          <span className="inline-block px-1.5 py-0.5 text-xs bg-purple-100 text-purple-700 rounded">
                            {q.generated_by}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-800 truncate">{q.sentence}</p>
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-500 flex-wrap">
                        <span className="text-green-600">Good: {q.good_count}</span>
                        <span className="text-red-600">Bad: {q.bad_count}</span>
                        <span>Bad率: {(q.bad_rate * 100).toFixed(1)}%</span>
                        <button
                          onClick={() => copyId(q.id)}
                          className="text-xs text-gray-400 hover:text-gray-600 font-mono transition"
                          title="IDをコピー"
                        >
                          {copiedId === q.id ? "コピー済!" : `ID: ${q.id.slice(0, 8)}...`}
                        </button>
                      </div>
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
            );
          })}
        </div>
      )}
    </div>
  );
}
