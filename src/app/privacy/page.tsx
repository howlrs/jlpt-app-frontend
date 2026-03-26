import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "JLPT学習アプリのプライバシーポリシー。個人情報の取り扱い、Cookie、データの利用目的について。",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "プライバシーポリシー",
    description: "JLPT学習アプリのプライバシーポリシー。",
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/" className="text-blue-600 hover:underline text-sm mb-8 block">&larr; トップへ戻る</Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">プライバシーポリシー</h1>
        <p className="text-sm text-gray-400 mb-8">最終更新日: 2026年3月18日</p>

        <div className="space-y-8 text-gray-700 leading-relaxed text-sm">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">1. はじめに</h2>
            <p>
              JLPT学習（以下「本アプリ」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。
              本プライバシーポリシーは、本アプリにおける個人情報の取り扱いについて説明します。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">2. 収集する情報</h2>
            <p className="mb-3">本アプリでは、以下の情報を収集する場合があります。</p>
            <h3 className="font-bold text-gray-800 mb-2">2.1 アカウント登録時</h3>
            <ul className="list-disc list-inside space-y-1 mb-3">
              <li>メールアドレス</li>
              <li>パスワード（暗号化して保存）</li>
            </ul>
            <h3 className="font-bold text-gray-800 mb-2">2.2 学習利用時</h3>
            <ul className="list-disc list-inside space-y-1 mb-3">
              <li>回答履歴（問題ID、選択した回答、正誤）</li>
              <li>カテゴリ別正答率の統計データ</li>
            </ul>
            <h3 className="font-bold text-gray-800 mb-2">2.3 自動的に収集される情報</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>問題の品質評価（良問/問題あり）</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">3. 情報の利用目的</h2>
            <p className="mb-2">収集した情報は、以下の目的で利用します。</p>
            <ul className="list-disc list-inside space-y-1">
              <li>ユーザー認証およびアカウント管理</li>
              <li>学習履歴の記録と苦手分析の提供</li>
              <li>問題品質の改善</li>
              <li>サービスの安定運用と改善</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">4. Cookieの使用</h2>
            <p>
              本アプリでは、ユーザー認証のためにCookieを使用しています。
              使用するCookieはhttpOnly属性を持つセッション管理用のもので、
              トラッキングや広告目的のCookieは使用していません。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">5. 情報の第三者提供</h2>
            <p>
              本アプリでは、収集した個人情報を第三者に提供・販売することはありません。
              ただし、法令に基づく開示請求があった場合はこの限りではありません。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">6. データの保管</h2>
            <p>
              ユーザーデータはGoogle Cloud（Firestore）上に保管されます。
              パスワードはArgon2idアルゴリズムで暗号化されており、平文では保存されません。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">7. ユーザーの権利</h2>
            <p className="mb-2">ユーザーは以下の権利を有します。</p>
            <ul className="list-disc list-inside space-y-1">
              <li>アカウントの削除を要求する権利</li>
              <li>保存されたデータの開示を要求する権利</li>
              <li>データの訂正を要求する権利</li>
            </ul>
            <p className="mt-2">これらの要求は、GitHubリポジトリのIssueまたは管理者への連絡により行うことができます。</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">8. セキュリティ</h2>
            <p>
              本アプリでは、ユーザーデータの保護のために以下のセキュリティ対策を実施しています。
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>HTTPS通信の強制</li>
              <li>httpOnly Cookie による認証トークン管理</li>
              <li>パスワードの暗号化保存（Argon2id）</li>
              <li>レート制限によるブルートフォース攻撃の防止</li>
              <li>セキュリティヘッダーの設定（X-Frame-Options, HSTS等）</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">9. ポリシーの変更</h2>
            <p>
              本プライバシーポリシーは、必要に応じて変更される場合があります。
              重要な変更がある場合は、本ページにて通知します。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">10. お問い合わせ</h2>
            <p>
              プライバシーに関するお問い合わせは、
              <a href="https://github.com/howlrs" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">GitHub</a>
              よりご連絡ください。
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
