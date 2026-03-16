"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import {
  adminFetchCoverage,
  CoverageStats,
  CoverageCategory,
} from "@/lib/api";

const LEVEL_COLORS: Record<string, string> = {
  N1: "#ef4444",
  N2: "#f97316",
  N3: "#eab308",
  N4: "#3b82f6",
  N5: "#22c55e",
};

interface ScatterPoint {
  x: number;
  y: number;
  category_name: string;
  level_name: string;
  target: number;
  actual: number;
  coverage_pct: number;
}

export default function CoverageAnalysisPage() {
  const [data, setData] = useState<CoverageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminFetchCoverage()
      .then(setData)
      .catch(() => setError("データの取得に失敗しました"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        読み込み中...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center py-20 text-red-500">
        {error || "データがありません"}
      </div>
    );
  }

  // Summary calculations
  const totalQuestions = data.levels.reduce(
    (sum, l) => sum + l.total_questions,
    0
  );
  const allCategories: { level_name: string; cat: CoverageCategory }[] = [];
  data.levels.forEach((l) =>
    l.categories.forEach((c) =>
      allCategories.push({ level_name: l.level_name, cat: c })
    )
  );
  const totalCategories = allCategories.length;
  const gaps = allCategories.filter((c) => c.cat.coverage_pct < 50).length;
  const deficit = allCategories.reduce((sum, c) => {
    const diff = c.cat.target - c.cat.sub_question_count;
    return diff > 0 ? sum + diff : sum;
  }, 0);

  // Scatter data per level
  const scatterDataByLevel: Record<string, ScatterPoint[]> = {};
  data.levels.forEach((l) => {
    scatterDataByLevel[l.level_name] = l.categories.map((c) => ({
      x: c.target,
      y: c.sub_question_count,
      category_name: c.category_name,
      level_name: l.level_name,
      target: c.target,
      actual: c.sub_question_count,
      coverage_pct: c.coverage_pct,
    }));
  });

  // Max value for reference line
  const maxVal = Math.max(
    ...allCategories.map((c) =>
      Math.max(c.cat.target, c.cat.sub_question_count)
    ),
    100
  );

  // Heatmap: collect unique category names across all levels
  const categoryNames = Array.from(
    new Set(allCategories.map((c) => c.cat.category_name))
  ).sort();
  const levelNames = data.levels
    .sort((a, b) => a.level_id - b.level_id)
    .map((l) => l.level_name);

  // Build lookup: { categoryName: { levelName: CoverageCategory } }
  const heatmapLookup: Record<string, Record<string, CoverageCategory>> = {};
  data.levels.forEach((l) => {
    l.categories.forEach((c) => {
      if (!heatmapLookup[c.category_name]) heatmapLookup[c.category_name] = {};
      heatmapLookup[c.category_name][l.level_name] = c;
    });
  });

  function cellColor(pct: number | undefined): string {
    if (pct === undefined) return "bg-gray-100 text-gray-400";
    if (pct >= 100) return "bg-green-200 text-green-900";
    if (pct >= 50) return "bg-yellow-200 text-yellow-900";
    return "bg-red-200 text-red-900";
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">カバレッジ分析</h2>
        <Link
          href="/admin"
          className="text-sm text-blue-600 hover:underline"
        >
          ダッシュボードに戻る
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <SummaryCard label="総問題数" value={totalQuestions.toLocaleString()} />
        <SummaryCard label="カテゴリ数" value={String(totalCategories)} />
        <SummaryCard
          label="不足カテゴリ (< 50%)"
          value={String(gaps)}
          color={gaps > 0 ? "red" : undefined}
        />
        <SummaryCard
          label="不足問題数"
          value={deficit.toLocaleString()}
          color={deficit > 0 ? "orange" : undefined}
        />
      </div>

      {/* Positioning Map */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="font-bold text-gray-700 mb-4">
          ポジショニングマップ（Target vs Actual）
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          対角線より下のドットは目標未達のカテゴリです
        </p>
        <ResponsiveContainer width="100%" height={450}>
          <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="x"
              name="Target"
              domain={[0, maxVal + 50]}
              label={{
                value: "Target (目標数)",
                position: "insideBottom",
                offset: -5,
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Actual"
              domain={[0, maxVal + 50]}
              label={{
                value: "Actual (実数)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip
              content={({ payload }) => {
                if (!payload || payload.length === 0) return null;
                const p = payload[0].payload as ScatterPoint;
                return (
                  <div className="bg-white border border-gray-300 rounded-lg p-3 shadow-lg text-sm">
                    <p className="font-bold">{p.category_name}</p>
                    <p className="text-gray-600">{p.level_name}</p>
                    <p>
                      実数: {p.actual} / 目標: {p.target}
                    </p>
                    <p>カバレッジ: {p.coverage_pct}%</p>
                  </div>
                );
              }}
            />
            <Legend />
            <ReferenceLine
              segment={[
                { x: 0, y: 0 },
                { x: maxVal + 50, y: maxVal + 50 },
              ]}
              stroke="#9ca3af"
              strokeDasharray="5 5"
              label="100%"
            />
            {levelNames.map((ln) => (
              <Scatter
                key={ln}
                name={ln}
                data={scatterDataByLevel[ln] || []}
                fill={LEVEL_COLORS[ln] || "#6b7280"}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Heatmap Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-bold text-gray-700 mb-4">
          カバレッジヒートマップ
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left p-2 border-b border-gray-200 bg-gray-50">
                  カテゴリ
                </th>
                {levelNames.map((ln) => (
                  <th
                    key={ln}
                    className="text-center p-2 border-b border-gray-200 bg-gray-50 min-w-[100px]"
                  >
                    {ln}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categoryNames.map((catName) => (
                <tr key={catName} className="border-b border-gray-100">
                  <td className="p-2 font-medium text-gray-700 whitespace-nowrap">
                    {catName}
                  </td>
                  {levelNames.map((ln) => {
                    const cell = heatmapLookup[catName]?.[ln];
                    return (
                      <td
                        key={ln}
                        className={`p-2 text-center text-xs font-mono ${cellColor(
                          cell?.coverage_pct
                        )}`}
                      >
                        {cell
                          ? `${cell.sub_question_count}/${cell.target}`
                          : "-"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex gap-4 mt-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-green-200 inline-block" />
            100%以上
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-yellow-200 inline-block" />
            50-99%
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-red-200 inline-block" />
            50%未満
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-gray-100 inline-block" />
            データなし
          </span>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  const textColor =
    color === "red"
      ? "text-red-600"
      : color === "orange"
      ? "text-orange-600"
      : "text-gray-800";
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
    </div>
  );
}
