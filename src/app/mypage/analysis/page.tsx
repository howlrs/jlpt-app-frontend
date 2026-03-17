"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchUserStats } from "@/lib/api";

interface CategoryStat {
  category_name: string;
  total: number;
  correct: number;
  accuracy: number;
}

interface LevelStat {
  level_name: string;
  total: number;
  correct: number;
  accuracy: number;
  categories: CategoryStat[];
}

interface UserStats {
  overall_accuracy: number;
  total_answers: number;
  total_correct: number;
  levels: LevelStat[];
}

export default function AnalysisPage() {
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserStats()
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [router]);

  if (loading) return <div className="text-center py-12 text-gray-500">読み込み中...</div>;

  if (!stats || stats.total_answers === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg mb-2">データがありません</p>
        <p className="text-sm">クイズに回答すると、分析結果が表示されます</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-sm text-gray-500 mb-2">全体正答率</p>
        <p className={`text-6xl font-bold ${stats.overall_accuracy >= 70 ? "text-blue-600" : "text-red-500"}`}>
          {Math.round(stats.overall_accuracy)}%
        </p>
        <p className="text-sm text-gray-400 mt-2">
          {stats.total_correct} / {stats.total_answers} 問正解
        </p>
      </div>

      {stats.levels.map((level) => (
        <div key={level.level_name} className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">{level.level_name}</h3>
            <span className={`text-sm font-medium ${level.accuracy >= 70 ? "text-green-600" : "text-red-500"}`}>
              {Math.round(level.accuracy)}% ({level.correct}/{level.total})
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className={`h-3 rounded-full transition-all ${level.accuracy >= 70 ? "bg-blue-500" : "bg-red-400"}`}
              style={{ width: `${Math.min(level.accuracy, 100)}%` }}
            />
          </div>

          {level.categories.length > 0 && (
            <div className="space-y-2">
              {level.categories.map((cat) => (
                <div key={cat.category_name} className="flex items-center gap-3">
                  <span className="text-sm text-gray-700 w-40 truncate">{cat.category_name}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${cat.accuracy >= 70 ? "bg-green-400" : "bg-red-400"}`}
                      style={{ width: `${Math.min(cat.accuracy, 100)}%` }}
                    />
                  </div>
                  <span className={`text-xs w-20 text-right ${cat.accuracy < 70 ? "text-red-500 font-medium" : "text-gray-500"}`}>
                    {Math.round(cat.accuracy)}% ({cat.correct}/{cat.total})
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
