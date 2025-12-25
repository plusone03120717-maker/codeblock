"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { lessons, getLesson } from "@/data/lessons";
import { getTutorial } from "@/data/tutorials";
import { useState, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import { 
  getProgress, 
  getLevelInfo, 
  getLevelProgress, 
  getXPToNextLevel,
  getLastOpenedMission,
  type LastOpenedMission
} from "@/utils/progress";
import Footer from "@/components/Footer";
import { F, FW, FuriganaText } from "@/components/Furigana";

export default function Home() {
  const router = useRouter();
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
  const [resumeStatus, setResumeStatus] = useState<Record<string, boolean>>({});
  const [debugStartLessonId, setDebugStartLessonId] = useState("");
  const [debugStartMission, setDebugStartMission] = useState("");
  const [lastOpenedMission, setLastOpenedMission] = useState<LastOpenedMission | null>(null);
  const [unitImageErrors, setUnitImageErrors] = useState<Record<number, boolean>>({});

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

  useEffect(() => {
    // 各レッスンの途中データ有無をチェック
    if (typeof window === "undefined") return;
    
    const status: Record<string, boolean> = {};
    lessons.forEach((lesson) => {
      const savedMission = localStorage.getItem(`lesson-${lesson.id}-mission`);
      status[lesson.id] = savedMission !== null && parseInt(savedMission) > 0;
    });
    setResumeStatus(status);
  }, []);

  useEffect(() => {
    const lastMission = getLastOpenedMission();
    setLastOpenedMission(lastMission);
  }, []);

  const isLessonLocked = (lessonIndex: number): boolean => {
    // 最初のレッスン（1-1）は常にアンロック
    if (lessonIndex === 0) return false;
    
    // 前のレッスンが完了していればアンロック
    const previousLesson = lessons[lessonIndex - 1];
    return !completedLessons.includes(previousLesson.id);
  };

  // レッスンカードクリック時の処理（途中データがある場合はエディターに直接遷移）
  const handleLessonClick = (lessonId: string) => {
    if (typeof window === "undefined") return;
    
    const savedMission = localStorage.getItem(`lesson-${lessonId}-mission`);
    
    if (savedMission && parseInt(savedMission) > 0) {
      // 途中データあり → 直接エディターへ
      router.push(`/lesson/${lessonId}/editor`);
    } else {
      // 新規 → チュートリアルへ
      router.push(`/lesson/${lessonId}`);
    }
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
    // localStorageをクリアする処理
    // 進捗データをリセット
    localStorage.removeItem("codeblock-progress");

    // 完了したレッスンをリセット
    localStorage.removeItem("completedLessons");

    // 全レッスンのミッション進捗をリセット（lessons配列からすべてのレッスンIDを取得）
    lessons.forEach(lesson => {
      const id = lesson.id;
      localStorage.removeItem(`lesson-${id}-mission`);
      localStorage.removeItem(`lesson-${id}-wrong`);
      localStorage.removeItem(`lesson-${id}-retryMode`);
      localStorage.removeItem(`lesson-${id}-retryIndex`);
    });

    // 新しい空の進捗データを設定
    const newProgress = {
      totalXP: 0,
      completedLessons: [],
      currentStreak: 0,
      highestStreak: 0,
    };
    localStorage.setItem("codeblock-progress", JSON.stringify(newProgress));
    
    // 状態をリセット
    setTotalXP(0);
    setCompletedLessons([]);
    setCurrentIndex(0);
    setLevelInfo(getLevelInfo(0));
    setLevelProgress(getLevelProgress(0));
    setXpToNext(getXPToNextLevel(0));
    setHighestStreak(0);
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

  // デバッグ用：任意のミッションから開始
  const debugStartFromMission = () => {
    if (!debugStartLessonId) {
      alert("レッスンIDを選択してください");
      return;
    }
    
    const missionNum = parseInt(debugStartMission);
    if (isNaN(missionNum) || missionNum < 1) {
      alert("正しいミッション番号を入力してください（1以上）");
      return;
    }
    
    // レッスンIDの存在確認
    const lessonExists = lessons.some(l => l.id === debugStartLessonId);
    if (!lessonExists) {
      alert(`レッスン ${debugStartLessonId} が見つかりません`);
      return;
    }
    
    // localStorageに設定（ミッション番号は0始まりなので-1）
    localStorage.setItem(`lesson-${debugStartLessonId}-mission`, String(missionNum));
    localStorage.setItem(`lesson-${debugStartLessonId}-wrong`, JSON.stringify([]));
    localStorage.removeItem(`lesson-${debugStartLessonId}-retryMode`);
    localStorage.removeItem(`lesson-${debugStartLessonId}-retryIndex`);
    
    // エディター画面に遷移
    router.push(`/lesson/${debugStartLessonId}/editor`);
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

  // 経過時間を計算する関数
  const getTimeAgo = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days > 0) return `${days}日前`;
    if (hours > 0) return `${hours}時間前`;
    if (minutes > 0) return `${minutes}分前`;
    return "たった今";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-purple-50 to-pink-100">
      {/* ヘッダー */}
      <div className="pt-6 pb-4 px-4">
        <h1 className="text-2xl font-bold text-center text-purple-800 mb-2">
          🐍 CodeBlock
        </h1>
      </div>

      {/* 2カラムレイアウト（デスクトップ） */}
      <div className="px-4 pb-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 左カラム：ステータスカード + 前回の続き（1/3幅） */}
            <div className="space-y-4 md:col-span-1">
              {/* ステータスカード */}
              <div className="bg-white rounded-2xl shadow-lg p-4 border-2 border-yellow-200">
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

              {/* 最後に学習したミッションへのショートカット */}
              {lastOpenedMission && (() => {
                const lesson = getLesson(lastOpenedMission.lessonId);
                if (!lesson) return null;

                return (
                  <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300 rounded-2xl p-4 shadow-md">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📚</span>
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">前回の続き</p>
                          <p className="font-bold text-gray-800">
                            レッスン {lastOpenedMission.lessonId} - ミッション {lastOpenedMission.missionId}
                            {lesson ? ` 「${lesson.title}」` : ""}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{getTimeAgo(lastOpenedMission.timestamp)}</p>
                        </div>
                      </div>
                      <Link
                        href={`/lesson/${lastOpenedMission.lessonId}/editor`}
                        className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white px-6 py-2 rounded-full font-bold shadow-md hover:shadow-lg transition-all text-center"
                      >
                        続きから学習する →
                      </Link>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* 右カラム：進捗マップ + レッスンカルーセル + ユニットボタン（2/3幅） */}
            <div className="space-y-4 md:col-span-2">
              {/* 進捗マップ */}
              <div className="px-4">
                <div className="flex justify-center items-center gap-1">
                  {lessons.map((lesson, index) => {
                    const isCompleted = completedLessons.includes(lesson.id);
                    const isCurrent = index === currentIndex;
                    const isLocked = isLessonLocked(index);
                    
                    // レッスンカードと同じ色を定義
                    const colors = [
                      "bg-purple-500",   // unit 1
                      "bg-pink-500",     // unit 2
                      "bg-blue-500",     // unit 3
                      "bg-green-500",    // unit 4
                      "bg-orange-500",   // unit 5
                    ];
                    const colorIndex = (lesson.unitNumber - 1) % colors.length;
                    const lessonColor = colors[colorIndex];
                    
                    return (
                      <div
                        key={lesson.id}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                          isLocked
                            ? "bg-gray-300"
                            : isCompleted
                            ? isCurrent
                              ? `${lessonColor} scale-125`
                              : lessonColor
                            : "bg-gray-400"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* レッスンカルーセル */}
              <div className="relative px-4">
                <div className="max-w-md mx-auto md:max-w-full">
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
                      <div className="inline-flex items-center justify-center w-full py-3 rounded-full font-bold text-lg bg-gray-600/50 text-gray-300 cursor-not-allowed whitespace-nowrap">
                        <span>🔒 前のレッスンを<F reading="くりあ">クリア</F>しよう</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        {/* メインボタン */}
                        {isCompleted ? (
                          <Link
                            href={`/lesson/${lesson.id}/editor`}
                            className="inline-flex items-center justify-center w-full py-3 rounded-full font-bold text-lg bg-white/30 hover:bg-white/40 text-white transition-all whitespace-nowrap"
                          >
                            <span>🔄 <FW word="復習" />する</span>
                          </Link>
                        ) : resumeStatus[lesson.id] ? (
                          <Link
                            href={`/lesson/${lesson.id}/editor`}
                            className="inline-flex items-center justify-center w-full py-3 rounded-full font-bold text-lg bg-white text-purple-600 hover:scale-105 shadow-lg transition-all whitespace-nowrap"
                          >
                            <span>📖 続きから</span>
                          </Link>
                        ) : (
                          <Link
                            href={`/lesson/${lesson.id}`}
                            className="inline-flex items-center justify-center w-full py-3 rounded-full font-bold text-lg bg-white text-purple-600 hover:scale-105 shadow-lg transition-all whitespace-nowrap"
                          >
                            <span>🚀 学習する</span>
                          </Link>
                        )}
                        
                        {/* チュートリアルを見るボタン（途中または完了の場合のみ表示） */}
                        {(resumeStatus[lesson.id] || isCompleted) && (
                          <Link
                            href={`/lesson/${lesson.id}`}
                            className="text-white/80 hover:text-white text-sm font-medium mt-1 inline-block hover:underline transition-all"
                          >
                            📖 チュートリアルを見る
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
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

              {/* 道のり表示（ゲーミフィケーション風） */}
              <div className="mt-8">
                <div className="max-w-md mx-auto md:max-w-full">
                  {/* すべてのユニット番号を取得 */}
          {useMemo(() => {
            const allUnits = Array.from(new Set(lessons.map(l => l.unitNumber))).sort((a, b) => a - b);
            const firstRowUnits = allUnits.slice(0, 3);
            const secondRowUnits = allUnits.slice(3);
            
            // ユニットポイントクリック時の処理
            const handleUnitPointClick = (unit: number) => {
              // そのユニットに属するレッスンで、完了したレッスンを探す
              const completedLessonsInUnit = lessons
                .map((lesson, index) => ({ lesson, index }))
                .filter(({ lesson }) => lesson.unitNumber === unit && completedLessons.includes(lesson.id));
              
              // 完了したレッスンがある場合、最初のレッスンにカードを切り替え
              if (completedLessonsInUnit.length > 0) {
                const targetIndex = completedLessonsInUnit[0].index;
                setCurrentIndex(targetIndex);
              }
            };

            // ユニットポイントコンポーネント（ヘルパー関数）
            const renderUnitPoint = (unit: number, unitLessons: typeof lessons, completedInUnit: number, isUnitComplete: boolean, unitProgress: number, unitName: ReactNode) => {
              // ユニットごとの色を定義（レッスンカードと同じ）
              const unitColors = [
                "from-purple-400 to-purple-500",  // unit 1
                "from-pink-400 to-pink-500",      // unit 2
                "from-blue-400 to-blue-500",      // unit 3
                "from-green-400 to-green-500",    // unit 4
                "from-orange-400 to-orange-500",  // unit 5
              ];
              const unitColorIndex = (unit - 1) % unitColors.length;
              const unitColor = unitColors[unitColorIndex];

              // そのユニットに完了したレッスンがあるかチェック
              const hasCompletedLessons = completedLessons.some(lessonId => 
                lessons.find(l => l.id === lessonId)?.unitNumber === unit
              );

              // ユニットが完了した場合、最初のレッスンのキャラクター画像を取得
              let characterImage: string | undefined;
              let characterEmoji: string | undefined;
              if (isUnitComplete && unitLessons.length > 0) {
                const firstLesson = unitLessons[0];
                const tutorial = getTutorial(firstLesson.id);
                characterImage = tutorial?.characterImage;
                characterEmoji = tutorial?.characterEmoji;
              }

              return (
                <div 
                  key={unit} 
                  className={`flex flex-col items-center group relative h-20 ${hasCompletedLessons ? 'cursor-pointer' : ''}`}
                  onClick={() => hasCompletedLessons && handleUnitPointClick(unit)}
                >
                  {/* ホバー時のツールチップ */}
                  <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 invisible group-hover:visible z-10 px-3 py-2 bg-gray-200 text-gray-800 text-xs rounded-lg shadow-lg whitespace-nowrap transition-all duration-200 pointer-events-none group-hover:pointer-events-auto border border-gray-300">
                    <div className="font-semibold mb-1">{unitName}</div>
                    <div>進捗: {completedInUnit}/{unitLessons.length}完了</div>
                    {/* ツールチップの矢印 */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-200"></div>
                  </div>

                  {/* ユニットポイント（ボタン）の位置を固定 - 上部に配置 */}
                  <div className="absolute top-0 flex items-center justify-center">
                    <div className={`w-12 h-12 rounded-full flex flex-col items-center justify-center font-bold text-xs shadow-lg transition-all duration-300 ease-out ${hasCompletedLessons ? 'group-hover:scale-110' : ''} ${
                      isUnitComplete
                        ? `bg-gradient-to-br ${unitColor} text-white overflow-hidden`
                        : completedInUnit > 0
                        ? "bg-gradient-to-br from-yellow-400 to-amber-500 text-white"
                        : "bg-gradient-to-br from-gray-300 to-gray-400 text-gray-600"
                    }`}>
                      {isUnitComplete && characterImage && !unitImageErrors[unit] ? (
                        <Image
                          src={characterImage}
                          alt="Character"
                          width={48}
                          height={48}
                          className="object-contain w-full h-full"
                          unoptimized
                          onError={() => {
                            setUnitImageErrors(prev => ({ ...prev, [unit]: true }));
                          }}
                        />
                      ) : isUnitComplete && characterEmoji ? (
                        <span className="text-2xl">{characterEmoji}</span>
                      ) : (
                        <span>{unit}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            };

            return (
              <div className="space-y-6">
                {/* 1行目: ユニット1-3 */}
                <div className="relative">
                  {/* ポイント */}
                  <div className="relative grid grid-cols-3 gap-0">
                    {firstRowUnits.map((unit) => {
                      const unitLessons = lessons.filter(l => l.unitNumber === unit);
                      const completedInUnit = unitLessons.filter(l => completedLessons.includes(l.id)).length;
                      const isUnitComplete = completedInUnit === unitLessons.length && unitLessons.length > 0;
                      const unitProgress = unitLessons.length > 0 ? (completedInUnit / unitLessons.length) * 100 : 0;
                      
                      const unitName = unit === 1 ? "print" :
                                      unit === 2 ? <FW word="変数" /> :
                                      unit === 3 ? <>データ<F reading="がた">型</F></> : "";
                      
                      return (
                        <div key={unit} className="flex justify-center">
                          {renderUnitPoint(unit, unitLessons, completedInUnit, isUnitComplete, unitProgress, unitName)}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2行目: ユニット4-5（折り返し） */}
                {secondRowUnits.length > 0 && (
                  <div className="relative">
                    {/* ポイント */}
                    <div className="relative grid grid-cols-3 gap-0">
                      {/* ユニット4を左に配置 */}
                      {secondRowUnits.map((unit) => {
                        if (unit === 5) return null; // ユニット5は後で配置
                        
                        const unitLessons = lessons.filter(l => l.unitNumber === unit);
                        const completedInUnit = unitLessons.filter(l => completedLessons.includes(l.id)).length;
                        const isUnitComplete = completedInUnit === unitLessons.length && unitLessons.length > 0;
                        const unitProgress = unitLessons.length > 0 ? (completedInUnit / unitLessons.length) * 100 : 0;
                        
                        const unitName = unit === 4 ? <>条件<F reading="ぶんき">分岐</F></> : "";
                        
                        return (
                          <div key={unit} className="flex justify-center">
                            {renderUnitPoint(unit, unitLessons, completedInUnit, isUnitComplete, unitProgress, unitName)}
                          </div>
                        );
                      })}
                      
                      {/* 中央にユニット5を配置 */}
                      {secondRowUnits.includes(5) && (() => {
                        const unit = 5;
                        const unitLessons = lessons.filter(l => l.unitNumber === unit);
                        const completedInUnit = unitLessons.filter(l => completedLessons.includes(l.id)).length;
                        const isUnitComplete = completedInUnit === unitLessons.length && unitLessons.length > 0;
                        const unitProgress = unitLessons.length > 0 ? (completedInUnit / unitLessons.length) * 100 : 0;
                        
                        return (
                          <div key={unit} className="flex justify-center">
                            {renderUnitPoint(unit, unitLessons, completedInUnit, isUnitComplete, unitProgress, "ループ")}
                          </div>
                        );
                      })()}
                      
                      {/* 右側のスペーサー（1行目と同じレイアウトにするため） */}
                      <div></div>
                    </div>
                  </div>
                )}
              </div>
            );
          }, [completedLessons, lessons])}
                </div>
              </div>
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

              {/* 任意のミッションから開始 */}
              <div className="mb-3">
                <label className="text-xs text-gray-600 block mb-1">任意のミッションから開始</label>
                <div className="flex gap-1 mb-1">
                  <select
                    value={debugStartLessonId}
                    onChange={(e) => setDebugStartLessonId(e.target.value)}
                    className="flex-1 border rounded px-2 py-1 text-xs"
                  >
                    <option value="">レッスンを選択</option>
                    {lessons.map((lesson) => (
                      <option key={lesson.id} value={lesson.id}>
                        {lesson.id}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-1">
                  <input
                    type="number"
                    value={debugStartMission}
                    onChange={(e) => setDebugStartMission(e.target.value)}
                    placeholder="ミッション番号（例: 3）"
                    min="1"
                    className="flex-1 border rounded px-2 py-1 text-xs"
                  />
                  <button
                    onClick={debugStartFromMission}
                    className="bg-purple-500 text-white text-xs px-2 py-1 rounded hover:bg-purple-600"
                  >
                    開始
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
