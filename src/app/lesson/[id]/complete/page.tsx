"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getLesson, getNextLesson } from "@/data/lessons";
import { getTutorial } from "@/data/tutorials";
import { addLessonComplete, getProgress } from "@/utils/progress";

type CompletePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function LessonCompletePage({ params }: CompletePageProps) {
  const router = useRouter();
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [leveledUp, setLeveledUp] = useState(false);

  useEffect(() => {
    params.then((p) => {
      const id = p.id as string;
      if (id) {
        setLessonId(id);
        setImageError(false);
        
        // レッスンを完了にする（XPを追加）
        const oldProgress = getProgress();
        const newProgress = addLessonComplete(id, 100);
        
        // XP獲得とレベルアップ判定
        setXpGained(100);
        setLeveledUp(newProgress.level > oldProgress.level);
      }
    });
  }, [params]);

  const currentLesson = lessonId ? getLesson(lessonId) : undefined;
  const nextLesson = lessonId ? getNextLesson(lessonId) : undefined;
  const tutorial = lessonId ? getTutorial(lessonId) : undefined;
  const hasNextLesson = !!nextLesson;

  if (!lessonId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-blue-800">読み込み中...</div>
      </div>
    );
  }

  if (!currentLesson) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border-2 border-red-500 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-red-800 mb-4">エラー</h2>
            <p className="text-red-700 mb-4">
              レッスンが見つかりません（ID: {lessonId}）
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-full font-bold"
            >
              ← ホームに戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 font-semibold transition-colors mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            ホームに戻る
          </Link>
        </div>

        {/* 完了メッセージ */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-green-200">
          <div className="text-center mb-8">
            <div className="text-8xl mb-4">🎉</div>
            <h1 className="text-4xl font-bold text-green-800 mb-4">
              レッスン完了！
            </h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              レッスン {lessonId}: {currentLesson.title}
            </h2>
            <p className="text-lg text-gray-600">{currentLesson.description}</p>
          </div>

          {/* キャラクターとメッセージ */}
          {tutorial && (
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              {/* キャラクター画像 */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-purple-200 relative overflow-hidden">
                  {tutorial.characterImage && !imageError ? (
                    <Image
                      src={tutorial.characterImage}
                      alt={tutorial.characterName}
                      width={128}
                      height={128}
                      className="object-contain"
                      onError={() => {
                        setImageError(true);
                      }}
                    />
                  ) : (
                    <span className="text-5xl md:text-6xl">
                      {tutorial.characterEmoji}
                    </span>
                  )}
                </div>
                <p className="text-center mt-2 font-bold text-gray-700 text-sm">
                  {tutorial.characterName}
                </p>
              </div>

              {/* 吹き出し */}
              <div className="flex-1 relative">
                <div className="bg-green-100 rounded-3xl p-4 md:p-6 shadow-lg border-2 border-green-200 relative">
                  {/* 三角形（吹き出しの矢印） */}
                  <div className="absolute left-0 top-1/2 transform -translate-x-3 -translate-y-1/2 hidden md:block">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-green-100 border-b-8 border-b-transparent"></div>
                  </div>

                  <p className="text-base md:text-lg text-gray-800">
                    おめでとう！よく頑張ったね！このレッスンを完璧にマスターできたよ！
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* XP獲得表示 */}
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 mb-6 border-2 border-yellow-300">
            <div className="flex items-center justify-center gap-4">
              <span className="text-3xl">⭐</span>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">獲得経験値</p>
                <p className="text-3xl font-bold text-orange-700">
                  +{xpGained} XP
                </p>
              </div>
              <span className="text-3xl">⭐</span>
            </div>
            {leveledUp && (
              <div className="mt-4 text-center">
                <p className="text-xl font-bold text-purple-700">
                  🎊 レベルアップ！ 🎊
                </p>
              </div>
            )}
          </div>

          {/* ナビゲーションボタン */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-3 rounded-full text-lg font-bold transition-all text-center"
            >
              ホームに戻る
            </Link>

            {hasNextLesson ? (
              <button
                onClick={() => router.push(`/lesson/${nextLesson?.id}`)}
                className="bg-gradient-to-r from-green-300 to-emerald-400 hover:from-green-400 hover:to-emerald-500 text-white px-8 py-3 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all"
              >
                次のレッスンへ →
              </button>
            ) : (
              <div className="bg-gray-100 rounded-full px-8 py-3 text-center">
                <p className="text-gray-600 font-semibold">
                  すべてのレッスンを完了しました！
                </p>
              </div>
            )}
          </div>
        </div>

        {/* レッスン情報 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">レッスン情報</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700">レッスンID:</span>
              <span className="text-gray-600">{lessonId}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700">難易度:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  currentLesson.difficulty === "かんたん"
                    ? "bg-emerald-100 text-emerald-700"
                    : currentLesson.difficulty === "ふつう"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-rose-100 text-rose-700"
                }`}
              >
                {currentLesson.difficulty}
              </span>
            </div>
            {nextLesson && (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">次のレッスン:</span>
                <span className="text-gray-600">
                  {nextLesson.id}: {nextLesson.title}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
