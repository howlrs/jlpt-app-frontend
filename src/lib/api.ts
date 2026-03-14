const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://backend-652691189545.asia-northeast1.run.app";

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

// Admin API

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

export async function signin(email: string, password: string): Promise<string> {
  const res = await fetch(`${API_BASE}/api/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, id: "", user_id: "" }),
  });
  if (!res.ok) {
    throw new Error("ログインに失敗しました");
  }
  const json = await res.json();
  return json.data?.token ?? json.token;
}

export async function adminFetchSummary(token: string): Promise<VoteSummary> {
  const res = await fetch(`${API_BASE}/api/admin/votes/summary`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch summary");
  const data = await res.json();
  return data.data ?? data;
}

export async function adminFetchBadQuestions(token: string): Promise<BadQuestion[]> {
  const res = await fetch(`${API_BASE}/api/admin/questions/bad`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch bad questions");
  const data = await res.json();
  return data.data ?? data;
}

export async function adminDeleteQuestion(token: string, questionId: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/api/admin/questions/${questionId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.ok;
}

export async function adminBulkDelete(token: string, ids: string[]): Promise<{ deleted: number; failed: number }> {
  const res = await fetch(`${API_BASE}/api/admin/questions/bulk-delete`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });
  if (!res.ok) throw new Error("Bulk delete failed");
  const data = await res.json();
  return data.data ?? data;
}

export async function adminFetchStats(token: string): Promise<AdminStats> {
  const res = await fetch(`${API_BASE}/api/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch stats");
  const data = await res.json();
  return data.data ?? data;
}
