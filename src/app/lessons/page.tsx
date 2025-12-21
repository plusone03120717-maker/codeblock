"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { lessons } from "@/data/lessons";
import { getProgress } from "@/utils/progress";
import Footer from "@/components/Footer";

export default function LessonsPage() {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    const progress = getProgress();
    setCompletedLessons(progress.completedLessons);
  }, []);

  const isLessonLocked = (lessonIndex: number): boolean => {
    if (lessonIndex === 0) return false;
    const previousLesson = lessons[lessonIndex - 1];
    return !completedLessons.includes(previousLesson.id);
  };

  // ユニットごとにレッスンをグループ化
  const lessonsByUnit = lessons.reduce((acc, lesson) => {
    const unit = lesson.unitNumber;
    if (!acc[unit]) {
      acc[unit] = [];
    }
    acc[unit].push(lesson);
    return acc;
  }, {} as Record<number, typeof lessons>);

  const unitNames: Record<number, string> = {
    1: "print関数",
    2: "変数",
    3: "条件分岐",
  };

  const unitColors: Record<number, string> = {
    1: "from-purple-400 to-purple-500",
    2: "from-pink-400 to-pink-500",
    3: "from-blue-400 to-blue-500",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-purple-50 to-pink-100 pb-24">
      {/* ヘッダー */}
      <div className="pt-6 pb-4 px-4">
        <h1 className="text-2xl font-bold text-center text-purple-800">
          📚 レッスン一覧
        </h1>
        <p className="text-center text-gray-600 text-sm mt-1">
          {completedLessons.length} / {lessons.length} 完了
        </p>
      </div>

      {/* 進捗バー */}
      <div className="px-4 mb-6">
        <div className="max-w-md mx-auto">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full transition-all"
              style={{ width: `${(completedLessons.length / lessons.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* ユニットごとのレッスン */}
      <div className="px-4">
        <div className="max-w-md mx-auto space-y-6">
          {Object.entries(lessonsByUnit).map(([unit, unitLessons]) => {
            const unitNum = parseInt(unit);
            const completedInUnit = unitLessons.filter(l => completedLessons.includes(l.id)).length;
            
            return (
              <div key={unit}>
                {/* ユニットヘッダー */}
                <div className={`bg-gradient-to-r ${unitColors[unitNum] || "from-gray-400 to-gray-500"} rounded-t-2xl p-3`}>
                  <div className="flex items-center justify-between text-white">
                    <h2 className="font-bold">
                      ユニット {unit}: {unitNames[unitNum] || "その他"}
                    </h2>
                    <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
                      {completedInUnit}/{unitLessons.length}
                    </span>
                  </div>
                </div>

                {/* レッスンカード */}
                <div className="bg-white rounded-b-2xl shadow-lg overflow-hidden">
                  {unitLessons.map((lesson, idx) => {
                    const globalIndex = lessons.findIndex(l => l.id === lesson.id);
                    const isCompleted = completedLessons.includes(lesson.id);
                    const isLocked = isLessonLocked(globalIndex);

                    return (
                      <div
                        key={lesson.id}
                        className={`border-b last:border-b-0 ${isLocked ? "bg-gray-50" : ""}`}
                      >
                        {isLocked ? (
                          <div className="p-4 flex items-center gap-4 opacity-50">
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                              🔒
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-gray-500">{lesson.id} {lesson.title}</p>
                              <p className="text-xs text-gray-400">{lesson.description}</p>
                            </div>
                          </div>
                        ) : (
                          <Link
                            href={`/lesson/${lesson.id}`}
                            className="p-4 flex items-center gap-4 hover:bg-purple-50 transition-colors"
                          >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isCompleted
                                ? "bg-green-500 text-white"
                                : "bg-purple-100 text-purple-600"
                            }`}>
                              {isCompleted ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <span className="font-bold">{lesson.subNumber}</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-gray-800">{lesson.title}</p>
                              <p className="text-xs text-gray-500">{lesson.description}</p>
                              <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs ${
                                lesson.difficulty === "かんたん"
                                  ? "bg-green-100 text-green-700"
                                  : lesson.difficulty === "ふつう"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }`}>
                                {lesson.difficulty}
                              </span>
                            </div>
                            <div className="text-gray-400">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
}
