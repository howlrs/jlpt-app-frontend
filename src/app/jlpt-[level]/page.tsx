import Link from "next/link";
import { Metadata } from "next";
import CategoryList from "./CategoryList";

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
    title: `JLPT ${info.name} 練習問題`,
    description: `JLPT ${info.name}レベルの練習問題。${info.description}。語彙${info.vocab}、漢字${info.kanji}。`,
  };
}

export default async function LevelPage({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params;
  const info = levelInfo[level];
  if (!info) return <div>Not Found</div>;

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

        <CategoryList levelId={info.id} levelSlug={level} />
      </div>
    </main>
  );
}
