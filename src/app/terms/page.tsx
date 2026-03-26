import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "利用規約",
  description: "JLPT学習アプリの利用規約。サービスの利用条件、免責事項、禁止事項について。",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "利用規約",
    description: "JLPT学習アプリの利用規約。",
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/" className="text-blue-600 hover:underline text-sm mb-8 block">&larr; トップへ戻る</Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">利用規約</h1>
        <p className="text-sm text-gray-400 mb-8">最終更新日: 2026年3月18日</p>

        <div className="space-y-8 text-gray-700 leading-relaxed text-sm">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">第1条（適用）</h2>
            <p>
              本利用規約（以下「本規約」）は、JLPT学習（以下「本アプリ」）の利用に関する条件を定めるものです。
              ユーザーは本アプリを利用することにより、本規約に同意したものとみなします。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">第2条（サービス内容）</h2>
            <p className="mb-2">本アプリは、以下のサービスを提供します。</p>
            <ul className="list-disc list-inside space-y-1">
              <li>JLPT N1〜N5レベルの練習問題の提供</li>
              <li>回答の正誤判定</li>
              <li>学習履歴の記録と苦手分析（要アカウント登録）</li>
              <li>問題品質の評価機能</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">第3条（アカウント）</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>練習問題の利用にアカウント登録は不要です。</li>
              <li>学習履歴・苦手分析機能を利用するには、メールアドレスとパスワードによるアカウント登録が必要です。</li>
              <li>ユーザーは、自身のアカウント情報を適切に管理する責任を負います。</li>
              <li>アカウントの不正利用があった場合、運営者は当該アカウントを停止する場合があります。</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">第4条（禁止事項）</h2>
            <p className="mb-2">ユーザーは、以下の行為を行ってはなりません。</p>
            <ul className="list-disc list-inside space-y-1">
              <li>本アプリのサーバーに過度な負荷をかける行為</li>
              <li>不正アクセスまたはそれを試みる行為</li>
              <li>自動化ツールを用いた大量のリクエスト送信</li>
              <li>問題データの大量な複製・再配布</li>
              <li>他のユーザーへの迷惑行為</li>
              <li>法令または公序良俗に違反する行為</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">第5条（免責事項）</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>本アプリは非公式のJLPT対策アプリであり、日本語能力試験の主催団体とは一切関係ありません。</li>
              <li>問題はAIにより自動生成されており、内容の正確性を保証するものではありません。</li>
              <li>本アプリの利用により生じた損害について、運営者は一切の責任を負いません。</li>
              <li>本アプリは予告なくサービスの変更・中断・終了を行う場合があります。</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">第6条（知的財産権）</h2>
            <p>
              本アプリのソースコードはオープンソースとして公開されています。
              AI生成による問題コンテンツの著作権の帰属については、各国の法律に準じます。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">第7条（利用料金）</h2>
            <p>本アプリは無料で利用できます。将来的に有料機能を追加する場合は、事前に通知します。</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">第8条（規約の変更）</h2>
            <p>
              運営者は、必要に応じて本規約を変更する場合があります。
              変更後の利用規約は本ページに掲載した時点から効力を生じるものとします。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">第9条（準拠法）</h2>
            <p>本規約は、日本法を準拠法とします。</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">第10条（お問い合わせ）</h2>
            <p>
              本規約に関するお問い合わせは、
              <a href="https://github.com/howlrs" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">GitHub</a>
              よりご連絡ください。
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
