"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useParams } from "next/navigation";
import { fetchQuestions, Question } from "@/lib/api";

const levelMap: Record<string, number> = {
  n1: 1, n2: 2, n3: 3, n4: 4, n5: 5,
};

function QuizContent() {
  const params = useParams<{ level: string }>();
  const level = params.level;
  const searchParams = useSearchParams();
  const categoryId = Number(searchParams.get("category") || "1");
  const levelId = levelMap[level] || 3;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [currentSub, setCurrentSub] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  const loadQuestions = useCallback(() => {
    setLoading(true);
    fetchQuestions(levelId, categoryId, 10).then((qs) => {
      setQuestions(qs);
      setCurrentQ(0);
      setCurrentSub(0);
      setSelected(null);
      setShowResult(false);
      setScore({ correct: 0, total: 0 });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [levelId, categoryId]);

  useEffect(() => { loadQuestions(); }, [loadQuestions]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">問題を読み込み中...</div>;
  if (questions.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-gray-500 gap-4">
      <p>問題が見つかりません</p>
      <Link href={`/${level}`} className="text-blue-600 hover:underline">カテゴリ選択に戻る</Link>
    </div>
  );

  const question = questions[currentQ];
  const subQuestion = question?.sub_questions[currentSub];

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
  };

  const handleNext = () => {
    setSelected(null);
    setShowResult(false);
    if (currentSub + 1 < question.sub_questions.length) {
      setCurrentSub(currentSub + 1);
    } else if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
      setCurrentSub(0);
    } else {
      setCurrentQ(questions.length);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link href={`/${level}`} className="text-blue-600 hover:underline text-sm">&larr; 戻る</Link>
          <span className="text-sm text-gray-500">
            {score.correct}/{score.total} 正解
          </span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <p className="text-sm text-gray-500 mb-2">{question.category_name}</p>
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
            let style = "bg-white border-gray-200 hover:border-blue-400";
            if (showResult) {
              if (sa.key === subQuestion.answer) style = "bg-green-50 border-green-500 text-green-900";
              else if (sa.key === selected) style = "bg-red-50 border-red-500 text-red-900";
              else style = "bg-gray-50 border-gray-200 text-gray-400";
            } else if (sa.key === selected) {
              style = "bg-blue-50 border-blue-500";
            }

            return (
              <button
                key={sa.key}
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
          <div className="mt-6 text-center">
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-lg"
            >
              次の問題 →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">読み込み中...</div>}>
      <QuizContent />
    </Suspense>
  );
}
