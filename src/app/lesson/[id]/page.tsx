"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { lessons } from "@/data/lessons";

type LessonPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function LessonPage({ params }: LessonPageProps) {
  const router = useRouter();
  const [lessonId, setLessonId] = useState<number | null>(null);

  useEffect(() => {
    params.then((p) => {
      const id = parseInt(p.id, 10);
      if (!isNaN(id)) {
        setLessonId(id);
      }
    });
  }, [params]);

  const lesson = lessonId ? lessons.find((l) => l.id === lessonId) : undefined;

  if (!lessonId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-blue-800">読み込み中...</div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-blue-900 mb-4">
            レッスンが見つかりません
          </h1>
          <p className="text-gray-700 mb-6">
            指定されたレッスンは存在しないようです。ホーム画面に戻って、もう一度レッスンを選びましょう。
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-8 py-4 rounded-full font-bold text-lg"
          >
            ← ホームに戻る
          </button>
        </div>
      </div>
    );
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "やさしい";
      case "medium":
        return "ふつう";
      case "hard":
        return "むずかしい";
      default:
        return difficulty;
    }
  };

  // レッスンの期待される出力を取得（最初のミッションの期待される出力を使用）
  const expectedOutput = lesson.missions && lesson.missions.length > 0
    ? lesson.missions[0].expectedOutput
    : "";

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="max-w-3xl mx-auto">
        {/* レッスンタイトル */}
        <h1 className="text-4xl font-bold text-blue-900 mb-8">
          {lesson.title}
        </h1>

        {/* レッスン情報カード */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="mb-6">
            <span className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
              難易度: {getDifficultyText(lesson.difficulty)}
            </span>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-3">【目標】</h2>
            <p className="text-gray-700 text-lg">{lesson.description}</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              【期待される出力】
            </h2>
            <div className="bg-gray-900 rounded-lg p-4">
              <pre className="text-green-400 font-mono whitespace-pre-wrap">
                {expectedOutput}
              </pre>
            </div>
          </div>
        </div>

        {/* ボタンエリア */}
        <div className="flex gap-4">
          <button
            onClick={() => router.push("/")}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-8 py-4 rounded-full font-bold text-lg transition active:scale-95"
          >
            ← ホームに戻る
          </button>

          <Link
            href={`/lesson/${lessonId}/tutorial`}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-bold text-xl shadow-lg transition active:scale-95 text-center block"
          >
            ミッション開始！
          </Link>
        </div>
      </div>
    </div>
  );
}


