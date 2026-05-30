import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryList from "./CategoryList";
import { Category, fetchMeta } from "@/lib/api";

const levelInfo: Record<string, { id: number; name: string; description: string; vocab: string; kanji: string }> = {
  n1: { id: 1, name: "N1", description: "幅広い場面で使われる高度な日本語を理解できる", vocab: "約10,000語", kanji: "約2,000字" },
  n2: { id: 2, name: "N2", description: "日常的な場面で使われる日本語をある程度理解できる", vocab: "約6,000語", kanji: "約1,000字" },
  n3: { id: 3, name: "N3", description: "日常的な場面で使われる日本語をある程度理解できる", vocab: "約3,000語", kanji: "約650字" },
  n4: { id: 4, name: "N4", description: "基本的な日本語を理解できる", vocab: "約1,500語", kanji: "約300字" },
  n5: { id: 5, name: "N5", description: "基本的な日本語をある程度理解できる", vocab: "約800語", kanji: "約100字" },
};

export function generateStaticParams() {
  return Object.keys(levelInfo).map((level) => ({ level }));
}

export async function generateMetadata({ params }: { params: Promise<{ level: string }> }): Promise<Metadata> {
  const { level } = await params;
  const info = levelInfo[level];
  if (!info) return {};
  return {
    title: `JLPT ${info.name} 練習問題 - 無料で${info.name}対策`,
    description: `JLPT ${info.name}レベルの練習問題を無料で学習。${info.description}。語彙${info.vocab}、漢字${info.kanji}。`,
    alternates: {
      canonical: `/${level}`,
    },
    openGraph: {
      title: `JLPT ${info.name} 練習問題`,
      description: `${info.name}レベルの練習問題を無料で学習。${info.description}。`,
      images: [`/${level}/opengraph-image`],
    },
  };
}

export default async function LevelPage({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params;
  const info = levelInfo[level];
  if (!info) notFound();

  let categories: Category[] = [];
  try {
    const meta = await fetchMeta();
    categories = meta.categories.filter((c) => c.level_id === info.id && (c.reten ?? 0) > 0);
  } catch {
    // CategoryList will render an empty state, and the random quiz stays hidden.
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/" className="text-blue-600 hover:underline mb-8 block">&larr; レベル選択に戻る</Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">JLPT {info.name}</h1>
          <p className="text-gray-600">{info.description}</p>
          <div className="flex gap-4 mt-4 text-sm text-gray-500">
            <span>語彙: {info.vocab}</span>
            <span>漢字: {info.kanji}</span>
          </div>
        </div>

        <Link
          href={`/${level}/quiz`}
          className="mb-8 block rounded-xl border border-blue-200 bg-white p-6 shadow-sm transition hover:border-blue-400 hover:shadow-md"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">カテゴリ横断</p>
              <h2 className="mt-1 text-xl font-bold text-gray-900">ランダム一問一答を始める</h2>
              <p className="mt-1 text-sm text-gray-500">このレベルの全カテゴリからランダムに出題します。</p>
            </div>
            <span className="inline-flex w-fit rounded-lg bg-blue-600 px-5 py-2 font-medium text-white">
              クイズへ
            </span>
          </div>
        </Link>

        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">カテゴリ別に学ぶ</h2>
          <p className="mt-1 text-sm text-gray-500">出題範囲を絞って練習できます。</p>
        </div>
        <CategoryList levelId={info.id} levelSlug={level} initialCategories={categories} />
      </div>
    </main>
  );
}
