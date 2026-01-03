"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { lessons, getLesson } from "@/data/lessons";
import { getTutorial } from "@/data/tutorials";
import { isLessonCompleted } from "@/utils/progress";
import { F, FW, FuriganaText } from "@/components/Furigana";
import { useAuth } from "@/contexts/AuthContext";

type LessonPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function LessonPage({ params }: LessonPageProps) {
  const router = useRouter();
  const { user, loading, canAccessLesson } = useAuth();
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 未ログイン時はログインページへリダイレクト
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

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

  // アクセス制御
  useEffect(() => {
    if (loading || !lessonId) return;
    
    const lesson = getLesson(lessonId);
    if (!lesson) return;
    
    const lessonNumber = lesson.unitNumber;
    
    if (!canAccessLesson(lessonNumber)) {
      // ホームにリダイレクト
      router.push("/");
    }
  }, [lessonId, canAccessLesson, loading, router]);

  const lesson = lessonId ? getLesson(lessonId) : undefined;
  const tutorial = lessonId ? getTutorial(lessonId) : undefined;

  // チュートリアルが変わったときにも画像エラーをリセット
  useEffect(() => {
    setImageError(false);
  }, [tutorial]);
  const completed = lessonId ? isLessonCompleted(lessonId) : false;

  const slides = tutorial?.slides || [];
  const hasNextSlide = slides.length > 0 && currentSlideIndex < slides.length - 1;
  const hasPrevSlide = currentSlideIndex > 0;

  // キーボード操作のサポート
  useEffect(() => {
    if (!lessonId || !tutorial || slides.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && hasPrevSlide) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentSlideIndex((prev) => prev - 1);
          setIsTransitioning(false);
        }, 150);
      } else if (e.key === "ArrowRight") {
        if (hasNextSlide) {
          setIsTransitioning(true);
          setTimeout(() => {
            setCurrentSlideIndex((prev) => prev + 1);
            setIsTransitioning(false);
          }, 150);
        } else {
          router.push(`/lesson/${lessonId}/editor`);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lessonId, tutorial, slides.length, currentSlideIndex, hasNextSlide, hasPrevSlide, router]);

  // ローディング中または未ログイン時の表示
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-400 to-purple-600">
        <div className="text-white text-xl">読み込み中...</div>
      </div>
    );
  }

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

  const currentSlide = slides[currentSlideIndex];

  const handleNextSlide = () => {
    if (hasNextSlide) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlideIndex(currentSlideIndex + 1);
        setIsTransitioning(false);
      }, 150);
    } else {
      // 最後のスライドならエディタに進む
      router.push(`/lesson/${lessonId}/editor`);
    }
  };

  const handlePrevSlide = () => {
    if (hasPrevSlide) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlideIndex(currentSlideIndex - 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 font-semibold transition-colors text-base bg-white hover:bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            ホーム
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                レッスン {lessonId}
              </h1>
              <h2 className="text-2xl font-semibold text-gray-700">
                <FuriganaText text={lesson.title} />
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
          <div className={`bg-white rounded-2xl shadow-xl p-6 border-2 border-purple-200 mb-4 transition-opacity duration-150 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            {/* ナビゲーションボタン（上部） */}
            <div className="flex justify-between items-center gap-2 mb-4">
              {currentSlideIndex > 0 ? (
                <button
                  onClick={handlePrevSlide}
                  className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  前へ
                </button>
              ) : (
                <div className="px-5 py-2.5 invisible text-sm">前へ</div>
              )}

              {/* スライドインジケーター */}
              <div className="flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setIsTransitioning(true);
                      setTimeout(() => {
                        setCurrentSlideIndex(index);
                        setIsTransitioning(false);
                      }, 150);
                    }}
                    className={`rounded-full transition-all ${
                      index === currentSlideIndex
                        ? "w-3 h-3 bg-purple-500 scale-125"
                        : "w-3 h-3 bg-purple-200 hover:bg-purple-300"
                    }`}
                    aria-label={`スライド ${index + 1}`}
                  />
                ))}
              </div>

              {currentSlideIndex < slides.length - 1 ? (
                <button
                  onClick={handleNextSlide}
                  className="px-5 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-full font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-1"
                >
                  次へ
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={() => router.push(`/lesson/${lessonId}/editor`)}
                  className="px-5 py-2.5 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white rounded-full font-bold text-sm transition-all shadow-md hover:shadow-lg"
                >
                  <F reading="かいし">開始</F> 🚀
                </button>
              )}
            </div>

            {/* キャラクターと吹き出し */}
            <div className="flex flex-col md:flex-row items-start gap-4 mb-4">
              {/* キャラクター */}
              <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-purple-200 to-purple-300 rounded-full flex items-center justify-center flex-shrink-0 border-4 border-purple-400 shadow-lg overflow-hidden mx-auto md:mx-0">
                {tutorial.characterImage && !imageError ? (
                  <Image
                    src={tutorial.characterImage}
                    alt={tutorial.characterName}
                    width={128}
                    height={128}
                    className="object-contain"
                    unoptimized
                    onError={() => {
                      console.error("画像の読み込みエラー:", tutorial.characterImage);
                      setImageError(true);
                    }}
                  />
                ) : (
                  <span className="text-4xl md:text-5xl">{tutorial.characterEmoji}</span>
                )}
              </div>
              
              {/* 吹き出し */}
              <div className="flex-1 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 relative shadow-md w-full md:w-auto">
                {/* モバイル用：上向きの三角形 */}
                <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-full md:hidden">
                  <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-12 border-b-purple-100"></div>
                </div>
                {/* デスクトップ用：左向きの三角形 */}
                <div className="hidden md:block absolute left-0 top-6 transform -translate-x-3">
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-r-12 border-r-purple-100 border-b-8 border-b-transparent"></div>
                </div>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed"><FuriganaText text={currentSlide.characterMessage} /></p>
              </div>
            </div>

            {/* スライドタイトル */}
            <h2 className="text-lg md:text-xl font-bold text-purple-800 mb-3">
              <FuriganaText text={currentSlide.title} />
            </h2>
            
            {/* 説明 */}
            <p className="text-sm md:text-base text-gray-600 mb-4 leading-relaxed"><FuriganaText text={currentSlide.content} /></p>
            
            {/* 画像 */}
            {currentSlide.image && (
              <div className="mb-4">
                <Image
                  src={currentSlide.image}
                  alt="ブロック画像"
                  width={50}
                  height={25}
                  className="border-2 border-gray-300 rounded-lg"
                />
              </div>
            )}
            
            {/* コード例 */}
            {currentSlide.codeExample && (
              <div className="space-y-3">
                {currentSlide.codeExample.bad && (
                  <div className="bg-red-50 border-2 border-red-300 rounded-lg p-3">
                    <div className="text-red-600 font-bold text-sm mb-2">❌ ダメな<F reading="れい">例</F></div>
                    <pre className="bg-gray-900 rounded-lg p-3 text-red-400 font-mono text-sm overflow-x-auto shadow-inner">
                      {currentSlide.codeExample.bad}
                    </pre>
                  </div>
                )}
                {currentSlide.codeExample.good && (
                  <div className="bg-green-50 border-2 border-green-300 rounded-lg p-3">
                    <div className="text-green-600 font-bold text-sm mb-2">✅ 正しい<F reading="れい">例</F></div>
                    <pre className="bg-gray-900 rounded-lg p-3 text-green-400 font-mono text-sm overflow-x-auto shadow-inner">
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
