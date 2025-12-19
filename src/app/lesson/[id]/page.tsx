"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { lessons, getLesson } from "@/data/lessons";
import { getTutorial } from "@/data/tutorials";
import { isLessonCompleted } from "@/utils/progress";

type LessonPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function LessonPage({ params }: LessonPageProps) {
  const router = useRouter();
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    params.then((p) => {
      const id = p.id;
      if (id) {
        setLessonId(id);
        setCurrentSlideIndex(0);
        setImageError(false);
      }
    });
  }, [params]);

  const lesson = lessonId ? getLesson(lessonId) : undefined;
  const tutorial = lessonId ? getTutorial(lessonId) : undefined;
  const completed = lessonId ? isLessonCompleted(lessonId) : false;

  if (!lessonId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-blue-800">読み込み中...</div>
      </div>
    );
  }

  if (!lesson) {
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

  const slides = tutorial?.slides || [];
  const currentSlide = slides[currentSlideIndex];
  const hasNextSlide = currentSlideIndex < slides.length - 1;
  const hasPrevSlide = currentSlideIndex > 0;

  const handleNextSlide = () => {
    if (hasNextSlide) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else {
      // 最後のスライドならエディタに進む
      router.push(`/lesson/${lessonId}/editor`);
    }
  };

  const handlePrevSlide = () => {
    if (hasPrevSlide) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                レッスン {lessonId}
              </h1>
              <h2 className="text-2xl font-semibold text-gray-700">
                {lesson.title}
              </h2>
            </div>
            {completed && (
              <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
                ✓ 完了
              </span>
            )}
          </div>
          <p className="mt-4 text-gray-600">{lesson.description}</p>
        </div>

        {/* チュートリアルスライド */}
        {tutorial && currentSlide ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-blue-200">
            {/* スライド進捗 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  スライド {currentSlideIndex + 1} / {slides.length}
                </span>
                <span className="text-sm text-gray-600">
                  {tutorial.characterName}
                </span>
              </div>
              <div className="flex gap-1">
                {slides.map((_, index) => (
                  <div
                    key={index}
                    className={`flex-1 h-2 rounded-full transition-all ${
                      index <= currentSlideIndex
                        ? "bg-blue-400"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* キャラクターとメッセージ */}
            <div className="flex flex-col md:flex-row gap-6 mb-6">
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
              </div>

              {/* 吹き出し */}
              <div className="flex-1 relative">
                <div className="bg-blue-100 rounded-3xl p-4 md:p-6 shadow-lg border-2 border-blue-200 relative">
                  {/* 三角形（吹き出しの矢印） */}
                  <div className="absolute left-0 top-1/2 transform -translate-x-3 -translate-y-1/2 hidden md:block">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-blue-100 border-b-8 border-b-transparent"></div>
                  </div>

                  <p className="text-base md:text-lg text-gray-800">
                    {currentSlide.characterMessage}
                  </p>
                </div>
              </div>
            </div>

            {/* スライドコンテンツ */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-blue-900">
                {currentSlide.title}
              </h3>
              <p className="text-lg text-gray-700">{currentSlide.content}</p>

              {/* コード例 */}
              {currentSlide.codeExample && (
                <div className="mt-6 space-y-4">
                  {currentSlide.codeExample.good && (
                    <div>
                      <p className="text-sm font-semibold text-green-700 mb-2">
                        ✓ 正しい例
                      </p>
                      <div className="bg-gray-900 rounded-lg p-4">
                        <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                          {currentSlide.codeExample.good}
                        </pre>
                      </div>
                    </div>
                  )}
                  {currentSlide.codeExample.bad && (
                    <div>
                      <p className="text-sm font-semibold text-red-700 mb-2">
                        ✗ 間違った例
                      </p>
                      <div className="bg-gray-900 rounded-lg p-4">
                        <pre className="text-red-400 font-mono text-sm whitespace-pre-wrap">
                          {currentSlide.codeExample.bad}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ナビゲーションボタン */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handlePrevSlide}
                disabled={!hasPrevSlide}
                className="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-gray-700 px-6 py-3 rounded-full font-bold transition-all"
              >
                ← 前へ
              </button>

              <button
                onClick={handleNextSlide}
                className="bg-gradient-to-r from-green-300 to-emerald-400 hover:from-green-400 hover:to-emerald-500 text-white px-8 py-3 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all"
              >
                {hasNextSlide ? "次へ →" : "エディタで練習する"}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-blue-200">
            <p className="text-gray-600 mb-6">
              このレッスンにはチュートリアルがありません。
            </p>
            <Link
              href={`/lesson/${lessonId}/editor`}
              className="inline-block bg-gradient-to-r from-green-300 to-emerald-400 hover:from-green-400 hover:to-emerald-500 text-white px-8 py-3 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all"
            >
              エディタで練習する
            </Link>
          </div>
        )}

        {/* レッスン情報 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">レッスン情報</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700">難易度:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  lesson.difficulty === "かんたん"
                    ? "bg-emerald-100 text-emerald-700"
                    : lesson.difficulty === "ふつう"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-rose-100 text-rose-700"
                }`}
              >
                {lesson.difficulty}
              </span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">説明:</span>
              <p className="text-gray-600 mt-1">{lesson.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
