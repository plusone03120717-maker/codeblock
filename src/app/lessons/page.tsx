"use client";

import { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import { lessons } from "@/data/lessons";
import { getProgress } from "@/utils/progress";
import Footer from "@/components/Footer";
import { F, FW } from "@/components/Furigana";
import { useFurigana } from "@/contexts/FuriganaContext";
import { getUnitGradient } from "@/utils/unitColors";

// レッスンタイトルにふりがなを適用
const lessonTitleWithFurigana: Record<string, ReactNode> = {
  "1-1": <>文字列（もじれつ）を表示（ひょうじ）しよう</>,
  "1-2": <>数字を表示（ひょうじ）しよう</>,
  "1-3": <>四則演算（しそくえんざん）を学ぼう</>,
  "1-4": <>文字列（もじれつ）をつなげよう</>,
  "1-5": <>余（あま）りを計算（けいさん）しよう</>,
  "1-6": <>複数（ふくすう）の値（あたい）を表示（ひょうじ）しよう</>,
  "2-1": <>変数（へんすう）に名前をつけよう</>,
  "2-2": <>変数（へんすう）を表示（ひょうじ）しよう</>,
  "2-3": <>変数（へんすう）を計算（けいさん）に使おう</>,
  "2-4": <>変数（へんすう）の中身を変えよう</>,
  "2-5": <>変数（へんすう）同士を組み合わせよう</>,
  "2-6": <>変数（へんすう）クイズに<F reading="ちょうせん">挑戦</F>！</>,
  "3-1": <>データ<F reading="がた">型</F>を知ろう</>,
  "3-2": <><F reading="かた">型</F>を<F reading="しら">調</F>べよう</>,
  "3-3": <><F reading="かた">型</F>を<F reading="へんかん">変換</F>しよう</>,
  "3-4": <>データ<F reading="がた">型</F>クイズ！</>,
};

const lessonDescWithFurigana: Record<string, ReactNode> = {
  "1-1": <>print()を使って文字を画面に表示（ひょうじ）する方法（ほうほう）を学ぼう</>,
  "1-2": <>print()を使って数字を表示（ひょうじ）する方法（ほうほう）を学ぼう</>,
  "1-3": <>足し算、引き算、掛（か）け算、割（わ）り算をやってみよう</>,
  "1-4": <>「+」を使って文字列（もじれつ）を連結（れんけつ）する方法（ほうほう）を学ぼう</>,
  "1-5": <>「%」を使って割（わ）り算の余（あま）りを求（もと）める方法（ほうほう）を学ぼう</>,
  "1-6": <>print()で複数（ふくすう）の値（あたい）をまとめて表示（ひょうじ）する方法（ほうほう）を学ぼう</>,
  "2-1": <>データを入れる「箱（はこ）」に名前をつける方法（ほうほう）を学ぼう</>,
  "2-2": <>変数（へんすう）の中身をprint()で表示（ひょうじ）する方法（ほうほう）を学ぼう</>,
  "2-3": <>数字を変数（へんすう）に入れて計算（けいさん）してみよう</>,
  "2-4": <>変数（へんすう）の値（あたい）を上書（うわが）きする方法（ほうほう）を学ぼう</>,
  "2-5": <>複数（ふくすう）の変数（へんすう）を使って計算（けいさん）や連結（れんけつ）をしてみよう</>,
  "2-6": <>コードを読んで出力（しゅつりょく）を<F reading="よそく">予測</F>しよう</>,
  "3-1": <>文字列（もじれつ）・数値（すうち）・<F reading="しんぎち">真偽値</F>の<F reading="ちが">違</F>いを学ぼう</>,
  "3-2": <>type()を使ってデータの<F reading="かた">型</F>を<F reading="かくにん">確認</F>しよう</>,
  "3-3": <>int()やstr()を使って<F reading="かた">型</F>を<F reading="へんかん">変換</F>しよう</>,
  "3-4": <>コードを読んで<F reading="かた">型</F>を<F reading="よそく">予測</F>しよう</>,
};

export default function LessonsPage() {
  const { furiganaEnabled } = useFurigana();
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

  const unitNames: Record<number, ReactNode> = {
    1: <>print<FW word="関数" /></>,
    2: <FW word="変数" />,
    3: <>データ<F reading="がた">型</F></>,
    4: <>条件<F reading="ぶんき">分岐</F></>,
    5: <>繰り返し</>,
    6: <>リスト</>,
    7: <>関数の基本</>,
    8: <>戻り値と応用</>,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-purple-50 to-pink-100 pb-24">
      {/* ヘッダー */}
      <div className="pt-6 pb-4 px-4">
        <h1 className="text-2xl font-bold text-center text-purple-800">
          📚 レッスン一覧
        </h1>
        <p className="text-center text-gray-600 text-sm mt-1">
          {completedLessons.length} / {lessons.length} <FW word="完了" />
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
                <div className={`bg-gradient-to-r ${getUnitGradient(unitNum)} rounded-t-2xl p-3`}>
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
                              <p className="font-bold text-gray-500">
                                {lesson.id} {furiganaEnabled && lessonTitleWithFurigana[lesson.id] ? lessonTitleWithFurigana[lesson.id] : lesson.title}
                              </p>
                              <p className="text-xs text-gray-400">
                                {furiganaEnabled && lessonDescWithFurigana[lesson.id] ? lessonDescWithFurigana[lesson.id] : lesson.description}
                              </p>
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
                              <p className="font-bold text-gray-800">
                                {furiganaEnabled && lessonTitleWithFurigana[lesson.id] ? lessonTitleWithFurigana[lesson.id] : lesson.title}
                              </p>
                              <p className="text-xs text-gray-500">
                                {furiganaEnabled && lessonDescWithFurigana[lesson.id] ? lessonDescWithFurigana[lesson.id] : lesson.description}
                              </p>
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


