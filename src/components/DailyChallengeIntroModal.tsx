"use client";

import { useState, useEffect } from "react";
import { F, FW } from "@/components/Furigana";
import Image from "next/image";

interface DailyChallengeIntroModalProps {
  onClose: () => void;
}

export function DailyChallengeIntroModal({ onClose }: DailyChallengeIntroModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 4;

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onClose();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  // キーボード操作
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* スライドコンテンツ */}
        <div className="flex-1 overflow-hidden relative">
          <div
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {/* スライド 0: タイトル */}
            <div className="min-w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-purple-500 to-blue-600 text-white">
              <div className="text-8xl mb-6 animate-bounce">🎉</div>
              <h2 className="text-4xl font-bold mb-4 text-center">
                新しい<F reading="きのう">機能</F>が<F reading="かいほう">開放</F>されました！
              </h2>
              <div className="text-6xl mb-6">🎯</div>
              <h3 className="text-3xl font-bold text-center">
                デイリーチャレンジ
              </h3>
            </div>

            {/* スライド 1: デイリーチャレンジとは */}
            <div className="min-w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-orange-100 to-yellow-100">
              <div className="text-6xl mb-6">📅</div>
              <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
                デイリーチャレンジとは？
              </h2>
              <div className="bg-white rounded-2xl p-6 shadow-lg max-w-lg">
                <p className="text-lg text-gray-700 mb-4 text-center">
                  毎日3<F reading="もん">問</F>の<F reading="もんだい">問題</F>に<F reading="ちょうせん">挑戦</F>できます！
                </p>
                <div className="flex justify-center gap-4 mb-4">
                  <div className="bg-purple-100 rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">❓</div>
                    <div className="font-bold text-purple-700">3問</div>
                  </div>
                  <div className="bg-blue-100 rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">⏰</div>
                    <div className="font-bold text-blue-700">毎日</div>
                  </div>
                  <div className="bg-green-100 rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">⭐</div>
                    <div className="font-bold text-green-700">XP</div>
                  </div>
                </div>
                <p className="text-center text-gray-600">
                  すでに<F reading="がくしゅう">学習</F>した内容から出題されます
                </p>
              </div>
            </div>

            {/* スライド 2: 連続記録 */}
            <div className="min-w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-red-100 to-pink-100">
              <div className="text-6xl mb-6">🔥</div>
              <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
                <F reading="れんぞく">連続</F>で<F reading="ちょうせん">挑戦</F>しよう！
              </h2>
              <div className="bg-white rounded-2xl p-6 shadow-lg max-w-lg">
                <p className="text-lg text-gray-700 mb-4 text-center">
                  <F reading="れんぞく">連続</F>で<F reading="ちょうせん">挑戦</F>すると<F reading="ぼーなす">ボーナス</F>XPが<F reading="もら">もら</F>えます！
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-orange-50 p-3 rounded-lg">
                    <span className="text-gray-700">🔥 7日連続</span>
                    <span className="font-bold text-orange-600">+100 XP</span>
                  </div>
                  <div className="flex items-center justify-between bg-red-50 p-3 rounded-lg">
                    <span className="text-gray-700">🔥 30日連続</span>
                    <span className="font-bold text-red-600">+500 XP</span>
                  </div>
                </div>
                <p className="text-center text-gray-600 mt-4">
                  毎日<F reading="ちょうせん">挑戦</F>して<F reading="れんぞく">連続</F><F reading="きろく">記録</F>を<F reading="のば">伸ば</F>そう！
                </p>
              </div>
            </div>

            {/* スライド 3: 終了 */}
            <div className="min-w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-green-100 to-emerald-100">
              <div className="text-8xl mb-6">✨</div>
              <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
                さあ、<F reading="ちょうせん">挑戦</F>しよう！
              </h2>
              <div className="bg-white rounded-2xl p-6 shadow-lg max-w-lg text-center">
                <p className="text-lg text-gray-700 mb-4">
                  ホームページからデイリーチャレンジに<F reading="ちょうせん">挑戦</F>できます
                </p>
                <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl p-4 mb-4">
                  <p className="font-bold text-xl">🎯 今日の挑戦</p>
                </div>
                <p className="text-gray-600">
                  毎日<F reading="れんぞく">連続</F>で<F reading="ちょうせん">挑戦</F>して、<F reading="すきる">スキル</F>を<F reading="み">磨</F>こう！
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ナビゲーション */}
        <div className="bg-gray-50 p-4 border-t">
          {/* プログレスバー */}
          <div className="mb-4">
            <div className="flex justify-center gap-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentSlide
                      ? "bg-purple-600 w-8"
                      : "bg-gray-300 w-2"
                  }`}
                  aria-label={`スライド ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* ボタン */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={`px-4 py-2 rounded-full font-bold transition-all ${
                currentSlide === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-300 hover:bg-gray-400 text-gray-700"
              }`}
            >
              ← 前へ
            </button>

            <span className="text-sm text-gray-600">
              {currentSlide + 1} / {totalSlides}
            </span>

            {currentSlide < totalSlides - 1 ? (
              <button
                onClick={nextSlide}
                className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white px-6 py-2 rounded-full font-bold transition-all"
              >
                次へ →
              </button>
            ) : (
              <button
                onClick={onClose}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-full font-bold transition-all"
              >
                始める！
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

