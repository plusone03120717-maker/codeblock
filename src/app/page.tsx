"use client";

import Link from "next/link";
import { lessons } from "@/data/lessons";
import { useState, useEffect } from "react";
import { 
  getProgress, 
  getLevelInfo, 
  getLevelProgress, 
  getXPToNextLevel 
} from "@/utils/progress";

export default function Home() {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [totalXP, setTotalXP] = useState(0);
  const [levelInfo, setLevelInfo] = useState({ level: 1, name: "ビギナー", minXP: 0, maxXP: 99 });
  const [levelProgress, setLevelProgress] = useState(0);
  const [xpToNext, setXpToNext] = useState(100);
  const [highestStreak, setHighestStreak] = useState(0);

  useEffect(() => {
    const progress = getProgress();
    setTotalXP(progress.totalXP);
    setCompletedLessons(progress.completedLessons);
    setLevelInfo(getLevelInfo(progress.totalXP));
    setLevelProgress(getLevelProgress(progress.totalXP));
    setXpToNext(getXPToNextLevel(progress.totalXP));
    setHighestStreak(progress.highestStreak);
  }, []);

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

        {/* ステータスカード */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 border-2 border-yellow-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* レベルとXP */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">{levelInfo.level}</span>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-800">{levelInfo.name}</p>
                <p className="text-yellow-600 font-bold">{totalXP} XP</p>
              </div>
            </div>
            
            {/* 最高連続正解 */}
            {highestStreak > 0 && (
              <div className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full">
                <span className="text-xl">🔥</span>
                <span className="font-bold text-orange-600">
                  <ruby>最高<rt>さいこう</rt></ruby>{highestStreak}<ruby>連続<rt>れんぞく</rt></ruby>
                </span>
              </div>
            )}
          </div>
          
          {/* XPプログレスバー */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Lv.{levelInfo.level}</span>
              <span>
                <ruby>次<rt>つぎ</rt></ruby>のレベルまで {xpToNext} XP
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-400 h-4 rounded-full transition-all duration-500"
                style={{ width: `${levelProgress * 100}%` }}
              />
            </div>
          </div>
        </div>

        <section>
          <h2 className="text-lg font-semibold text-sky-900 md:text-xl">
            レッスン一覧
          </h2>
          <p className="mt-1 text-xs text-sky-800 md:text-sm">
            まずはレッスン1から順番に、少しずつレベルアップしていきましょう。
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lessons.map((lesson) => {
              const isCompleted = completedLessons.includes(lesson.id);
              const colorIndex = (lesson.unitNumber - 1) % colors.length;
              const bgColor = colors[colorIndex];

              return (
                <Link
                  key={lesson.id}
                  href={`/lesson/${lesson.id}`}
                  className={`block bg-gradient-to-br ${bgColor} rounded-2xl p-5 shadow-lg hover:shadow-xl hover:scale-105 transition-all relative overflow-hidden flex flex-col h-full`}
                >
                  {/* 完了バッジ */}
                  {isCompleted && (
                    <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 text-xs font-bold rounded-bl-xl">
                      ✓ 完了
                    </div>
                  )}

                  {/* レッスン番号 */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-sm font-bold px-2 py-1 rounded-full ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-white/50 text-gray-700'}`}>
                      {lesson.id}
                    </span>
                    <span className="text-xs text-gray-600">{lesson.difficulty}</span>
                  </div>

                  {/* タイトル */}
                  <h2 className="text-lg font-bold text-gray-800 mb-1">{lesson.title}</h2>

                  {/* 説明 */}
                  <p className="text-sm text-gray-600 mb-3 flex-grow">{lesson.description}</p>

                  {/* ボタン */}
                  {isCompleted ? (
                    <div className="bg-blue-500 text-white text-center py-2 rounded-full font-bold text-sm mt-auto">
                      🔄 復習する
                    </div>
                  ) : (
                    <div className="bg-green-500 text-white text-center py-2 rounded-full font-bold text-sm mt-auto">
                      🚀 学習する
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
