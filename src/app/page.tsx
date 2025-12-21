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
import Footer from "@/components/Footer";
import { F, FW } from "@/components/Furigana";

export default function Home() {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [totalXP, setTotalXP] = useState(0);
  const [levelInfo, setLevelInfo] = useState({ level: 1, name: "ビギナー", minXP: 0, maxXP: 99 });
  const [levelProgress, setLevelProgress] = useState(0);
  const [xpToNext, setXpToNext] = useState(100);
  const [highestStreak, setHighestStreak] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const progress = getProgress();
    setTotalXP(progress.totalXP);
    setCompletedLessons(progress.completedLessons);
    setLevelInfo(getLevelInfo(progress.totalXP));
    setLevelProgress(getLevelProgress(progress.totalXP));
    setXpToNext(getXPToNextLevel(progress.totalXP));
    setHighestStreak(progress.highestStreak);
  }, []);

  useEffect(() => {
    // 未完了の最初のレッスンを見つける
    const firstIncompleteIndex = lessons.findIndex(
      lesson => !completedLessons.includes(lesson.id)
    );
    if (firstIncompleteIndex !== -1) {
      setCurrentIndex(firstIncompleteIndex);
    } else {
      // 全部完了していたら最後のレッスン
      setCurrentIndex(lessons.length - 1);
    }
  }, [completedLessons]);

  const isLessonLocked = (lessonIndex: number): boolean => {
    // 最初のレッスン（1-1）は常にアンロック
    if (lessonIndex === 0) return false;
    
    // 前のレッスンが完了していればアンロック
    const previousLesson = lessons[lessonIndex - 1];
    return !completedLessons.includes(previousLesson.id);
  };

  const goToPrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => Math.min(lessons.length - 1, prev + 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-purple-50 to-pink-100">
      {/* ヘッダー */}
      <div className="pt-6 pb-4 px-4">
        <h1 className="text-2xl font-bold text-center text-purple-800 mb-2">
          🐍 CodeBlock
        </h1>
        
        {/* ステータスカード */}
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-4 border-2 border-yellow-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow">
                <span className="text-lg font-bold text-white">{levelInfo.level}</span>
              </div>
              <div>
                <p className="font-bold text-gray-800">{levelInfo.name}</p>
                <p className="text-yellow-600 text-sm font-bold">{totalXP} XP</p>
              </div>
            </div>
            {highestStreak > 0 && (
              <div className="flex items-center gap-1 bg-orange-100 px-3 py-1 rounded-full">
                <span>🔥</span>
                <span className="font-bold text-orange-600 text-sm">{highestStreak}</span>
              </div>
            )}
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Lv.{levelInfo.level}</span>
              <span>次まで {xpToNext} XP</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all"
                style={{ width: `${levelProgress * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 進捗マップ */}
      <div className="px-4 mb-4">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center items-center gap-1">
            {lessons.map((lesson, index) => {
              const isCompleted = completedLessons.includes(lesson.id);
              const isCurrent = index === currentIndex;
              const isLocked = isLessonLocked(index);
              return (
                <div
                  key={lesson.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                    isCompleted
                      ? "bg-green-400"
                      : isLocked
                      ? "bg-gray-300"
                      : isCurrent
                      ? "bg-purple-500 scale-125"
                      : "bg-yellow-400"
                  }`}
                />
              );
            })}
          </div>
          <p className="text-center text-sm text-gray-500 mt-2">
            {currentIndex + 1} / {lessons.length} レッスン
          </p>
        </div>
      </div>

      {/* レッスンカルーセル */}
      <div className="relative px-4">
        <div className="max-w-md mx-auto">
          {/* 左矢印 */}
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
              currentIndex === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white text-purple-600 hover:bg-purple-100"
            }`}
          >
            ◀
          </button>

          {/* 現在のレッスンカード */}
          {(() => {
            const lesson = lessons[currentIndex];
            const isCompleted = completedLessons.includes(lesson.id);
            const isLocked = isLessonLocked(currentIndex);
            const colors = [
              "from-purple-400 to-purple-500",
              "from-pink-400 to-pink-500",
              "from-blue-400 to-blue-500",
              "from-green-400 to-green-500",
              "from-orange-400 to-orange-500",
            ];
            const colorIndex = (lesson.unitNumber - 1) % colors.length;
            const bgColor = isLocked ? "from-gray-400 to-gray-500" : colors[colorIndex];

            return (
              <div className="mx-12">
                <div className={`bg-gradient-to-br ${bgColor} rounded-3xl p-6 shadow-xl text-white relative overflow-hidden`}>
                  {/* 完了バッジ */}
                  {isCompleted && (
                    <div className="absolute top-0 right-0 bg-green-500 px-4 py-1 rounded-bl-2xl font-bold text-sm">
                      ✓ 完了
                    </div>
                  )}

                  {/* ロックアイコン */}
                  {isLocked && (
                    <div className="absolute top-0 right-0 bg-gray-600 px-4 py-1 rounded-bl-2xl font-bold text-sm">
                      🔒 ロック
                    </div>
                  )}

                  {/* レッスン番号 */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-white/30 px-3 py-1 rounded-full text-sm font-bold">
                      {lesson.id}
                    </span>
                    <span className="text-sm opacity-80">{lesson.difficulty}</span>
                  </div>

                  {/* タイトル */}
                  <h2 className="text-xl font-bold mb-2">{lesson.title}</h2>

                  {/* 説明 */}
                  <p className="text-sm opacity-90 mb-4">{lesson.description}</p>

                  {/* ボタン */}
                  {isLocked ? (
                    <div className="block text-center py-3 rounded-full font-bold text-lg bg-gray-600/50 text-gray-300 cursor-not-allowed">
                      🔒 前のレッスンをクリアしよう
                    </div>
                  ) : (
                    <Link
                      href={`/lesson/${lesson.id}`}
                      className={`block text-center py-3 rounded-full font-bold text-lg transition-all ${
                        isCompleted
                          ? "bg-white/30 hover:bg-white/40 text-white"
                          : "bg-white text-purple-600 hover:scale-105 shadow-lg"
                      }`}
                    >
                      {isCompleted ? "🔄 復習する" : "🚀 学習する"}
                    </Link>
                  )}
                </div>

                {/* ユニット表示 */}
                <p className="text-center text-gray-500 text-sm mt-3">
                  ユニット {lesson.unitNumber}: {
                    lesson.unitNumber === 1 ? <>print<FW word="関数" /></> :
                    lesson.unitNumber === 2 ? <FW word="変数" /> :
                    lesson.unitNumber === 3 ? <><FW word="条件" /><FW word="分岐" /></> : ""
                  }
                </p>
              </div>
            );
          })()}

          {/* 右矢印 */}
          <button
            onClick={goToNext}
            disabled={currentIndex === lessons.length - 1}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
              currentIndex === lessons.length - 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white text-purple-600 hover:bg-purple-100"
            }`}
          >
            ▶
          </button>
        </div>
      </div>

      {/* 道のり表示（RPG風） */}
      <div className="mt-8 px-4">
        <div className="max-w-md mx-auto">
          <div className="relative">
            {/* 道のライン */}
            <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-200 rounded-full -translate-y-1/2" />
            <div 
              className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-green-400 to-green-500 rounded-full -translate-y-1/2 transition-all"
              style={{ width: `${(completedLessons.length / lessons.length) * 100}%` }}
            />
            
            {/* ポイント */}
            <div className="relative flex justify-between">
              {[1, 2, 3].map((unit) => {
                const unitLessons = lessons.filter(l => l.unitNumber === unit);
                const completedInUnit = unitLessons.filter(l => completedLessons.includes(l.id)).length;
                const isUnitComplete = completedInUnit === unitLessons.length && unitLessons.length > 0;
                
                return (
                  <div key={unit} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow ${
                      isUnitComplete
                        ? "bg-green-500 text-white"
                        : completedInUnit > 0
                        ? "bg-yellow-400 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}>
                      {isUnitComplete ? "✓" : unit}
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {unit === 1 ? "print" : unit === 2 ? <FW word="変数" /> : <><FW word="条件" /><FW word="分岐" /></>}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 下部の余白 */}
      <div className="h-24" />

      {/* フッター */}
      <Footer />
    </div>
  );
}
