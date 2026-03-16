"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetchSummary, adminFetchStats, VoteSummary, AdminStats } from "@/lib/api";

const LEVEL_BAR_COLORS: Record<string, string> = {
  N1: "bg-red-500",
  N2: "bg-orange-500",
  N3: "bg-yellow-500",
  N4: "bg-blue-500",
  N5: "bg-green-500",
};

const LEVEL_TEXT_COLORS: Record<string, string> = {
  N1: "text-red-600",
  N2: "text-orange-600",
  N3: "text-yellow-600",
  N4: "text-blue-600",
  N5: "text-green-600",
};

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<VoteSummary | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      adminFetchSummary(),
      adminFetchStats().catch(() => null),
    ])
      .then(([summaryData, statsData]) => {
        setSummary(summaryData);
        if (statsData) setStats(statsData);
      })
      .catch(() => setError("データの取得に失敗しました"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-gray-500">読み込み中...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center py-20 text-red-500">{error}</div>;
  }

  const maxTotal = stats?.levels ? Math.max(...stats.levels.map((l) => l.total_questions), 1) : 1;

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
        <h3 className="font-bold text-gray-700 mb-4">レベル別品質概要</h3>
        {stats?.levels && stats.levels.length > 0 ? (
          <div className="space-y-3">
            {stats.levels.map((level) => {
              const barColor = LEVEL_BAR_COLORS[level.level_name] || "bg-gray-400";
              const textColor = LEVEL_TEXT_COLORS[level.level_name] || "text-gray-600";
              const pct = maxTotal > 0 ? (level.total_questions / maxTotal) * 100 : 0;
              return (
                <div key={level.level_name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-semibold ${textColor}`}>{level.level_name}</span>
                    <span className="text-sm text-gray-500">{level.total_questions.toLocaleString()}問</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${barColor} transition-all`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex gap-4 mt-1 text-xs text-gray-500">
                    <span className="text-green-600">Good: {level.good_votes}</span>
                    <span className="text-red-600">Bad: {level.bad_votes}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500">レベル別の詳細データはAPIの対応後に表示されます。</p>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-bold text-gray-700 mb-4">管理メニュー</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Link href="/admin/votes" className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition">
            <span className="text-2xl">📋</span>
            <div>
              <p className="font-semibold text-gray-800">投票レビュー</p>
              <p className="text-sm text-gray-500">低品質問題の確認・削除</p>
            </div>
          </Link>
          <Link href="/admin/coverage" className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition">
            <span className="text-2xl">📊</span>
            <div>
              <p className="font-semibold text-gray-800">カバレッジ分析</p>
              <p className="text-sm text-gray-500">問題のポジショニングマップ・カテゴリ別充足率</p>
            </div>
          </Link>
          <Link href="/" className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-green-400 hover:bg-green-50 transition">
            <span className="text-2xl">📝</span>
            <div>
              <p className="font-semibold text-gray-800">問題演習（ユーザー視点）</p>
              <p className="text-sm text-gray-500">ユーザーと同じ画面で確認</p>
            </div>
          </Link>
        </div>
      </div>
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
