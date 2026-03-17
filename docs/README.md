# jlpt-app-frontend ドキュメント

## プロジェクト概要

JLPT（日本語能力試験）対策学習アプリのフロントエンド。Next.js 16 (App Router) + Tailwind CSSで構築し、Google Cloud Runでホスティングする。

## ページ一覧

| パス | 説明 | 認証 |
|------|------|------|
| `/` | トップページ（レベル選択） | 不要 |
| `/n1` ~ `/n5` | レベル別ページ（カテゴリ一覧） | 不要 |
| `/n1/quiz?category=N` | クイズページ（投票・回答記録付き） | 不要（回答記録は要認証） |
| `/login` | ユーザーログイン・新規登録 | 不要 |
| `/mypage/history` | 間違えた問題の履歴 | Cookie認証 |
| `/mypage/analysis` | カテゴリ別正答率の苦手分析 | Cookie認証 |
| `/admin/login` | 管理者ログイン | 不要 |
| `/admin` | 管理者ダッシュボード | Cookie認証 + admin権限 |
| `/admin/votes` | 投票レビュー・一括削除・フィルター | Cookie認証 + admin権限 |
| `/admin/coverage` | ポジショニングマップ・カバレッジヒートマップ | Cookie認証 + admin権限 |

## 認証方式

httpOnly Cookie認証を使用。localStorageは使用しない。

| 項目 | 内容 |
|------|------|
| ログイン | `POST /api/signin` → Cookie自動設定 |
| 認証確認 | `GET /api/auth/me` （Cookie自動送信） |
| ログアウト | `POST /api/auth/logout` → Cookie クリア |
| API呼び出し | `fetch(..., { credentials: "include" })` |
| ナビバー状態 | `fetchAuthMe()` でCookie認証状態を確認 |

**API通信:** Next.js rewrites で `/api/*` をバックエンドにプロキシ。ブラウザからは同一オリジン（`jlpt.howlrs.net`）へのリクエストとなり、Cookieがファーストパーティとして動作する。

## 管理画面のアクセス制御

`admin/layout.tsx` で3段階の認証状態（`loading` / `authed` / `denied`）を管理。`authed` 以外では子コンポーネントを一切レンダリングしない。

## 技術スタック

| 技術 | 用途 |
|------|------|
| **Next.js 16** | フレームワーク（App Router, rewrites） |
| **Tailwind CSS** | スタイリング |
| **TypeScript** | 型安全な開発 |
| **Recharts** | データ可視化（分析・カバレッジ） |
| **Google Cloud Run** | ホスティング |

## デプロイ

```bash
cd jlpt-app-frontend
./deploy.sh
```

Cloud Runへのデプロイ時、Dockerfileによるマルチステージビルドが実行される（`output: 'standalone'`）。
