"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetchSummary, VoteSummary } from "@/lib/api";

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<VoteSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;
    adminFetchSummary(token)
      .then(setSummary)
      .catch(() => setError("データの取得に失敗しました"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-gray-500">読み込み中...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center py-20 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">ダッシュボード</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="総問題数" value={summary?.total_questions?.toLocaleString() ?? "-"} />
        <StatCard label="総投票数" value={summary?.total_votes?.toLocaleString() ?? "-"} />
        <StatCard label="良問率" value={summary?.good_rate != null ? `${(summary.good_rate * 100).toFixed(1)}%` : "-"} />
        <StatCard label="問題ある問題" value={summary?.bad_questions_count?.toLocaleString() ?? "-"} color="red" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="font-bold text-gray-700 mb-3">レベル別品質概要</h3>
        <p className="text-sm text-gray-500">レベル別の詳細データはAPIの対応後に表示されます。</p>
      </div>

      <Link
        href="/admin/votes"
        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        投票レビューを確認
      </Link>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color === "red" ? "text-red-600" : "text-gray-800"}`}>{value}</p>
    </div>
  );
}
