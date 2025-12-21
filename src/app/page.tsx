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
import { F, FW, FuriganaText } from "@/components/Furigana";

export default function Home() {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [totalXP, setTotalXP] = useState(0);
  const [levelInfo, setLevelInfo] = useState({ level: 1, name: "ビギナー", minXP: 0, maxXP: 99 });
  const [levelProgress, setLevelProgress] = useState(0);
  const [xpToNext, setXpToNext] = useState(100);
  const [highestStreak, setHighestStreak] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [debugXP, setDebugXP] = useState("");
  const [debugLessonId, setDebugLessonId] = useState("");

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

  // デバッグ用：全レッスンを完了にする
  const debugCompleteAll = () => {
    const allLessonIds = lessons.map(l => l.id);
    const progress = getProgress();
    const newProgress = {
      ...progress,
      completedLessons: allLessonIds,
    };
    localStorage.setItem("codeblock-progress", JSON.stringify(newProgress));
    setCompletedLessons(allLessonIds);
    alert("全レッスンを完了状態にしました！");
  };

  // デバッグ用：進捗をリセットする
  const debugResetAll = () => {
    const progress = getProgress();
    const newProgress = {
      ...progress,
      completedLessons: [],
    };
    localStorage.setItem("codeblock-progress", JSON.stringify(newProgress));
    setCompletedLessons([]);
    setCurrentIndex(0);
    alert("進捗をリセットしました！");
  };

  // デバッグ用：XPを設定
  const debugSetXP = () => {
    const xp = parseInt(debugXP);
    if (isNaN(xp) || xp < 0) {
      alert("正しいXP値を入力してください");
      return;
    }
    const progress = getProgress();
    const newProgress = {
      ...progress,
      totalXP: xp,
    };
    localStorage.setItem("codeblock-progress", JSON.stringify(newProgress));
    setTotalXP(xp);
    setLevelInfo(getLevelInfo(xp));
    setLevelProgress(getLevelProgress(xp));
    alert(`XPを ${xp} に設定しました！`);
    setDebugXP("");
  };

  // デバッグ用：特定レッスンまで完了
  const debugCompleteUpTo = () => {
    if (!debugLessonId) {
      alert("レッスンIDを入力してください（例: 1-3）");
      return;
    }
    const targetIndex = lessons.findIndex(l => l.id === debugLessonId);
    if (targetIndex === -1) {
      alert(`レッスン ${debugLessonId} が見つかりません`);
      return;
    }
    const completedIds = lessons.slice(0, targetIndex + 1).map(l => l.id);
    const progress = getProgress();
    const newProgress = {
      ...progress,
      completedLessons: completedIds,
    };
    localStorage.setItem("codeblock-progress", JSON.stringify(newProgress));
    setCompletedLessons(completedIds);
    setCurrentIndex(Math.min(targetIndex + 1, lessons.length - 1));
    alert(`${debugLessonId} まで完了状態にしました！`);
    setDebugLessonId("");
  };

  // デバッグ用：現在の進捗を取得
  const getDebugInfo = () => {
    const progress = getProgress();
    return JSON.stringify(progress, null, 2);
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
            className={`absolute left-0 top-28 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
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
                <div className={`bg-gradient-to-br ${bgColor} rounded-3xl p-6 shadow-xl text-white relative overflow-hidden min-h-[220px] flex flex-col`}>
                  {/* 完了バッジ */}
                  {isCompleted && (
                    <div className="absolute top-0 right-0 bg-green-500 px-4 py-1 rounded-bl-2xl font-bold text-sm">
                      ✓ <FW word="完了" />
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
                  </div>

                  {/* タイトル */}
                  <h2 className="text-xl font-bold mb-2"><FuriganaText text={lesson.title} /></h2>

                  {/* 説明 */}
                  <p className="text-sm opacity-90 mb-4"><FuriganaText text={lesson.description} /></p>

                  {/* ボタン */}
                  <div className="mt-auto">
                    {isLocked ? (
                      <div className="block text-center py-3 rounded-full font-bold text-lg bg-gray-600/50 text-gray-300 cursor-not-allowed">
                        🔒 前のレッスンを<F reading="くりあ">クリア</F>しよう
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
                        {isCompleted ? <>🔄 <FW word="復習" />する</> : "🚀 学習する"}
                      </Link>
                    )}
                  </div>
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
          {(() => {
            const isLastLesson = currentIndex === lessons.length - 1;
            const nextLessonLocked = !isLastLesson && isLessonLocked(currentIndex + 1);
            const isDisabled = isLastLesson || nextLessonLocked;
            
            return (
              <button
                onClick={goToNext}
                disabled={isDisabled}
                className={`absolute right-0 top-28 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
                  isDisabled
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white text-purple-600 hover:bg-purple-100"
                }`}
              >
                {nextLessonLocked ? "🔒" : "▶"}
              </button>
            );
          })()}
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

      {/* デバッグ用パネル（開発時のみ表示） */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed top-2 right-2 z-50">
          {/* トグルボタン */}
          <button
            onClick={() => setShowDebugPanel(!showDebugPanel)}
            className="bg-gray-800 text-white text-xs px-2 py-1 rounded shadow hover:bg-gray-700"
          >
            🛠️ {showDebugPanel ? "閉じる" : "デバッグ"}
          </button>

          {/* デバッグパネル */}
          {showDebugPanel && (
            <div className="mt-2 bg-white border-2 border-gray-800 rounded-lg p-3 shadow-lg w-64">
              <h3 className="font-bold text-sm mb-2 text-gray-800">🛠️ デバッグパネル</h3>
              
              {/* 基本操作 */}
              <div className="flex gap-2 mb-3">
                <button
                  onClick={debugCompleteAll}
                  className="flex-1 bg-green-500 text-white text-xs px-2 py-1 rounded hover:bg-green-600"
                >
                  全完了
                </button>
                <button
                  onClick={debugResetAll}
                  className="flex-1 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
                >
                  リセット
                </button>
              </div>

              {/* XP設定 */}
              <div className="mb-3">
                <label className="text-xs text-gray-600 block mb-1">XP設定</label>
                <div className="flex gap-1">
                  <input
                    type="number"
                    value={debugXP}
                    onChange={(e) => setDebugXP(e.target.value)}
                    placeholder="例: 500"
                    className="flex-1 border rounded px-2 py-1 text-xs"
                  />
                  <button
                    onClick={debugSetXP}
                    className="bg-yellow-500 text-white text-xs px-2 py-1 rounded hover:bg-yellow-600"
                  >
                    設定
                  </button>
                </div>
              </div>

              {/* 特定レッスンまで完了 */}
              <div className="mb-3">
                <label className="text-xs text-gray-600 block mb-1">〜まで完了</label>
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={debugLessonId}
                    onChange={(e) => setDebugLessonId(e.target.value)}
                    placeholder="例: 1-3"
                    className="flex-1 border rounded px-2 py-1 text-xs"
                  />
                  <button
                    onClick={debugCompleteUpTo}
                    className="bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600"
                  >
                    完了
                  </button>
                </div>
              </div>

              {/* 現在の進捗 */}
              <div>
                <label className="text-xs text-gray-600 block mb-1">現在の進捗データ</label>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32">
                  {getDebugInfo()}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* フッター */}
      <Footer />
    </div>
  );
}
