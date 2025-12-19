"use client";

import Link from "next/link";
import { lessons } from "@/data/lessons";
import { useState } from "react";

export default function Home() {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  // ユニットごとの色定義
  const colors = [
    "from-purple-200 to-purple-300",  // ユニット1（print）
    "from-pink-200 to-pink-300",      // ユニット2（変数）
    "from-blue-200 to-blue-300",      // ユニット3（条件分岐）
  ];

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
            {lessons.map((lesson) => {
              // 色の取得
              const colorIndex = (lesson.unitNumber - 1) % colors.length;
              const bgColor = colors[colorIndex];
              const isCompleted = completedLessons.includes(lesson.id);

              return (
                <article
                  key={lesson.id}
                  className={`flex flex-col justify-between rounded-2xl bg-gradient-to-br ${bgColor} p-4 shadow-sm ring-1 ring-sky-100 transition hover:-translate-y-1 hover:shadow-md ${
                    isCompleted ? "ring-2 ring-green-400" : ""
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-gray-800">
                          レッスン {lesson.id}
                        </span>
                        <h3 className="text-sm font-bold text-sky-900 md:text-base">
                          {lesson.title}
                        </h3>
                      </div>
                      <span
                        className={
                          "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold md:text-xs " +
                          (lesson.difficulty === "かんたん"
                            ? "bg-emerald-50 text-emerald-700"
                            : lesson.difficulty === "ふつう"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-rose-50 text-rose-700")
                        }
                      >
                        {lesson.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-sky-800 md:text-sm">
                      {lesson.description}
                    </p>
                  </div>

                  <Link
                    href={`/lesson/${lesson.id}`}
                    className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-sky-500 px-4 py-2 text-center text-xs font-semibold text-white shadow-sm transition hover:bg-sky-600 active:scale-95 md:text-sm"
                  >
                    {isCompleted ? "✓ 完了" : "開始"}
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
