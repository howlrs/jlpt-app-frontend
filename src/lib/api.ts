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
