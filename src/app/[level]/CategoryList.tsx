"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchMeta, Category } from "@/lib/api";

export default function CategoryList({ levelId, levelSlug }: { levelId: number; levelSlug: string }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeta().then((meta) => {
      setCategories(meta.categories.filter((c) => c.level_id === levelId));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [levelId]);

  if (loading) return <div className="text-center py-8 text-gray-500">カテゴリを読み込み中...</div>;
  if (categories.length === 0) return <div className="text-center py-8 text-gray-500">カテゴリが見つかりません</div>;

  return (
    <div className="grid gap-3">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/jlpt-${levelSlug}/quiz?category=${cat.id}`}
          className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900">{cat.name}</span>
            <span className="text-sm text-gray-500">{cat.reten ? `${cat.reten}問` : ""}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
