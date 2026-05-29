import Link from "next/link";

// Phase 17: レベル別問題数は /api/meta から取得
// 以前は levels[].questions にハードコード値があったが、dedup や削除で DB と乖離していた

export const revalidate = 60;

interface CategoryMeta {
  id: number;
  level_id: number;
  name: string;
  reten: number;
}

interface MetaResponse {
  data?: {
    categories?: CategoryMeta[];
  };
}

const LEVEL_META = [
  { id: "n5", level_id: 5, name: "N5", description: "初級 - 基本的な日本語", color: "bg-green-500" },
  { id: "n4", level_id: 4, name: "N4", description: "初中級 - 基本的な日本語を理解", color: "bg-blue-500" },
  { id: "n3", level_id: 3, name: "N3", description: "中級 - 日常的な日本語を理解", color: "bg-yellow-500" },
  { id: "n2", level_id: 2, name: "N2", description: "中上級 - 幅広い場面の日本語", color: "bg-orange-500" },
  { id: "n1", level_id: 1, name: "N1", description: "上級 - 高度な日本語を理解", color: "bg-red-500" },
];

async function fetchLevelCounts(): Promise<Record<number, number>> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  try {
    const res = await fetch(`${apiBase}/api/meta`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return {};
    const json: MetaResponse = await res.json();
    const cats = json.data?.categories ?? [];
    const counts: Record<number, number> = {};
    for (const c of cats) {
      counts[c.level_id] = (counts[c.level_id] ?? 0) + (c.reten ?? 0);
    }
    return counts;
  } catch {
    return {};
  }
}

function formatJapaneseNumber(n: number): string {
  return n.toLocaleString("ja-JP");
}

export default async function Home() {
  const levelCounts = await fetchLevelCounts();
  const totalCount = Object.values(levelCounts).reduce((sum, count) => sum + count, 0);
  const totalDisplay = totalCount > 0 ? formatJapaneseNumber(totalCount) : "";

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            JLPT 日本語能力試験
          </h1>
          <p className="text-xl text-gray-600 mb-2">対策学習アプリ</p>
          <p className="text-gray-500">
            {totalDisplay ? `${totalDisplay}問の品質検証済み練習問題で合格を目指そう` : "品質検証済み練習問題で合格を目指そう"}
          </p>
        </div>

        <div className="grid gap-4">
          {LEVEL_META.map((level) => {
            const count = levelCounts[level.level_id];
            const display = count !== undefined ? formatJapaneseNumber(count) : "-";
            return (
              <Link
                key={level.id}
                href={`/${level.id}`}
                className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className={`${level.color} text-white font-bold text-2xl w-16 h-16 rounded-full flex items-center justify-center`}>
                      {level.name}
                    </span>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{level.name}</h2>
                      <p className="text-gray-600">{level.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{display}</p>
                    <p className="text-sm text-gray-500">問</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>非公式 JLPT対策アプリ</p>
          <nav aria-label="フッターナビゲーション" className="flex justify-center gap-4 mt-3">
            <Link href="/about" className="hover:text-gray-700 transition">このアプリについて</Link>
            <Link href="/terms" className="hover:text-gray-700 transition">利用規約</Link>
            <Link href="/privacy" className="hover:text-gray-700 transition">プライバシーポリシー</Link>
          </nav>
          <p className="mt-2">
            <a href="https://github.com/howlrs" className="hover:text-gray-700" target="_blank" rel="noopener noreferrer">@howlrs</a>
          </p>
        </footer>
      </div>
    </main>
  );
}
