"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchAuthMe, logout } from "@/lib/api";

export default function UserNav() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // sessionStorage キャッシュで再訪問時のAPIコール削減
    const cached = sessionStorage.getItem("auth_user");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.email) {
          setUser(parsed);
        }
      } catch {
        // ignore
      }
    }

    fetchAuthMe().then((u) => {
      if (u) {
        const userData = { email: u.email };
        setUser(userData);
        sessionStorage.setItem("auth_user", JSON.stringify(userData));
      } else {
        setUser(null);
        sessionStorage.removeItem("auth_user");
      }
    });
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    sessionStorage.removeItem("auth_user");
    router.push("/");
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-gray-900 hover:text-blue-600 transition">
          JLPT学習
        </Link>
        {mounted && (
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-xs text-gray-400 hidden sm:inline">{user.email.split("@")[0]}</span>
                <Link href="/mypage/history" className="text-sm text-gray-600 hover:text-blue-600 transition">
                  マイページ
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-red-600 transition"
                >
                  ログアウト
                </button>
              </>
            ) : (
              <Link href="/login" className="text-sm text-blue-600 hover:text-blue-800 transition">
                ログイン
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
