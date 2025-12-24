"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { lessons, getLesson } from "@/data/lessons";
import { getTutorial } from "@/data/tutorials";
import { isLessonCompleted } from "@/utils/progress";
import { F, FW, FuriganaText } from "@/components/Furigana";

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

  // チュートリアルが変わったときにも画像エラーをリセット
  useEffect(() => {
    setImageError(false);
  }, [tutorial]);
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
          <p className="mt-4 text-gray-600"><FuriganaText text={lesson.description} /></p>
        </div>

        {/* チュートリアルスライド */}
        {tutorial && currentSlide ? (
          <div className="bg-white rounded-2xl shadow-xl p-4 border-2 border-purple-200 mb-4">
            {/* ナビゲーションボタン（上部） */}
            <div className="flex justify-between items-center gap-2 mb-3">
              {currentSlideIndex > 0 ? (
                <button
                  onClick={() => setCurrentSlideIndex(currentSlideIndex - 1)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full font-bold text-sm transition-all"
                >
                  ← 前へ
                </button>
              ) : (
                <div className="px-4 py-2 invisible text-sm">← 前へ</div>
              )}

              {/* スライドインジケーター */}
              <div className="flex gap-1">
                {slides.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentSlideIndex
                        ? "bg-purple-500"
                        : "bg-purple-200"
                    }`}
                  />
                ))}
              </div>

              {currentSlideIndex < slides.length - 1 ? (
                <button
                  onClick={() => setCurrentSlideIndex(currentSlideIndex + 1)}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full font-bold text-sm transition-all"
                >
                  次へ →
                </button>
              ) : (
                <button
                  onClick={() => router.push(`/lesson/${lessonId}/editor`)}
                  className="px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full font-bold text-sm transition-all"
                >
                  <F reading="かいし">開始</F> 🚀
                </button>
              )}
            </div>

            {/* キャラクターと吹き出し（横並び） */}
            <div className="flex items-start gap-3 mb-3">
              {/* キャラクター（小さく） */}
              <div className="w-28 h-28 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-purple-200 overflow-hidden">
                {tutorial.characterImage && !imageError ? (
                  <Image
                    src={tutorial.characterImage}
                    alt={tutorial.characterName}
                    width={112}
                    height={112}
                    className="object-contain"
                    unoptimized
                    onError={() => {
                      console.error("画像の読み込みエラー:", tutorial.characterImage);
                      setImageError(true);
                    }}
                  />
                ) : (
                  <span className="text-4xl">{tutorial.characterEmoji}</span>
                )}
              </div>
              
              {/* 吹き出し */}
              <div className="flex-1 bg-purple-100 rounded-xl p-3 relative">
                <div className="absolute left-0 top-4 transform -translate-x-2">
                  <div className="w-0 h-0 border-t-6 border-t-transparent border-r-8 border-r-purple-100 border-b-6 border-b-transparent"></div>
                </div>
                <p className="text-sm text-gray-700"><FuriganaText text={currentSlide.characterMessage} /></p>
              </div>
            </div>

            {/* スライドタイトル */}
            <h2 className="text-lg font-bold text-purple-800 mb-2">
              <FuriganaText text={currentSlide.title} />
            </h2>
            
            {/* 説明 */}
            <p className="text-sm text-gray-600 mb-2"><FuriganaText text={currentSlide.content} /></p>
            
            {/* 画像 */}
            {currentSlide.image && (
              <div className="mb-3">
                <Image
                  src={currentSlide.image}
                  alt="ブロック画像"
                  width={50}
                  height={25}
                  className="border-2 border-gray-300 rounded-lg"
                />
              </div>
            )}
            
            {/* コード例（コンパクト版） */}
            {currentSlide.codeExample && (
              <div className="space-y-2">
                {currentSlide.codeExample.bad && (
                  <div className="bg-red-50 border border-red-300 rounded-lg p-2">
                    <div className="text-red-600 font-bold text-xs mb-1">❌ ダメな<F reading="れい">例</F></div>
                    <pre className="bg-red-100 rounded p-2 text-red-800 font-mono text-xs overflow-x-auto">
                      {currentSlide.codeExample.bad}
                    </pre>
                  </div>
                )}
                {currentSlide.codeExample.good && (
                  <div className="bg-green-50 border border-green-300 rounded-lg p-2">
                    <div className="text-green-600 font-bold text-xs mb-1">✅ 正しい<F reading="れい">例</F></div>
                    <pre className="bg-green-100 rounded p-2 text-green-800 font-mono text-xs overflow-x-auto">
                      {currentSlide.codeExample.good}
                    </pre>
                  </div>
                )}
              </div>
            )}
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
            <div>
              <span className="font-semibold text-gray-700">説明:</span>
              <p className="text-gray-600 mt-1"><FuriganaText text={lesson.description} /></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
