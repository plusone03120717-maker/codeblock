"use client";

import { Lesson } from "@/types";

const lessons: Lesson[] = [
  {
    id: "1",
    title: "print() 関数を学ぼう",
    description: "'Hello World' と表示させるプログラムを作成しましょう",
    expectedOutput: "Hello World",
    difficulty: "easy",
  },
  {
    id: "2",
    title: "変数に値を保存しよう",
    description: "変数に名前を保存して、表示させましょう",
    expectedOutput: "Yuki",
    difficulty: "easy",
  },
  {
    id: "3",
    title: "条件分岐を使おう",
    description:
      "年齢が10歳以上かどうかで、メッセージを出し分けましょう",
    expectedOutput: "10歳以上です",
    difficulty: "medium",
  },
];

export default function Home() {
  const handleStartLesson = (lessonId: string) => {
    // TODO: ここでレッスン画面への遷移や状態更新を実装
    console.log(`レッスン ${lessonId} を開始します。`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-indigo-100 px-4 py-8 font-sans">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 md:px-6">
        <header className="text-center md:text-left">
          <h1 className="text-2xl font-bold text-sky-900 md:text-3xl">
            CodeBlock - Python学習
          </h1>
          <p className="mt-2 text-sm text-sky-800 md:text-base">
            ブロックを組み立てながら、Python プログラムの考え方を楽しく学びましょう。
          </p>
        </header>

        <section>
          <h2 className="text-lg font-semibold text-sky-900 md:text-xl">
            レッスン一覧
          </h2>
          <p className="mt-1 text-xs text-sky-800 md:text-sm">
            まずはレッスン1から順番に、少しずつレベルアップしていきましょう。
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lessons.map((lesson) => (
              <article
                key={lesson.id}
                className="flex flex-col justify-between rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-sky-100 transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-sky-900 md:text-base">
                      {lesson.title}
                    </h3>
                    <span
                      className={
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold md:text-xs " +
                        (lesson.difficulty === "easy"
                          ? "bg-emerald-50 text-emerald-700"
                          : lesson.difficulty === "medium"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-rose-50 text-rose-700")
                      }
                    >
                      {lesson.difficulty === "easy"
                        ? "やさしい"
                        : lesson.difficulty === "medium"
                        ? "ふつう"
                        : "むずかしい"}
                    </span>
                  </div>
                  <p className="text-xs text-sky-800 md:text-sm">
                    {lesson.description}
                  </p>
                  <p className="text-[11px] text-sky-700 md:text-xs">
                    期待される出力:{" "}
                    <span className="font-mono text-sky-900">
                      {lesson.expectedOutput}
                    </span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleStartLesson(lesson.id)}
                  className="mt-4 w-full rounded-full bg-sky-500 px-4 py-2 text-center text-xs font-semibold text-white shadow-sm transition hover:bg-sky-600 active:scale-95 md:text-sm"
                >
                  開始
                </button>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
