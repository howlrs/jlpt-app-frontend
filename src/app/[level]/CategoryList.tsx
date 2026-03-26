import Link from "next/link";
import { fetchMeta, Category } from "@/lib/api";

export default async function CategoryList({ levelId, levelSlug }: { levelId: number; levelSlug: string }) {
  let categories: Category[] = [];
  try {
    const meta = await fetchMeta();
    categories = meta.categories.filter((c) => c.level_id === levelId);
  } catch {
    // API failure — show empty state
  }

  if (categories.length === 0) {
    return <div className="text-center py-8 text-gray-500">カテゴリが見つかりません</div>;
  }

  return (
    <div className="grid gap-3">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/${levelSlug}/quiz?category=${cat.id}`}
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
