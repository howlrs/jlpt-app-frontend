#!/bin/bash
set -euo pipefail

# JLPT Frontend - Cloud Run デプロイスクリプト
# Usage: ./deploy.sh

PROJECT_ID="argon-depth-446413-t0"
SERVICE_NAME="frontend"
REGION="asia-northeast1"
BACKEND_URL="https://backend-652691189545.asia-northeast1.run.app"

echo "=== JLPT Frontend Deploy ==="
echo "Project: ${PROJECT_ID}"
echo "Service: ${SERVICE_NAME}"
echo "Region:  ${REGION}"
echo ""

# --- Pre-deploy checks ---

# 1. .env.local の存在確認（ビルド時にNEXT_PUBLIC_API_URLが必要）
if [ ! -f ".env.local" ]; then
    echo "ERROR: .env.local が見つかりません"
    echo "  NEXT_PUBLIC_API_URL が未設定のままビルドするとAPIリクエストが失敗します"
    echo "  以下のコマンドで作成してください:"
    echo "    echo 'NEXT_PUBLIC_API_URL=${BACKEND_URL}' > .env.local"
    exit 1
fi

# 2. NEXT_PUBLIC_API_URL がセットされているか確認
if ! grep -q "NEXT_PUBLIC_API_URL=" .env.local; then
    echo "ERROR: .env.local に NEXT_PUBLIC_API_URL が設定されていません"
    exit 1
fi

# 3. ローカルビルドで型エラー・構文エラーを事前検知
echo "--- Pre-deploy: TypeScript ビルドチェック ---"
if ! npm run build; then
    echo "ERROR: ビルドが失敗しました。デプロイを中止します"
    exit 1
fi
echo "--- ビルドチェック OK ---"
echo ""

# 4. バックエンドの疎通確認
echo "--- Pre-deploy: バックエンド疎通確認 ---"
BACKEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" "${BACKEND_URL}/api/meta" --max-time 10 || echo "000")
if [ "${BACKEND_HEALTH}" != "200" ]; then
    echo "WARNING: バックエンド ${BACKEND_URL}/api/meta が応答しません (HTTP ${BACKEND_HEALTH})"
    echo "  デプロイ後にフロントエンドのAPI呼び出しが失敗する可能性があります"
    read -r -p "続行しますか? (y/N): " CONTINUE
    if [ "${CONTINUE}" != "y" ] && [ "${CONTINUE}" != "Y" ]; then
        echo "デプロイを中止しました"
        exit 1
    fi
fi
echo "--- バックエンド疎通 OK ---"
echo ""

# --- Deploy ---
echo "--- Cloud Run にデプロイ中... ---"
gcloud run deploy ${SERVICE_NAME} \
    --source . \
    --region=${REGION} \
    --allow-unauthenticated \
    --project=${PROJECT_ID}

# --- Post-deploy verification ---
echo ""
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} --region=${REGION} --project=${PROJECT_ID} --format="value(status.url)")
echo "=== デプロイ完了: ${SERVICE_URL} ==="
echo ""

echo "--- Post-deploy: ヘルスチェック ---"
sleep 5  # Cloud Run の起動待ち

# フロントエンドのHTML応答確認
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${SERVICE_URL}" --max-time 15 || echo "000")
if [ "${FRONTEND_STATUS}" != "200" ]; then
    echo "WARNING: フロントエンド ${SERVICE_URL} が HTTP ${FRONTEND_STATUS} を返しました"
else
    echo "  フロントエンド: OK (HTTP 200)"
fi

# API経由の問題取得確認（rewritesが正しく動作するかの検証）
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${SERVICE_URL}/api/meta" --max-time 15 || echo "000")
if [ "${API_STATUS}" != "200" ]; then
    echo "WARNING: API proxy ${SERVICE_URL}/api/meta が HTTP ${API_STATUS} を返しました"
    echo "  Next.js rewrites の設定を確認してください"
else
    echo "  APIプロキシ: OK (HTTP 200)"
fi

echo ""
echo "=== 全チェック完了 ==="
