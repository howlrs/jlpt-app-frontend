# jlpt-app-frontend ドキュメント

## プロジェクト概要

JLPT（日本語能力試験）対策学習アプリのフロントエンド。Next.js 16 (App Router) + Tailwind CSSで構築し、Google Cloud Runでホスティングする。

## ページ一覧

| パス | 説明 |
|------|------|
| `/` | トップページ（レベル選択） |
| `/n1` ~ `/n5` | レベル別ページ（カテゴリ一覧） |
| `/n1/quiz?category=N` ~ `/n5/quiz?category=N` | クイズページ（カテゴリ別問題） |
| `/login` | ユーザーログイン・新規登録 |
| `/mypage/history` | 学習履歴 |
| `/mypage/analysis` | 弱点分析 |
| `/admin/login` | 管理者ログイン |
| `/admin` | 管理者ダッシュボード |
| `/admin/votes` | 投票レビュー・一括削除 |

## 技術スタック

| 技術 | 用途 |
|------|------|
| **Next.js 16** | フレームワーク（App Router） |
| **Tailwind CSS** | スタイリング |
| **TypeScript** | 型安全な開発 |
| **Google Cloud Run** | ホスティング |

## デプロイ

```bash
gcloud run deploy frontend --source .
```

Cloud Runへのデプロイ時、Dockerfileによるビルドが実行される。
