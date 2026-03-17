"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { fetchAuthMe, logout } from "@/lib/api";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authState, setAuthState] = useState<"loading" | "authed" | "denied">("loading");

  useEffect(() => {
    if (pathname === "/admin/login") {
      setAuthState("authed");
      return;
    }

    setAuthState("loading");
    fetchAuthMe().then((user) => {
      if (user && user.role === "admin") {
        setAuthState("authed");
      } else {
        setAuthState("denied");
        router.replace("/admin/login");
      }
    });
  }, [pathname, router]);

  const handleLogout = async () => {
    await logout();
    router.replace("/admin/login");
  };

  // 認証確認完了まで、またはアクセス拒否時は子コンポーネントを一切レンダリングしない
  if (authState !== "authed") {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        {authState === "loading" ? "読み込み中..." : "リダイレクト中..."}
      </div>
    );
  }

  const isLoginPage = pathname === "/admin/login";

  return (
    <div className="min-h-screen bg-gray-50">
      {!isLoginPage && (
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-800">管理画面</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-gray-600 hover:text-red-600 transition"
          >
            ログアウト
          </button>
        </header>
      )}
      {children}
    </div>
  );
}
