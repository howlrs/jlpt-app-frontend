import Link from "next/link";

const levels = [
  { id: "n5", name: "N5", description: "初級 - 基本的な日本語", color: "bg-green-500", questions: "2,270" },
  { id: "n4", name: "N4", description: "初中級 - 基本的な日本語を理解", color: "bg-blue-500", questions: "2,936" },
  { id: "n3", name: "N3", description: "中級 - 日常的な日本語を理解", color: "bg-yellow-500", questions: "3,426" },
  { id: "n2", name: "N2", description: "中上級 - 幅広い場面の日本語", color: "bg-orange-500", questions: "3,873" },
  { id: "n1", name: "N1", description: "上級 - 高度な日本語を理解", color: "bg-red-500", questions: "5,555" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            JLPT 日本語能力試験
          </h1>
          <p className="text-xl text-gray-600 mb-2">対策学習アプリ</p>
          <p className="text-gray-500">18,000問以上の練習問題で合格を目指そう</p>
        </div>

        <div className="grid gap-4">
          {levels.map((level) => (
            <Link
              key={level.id}
              href={`/${level.id}`}
              className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className={`${level.color} text-white font-bold text-2xl w-16 h-16 rounded-full flex items-center justify-center`}>
                    {level.name}
                  </span>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{level.name}</h2>
                    <p className="text-gray-600">{level.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{level.questions}</p>
                  <p className="text-sm text-gray-500">問</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <footer className="mt-12 text-center text-gray-400 text-sm">
          <p>非公式 JLPT対策アプリ</p>
          <p className="mt-1">
            <a href="https://github.com/howlrs" className="hover:text-gray-600">@howlrs</a>
          </p>
        </footer>
      </div>
    </main>
  );
}
