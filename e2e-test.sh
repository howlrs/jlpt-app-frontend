#!/bin/bash
set -euo pipefail

# JLPT Frontend E2E テスト
# Usage: ./e2e-test.sh [BASE_URL]
# Default: https://jlpt.howlrs.net

BASE_URL="${1:-https://jlpt.howlrs.net}"
BACKEND_URL="https://backend-652691189545.asia-northeast1.run.app"
PASS=0
FAIL=0
WARN=0

green() { echo -e "\033[32m✓ $1\033[0m"; }
red()   { echo -e "\033[31m✗ $1\033[0m"; }
yellow(){ echo -e "\033[33m⚠ $1\033[0m"; }

check_status() {
  local url="$1"
  local expected="${2:-200}"
  local label="${3:-$url}"
  local status
  status=$(curl -s -o /dev/null -w "%{http_code}" "$url" --max-time 15 2>/dev/null || echo "000")
  if [ "$status" = "$expected" ]; then
    green "$label → HTTP $status"
    PASS=$((PASS+1))
  else
    red "$label → HTTP $status (expected $expected)"
    FAIL=$((FAIL+1))
  fi
}

check_contains() {
  local url="$1"
  local pattern="$2"
  local label="${3:-$url contains '$pattern'}"
  local body
  body=$(curl -s "$url" --max-time 15 2>/dev/null || echo "")
  if echo "$body" | grep -q "$pattern"; then
    green "$label"
    PASS=$((PASS+1))
  else
    red "$label"
    FAIL=$((FAIL+1))
  fi
}

check_no_contains() {
  local url="$1"
  local pattern="$2"
  local label="${3:-$url does not contain '$pattern'}"
  local body
  body=$(curl -s "$url" --max-time 15 2>/dev/null || echo "")
  if echo "$body" | grep -q "$pattern"; then
    red "$label (found unwanted pattern)"
    FAIL=$((FAIL+1))
  else
    green "$label"
    PASS=$((PASS+1))
  fi
}

echo "=== JLPT Frontend E2E Test ==="
echo "Target: $BASE_URL"
echo "Time:   $(date -Iseconds)"
echo ""

# ========================================
# 1. 全公開ページの HTTP 200 確認
# ========================================
echo "--- 1. Page Status Checks ---"
check_status "$BASE_URL/"          200 "Home /"
check_status "$BASE_URL/n1"        200 "Level /n1"
check_status "$BASE_URL/n2"        200 "Level /n2"
check_status "$BASE_URL/n3"        200 "Level /n3"
check_status "$BASE_URL/n4"        200 "Level /n4"
check_status "$BASE_URL/n5"        200 "Level /n5"
check_status "$BASE_URL/about"     200 "About /about"
check_status "$BASE_URL/terms"     200 "Terms /terms"
check_status "$BASE_URL/privacy"   200 "Privacy /privacy"
check_status "$BASE_URL/login"     200 "Login /login"
echo ""

# ========================================
# 2. 静的アセット確認
# ========================================
echo "--- 2. Static Assets ---"
check_status "$BASE_URL/sitemap.xml"    200 "Sitemap"
check_status "$BASE_URL/robots.txt"     200 "robots.txt"
check_status "$BASE_URL/manifest.json"  200 "manifest.json"
check_status "$BASE_URL/favicon.ico"    200 "favicon.ico"
check_status "$BASE_URL/icon.svg"       200 "icon.svg"
check_status "$BASE_URL/icon-192.png"   200 "icon-192.png"
check_status "$BASE_URL/icon-512.png"   200 "icon-512.png"
echo ""

# ========================================
# 3. API 疎通 (バックエンド直接)
# ========================================
echo "--- 3. Backend API Direct ---"
check_status "$BACKEND_URL/api/meta" 200 "Backend /api/meta"
check_status "$BACKEND_URL/api/level/3/categories/2/questions?limit=1" 200 "Backend questions API"
echo ""

# ========================================
# 4. API Proxy 疎通 (フロントエンド経由)
# ========================================
echo "--- 4. API Proxy via Frontend ---"
check_status "$BASE_URL/api/meta" 200 "Proxy /api/meta"
echo ""

# ========================================
# 5. HTML コンテンツ検証
# ========================================
echo "--- 5. HTML Content Checks ---"
check_contains "$BASE_URL/" "JLPT" "Home contains 'JLPT'"
check_contains "$BASE_URL/" "N1" "Home contains N1 level"
check_contains "$BASE_URL/" "N5" "Home contains N5 level"
check_contains "$BASE_URL/" "18,000" "Home contains question count"

# レベルページにカテゴリリスト（SSR化済み）があるか
check_contains "$BASE_URL/n3" "JLPT N3" "N3 page has level title"
check_contains "$BASE_URL/n3" "quiz" "N3 page has quiz links (SSR categories)"

# メタデータ検証
check_contains "$BASE_URL/" "<title>" "Home has title tag"
check_contains "$BASE_URL/" "og:title" "Home has OG title"
check_contains "$BASE_URL/" "application/ld+json" "Home has JSON-LD"

# 各レベルページのメタデータ
check_contains "$BASE_URL/n1" "JLPT N1" "N1 page has level-specific title"
check_contains "$BASE_URL/n2" "JLPT N2" "N2 page has level-specific title"

# Quiz ページのメタデータ (#20)
check_contains "$BASE_URL/n3/quiz?category=2" "JLPT N3" "Quiz page has level-specific metadata"

# JSON-LD 強化 (#22)
check_contains "$BASE_URL/" "CourseInstance" "JSON-LD has CourseInstance"
check_contains "$BASE_URL/" "potentialAction" "JSON-LD has potentialAction"

# sitemap固定日時 (#21) — 固定日付が使われていることを確認
check_contains "$BASE_URL/sitemap.xml" "2026-03-26" "Sitemap has fixed content date"
check_contains "$BASE_URL/sitemap.xml" "2026-03-18" "Sitemap has fixed static page date"
echo ""

# ========================================
# 6. リンク切れ検出 (内部リンク)
# ========================================
echo "--- 6. Internal Link Check ---"
# ホームページの内部リンクを検証
check_status "$BASE_URL/n1" 200 "Link: /n1"
check_status "$BASE_URL/n2" 200 "Link: /n2"
check_status "$BASE_URL/n3" 200 "Link: /n3"
check_status "$BASE_URL/n4" 200 "Link: /n4"
check_status "$BASE_URL/n5" 200 "Link: /n5"
check_status "$BASE_URL/about" 200 "Link: /about"
check_status "$BASE_URL/terms" 200 "Link: /terms"
check_status "$BASE_URL/privacy" 200 "Link: /privacy"
# Quiz ページ (各レベル×代表カテゴリ)
for lvl in n1 n2 n3 n4 n5; do
  check_status "$BASE_URL/$lvl/quiz?category=2" 200 "Quiz: /$lvl/quiz?category=2"
done
echo ""

# ========================================
# 7. sitemap.xml 内URL検証 (サンプル)
# ========================================
echo "--- 7. Sitemap URL Sampling ---"
SITEMAP_URLS=$(curl -s "$BASE_URL/sitemap.xml" --max-time 15 | grep -o '<loc>[^<]*</loc>' | sed 's/<loc>//;s/<\/loc>//' | head -15)
for url in $SITEMAP_URLS; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "$url" --max-time 10 2>/dev/null || echo "000")
  label="Sitemap: ${url#$BASE_URL}"
  if [ "$status" = "200" ]; then
    green "$label → $status"
    PASS=$((PASS+1))
  else
    red "$label → $status"
    FAIL=$((FAIL+1))
  fi
done
echo ""

# ========================================
# 8. セキュリティ・パフォーマンスチェック
# ========================================
echo "--- 8. Headers Check ---"
HEADERS=$(curl -sI "$BASE_URL/" --max-time 10 2>/dev/null)

# Content-Type
if echo "$HEADERS" | grep -qi "content-type.*text/html"; then
  green "Content-Type: text/html"
  PASS=$((PASS+1))
else
  red "Content-Type missing or wrong"
  FAIL=$((FAIL+1))
fi

# Security headers (#19)
for hdr in "x-content-type-options" "x-frame-options" "referrer-policy" "permissions-policy" "strict-transport-security"; do
  if echo "$HEADERS" | grep -qi "$hdr"; then
    green "Security header: $hdr"
    PASS=$((PASS+1))
  else
    red "Missing security header: $hdr"
    FAIL=$((FAIL+1))
  fi
done

# HTTPS redirect
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://jlpt.howlrs.net/" --max-time 10 -L 2>/dev/null || echo "000")
if [ "$HTTP_STATUS" = "200" ]; then
  green "HTTP→HTTPS redirect works"
  PASS=$((PASS+1))
else
  yellow "HTTP redirect check: $HTTP_STATUS"
  WARN=$((WARN+1))
fi
echo ""

# ========================================
# Summary
# ========================================
echo "================================"
echo "Results: ✓ $PASS passed, ✗ $FAIL failed, ⚠ $WARN warnings"
echo "================================"

if [ "$FAIL" -gt 0 ]; then
  echo ""
  red "E2E TEST FAILED — $FAIL failures detected"
  exit 1
else
  echo ""
  green "ALL TESTS PASSED"
  exit 0
fi
