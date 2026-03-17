// サーバー側(SSG/SSR): バックエンドURLを直接使用
// クライアント側(ブラウザ): 相対パス（Next.js rewritesで同一オリジン経由）
const API_BASE = typeof window === 'undefined'
  ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080")
  : "";

export interface SelectAnswer {
  key: string;
  value: string;
}

export interface SubQuestion {
  id: number;
  sentence: string | null;
  prerequisites: string | null;
  select_answer: SelectAnswer[];
  answer: string;
}

export interface Question {
  id: string;
  level_id: number;
  level_name: string;
  category_id: number | null;
  category_name: string;
  sentence: string;
  prerequisites: string | null;
  sub_questions: SubQuestion[];
  generated_by: string | null;
}

export interface Category {
  level_id: number;
  id: number;
  name: string;
  reten: number | null;
}

export interface MetaResponse {
  levels: { id: number; name: string }[];
  categories: Category[];
}

export async function fetchMeta(): Promise<MetaResponse> {
  const res = await fetch(`${API_BASE}/api/meta`, { next: { revalidate: 3600 } });
  const data = await res.json();
  return data.data;
}

export async function fetchQuestions(levelId: number, categoryId: number, limit?: number): Promise<Question[]> {
  const url = new URL(`${API_BASE}/api/level/${levelId}/categories/${categoryId}/questions`);
  if (limit) url.searchParams.set("limit", String(limit));
  const res = await fetch(url.toString(), { cache: "no-store" });
  const data = await res.json();
  return data.data || [];
}

export async function fetchQuestionById(questionId: string): Promise<Question | null> {
  try {
    const res = await fetch(`${API_BASE}/api/questions/${questionId}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data ?? null;
  } catch {
    return null;
  }
}

export async function submitVote(vote: "good" | "bad", parentId: string, childId: string): Promise<boolean> {
  try {
    const url = new URL(`${API_BASE}/api/evaluate/${vote}`);
    url.searchParams.set("parent_id", parentId);
    url.searchParams.set("child_id", childId);
    const res = await fetch(url.toString());
    return res.ok;
  } catch {
    return false;
  }
}

// Auth API

export interface AuthUser {
  user_id: string;
  email: string;
  role: string | null;
}

export async function signup(email: string, password: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "登録に失敗しました");
  }
}

export async function signin(email: string, password: string): Promise<AuthUser> {
  const res = await fetch(`${API_BASE}/api/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    throw new Error("ログインに失敗しました");
  }
  const json = await res.json();
  return json.data?.user ?? json.user;
}

export async function fetchAuthMe(): Promise<AuthUser | null> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      credentials: "include",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data ?? null;
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  await fetch(`${API_BASE}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  }).catch(() => {});
}

// User API (cookie-based auth)

export async function recordAnswer(questionId: string, subQuestionId: number, selectedAnswer: string): Promise<void> {
  await fetch(`${API_BASE}/api/answers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ question_id: questionId, sub_question_id: subQuestionId, selected_answer: selectedAnswer }),
  }).catch(() => {});
}

export async function fetchHistory(limit = 50) {
  const res = await fetch(`${API_BASE}/api/users/me/history?limit=${limit}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch history");
  const data = await res.json();
  return data.data ?? [];
}

export async function fetchUserStats() {
  const res = await fetch(`${API_BASE}/api/users/me/stats`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch stats");
  const data = await res.json();
  return data.data ?? data;
}

export async function fetchMistakes(limit = 20) {
  const res = await fetch(`${API_BASE}/api/users/me/mistakes?limit=${limit}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch mistakes");
  const data = await res.json();
  return data.data ?? [];
}

// Admin API (cookie-based auth)

export interface VoteSummary {
  total_questions: number;
  total_votes: number;
  good_rate: number;
  bad_questions_count: number;
}

export interface BadQuestion {
  id: string;
  sentence: string;
  category_name: string;
  good_count: number;
  bad_count: number;
  bad_rate: number;
  level_name: string;
  prerequisites: string | null;
  sub_questions: SubQuestion[];
  generated_by: string | null;
}

export interface LevelStats {
  level_id: number;
  level_name: string;
  total_questions: number;
  total_sub_questions: number;
  good_votes: number;
  bad_votes: number;
  categories: { name: string; questions: number; sub_questions: number }[];
}

export interface AdminStats {
  levels: LevelStats[];
}

export async function adminFetchSummary(): Promise<VoteSummary> {
  const res = await fetch(`${API_BASE}/api/admin/votes/summary`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch summary");
  const data = await res.json();
  return data.data ?? data;
}

export async function adminFetchBadQuestions(): Promise<BadQuestion[]> {
  const res = await fetch(`${API_BASE}/api/admin/questions/bad`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch bad questions");
  const data = await res.json();
  return data.data ?? data;
}

export async function adminDeleteQuestion(questionId: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/api/admin/questions/${questionId}`, {
    method: "DELETE",
    credentials: "include",
  });
  return res.ok;
}

export async function adminBulkDelete(ids: string[]): Promise<{ deleted: number; failed: number }> {
  const res = await fetch(`${API_BASE}/api/admin/questions/bulk-delete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ ids }),
  });
  if (!res.ok) throw new Error("Bulk delete failed");
  const data = await res.json();
  return data.data ?? data;
}

export async function adminFetchStats(): Promise<AdminStats> {
  const res = await fetch(`${API_BASE}/api/admin/stats`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch stats");
  const data = await res.json();
  return data.data ?? data;
}

// Coverage API

export interface CoverageCategory {
  category_id: string;
  category_name: string;
  question_count: number;
  sub_question_count: number;
  target: number;
  coverage_pct: number;
}

export interface CoverageLevel {
  level_id: number;
  level_name: string;
  total_questions: number;
  categories: CoverageCategory[];
}

export interface CoverageStats {
  levels: CoverageLevel[];
}

export async function adminFetchCoverage(): Promise<CoverageStats> {
  const res = await fetch(`${API_BASE}/api/admin/coverage-stats`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch coverage");
  const data = await res.json();
  return data.data ?? data;
}
