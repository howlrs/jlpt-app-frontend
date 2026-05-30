"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useParams } from "next/navigation";
import {
  fetchLevelQuestions,
  fetchQuestions,
  fetchQuestionById,
  submitVote,
  reportQuestion,
  recordAnswer,
  Category,
  Question,
  SubQuestion,
} from "@/lib/api";

const levelMap: Record<string, number> = {
  n1: 1, n2: 2, n3: 3, n4: 4, n5: 5,
};

interface QuizItem {
  question: Question;
  subQuestion: SubQuestion;
}

const QUESTION_COUNT = 10;
const FALLBACK_CATEGORY_ATTEMPTS = 2;
const QUESTIONS_PER_FALLBACK_CATEGORY = Math.ceil(QUESTION_COUNT / FALLBACK_CATEGORY_ATTEMPTS);

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function flattenQuestions(questions: Question[]): QuizItem[] {
  return questions.flatMap((question) =>
    question.sub_questions
      .filter((subQuestion) => subQuestion.select_answer.length > 0)
      .map((subQuestion) => ({ question, subQuestion })),
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4 text-center">
        <div
          className="mb-5 h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600"
          aria-hidden="true"
        />
        <p className="text-base font-medium text-gray-700">問題を読み込み中...</p>
        <p className="mt-2 text-sm text-gray-500">通信状況によって数秒かかることがあります。</p>
      </div>
    </div>
  );
}

function QuizContent({ categories }: { categories: Category[] }) {
  const params = useParams<{ level: string }>();
  const level = params.level;
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const categoryId = categoryParam ? Number(categoryParam) : null;
  const questionId = searchParams.get("question_id");
  const levelId = levelMap[level] || 3;

  const [items, setItems] = useState<QuizItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState<string | null>(null);
  const [reported, setReported] = useState<"none" | "done" | "already" | "error" | "auth">("none");

  const resetSession = (nextItems: QuizItem[]) => {
    setItems(nextItems);
    setCurrentIdx(0);
    setSelected(null);
    setShowResult(false);
    setScore({ correct: 0, total: 0 });
    setVoted(null);
    setReported("none");
  };

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    try {
      if (questionId) {
        const q = await fetchQuestionById(questionId);
        resetSession(q ? flattenQuestions([q]) : []);
        return;
      }

      if (categoryId) {
        const qs = await fetchQuestions(levelId, categoryId, QUESTION_COUNT);
        resetSession(flattenQuestions(qs).slice(0, QUESTION_COUNT));
        return;
      }

      const levelQuestions = await fetchLevelQuestions(levelId, QUESTION_COUNT);
      if (levelQuestions.status === "ok") {
        resetSession(flattenQuestions(levelQuestions.questions).slice(0, QUESTION_COUNT));
        return;
      }

      const fallbackCategories = shuffle(
        categories.filter(
          (category) => category.level_id === levelId && (category.reten ?? 0) > 0,
        ),
      ).slice(0, FALLBACK_CATEGORY_ATTEMPTS);
      const results = await Promise.all(
        fallbackCategories.map((category) =>
          fetchQuestions(levelId, category.id, QUESTIONS_PER_FALLBACK_CATEGORY),
        ),
      );
      const fallbackQuestions = results.flat();
      resetSession(shuffle(flattenQuestions(fallbackQuestions)).slice(0, QUESTION_COUNT));
      return;
    } catch {
      resetSession([]);
    } finally {
      setLoading(false);
    }
  }, [levelId, categoryId, questionId, categories]);

  useEffect(() => {
    queueMicrotask(() => {
      void loadQuestions();
    });
  }, [loadQuestions]);

  if (loading) return <LoadingState />;
  if (items.length === 0) return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-bold text-gray-900">問題が見つかりません</h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            一時的な通信失敗、またはアクセス集中により問題を取得できませんでした。
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={loadQuestions}
              className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              再読み込み
            </button>
            <Link
              href={`/${level}`}
              className="rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
            >
              カテゴリ選択に戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  const current = items[currentIdx];
  const question = current?.question;
  const subQuestion = current?.subQuestion;

  if (!question || !subQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">結果</h2>
          <p className="text-5xl font-bold text-blue-600 mb-2">{score.correct}/{score.total}</p>
          <p className="text-gray-500 mb-6">正答率: {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%</p>
          <div className="flex gap-3 justify-center">
            <button onClick={loadQuestions} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">もう一度</button>
            <Link href={`/${level}`} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">戻る</Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSelect = (key: string) => {
    if (showResult) return;
    setSelected(key);
    setShowResult(true);
    setScore((prev) => ({
      correct: prev.correct + (key === subQuestion.answer ? 1 : 0),
      total: prev.total + 1,
    }));
    recordAnswer(question.id, subQuestion.id, key);
  };

  const handleVote = async (vote: "good" | "bad") => {
    if (voted) return;
    setVoted(vote);
    await submitVote(vote, question.id, String(subQuestion.id));
  };

  const handleReport = async () => {
    if (!question || !subQuestion) return;
    const result = await reportQuestion(question.id);
    setReported(result === "ok" ? "done" : result === "already" ? "already" : result === "auth" ? "auth" : "error");
  };

  const handleNext = () => {
    setSelected(null);
    setShowResult(false);
    setVoted(null);
    setReported("none");
    setCurrentIdx((index) => index + 1);
  };

  const quizLabel = categoryParam ? question.category_name : "カテゴリ横断";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link href={`/${level}`} className="text-blue-600 hover:underline text-sm">&larr; 戻る</Link>
          <span className="text-sm text-gray-500">
            {score.correct}/{score.total} 正解 ・ {currentIdx + 1}/{items.length}
          </span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <p className="text-sm text-gray-500 mb-2">{quizLabel}</p>
          <p className="text-gray-700 mb-4">{question.sentence}</p>
          {question.prerequisites && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4 text-sm text-gray-600 whitespace-pre-wrap">
              {question.prerequisites}
            </div>
          )}
          {subQuestion.sentence && (
            <p className="font-medium text-gray-900 text-lg">{subQuestion.sentence}</p>
          )}
        </div>

        <div className="grid gap-3">
          {subQuestion.select_answer.map((sa) => {
            let style = "bg-white border-gray-200 text-gray-900 hover:border-blue-400";
            if (showResult) {
              if (sa.key === subQuestion.answer) style = "bg-green-50 border-green-500 text-green-900";
              else if (sa.key === selected) style = "bg-red-50 border-red-500 text-red-900";
              else style = "bg-gray-50 border-gray-200 text-gray-500";
            } else if (sa.key === selected) {
              style = "bg-blue-50 border-blue-500 text-gray-900";
            }

            return (
              <button
                key={sa.key}
                type="button"
                onClick={() => handleSelect(sa.key)}
                disabled={showResult}
                className={`w-full text-left p-4 rounded-lg border-2 transition ${style}`}
              >
                <span className="font-medium mr-3">{sa.key}.</span>
                {sa.value}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleVote("good")}
                  disabled={!!voted}
                  className={`px-3 py-2 rounded-lg text-sm transition ${
                    voted === "good"
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : voted
                      ? "bg-gray-100 text-gray-400"
                      : "bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700"
                  }`}
                >
                  👍 良問
                </button>
                <button
                  type="button"
                  onClick={() => handleVote("bad")}
                  disabled={!!voted}
                  className={`px-3 py-2 rounded-lg text-sm transition ${
                    voted === "bad"
                      ? "bg-red-100 text-red-700 border border-red-300"
                      : voted
                      ? "bg-gray-100 text-gray-400"
                      : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-700"
                  }`}
                >
                  👎 問題あり
                </button>
                {voted && <span className="text-xs text-gray-400 self-center ml-1">送信済み</span>}
              </div>
              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-lg"
              >
                {currentIdx + 1 >= items.length ? "結果を見る" : "次の問題 →"}
              </button>
            </div>
            <div className="mt-3 flex justify-center">
              {reported === "none" && (
                <button
                  type="button"
                  onClick={handleReport}
                  className="text-xs text-gray-400 hover:text-red-500 transition"
                  title="この問題に誤りがあれば報告"
                >
                  ⚑ 問題を報告
                </button>
              )}
              {reported === "done" && (
                <span className="text-xs text-green-600">✓ 報告しました（ご協力ありがとうございます）</span>
              )}
              {reported === "already" && (
                <span className="text-xs text-gray-500">この問題はすでに報告済みです</span>
              )}
              {reported === "auth" && (
                <span className="text-xs text-gray-500">報告にはログインが必要です</span>
              )}
              {reported === "error" && (
                <span className="text-xs text-red-500">報告に失敗しました</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function QuizClient({ categories }: { categories: Category[] }) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">読み込み中...</div>}>
      <QuizContent categories={categories} />
    </Suspense>
  );
}
