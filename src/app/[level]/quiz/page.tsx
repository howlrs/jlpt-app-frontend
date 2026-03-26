import { Metadata } from "next";
import { fetchMeta } from "@/lib/api";
import QuizClient from "./QuizClient";

const levelNames: Record<string, string> = {
  n1: "N1", n2: "N2", n3: "N3", n4: "N4", n5: "N5",
};

const levelIds: Record<string, number> = {
  n1: 1, n2: 2, n3: 3, n4: 4, n5: 5,
};

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ level: string }>;
  searchParams: Promise<{ category?: string; question_id?: string }>;
}): Promise<Metadata> {
  const { level } = await params;
  const { category, question_id } = await searchParams;
  const name = levelNames[level];
  if (!name) return {};

  // 個別問題ページ
  if (question_id) {
    return {
      title: `JLPT ${name} 練習問題`,
      description: `JLPT ${name}レベルの練習問題に挑戦。`,
      alternates: { canonical: `/${level}/quiz?question_id=${question_id}` },
    };
  }

  // カテゴリ別クイズページ
  const categoryId = Number(category || "1");
  let categoryName = "";
  try {
    const meta = await fetchMeta();
    const cat = meta.categories.find(
      (c) => c.level_id === levelIds[level] && c.id === categoryId
    );
    if (cat) categoryName = cat.name;
  } catch {
    // fallback without category name
  }

  const title = categoryName
    ? `JLPT ${name} ${categoryName} 練習問題`
    : `JLPT ${name} 練習問題`;
  const description = categoryName
    ? `JLPT ${name}レベルの${categoryName}の練習問題を無料で学習。`
    : `JLPT ${name}レベルの練習問題を無料で学習。`;

  return {
    title,
    description,
    alternates: { canonical: `/${level}/quiz?category=${categoryId}` },
    openGraph: {
      title,
      description,
    },
  };
}

export default function QuizPage() {
  return <QuizClient />;
}
