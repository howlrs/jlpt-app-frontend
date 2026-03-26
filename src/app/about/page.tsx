import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "このアプリについて",
  description: "JLPT日本語能力試験対策学習アプリの使い方・機能紹介。N1〜N5の練習問題、苦手分析、学習履歴管理など。",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "このアプリについて",
    description: "JLPT学習アプリの機能紹介。N1〜N5対応、18,000問以上の練習問題。",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/" className="text-blue-600 hover:underline text-sm mb-8 block">&larr; トップへ戻る</Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">このアプリについて</h1>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">JLPT学習とは</h2>
            <p>
              JLPT学習は、日本語能力試験（JLPT）N1〜N5の練習問題を無料で提供する学習アプリです。
              18,000問以上の練習問題を収録しており、語彙・文法・読解・聴解の全カテゴリに対応しています。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">主な機能</h2>
            <div className="grid gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 mb-2">練習問題</h3>
                <p className="text-sm">N1〜N5のレベル別・カテゴリ別に練習問題を出題。回答後すぐに正解を確認でき、問題の品質評価も可能です。</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 mb-2">学習履歴</h3>
                <p className="text-sm">間違えた問題を自動記録。後から復習することで、苦手分野を重点的に学習できます。</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 mb-2">苦手分析</h3>
                <p className="text-sm">レベル別・カテゴリ別の正答率をグラフで表示。自分の弱点を可視化し、効率的な学習計画を立てられます。</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 mb-2">無料・登録不要で利用可能</h3>
                <p className="text-sm">練習問題はログインなしで利用可能。学習履歴・苦手分析を利用する場合はアカウント登録（無料）が必要です。</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">使い方</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>トップページからレベル（N1〜N5）を選択</li>
              <li>カテゴリ（語彙・文法・読解など）を選択</li>
              <li>問題に回答し、正解を確認</li>
              <li>問題の品質が気になる場合は「良問」「問題あり」で評価</li>
              <li>ログインすると、間違えた問題の履歴と苦手分析が利用可能</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">注意事項</h2>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>本アプリは非公式のJLPT対策アプリであり、日本語能力試験の公式サービスではありません。</li>
              <li>問題はAIにより自動生成されています。内容の正確性には注意を払っていますが、誤りが含まれる場合があります。</li>
              <li>問題に誤りを見つけた場合は「問題あり」ボタンで報告いただけると、品質改善に役立てます。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">技術情報</h2>
            <p className="text-sm">
              本アプリはオープンソースで開発されています。ソースコードは{" "}
              <a href="https://github.com/howlrs" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">GitHub</a>
              {" "}で公開しています。
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
