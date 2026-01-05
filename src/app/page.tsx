"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { lessons, getLesson } from "@/data/lessons";
import { getTutorial } from "@/data/tutorials";
import { useState, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { achievements, Achievement } from "@/data/achievements";
import { checkNewAchievements, UserStats, isWeekend, isEarlyMorning } from "@/utils/achievementChecker";
import { 
  getProgress, 
  getLevelInfo, 
  getLevelProgress, 
  getXPToNextLevel,
  getLastOpenedMission,
  hasCompletedUnit1Basics,
  hasCompletedLesson1_7,
  type LastOpenedMission
} from "@/utils/progress";
import Footer from "@/components/Footer";
import { F, FW, FuriganaText } from "@/components/Furigana";
import { UNIT_COLORS, getUnitGradient, getUnitSolid } from "@/utils/unitColors";
import { useAuth } from "@/contexts/AuthContext";
import { logout } from "@/lib/auth";
import ReviewSection from "@/components/ReviewSection";
import { resetReviewData, getReviewCount } from "@/utils/reviewSystem";
import ToggleImage from "@/components/ToggleImage";
import { UpgradeModal } from "@/components/UpgradeModal";
import { DailyChallengeCard } from "@/components/daily-challenge";
import {
  getDailyChallengeState,
  getDailyChallengeStats,
  generateNewDailyChallenge,
  resetDailyChallengeState,
  resetDailyChallengeStats,
  setDebugStreak,
} from "@/utils/dailyChallengeStorage";
import { DailyChallengeState, DailyChallengeStats } from "@/types/dailyChallenge";
import { getTodayDateJST } from "@/utils/dailyChallengeUtils";

// 簡単な多言語対応フック（ランディングページ用）
const useLanguage = () => {
  const [language, setLanguage] = useState<"ja" | "en">("ja");
  
  // localStorageから言語設定を読み込み
  useEffect(() => {
    const saved = localStorage.getItem("codeblock-language");
    if (saved === "en" || saved === "ja") {
      setLanguage(saved);
    }
  }, []);
  
  const t = (key: string): string => {
    // 簡単な翻訳テーブル
    const translations: Record<string, Record<string, string>> = {
      "common.login": { ja: "ログイン", en: "Login" },
      "common.signUp": { ja: "新規登録", en: "Sign Up" },
      "common.loading": { ja: "読み込み中...", en: "Loading..." },
    };
    return translations[key]?.[language] || key;
  };
  
  return { t, language, setLanguage };
};

// ランディングページコンポーネント
const LandingPage = () => {
  const { t, language } = useLanguage();
  
  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-600 relative overflow-hidden">
        {/* 背景画像 */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none z-0">
          <Image 
            src="/header-image.png" 
            alt="Header decoration" 
            width={800} 
            height={400} 
            className="object-contain"
            style={{ width: "auto", height: "auto" }}
            priority
          />
        </div>
        <header className="flex justify-between items-center p-4 max-w-6xl mx-auto relative z-20">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="CodeBlock ロゴ" width={40} height={40} className="rounded-full border-2 border-white" />
          <span className="text-2xl font-bold text-white">CodeBlock</span>
        </div>
        <div className="flex items-center gap-3 relative z-20">
          <Link
            href="/login"
            className="text-white font-medium hover:text-purple-200 transition-colors relative z-20"
          >
            {t("common.login")}
          </Link>
          <Link
            href="/login?mode=register"
            className="bg-white text-purple-600 font-bold py-2 px-6 rounded-full hover:bg-purple-100 transition-colors relative z-20"
          >
            {language === "ja" ? <>新規<FW word="登録" /></> : "Sign Up"}
          </Link>
        </div>
        </header>

        {/* ヒーローセクション */}
        <section className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {language === "ja" ? "ブロックで学ぶ" : "Learn with Blocks"}
          <br />
          {language === "ja" ? "はじめてのPython" : "Your First Python"}
        </h1>
        <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
          {language === "ja" 
            ? "小学生でもかんたん！ドラッグ＆ドロップでプログラミングを学ぼう" 
            : "Easy for kids! Learn programming with drag & drop"}
        </p>
        <Link
          href="/login?mode=register"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold text-xl py-4 px-10 rounded-full shadow-lg transform hover:scale-105 transition-all"
        >
          {language === "ja" ? "無料で始める 🚀" : "Start Free 🚀"}
        </Link>
        </section>
      </div>

      {/* 保護者向け訴求セクション */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          
          {/* パート1: 問題提起 */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
              {language === "ja" ? (
                <>
                  子どもにプログラミングを学ばせたい。でも...
                </>
              ) : (
                "Want your child to learn programming. But..."
              )}
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {/* 悩み1 */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-3xl mb-3">💭</div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {language === "ja" 
                    ? "プログラミングは将来必要なスキルだと分かっている"
                    : "I know programming is an essential skill for the future"}
                </p>
              </div>
              
              {/* 悩み2 */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-3xl mb-3">😰</div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {language === "ja" 
                    ? (
                      <>
                        でも<F reading="きょうざい">教材</F>を見ると英語や専門用語ばかりで難しそう
                      </>
                    )
                    : "But learning materials are full of English and technical terms"}
                </p>
              </div>
              
              {/* 悩み3 */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-3xl mb-3">😓</div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {language === "ja" 
                    ? "いきなりコードを書かせるのはハードルが高い"
                    : "Having them write code right away seems too difficult"}
                </p>
              </div>
              
              {/* 悩み4 */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-3xl mb-3">😟</div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {language === "ja" 
                    ? "子どもが挫折しないか心配"
                    : "I'm worried my child might give up"}
                </p>
              </div>
              
              {/* 悩み5 */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-3xl mb-3">🤔</div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {language === "ja" 
                    ? "何から始めればいいか分からない"
                    : "I don't know where to start"}
                </p>
              </div>
              
              {/* 悩み6 */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-3xl mb-3">📚</div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {language === "ja" 
                    ? "タイピングがまだできない小学生には難しすぎる"
                    : "It's too difficult for elementary students who can't type yet"}
                </p>
              </div>
            </div>
          </div>

          {/* CodeBlockの特徴セクション */}
          <section className="mb-16 py-16 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                {language === "ja" ? "CodeBlockの特徴" : "Features"}
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6">
                  <div className="h-64 flex items-center justify-center mb-4">
                    <img 
                      src="/images/features/block-learning.png" 
                      alt={language === "ja" ? "ブロックで学ぶ" : "Learn with Blocks"} 
                      className="max-h-full max-w-full rounded-lg shadow-md object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {language === "ja" ? "ブロックで学ぶ" : "Learn with Blocks"}
                  </h3>
                  <p className="text-gray-600">
                    {language === "ja" 
                      ? "ドラッグ＆ドロップでコードを組み立て。タイピングが苦手でも大丈夫！" 
                      : "Build code with drag & drop. No typing skills needed!"}
                  </p>
                </div>
                <div className="text-center p-6">
                  <div className="h-64 flex items-center justify-center mb-4">
                    <ToggleImage
                      image1="/images/features/furigana-off.png"
                      image2="/images/features/furigana-on.png"
                      alt1={language === "ja" ? "ふりがなOFF" : "Furigana OFF"}
                      alt2={language === "ja" ? "ふりがなON" : "Furigana ON"}
                      interval={2500}
                      className="w-full max-w-xs h-full rounded-xl shadow-lg overflow-hidden"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {language === "ja" ? "ふりがなワンタッチ" : "One-Touch Furigana"}
                  </h3>
                  <p className="text-gray-600">
                    {language === "ja" 
                      ? "ボタンひとつでふりがなのオン/オフを切り替え。わからない漢字が出たときだけ表示できるから、画面がスッキリ読みやすい！" 
                      : "Toggle furigana on/off with one button. Show it only when you need help with kanji!"}
                  </p>
                </div>
                <div className="text-center p-6">
                  <div className="h-64 flex items-center justify-center mb-4">
                    <img 
                      src="/images/features/hint.png" 
                      alt={language === "ja" ? "困ったらヒント" : "Hints When Stuck"} 
                      className="max-h-full max-w-full rounded-lg shadow-md object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        if (target.parentElement) {
                          const fallback = document.createElement('div');
                          fallback.className = 'text-5xl';
                          fallback.textContent = '💡';
                          target.parentElement.appendChild(fallback);
                        }
                      }}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {language === "ja" ? "困ったらヒント" : "Hints When Stuck"}
                  </h3>
                  <p className="text-gray-600">
                    {language === "ja" 
                      ? "わからなくても大丈夫！個性豊かなキャラクターたちがあなたを正解へ導くヒントを教えてくれるよ" 
                      : "Don't worry if you're stuck! Unique characters will give you hints to guide you to the answer"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* パート3: 差別化ポイント */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
              {language === "ja" ? (
                <>
                  他のPython<F reading='きょうざい'>教材</F>との違い
                </>
              ) : (
                "Difference from other Python learning materials"
              )}
            </h2>
            
            {/* 比較表（デスクトップ用） */}
            <div className="hidden md:block overflow-x-auto mb-8">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                      <th className="px-6 py-4 text-left font-bold">{language === "ja" ? "項目" : "Item"}</th>
                      <th className="px-6 py-4 text-center font-bold">{language === "ja" ? "他の教材" : "Other Materials"}</th>
                      <th className="px-6 py-4 text-center font-bold bg-purple-700">{language === "ja" ? "CodeBlock" : "CodeBlock"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="px-6 py-4 font-semibold text-gray-800">{language === "ja" ? "入力方法" : "Input Method"}</td>
                      <td className="px-6 py-4 text-center text-gray-600">{language === "ja" ? "キーボードでタイピング" : "Typing on keyboard"}</td>
                      <td className="px-6 py-4 text-center text-purple-600 font-bold bg-purple-50">✓ {language === "ja" ? "ブロックを選んで並べる" : "Select and arrange blocks"}</td>
                    </tr>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <td className="px-6 py-4 font-semibold text-gray-800">{language === "ja" ? "対象年齢" : "Target Age"}</td>
                      <td className="px-6 py-4 text-center text-gray-600">{language === "ja" ? "中高生〜大人向けが多い" : "Mostly for middle/high school and adults"}</td>
                      <td className="px-6 py-4 text-center text-purple-600 font-bold bg-purple-50">
                        ✓ {language === "ja" ? (
                          <>
                            <F reading="しょうがくせい">小学生</F>（10〜12歳）に特化
                          </>
                        ) : (
                          "Specialized for elementary (ages 10-12)"
                        )}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="px-6 py-4 font-semibold text-gray-800">{language === "ja" ? "学習体験" : "Learning Experience"}</td>
                      <td className="px-6 py-4 text-center text-gray-600">{language === "ja" ? "教科書的・説明が多い" : "Textbook-like, lots of explanations"}</td>
                      <td className="px-6 py-4 text-center text-purple-600 font-bold bg-purple-50">✓ {language === "ja" ? "ゲーム感覚で楽しく" : "Fun, game-like experience"}</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 font-semibold text-gray-800">{language === "ja" ? "難易度" : "Difficulty"}</td>
                      <td className="px-6 py-4 text-center text-gray-600">{language === "ja" ? "最初からハードルが高い" : "High barrier from the start"}</td>
                      <td className="px-6 py-4 text-center text-purple-600 font-bold bg-purple-50">✓ {language === "ja" ? "やさしくステップアップ" : "Gentle step-by-step progression"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 比較表（モバイル用） */}
            <div className="md:hidden space-y-4 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="font-bold text-gray-800 mb-4">{language === "ja" ? "入力方法" : "Input Method"}</h3>
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600 mb-1">{language === "ja" ? "他の教材" : "Other Materials"}</p>
                    <p className="text-gray-700">{language === "ja" ? "キーボードでタイピング" : "Typing on keyboard"}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 border-2 border-purple-300">
                    <p className="text-sm text-purple-600 font-bold mb-1">CodeBlock</p>
                    <p className="text-purple-700 font-semibold">✓ {language === "ja" ? "ブロックを選んで並べる" : "Select and arrange blocks"}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="font-bold text-gray-800 mb-4">{language === "ja" ? "対象年齢" : "Target Age"}</h3>
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600 mb-1">{language === "ja" ? "他の教材" : "Other Materials"}</p>
                    <p className="text-gray-700">{language === "ja" ? "中高生〜大人向けが多い" : "Mostly for middle/high school and adults"}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 border-2 border-purple-300">
                    <p className="text-sm text-purple-600 font-bold mb-1">CodeBlock</p>
                    <p className="text-purple-700 font-semibold">
                      ✓ {language === "ja" ? (
                        <>
                          <F reading="しょうがくせい">小学生</F>（10〜12歳）に特化
                        </>
                      ) : (
                        "Specialized for elementary (ages 10-12)"
                      )}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="font-bold text-gray-800 mb-4">{language === "ja" ? "学習体験" : "Learning Experience"}</h3>
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600 mb-1">{language === "ja" ? "他の教材" : "Other Materials"}</p>
                    <p className="text-gray-700">{language === "ja" ? "教科書的・説明が多い" : "Textbook-like, lots of explanations"}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 border-2 border-purple-300">
                    <p className="text-sm text-purple-600 font-bold mb-1">CodeBlock</p>
                    <p className="text-purple-700 font-semibold">✓ {language === "ja" ? "ゲーム感覚で楽しく" : "Fun, game-like experience"}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="font-bold text-gray-800 mb-4">{language === "ja" ? "難易度" : "Difficulty"}</h3>
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600 mb-1">{language === "ja" ? "他の教材" : "Other Materials"}</p>
                    <p className="text-gray-700">{language === "ja" ? "最初からハードルが高い" : "High barrier from the start"}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 border-2 border-purple-300">
                    <p className="text-sm text-purple-600 font-bold mb-1">CodeBlock</p>
                    <p className="text-purple-700 font-semibold">✓ {language === "ja" ? "やさしくステップアップ" : "Gentle step-by-step progression"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 追加の差別化ポイント */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-5 shadow-md text-center">
                <div className="text-3xl mb-2">🐸</div>
                <p className="text-sm font-semibold text-gray-800">
                  {language === "ja" ? "キャラクターと一緒に学べる" : "Learn with characters"}
                </p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-md text-center">
                <div className="text-3xl mb-2">📱</div>
                <p className="text-sm font-semibold text-gray-800">
                  {language === "ja" ? "スマホでもタブレットでもOK" : "Works on phone & tablet"}
                </p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-md text-center">
                <div className="text-3xl mb-2">🔄</div>
                <p className="text-sm font-semibold text-gray-800">
                  {language === "ja" ? "間隔反復学習で定着する" : "Spaced repetition for retention"}
                </p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-md text-center">
                <div className="text-3xl mb-2">🏆</div>
                <p className="text-sm font-semibold text-gray-800">
                  {language === "ja" ? "XPやバッジでモチベーション維持" : "XP & badges maintain motivation"}
                </p>
              </div>
            </div>
          </div>

          {/* CTAボタン */}
          <div className="text-center">
            <Link
              href="/login?mode=register"
              className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-lg md:text-xl py-4 px-10 rounded-full shadow-lg transform hover:scale-105 transition-all"
            >
              {language === "ja" ? "無料で始める 🚀" : "Start Free 🚀"}
            </Link>
          </div>
        </div>
      </section>

      {/* ゲーミフィケーション機能セクション */}
      <section className="py-16 px-4 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            {language === "ja" ? "🎮 ゲームのように楽しく学べる" : "🎮 Learn Like a Game"}
          </h2>
          <p className="text-center text-gray-600 mb-12">
            {language === "ja" 
              ? "XPやレベルアップで、学習がもっと楽しくなる！" 
              : "XP and level-ups make learning more fun!"}
          </p>
          
          <div className="flex justify-center mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
              {/* XPシステム */}
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {language === "ja" ? "XPシステム" : "XP System"}
              </h3>
              <ul className="text-sm text-gray-600 space-y-1 text-left">
                <li>• {language === "ja" ? "1問正解 = 10XP" : "1 correct = 10XP"}</li>
                <li>• {language === "ja" ? "レッスン完了 = 50XP" : "Lesson complete = 50XP"}</li>
                <li>• {language === "ja" ? "復習完了 = 20XP" : "Review complete = 20XP"}</li>
              </ul>
            </div>

            {/* レベルシステム */}
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {language === "ja" ? "レベルシステム" : "Level System"}
              </h3>
              <p className="text-sm text-gray-600">
                {language === "ja" 
                  ? "Lv.1 ビギナーからレジェンドまで、段階的にレベルアップ！" 
                  : "Level up from Beginner to Legend!"}
              </p>
            </div>

            {/* ストリークボーナス */}
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="text-4xl mb-4">🔥</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {language === "ja" ? "ストリークボーナス" : "Streak Bonus"}
              </h3>
              <p className="text-sm text-gray-600">
                {language === "ja" 
                  ? "3問連続正解ごとにボーナスXPがもらえる！" 
                  : "Get bonus XP for every 3 consecutive correct answers!"}
              </p>
            </div>
            </div>
          </div>

          {/* 実績・バッジシステム */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
              {language === "ja" ? "🏆 実績・バッジシステム" : "🏆 Achievements & Badges"}
            </h3>
            <p className="text-center text-gray-600 mb-6">
              {language === "ja" 
                ? "たくさんの実績を集めて、学習のモチベーションを上げよう！（順次追加）" 
                : "Collect many achievements to boost your motivation! (More coming soon)"}
            </p>
            
            <div className="grid md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-3xl mb-2">🌱</div>
                <div className="text-sm font-bold text-gray-700">
                  {language === "ja" ? "学習進捗" : "Progress"}
                </div>
                <div className="text-xs text-gray-500 mt-1">10種類</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🔥</div>
                <div className="text-sm font-bold text-gray-700">
                  {language === "ja" ? "連続学習" : "Streaks"}
                </div>
                <div className="text-xs text-gray-500 mt-1">5種類</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">✅</div>
                <div className="text-sm font-bold text-gray-700">
                  {language === "ja" ? "正解数" : "Correct"}
                </div>
                <div className="text-xs text-gray-500 mt-1">5種類</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-sm font-bold text-gray-700">
                  {language === "ja" ? "XP・レベル" : "XP & Level"}
                </div>
                <div className="text-xs text-gray-500 mt-1">5種類</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">💯</div>
                <div className="text-sm font-bold text-gray-700">
                  {language === "ja" ? "チャレンジ" : "Challenges"}
                </div>
                <div className="text-xs text-gray-500 mt-1">9種類</div>
              </div>
            </div>
            
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 text-center">
                {language === "ja" 
                  ? "例: 「はじめの一歩」「連続学習30日」「パーフェクト」「スピードスター」など" 
                  : "Examples: 'First Step', '30-Day Streak', 'Perfect', 'Speed Star', etc."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* キャラクター紹介セクション */}
      <section className="py-16 px-4 bg-purple-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            {language === "ja" ? "なかまたち" : "Meet the Characters"}
          </h2>
          <p className="text-center text-gray-600 mb-12">
            {language === "ja" 
              ? <>個性豊かなキャラクターたちが、きみの<FW word="学習" />をサポートするよ！</> 
              : "Unique characters will support your learning journey!"}
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {/* コーディ */}
            <div className="relative rounded-2xl shadow-lg overflow-hidden w-80 h-96 bg-green-100">
              <Image
                src="/images/characters/cody.png"
                alt="コーディ"
                width={320}
                height={384}
                className="w-full h-full object-cover"
                unoptimized
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  if (target.parentElement) {
                    const fallback = document.createElement('div');
                    fallback.className = 'w-full h-full flex items-center justify-center text-9xl';
                    fallback.textContent = '🐸';
                    target.parentElement.appendChild(fallback);
                  }
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">
                  {language === "ja" ? "コーディ" : "Cody"}
                </h3>
                <p className="text-sm leading-relaxed">
                  {language === "ja" 
                    ? "プログラミングの基本を教えてくれる、元気いっぱいのヘビ！" 
                    : "An energetic snake who teaches programming basics!"}
                </p>
              </div>
            </div>
            
            {/* ディジー */}
            <div className="relative rounded-2xl shadow-lg overflow-hidden w-80 h-96 bg-blue-100">
              <Image
                src="/images/characters/dizzy.png"
                alt="ディジー"
                width={320}
                height={384}
                className="w-full h-full object-cover"
                unoptimized
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  if (target.parentElement) {
                    const fallback = document.createElement('div');
                    fallback.className = 'w-full h-full flex items-center justify-center text-9xl';
                    fallback.textContent = '🐕';
                    target.parentElement.appendChild(fallback);
                  }
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">
                  {language === "ja" ? "ディジー" : "Diggy"}
                </h3>
                <p className="text-sm leading-relaxed">
                  {language === "ja" 
                    ? "変数について楽しく教えてくれる、好奇心旺盛な仲間！" 
                    : "A curious friend who teaches variables in a fun way!"}
                </p>
              </div>
            </div>
            
            {/* デックス */}
            <div className="relative rounded-2xl shadow-lg overflow-hidden w-80 h-96 bg-gray-100">
              <Image
                src="/images/characters/dex.png"
                alt="デックス"
                width={320}
                height={384}
                className="w-full h-full object-cover"
                unoptimized
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  if (target.parentElement) {
                    const fallback = document.createElement('div');
                    fallback.className = 'w-full h-full flex items-center justify-center text-9xl';
                    fallback.textContent = '🤖';
                    target.parentElement.appendChild(fallback);
                  }
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">
                  {language === "ja" ? "デックス" : "Dex"}
                </h3>
                <p className="text-sm leading-relaxed">
                  {language === "ja" 
                    ? "データ型を論理的に教えてくれる、頼れるロボット！" 
                    : "A reliable robot who teaches data types logically!"}
                </p>
              </div>
            </div>
          </div>
          
          {/* その他のキャラクターの予告 */}
          <p className="text-center text-gray-500 mt-8">
            {language === "ja" 
              ? "他にもたくさんのなかまが待っているよ...！" 
              : "Many more friends are waiting for you...!"}
          </p>
        </div>
      </section>

      {/* 学習の流れセクション */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            {language === "ja" ? <><FW word="学習" />の流れ</> : "How It Works"}
          </h2>
          <p className="text-center text-gray-600 mb-12">
            {language === "ja" 
              ? "4つのステップでプログラミングをマスターしよう！" 
              : "Master programming in 4 simple steps!"}
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* ステップ1: チュートリアル */}
            <div className="relative">
              <div className="bg-purple-100 rounded-2xl p-6 text-center h-full">
                <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {language === "ja" ? "チュートリアルで学ぶ" : "Learn with Tutorials"}
                </h3>
                <p className="text-gray-600 text-sm">
                  {language === "ja" 
                    ? "キャラクターがやさしく解説。新しい概念をわかりやすく説明してくれるよ！" 
                    : "Characters explain concepts in an easy-to-understand way!"}
                </p>
              </div>
              {/* 矢印（PC表示のみ） */}
              <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-purple-400 text-2xl">
                →
              </div>
            </div>
            
            {/* ステップ2: 問題に挑戦 */}
            <div className="relative">
              <div className="bg-green-100 rounded-2xl p-6 text-center h-full">
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {language === "ja" ? <>ブロックで<FW word="問題" />を解く</> : "Solve with Blocks"}
                </h3>
                <p className="text-gray-600 text-sm">
                  {language === "ja" 
                    ? "ドラッグ＆ドロップでコードを組み立て。タイピングなしでプログラミング！" 
                    : "Build code with drag & drop. No typing required!"}
                </p>
              </div>
              {/* 矢印（PC表示のみ） */}
              <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-green-400 text-2xl">
                →
              </div>
            </div>
            
            {/* ステップ3: ヒントをもらう */}
            <div className="relative">
              <div className="bg-yellow-100 rounded-2xl p-6 text-center h-full">
                <div className="w-12 h-12 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {language === "ja" ? "困ったらヒントをもらう" : "Get Hints When Stuck"}
                </h3>
                <p className="text-gray-600 text-sm">
                  {language === "ja" 
                    ? "わからなくても大丈夫！AIがキャラクターになってヒントを教えてくれるよ" 
                    : "Don't worry if you're stuck! AI characters will give you hints"}
                </p>
              </div>
              {/* 矢印（PC表示のみ） */}
              <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-yellow-400 text-2xl">
                →
              </div>
            </div>
            
            {/* ステップ4: 復習で定着 */}
            <div className="relative">
              <div className="bg-blue-50 rounded-2xl p-6 text-center h-full">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  4
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {language === "ja" ? "復習で定着させる" : "Review to Master"}
                </h3>
                <p className="text-gray-600 text-sm">
                  {language === "ja" 
                    ? <>AIが最適なタイミングで<FW word="復習" /><FW word="問題" />を出題。忘れる前に思い出して、<FW word="知識" />をしっかり定着させよう！</> 
                    : "AI provides review questions at optimal times. Remember before you forget and solidify your knowledge!"}
                </p>
              </div>
            </div>
          </div>
          
          {/* 追加説明 */}
          <div className="mt-12 bg-gray-50 rounded-2xl p-6 text-center">
            <p className="text-gray-700">
              {language === "ja" 
                ? "🎮 問題を解くとXPがもらえる！レベルアップを目指して楽しく学ぼう！" 
                : "🎮 Earn XP by solving problems! Level up while having fun!"}
            </p>
          </div>
        </div>
      </section>

      {/* スマート復習システムセクション */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            {language === "ja" ? "スマート復習システム" : "Smart Review System"}
          </h2>
          <p className="text-center text-gray-600 mb-4">
            {language === "ja" 
              ? "エビングハウスの忘却曲線に基づいた、科学的な復習システム" 
              : "Scientific review system based on Ebbinghaus' forgetting curve"}
          </p>
          <p className="text-center text-sm text-gray-500 mb-12">
            {language === "ja" 
              ? "AIが最適なタイミングで復習問題を出題し、知識をしっかり定着させます" 
              : "AI provides review questions at optimal times to solidify your knowledge"}
          </p>

          {/* 復習間隔の説明 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {language === "ja" ? "📅 自動調整される復習間隔" : "📅 Auto-Adjusted Review Intervals"}
            </h3>
            <div className="grid md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl mb-2">🔴</div>
                <div className="font-bold text-gray-800 text-sm mb-1">
                  {language === "ja" ? "未定着" : "New"}
                </div>
                <div className="text-xs text-gray-600">
                  {language === "ja" ? "1日後" : "1 day"}
                </div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl mb-2">🟠</div>
                <div className="font-bold text-gray-800 text-sm mb-1">
                  {language === "ja" ? "学習中" : "Learning"}
                </div>
                <div className="text-xs text-gray-600">
                  {language === "ja" ? "3日後" : "3 days"}
                </div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl mb-2">🟡</div>
                <div className="font-bold text-gray-800 text-sm mb-1">
                  {language === "ja" ? "定着中" : "Solidifying"}
                </div>
                <div className="text-xs text-gray-600">
                  {language === "ja" ? "1週間後" : "1 week"}
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl mb-2">🟢</div>
                <div className="font-bold text-gray-800 text-sm mb-1">
                  {language === "ja" ? "定着済み" : "Mastered"}
                </div>
                <div className="text-xs text-gray-600">
                  {language === "ja" ? "2週間後" : "2 weeks"}
                </div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl mb-2">⭐</div>
                <div className="font-bold text-gray-800 text-sm mb-1">
                  {language === "ja" ? "マスター" : "Expert"}
                </div>
                <div className="text-xs text-gray-600">
                  {language === "ja" ? "1ヶ月後" : "1 month"}
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-gray-600 mt-6">
              {language === "ja" 
                ? "連続正解数に応じて、復習間隔が自動的に延長されます" 
                : "Review intervals automatically extend based on consecutive correct answers"}
            </p>
          </div>
        </div>
      </section>

      {/* 保護者向けセクション */}
      <section className="py-16 px-4 bg-purple-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            {language === "ja" ? "保護者の方へ" : "For Parents"}
          </h2>
          <p className="text-center text-gray-600 mb-12">
            {language === "ja" 
              ? "お子さまの学習を安心してサポートできる環境をご用意しています" 
              : "We provide a safe and supportive learning environment for your child"}
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* 安心ポイント1 */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  {language === "ja" ? "安心・安全な環境" : "Safe & Secure"}
                </h3>
              </div>
              <p className="text-gray-600 text-sm">
                {language === "ja" 
                  ? "広告なし、外部リンクなしの安全な学習環境です。お子さまが安心して学習に集中できます。" 
                  : "An ad-free, link-free safe learning environment where your child can focus on learning."}
              </p>
            </div>
            
            {/* 安心ポイント2 */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  {language === "ja" ? "教育的なカリキュラム" : "Educational Curriculum"}
                </h3>
              </div>
              <p className="text-gray-600 text-sm">
                {language === "ja" 
                  ? "プログラミング教育の専門家が監修したカリキュラム。基礎から応用まで段階的に学べます。" 
                  : "Curriculum supervised by programming education experts. Learn step by step from basics to advanced."}
              </p>
            </div>
            
            {/* 安心ポイント3 */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  {language === "ja" ? "自分のペースで学習" : "Learn at Your Own Pace"}
                </h3>
              </div>
              <p className="text-gray-600 text-sm">
                {language === "ja" 
                  ? "時間制限なし。お子さまが自分のペースで、何度でも繰り返し学習できます。" 
                  : "No time limits. Your child can learn at their own pace and review as many times as needed."}
              </p>
            </div>
            
            {/* 安心ポイント4 */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💡</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  {language === "ja" ? "つまずいても安心" : "Support When Stuck"}
                </h3>
              </div>
              <p className="text-gray-600 text-sm">
                {language === "ja" 
                  ? "AIがキャラクターとしてヒントを提供。答えを教えるのではなく、考え方を導くので、自分で解く力が身につきます。" 
                  : "AI characters provide hints. Instead of giving answers, they guide thinking so children develop problem-solving skills."}
              </p>
            </div>
            
            {/* 安心ポイント5 */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  {language === "ja" ? "達成感を実感" : "Sense of Achievement"}
                </h3>
              </div>
              <p className="text-gray-600 text-sm">
                {language === "ja" 
                  ? "XPやレベルアップ機能で、学習の成果を実感できます。お子さまのやる気を引き出します。" 
                  : "XP and level-up features let children see their progress, boosting motivation."}
              </p>
            </div>
            
            {/* 安心ポイント6 */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🌱</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  {language === "ja" ? "将来につながるスキル" : "Skills for the Future"}
                </h3>
              </div>
              <p className="text-gray-600 text-sm">
                {language === "ja" 
                  ? "Pythonは世界で最も人気のあるプログラミング言語の一つ。今から学ぶことで、将来の選択肢が広がります。" 
                  : "Python is one of the world's most popular programming languages. Learning it now opens future opportunities."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 料金プランセクション */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            {language === "ja" ? "料金プラン" : "Pricing"}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* 月額プラン */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 flex flex-col h-full">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {language === "ja" ? "月額プラン" : "Monthly Plan"}
                </h3>
                <div className="text-4xl font-bold text-gray-800">
                  ¥980
                  <span className="text-lg font-normal text-gray-500">/月</span>
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  {language === "ja" ? "いつでも解約OK" : "Cancel anytime"}
                </p>
              </div>
              <ul className="space-y-3 mb-6 text-sm flex-1">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">
                    {language === "ja" ? "すべてのレッスン" : "All lessons"}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">
                    {language === "ja" ? "AIヒント機能" : "AI Hints"}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">
                    {language === "ja" ? "新レッスンも追加予定" : "New lessons coming"}
                  </span>
                </li>
              </ul>
              <Link
                href="/login?mode=register"
                className="mt-auto block w-full text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-full transition-colors text-sm"
              >
                {language === "ja" ? "月額で始める" : "Start Monthly"}
              </Link>
            </div>
            
            {/* 年間プラン（おすすめ） */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-6 shadow-lg border-2 border-purple-400 relative flex flex-col h-full">
              {/* おすすめバッジ */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-orange-500 text-white text-xs font-bold py-1 px-3 rounded-full">
                  {language === "ja" ? "おすすめ" : "Recommended"}
                </span>
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-white mb-2">
                  {language === "ja" ? "年間プラン" : "Annual Plan"}
                </h3>
                <div className="text-4xl font-bold text-white">
                  ¥6,800
                </div>
                <p className="text-purple-200 text-sm mt-1">
                  {language === "ja" ? "月あたり567円" : "¥567/mo"}
                </p>
                <p className="text-yellow-300 text-xs font-bold mt-1">
                  {language === "ja" ? "42%お得" : "42% off"}
                </p>
              </div>
              <ul className="space-y-3 mb-6 text-sm flex-1">
                <li className="flex items-center gap-2">
                  <span className="text-yellow-300">✓</span>
                  <span className="text-white">
                    {language === "ja" ? "すべてのレッスン" : "All lessons"}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-yellow-300">✓</span>
                  <span className="text-white">
                    {language === "ja" ? "AIヒント機能" : "AI Hints"}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-yellow-300">✓</span>
                  <span className="text-white">
                    {language === "ja" ? "新レッスンも追加予定" : "New lessons coming"}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-yellow-300">✓</span>
                  <span className="text-white font-bold">
                    {language === "ja" ? "1年間利用可能" : "1 year access"}
                  </span>
                </li>
              </ul>
              <Link
                href="/login?mode=register"
                className="mt-auto block w-full text-center bg-white hover:bg-purple-100 text-purple-600 font-bold py-3 px-4 rounded-full transition-colors text-sm"
              >
                {language === "ja" ? "年間プランで始める" : "Start Annual"}
              </Link>
            </div>
          </div>
          
          {/* 無料で始めるボタン */}
          <div className="mt-10 text-center">
            <p className="text-gray-600 mb-4">
              {language === "ja" 
                ? "まずは無料でお試し！レッスン1-1〜1-3が無料で遊べます" 
                : "Try for free! Lessons 1-1 to 1-3 are free"}
            </p>
            <Link
              href="/login?mode=register"
              className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold text-lg py-4 px-10 rounded-full shadow-lg transform hover:scale-105 transition-all"
            >
              {language === "ja" ? "🎮 無料で始める" : "🎮 Start Free"}
            </Link>
          </div>
          
          {/* 注釈 */}
          <p className="text-center text-gray-500 text-sm mt-8">
            {language === "ja" 
              ? "※ 料金は税込みです。有料プランはいつでもキャンセル可能です。" 
              : "※ Prices include tax. Paid plans can be cancelled anytime."}
          </p>
        </div>
      </section>

      {/* 運営者情報セクション */}
      <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-4">
            <F reading="うんえいしゃ">運営者について</F>
          </h2>
          
          {/* 運営者名とキャッチコピー */}
          <div className="text-center mb-8 md:mb-12">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
              プログラミングスクール plus one
            </h3>
            <p className="text-base md:text-lg text-gray-600 italic">
              〜一つ一つの成長を大事に。〜
            </p>
          </div>

          {/* 私たちの想い */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg mb-8 md:mb-12 max-w-4xl mx-auto">
            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 text-center">
              {language === "ja" ? "私たちの想い" : "Our Mission"}
            </h3>
            <p className="text-gray-700 leading-relaxed text-center text-sm md:text-base">
              {language === "ja" 
                ? "CodeBlockは、実際のプログラミング教室で子どもたちを指導している現役講師が開発した学習アプリです。教室での指導経験を通じて、子どもたちがつまずきやすいポイントや、楽しく学べる方法を日々研究してきました。その経験を活かし、お子さま一人ひとりの「わからない」に寄り添い、一つ一つの成長を大切にできるよう、CodeBlockを開発いたしました。プログラミングは難しいものではなく、楽しく学べるもの。その想いを込めて、お子さまの学習をサポートします。"
                : "CodeBlock is a learning app developed by active instructors who teach children in real programming classrooms. Through our teaching experience, we've researched the points where children struggle and ways to make learning fun. We've developed CodeBlock to support each child's individual learning journey, valuing every step of growth. Programming isn't difficult—it's something that can be learned with joy. We support your child's learning with this belief."}
            </p>
          </div>

          {/* 連絡先 */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg mb-6 md:mb-8 max-w-2xl mx-auto">
            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6 text-center">
              {language === "ja" ? "お問い合わせ" : "Contact Us"}
            </h3>
            <div className="space-y-4">
              {/* メールアドレス */}
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-purple-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a 
                  href="mailto:plus.one.0312.0717@gmail.com" 
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm md:text-base break-all"
                >
                  plus.one.0312.0717@gmail.com
                </a>
              </div>
              
              {/* 公式サイト */}
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-purple-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <a 
                  href="https://plus-one-naruse.com/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm md:text-base"
                >
                  {language === "ja" ? "公式サイト" : "Official Website"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* よくある質問セクション */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            {language === "ja" ? "よくある質問" : "FAQ"}
          </h2>
          
          <div className="space-y-4">
            {/* Q1 */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span className="text-purple-600">Q.</span>
                {language === "ja" ? "対象年齢は何歳ですか？" : "What age is this for?"}
              </h3>
              <p className="text-gray-600 pl-6">
                {language === "ja" 
                  ? "10〜15歳を主な対象としていますが、プログラミング初心者の方であれば年齢問わずお使いいただけます。ふりがな機能もあるので、漢字が苦手なお子さまでも安心です。" 
                  : "Mainly designed for ages 10-15, but anyone new to programming can use it. The furigana feature helps younger children read kanji."}
              </p>
            </div>
            
            {/* Q2 */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span className="text-purple-600">Q.</span>
                {language === "ja" ? "プログラミング未経験でも大丈夫？" : "Can beginners use this?"}
              </h3>
              <p className="text-gray-600 pl-6">
                {language === "ja" 
                  ? "はい、大丈夫です！CodeBlockはプログラミング未経験のお子さま向けに作られています。ドラッグ＆ドロップでコードを組み立てるので、タイピングが苦手でも楽しく学べます。" 
                  : "Yes! CodeBlock is designed for complete beginners. Build code with drag & drop, so typing skills aren't needed."}
              </p>
            </div>
            
            {/* Q3 */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span className="text-purple-600">Q.</span>
                {language === "ja" ? "スマホやタブレットでも使えますか？" : "Does it work on phones and tablets?"}
              </h3>
              <p className="text-gray-600 pl-6">
                {language === "ja" 
                  ? "はい、スマートフォンやタブレットのブラウザからご利用いただけます。ただし、画面が大きいパソコンやタブレットでの学習をおすすめします。" 
                  : "Yes, it works on smartphone and tablet browsers. However, we recommend using a computer or tablet with a larger screen for the best experience."}
              </p>
            </div>
            
            {/* Q4 */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span className="text-purple-600">Q.</span>
                {language === "ja" ? "無料でどこまで遊べますか？" : "What's included for free?"}
              </h3>
              <p className="text-gray-600 pl-6">
                {language === "ja" 
                  ? "無料でレッスン1-1〜1-3まで学習できます。print関数の基本を学び、プログラミングの楽しさを体験できます。気に入ったら有料プランでさらに学習を進めましょう！" 
                  : "Lessons 1-1 to 1-3 are free. Learn the basics of the print function and experience the fun of programming. Upgrade to a paid plan to continue learning!"}
              </p>
            </div>
            
            {/* Q5 */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span className="text-purple-600">Q.</span>
                {language === "ja" ? "支払い方法は何がありますか？" : "What payment methods are accepted?"}
              </h3>
              <p className="text-gray-600 pl-6">
                {language === "ja" 
                  ? "クレジットカード（Visa、Mastercard、JCB、American Express）でお支払いいただけます。" 
                  : "We accept credit cards (Visa, Mastercard, JCB, American Express)."}
              </p>
            </div>
            
            {/* Q6 */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span className="text-purple-600">Q.</span>
                {language === "ja" ? "解約はいつでもできますか？" : "Can I cancel anytime?"}
              </h3>
              <p className="text-gray-600 pl-6">
                {language === "ja" 
                  ? "はい、いつでも解約できます。解約後も契約期間中はサービスをご利用いただけます。" 
                  : "Yes, you can cancel anytime. You'll still have access until the end of your billing period."}
              </p>
            </div>
            
            {/* Q7 */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span className="text-purple-600">Q.</span>
                {language === "ja" ? "学校や塾で使うことはできますか？" : "Can schools or tutoring centers use this?"}
              </h3>
              <p className="text-gray-600 pl-6">
                {language === "ja" 
                  ? "はい、教育機関でのご利用も歓迎です。団体向けプランについてはお問い合わせください。" 
                  : "Yes, educational institutions are welcome to use CodeBlock. Please contact us for group plans."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          {language === "ja" ? "さあ、はじめよう！" : "Let's Get Started!"}
        </h2>
        <p className="text-purple-100 mb-8">
          {language === "ja" ? "無料でアカウントを作成して、今すぐ学習スタート" : "Create a free account and start learning today"}
        </p>
        <Link
          href="/login?mode=register"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold text-xl py-4 px-10 rounded-full shadow-lg transform hover:scale-105 transition-all"
        >
          {language === "ja" ? "無料で始める 🚀" : "Start Free 🚀"}
        </Link>
      </section>

      {/* フッター */}
      <footer className="py-8 px-4 bg-gray-800 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Image src="/logo.png" alt="CodeBlock ロゴ" width={32} height={32} className="rounded-full" />
          <span className="text-xl font-bold text-white">CodeBlock</span>
        </div>
        <p className="text-gray-400 text-sm">
          © 2024 CodeBlock. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default function Home() {
  const router = useRouter();
  const { user, userId, displayName, contactEmail, loading, progressLoaded, canAccessLesson, userProfile } = useAuth();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedLessonNumber, setSelectedLessonNumber] = useState(0);
  const { language } = useLanguage();
  
  // すべてのフックを先に宣言（条件分岐の前に）
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [totalXP, setTotalXP] = useState(0);
  const [levelInfo, setLevelInfo] = useState({ level: 1, name: "ビギナー", minXP: 0, maxXP: 99 });
  const [levelProgress, setLevelProgress] = useState(0);
  const [xpToNext, setXpToNext] = useState(100);
  const [highestStreak, setHighestStreak] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [showEmailBanner, setShowEmailBanner] = useState(() => {
    if (typeof window === "undefined") return true;
    const dismissed = localStorage.getItem("email-banner-dismissed");
    return dismissed !== "true";
  });
  const [debugXP, setDebugXP] = useState("");
  const [debugLessonId, setDebugLessonId] = useState("");
  const [resumeStatus, setResumeStatus] = useState<Record<string, boolean>>({});
  const [debugStartLessonId, setDebugStartLessonId] = useState("");
  const [debugStartMission, setDebugStartMission] = useState("");
  const [lastOpenedMission, setLastOpenedMission] = useState<LastOpenedMission | null>(null);
  const [unitImageErrors, setUnitImageErrors] = useState<Record<number, boolean>>({});
  const [unitImageFallback, setUnitImageFallback] = useState<Record<number, boolean>>({});
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [currentAchievementIndex, setCurrentAchievementIndex] = useState(0);
  const [dailyChallengeState, setDailyChallengeState] = useState<DailyChallengeState | null>(null);
  const [dailyChallengeStats, setDailyChallengeStats] = useState<DailyChallengeStats | null>(null);
  const [debugStreak, setDebugStreakInput] = useState<string>('7');
  const [dailyDebugInfo, setDailyDebugInfo] = useState<string>('');


  useEffect(() => {
    if (!progressLoaded) return;
    
    const progress = getProgress();
    setTotalXP(progress.totalXP);
    setCompletedLessons(progress.completedLessons);
    setLevelInfo(getLevelInfo(progress.totalXP));
    setLevelProgress(getLevelProgress(progress.totalXP));
    setXpToNext(getXPToNextLevel(progress.totalXP));
    setHighestStreak(progress.highestStreak);
    
    // デイリーチャレンジの状態を取得
    const challengeState = getDailyChallengeState();
    const challengeStats = getDailyChallengeStats();
    setDailyChallengeState(challengeState);
    setDailyChallengeStats(challengeStats);
  }, [progressLoaded]);

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
    if (!progressLoaded) return;
    
    // 各レッスンの途中データ有無をチェック
    if (typeof window === "undefined") return;
    
    const status: Record<string, boolean> = {};
    lessons.forEach((lesson) => {
      // missionProgress_キーから進捗を確認
      const progressKey = `missionProgress_${lesson.id}`;
      const savedProgress = parseInt(localStorage.getItem(progressKey) || "0", 10);
      status[lesson.id] = savedProgress > 0;
    });
    setResumeStatus(status);
  }, [progressLoaded]);

  useEffect(() => {
    if (!progressLoaded) return;
    
    const lastMission = getLastOpenedMission();
    setLastOpenedMission(lastMission);
  }, [progressLoaded]);

  // 実績チェック
  useEffect(() => {
    const checkAchievements = async () => {
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists()) return;

        const userData = userDoc.data();
        const currentAchievements: string[] = userData.achievements || [];
        const pendingAchievements: string[] = userData.pendingAchievements || [];

        // 保留中のバッジがあれば表示
        if (pendingAchievements.length > 0) {
          const achievementsToShow = achievements.filter(a => 
            pendingAchievements.includes(a.id)
          );
          setNewAchievements(achievementsToShow);
          setShowAchievementModal(true);

          // 保留中のバッジを獲得済みに移動
          await updateDoc(doc(db, "users", user.uid), {
            achievements: [...currentAchievements, ...pendingAchievements],
            pendingAchievements: []
          });
        }
      } catch (error) {
        console.error("Failed to check achievements:", error);
      }
    };

    checkAchievements();
  }, [user]);

  // ユニット行のレンダリング用のuseMemo（すべてのフックの後に、早期リターンの前に配置）
  const unitRowsContent = useMemo(() => {
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
      // ユニットボタンの色定義を使用
      const unitColor = getUnitGradient(unit);

      // そのユニットに完了したレッスンがあるかチェック
      const hasCompletedLessons = completedLessons.some(lessonId => 
        lessons.find(l => l.id === lessonId)?.unitNumber === unit
      );

      // ユニットが完了した場合、画像を取得
      let characterImage: string | undefined;
      let fallbackImage: string | undefined; // フォールバック用（チュートリアルの画像）
      let characterEmoji: string | undefined;
      if (isUnitComplete && unitLessons.length > 0) {
        // ユニット専用画像を優先的に使用
        const unitImagePath = `/images/characters/unit-${String(unit).padStart(2, '0')}.png`;
        characterImage = unitImagePath;
        
        // フォールバック用に最初のレッスンのチュートリアル画像を取得
        const firstLesson = unitLessons[0];
        const tutorial = getTutorial(firstLesson.id);
        fallbackImage = tutorial?.characterImage;
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
                ? `bg-gradient-to-br ${unitColor} text-white ${unit === 1 ? 'overflow-hidden' : ''}`
                : completedInUnit > 0
                ? "bg-gradient-to-br from-yellow-400 to-amber-500 text-white"
                : "bg-gradient-to-br from-gray-300 to-gray-400 text-gray-600"
            }`}>
              {isUnitComplete && (() => {
                // ユニット1は元のサイズ（w-full h-full）、ユニット2以降は背景が見えるサイズ（w-10 h-10）
                const imageSize = unit === 1 ? 'w-full h-full' : 'w-10 h-10';
                const imageWidth = unit === 1 ? 48 : 40;
                const imageHeight = unit === 1 ? 48 : 40;
                
                // ユニット専用画像がエラーでなく、フォールバックも不要な場合
                if (characterImage && !unitImageErrors[unit] && !unitImageFallback[unit]) {
                  return (
                    <Image
                      src={characterImage}
                      alt="Character"
                      width={imageWidth}
                      height={imageHeight}
                      className={`object-contain ${imageSize}`}
                      unoptimized
                      onError={() => {
                        // ユニット専用画像が失敗した場合、フォールバックを試す
                        setUnitImageFallback(prev => ({ ...prev, [unit]: true }));
                      }}
                    />
                  );
                }
                // フォールバック画像を使用する場合
                if (unitImageFallback[unit] && fallbackImage && !unitImageErrors[unit]) {
                  return (
                    <Image
                      src={fallbackImage}
                      alt="Character"
                      width={imageWidth}
                      height={imageHeight}
                      className={`object-contain ${imageSize}`}
                      unoptimized
                      onError={() => {
                        setUnitImageErrors(prev => ({ ...prev, [unit]: true }));
                      }}
                    />
                  );
                }
                // 画像が使えない場合は絵文字またはユニット番号
                if (characterEmoji) {
                  return <span className="text-2xl">{characterEmoji}</span>;
                }
                return <span>{unit}</span>;
              })()}
            </div>
          </div>
        </div>
      );
    };

    // ユニット名を取得するヘルパー関数
    const getUnitName = (unit: number) => {
      if (unit === 1) return "print";
      if (unit === 2) return <FW word="変数" />;
      if (unit === 3) return <>データ<F reading="がた">型</F></>;
      if (unit === 4) return <>条件<F reading="ぶんき">分岐</F></>;
      if (unit === 5) return "ループ";
      if (unit === 6) return "リスト";
      if (unit === 7) return <><FW word="関数" />の<FW word="基本" /></>;
      if (unit === 8) return <><FW word="戻り値" />と<FW word="応用" /></>;
      return "";
    };

    return {
      allUnits,
      firstRowUnits,
      secondRowUnits,
      renderUnitPoint,
      getUnitName,
    };
  }, [completedLessons, lessons, unitImageErrors, unitImageFallback]);

  const handleLogout = async () => {
    const confirmed = window.confirm("本当にログアウトしますか？");
    if (!confirmed) return;
    
    try {
      await logout();
    } catch (error) {
      console.error("ログアウトエラー:", error);
    }
  };

  // ローディング中または未ログイン時の表示（すべてのフックの後に配置）
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-400 to-purple-600">
        <div className="text-white text-xl">読み込み中...</div>
      </div>
    );
  }

  // 未ログイン時はランディングページを表示
  if (!user) {
    return <LandingPage />;
  }

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
    
    const lesson = getLesson(lessonId);
    if (!lesson) return;
    
    const lessonNumber = lesson.unitNumber;
    
    // アクセス権限チェック
    const hasAccess = canAccessLesson(lessonNumber);
    if (!hasAccess) {
      setSelectedLessonNumber(lessonNumber);
      setShowUpgradeModal(true);
      return;
    }
    
    const savedMission = localStorage.getItem(`lesson-${lessonId}-mission`);
    
    if (savedMission && parseInt(savedMission) > 0) {
      // 途中データあり → 直接エディターへ
      router.push(`/lesson/${lessonId}/editor`);
    } else {
      // 新規 → チュートリアルへ
      router.push(`/lesson/${lessonId}`);
    }
  };

  // チャレンジ開始ハンドラ
  const handleStartDailyChallenge = () => {
    const progressStr = localStorage.getItem('codeblock-progress');
    const userProgress = progressStr ? JSON.parse(progressStr).completedLessons?.reduce((acc: Record<string, boolean>, id: string) => {
      acc[id] = true;
      return acc;
    }, {}) : null;
    
    const newChallenge = generateNewDailyChallenge(userProgress);
    setDailyChallengeState(newChallenge);
    
    router.push('/daily-challenge');
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


  // 進捗データのローディング中の表示
  if (!progressLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-100 via-purple-50 to-pink-100">
        <div className="text-xl text-gray-700">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-purple-50 to-pink-100 pb-20">
      {/* 2カラムレイアウト（デスクトップ） */}
      <div className="pt-6 px-4 pb-4">
        <div className="max-w-6xl mx-auto">
          {/* ヘッダー：ロゴとユーザー情報 */}
          <header className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-left flex items-center gap-2" style={{ color: '#333333' }}>
              <Image src="/logo.png" alt="CodeBlock ロゴ" width={32} height={32} className="rounded-full" />
              CodeBlock
            </h1>
            {!loading && (
              user ? (
                <button
                  onClick={handleLogout}
                  className="text-lg font-bold bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 px-4 py-2 rounded-full transition-colors"
                >
                  ログアウト
                </button>
              ) : (
                <Link
                  href="/login"
                  className="text-lg font-bold bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full transition-colors"
                >
                  ログイン
                </Link>
              )
            )}
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* 左カラム：ステータスカード + 前回の続き（1/3幅） */}
            <div className="space-y-4 md:col-span-1">
              
              {/* メール設定促進バナー */}
              {user && !contactEmail && showEmailBanner && (
                <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✉️</span>
                    <span className="text-sm font-bold text-blue-800">
                      メールアドレスを設定しよう！
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Link
                      href="/options"
                      className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-1 px-3 rounded-lg"
                    >
                      設定する
                    </Link>
                    <button
                      onClick={() => {
                        setShowEmailBanner(false);
                        localStorage.setItem("email-banner-dismissed", "true");
                      }}
                      className="text-gray-400 hover:text-gray-600 ml-1 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
              
              {/* ステータスカード */}
              <div className="bg-white rounded-2xl shadow-lg p-5 border-2 border-yellow-200">
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
                  <div className="flex items-center gap-2">
                    {user && (
                      <div className="text-lg font-bold text-gray-600">
                        {displayName || userId || "ユーザー"}
                      </div>
                    )}
                    {highestStreak > 0 && (
                      <div className="flex items-center gap-1 bg-orange-100 px-3 py-1 rounded-full">
                        <span>🔥</span>
                        <span className="font-bold text-orange-600 text-sm">{highestStreak}</span>
                      </div>
                    )}
                  </div>
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

              {/* 前回の続き - コンパクト版 */}
              {lastOpenedMission && (() => {
                const lesson = getLesson(lastOpenedMission.lessonId);
                if (!lesson) return null;

                return (
                  <Link 
                    href={`/lesson/${lastOpenedMission.lessonId}/editor?mission=${lastOpenedMission.missionId}`}
                    className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full shadow-md transition-all"
                  >
                    <span>▶</span>
                    <span>前回の<FW word="続" />きから<FW word="学習" />する</span>
                  </Link>
                );
              })()}

              {/* デイリーチャレンジ */}
              {hasCompletedUnit1Basics() && dailyChallengeStats && (
                <div className="mb-6">
                  <DailyChallengeCard
                    state={dailyChallengeState}
                    stats={dailyChallengeStats}
                    onStart={handleStartDailyChallenge}
                  />
                </div>
              )}

              {/* 復習セクション */}
              {hasCompletedLesson1_7() && (
                <ReviewSection />
              )}
            </div>

            {/* 右カラム：レッスンカルーセル + 進捗マップ + ユニットボタン（2/3幅） */}
            <div className="space-y-4 md:col-span-2">
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
            const isProgressLocked = isLessonLocked(currentIndex);
            const isPremiumLocked = !canAccessLesson(lesson.unitNumber);
            const isLocked = isProgressLocked || isPremiumLocked;
            // ユニットボタンの色定義を使用
            const bgColor = isLocked ? "from-gray-400 to-gray-500" : getUnitGradient(lesson.unitNumber);

            return (
              <div className="mx-12">
                <div 
                  className={`bg-gradient-to-br ${bgColor} rounded-3xl p-6 shadow-xl text-white relative overflow-hidden min-h-[220px] flex flex-col ${isLocked ? 'cursor-pointer' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isPremiumLocked) {
                      setSelectedLessonNumber(lesson.unitNumber);
                      setShowUpgradeModal(true);
                    } else if (!isProgressLocked) {
                      handleLessonClick(lesson.id);
                    }
                  }}
                >
                  {/* 完了バッジ */}
                  {isCompleted && (
                    <div className="absolute top-0 right-0 bg-green-500 px-4 py-1 rounded-bl-2xl font-bold text-sm">
                      ✓ <FW word="完了" />
                    </div>
                  )}

                  {/* ロックアイコン */}
                  {isPremiumLocked && (
                    <div className="absolute top-0 right-0 bg-purple-600 px-4 py-1 rounded-bl-2xl font-bold text-sm">
                      🔒 有料プラン
                    </div>
                  )}
                  {isProgressLocked && !isPremiumLocked && (
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
                  <div className="mt-auto" onClick={(e) => {
                    // isPremiumLockedの場合は親のonClickに任せる（stopPropagationしない）
                    if (!isPremiumLocked) {
                      e.stopPropagation();
                    }
                  }}>
                    {isPremiumLocked ? (
                      <div className="inline-flex items-center justify-center w-full py-3 rounded-full font-bold text-lg bg-purple-600/50 text-white cursor-pointer whitespace-nowrap">
                        <span>🔒 有料プランで解放</span>
                      </div>
                    ) : isProgressLocked ? (
                      <div className="inline-flex items-center justify-center w-full py-3 rounded-full font-bold text-lg bg-gray-600/50 text-gray-300 cursor-not-allowed whitespace-nowrap">
                        <span>🔒 前のレッスンを<FW word="クリア" />しよう</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        {/* メインボタン */}
                        {isCompleted ? (
                          <Link
                            href={`/lesson/${lesson.id}/editor`}
                            className="inline-flex items-center justify-center w-full py-3 rounded-full font-bold text-xs sm:text-sm bg-white/30 hover:bg-white/40 text-white transition-all whitespace-nowrap"
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
                            <span>🚀 <FW word="学習" />する</span>
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

              {/* 進捗マップ */}
              <div className="px-4">
                <div className="flex justify-center items-center gap-1">
                  {lessons.map((lesson, index) => {
                    const isCompleted = completedLessons.includes(lesson.id);
                    const isCurrent = index === currentIndex;
                    const isLocked = isLessonLocked(index);
                    
                    // ユニットボタンの色定義を使用
                    const lessonColor = getUnitSolid(lesson.unitNumber);
                    
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

              {/* 道のり表示（ゲーミフィケーション風） */}
              <div className="mt-8">
                <div className="max-w-md mx-auto md:max-w-full">
                  <div className="space-y-6">
                    {/* 1行目: ユニット1-3 */}
                    <div className="relative">
                      <div className="relative grid grid-cols-3 gap-0">
                        {unitRowsContent.firstRowUnits.map((unit) => {
                          const unitLessons = lessons.filter(l => l.unitNumber === unit);
                          const completedInUnit = unitLessons.filter(l => completedLessons.includes(l.id)).length;
                          const isUnitComplete = completedInUnit === unitLessons.length && unitLessons.length > 0;
                          const unitProgress = unitLessons.length > 0 ? (completedInUnit / unitLessons.length) * 100 : 0;
                          
                          return (
                            <div key={unit} className="flex justify-center">
                              {unitRowsContent.renderUnitPoint(unit, unitLessons, completedInUnit, isUnitComplete, unitProgress, unitRowsContent.getUnitName(unit))}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 2行目: ユニット4-6 */}
                    {unitRowsContent.secondRowUnits.length > 0 && (
                      <div className="relative">
                        <div className="relative grid grid-cols-3 gap-0">
                          {unitRowsContent.secondRowUnits.slice(0, 3).map((unit) => {
                            const unitLessons = lessons.filter(l => l.unitNumber === unit);
                            const completedInUnit = unitLessons.filter(l => completedLessons.includes(l.id)).length;
                            const isUnitComplete = completedInUnit === unitLessons.length && unitLessons.length > 0;
                            const unitProgress = unitLessons.length > 0 ? (completedInUnit / unitLessons.length) * 100 : 0;
                            
                            return (
                              <div key={unit} className="flex justify-center">
                                {unitRowsContent.renderUnitPoint(unit, unitLessons, completedInUnit, isUnitComplete, unitProgress, unitRowsContent.getUnitName(unit))}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* 3行目: ユニット7以降（ある場合） */}
                    {unitRowsContent.secondRowUnits.length > 3 && (
                      <div className="relative">
                        <div className="relative grid grid-cols-3 gap-0">
                          {unitRowsContent.secondRowUnits.slice(3, 6).map((unit) => {
                            const unitLessons = lessons.filter(l => l.unitNumber === unit);
                            const completedInUnit = unitLessons.filter(l => completedLessons.includes(l.id)).length;
                            const isUnitComplete = completedInUnit === unitLessons.length && unitLessons.length > 0;
                            const unitProgress = unitLessons.length > 0 ? (completedInUnit / unitLessons.length) * 100 : 0;
                            
                            return (
                              <div key={unit} className="flex justify-center">
                                {unitRowsContent.renderUnitPoint(unit, unitLessons, completedInUnit, isUnitComplete, unitProgress, unitRowsContent.getUnitName(unit))}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
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

              {/* 復習データリセット */}
              <div className="mb-3">
                <label className="text-xs text-gray-600 block mb-1">復習データ</label>
                <div className="flex gap-1 mb-1">
                  <button
                    onClick={() => {
                      resetReviewData();
                      alert("復習データをリセットしました！");
                    }}
                    className="flex-1 bg-orange-500 text-white text-xs px-2 py-1 rounded hover:bg-orange-600"
                  >
                    リセット
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  復習待ち: {getReviewCount()}問
                </p>
              </div>

              {/* デイリーチャレンジ デバッグ */}
              <div className="border-t border-gray-300 pt-3 mt-3">
                <h3 className="font-bold text-xs text-yellow-600 mb-2">🎯 デイリーチャレンジ</h3>
                
                {/* デバッグ情報表示 */}
                <div className="bg-gray-100 p-2 rounded mb-2 text-xs max-h-32 overflow-auto">
                  <pre className="whitespace-pre-wrap">{dailyDebugInfo || '情報を更新してください'}</pre>
                </div>
                
                {/* 情報更新ボタン */}
                <button
                  onClick={() => {
                    const state = getDailyChallengeState();
                    const stats = getDailyChallengeStats();
                    const today = getTodayDateJST();
                    
                    const info = `
📅 今日の日付(JST): ${today}
📊 チャレンジ状態:
  - 日付: ${state?.date || 'なし'}
  - 完了: ${state?.completed ? 'はい' : 'いいえ'}
  - 現在の問題: ${state ? state.currentQuestion + 1 : 0}/3
  - 正解数: ${state?.correctCount || 0}
📈 統計:
  - 連続日数: ${stats.currentStreak}日
  - 最長連続: ${stats.longestStreak}日
  - 累計完了: ${stats.totalCompleted}回
  - 累計正解: ${stats.totalCorrect}問
  - 最終完了日: ${stats.lastCompletedDate || 'なし'}
  - バッジ: ${stats.badges.map(b => b.type).join(', ') || 'なし'}
                    `.trim();
                    
                    setDailyDebugInfo(info);
                    // 状態も更新
                    setDailyChallengeState(state);
                    setDailyChallengeStats(stats);
                  }}
                  className="w-full bg-gray-600 hover:bg-gray-500 text-white text-xs py-1 px-2 rounded mb-2"
                >
                  🔄 情報を更新
                </button>
                
                {/* チャレンジ状態リセット */}
                <button
                  onClick={() => {
                    resetDailyChallengeState();
                    const state = getDailyChallengeState();
                    const stats = getDailyChallengeStats();
                    setDailyChallengeState(state);
                    setDailyChallengeStats(stats);
                    alert('デイリーチャレンジの状態をリセットしました');
                    // 情報も更新
                    const today = getTodayDateJST();
                    const info = `
📅 今日の日付(JST): ${today}
📊 チャレンジ状態: リセット済み
📈 統計:
  - 連続日数: ${stats.currentStreak}日
  - 最長連続: ${stats.longestStreak}日
                    `.trim();
                    setDailyDebugInfo(info);
                  }}
                  className="w-full bg-orange-500 hover:bg-orange-400 text-white text-xs py-1 px-2 rounded mb-1"
                >
                  🗑️ 今日のチャレンジをリセット
                </button>
                
                {/* 統計リセット */}
                <button
                  onClick={() => {
                    if (confirm('統計データをすべてリセットしますか？')) {
                      resetDailyChallengeStats();
                      const stats = getDailyChallengeStats();
                      setDailyChallengeStats(stats);
                      const today = getTodayDateJST();
                      const info = `
📅 今日の日付(JST): ${today}
📊 チャレンジ状態: ${getDailyChallengeState()?.date || 'なし'}
📈 統計: リセット済み
                      `.trim();
                      setDailyDebugInfo(info);
                      alert('統計データをリセットしました');
                    }
                  }}
                  className="w-full bg-red-500 hover:bg-red-400 text-white text-xs py-1 px-2 rounded mb-2"
                >
                  ⚠️ 統計を完全リセット
                </button>
                
                {/* 連続日数設定 */}
                <div className="flex gap-1 mb-1">
                  <input
                    type="number"
                    value={debugStreak}
                    onChange={(e) => setDebugStreakInput(e.target.value)}
                    className="flex-1 bg-gray-50 border rounded px-2 py-1 text-xs"
                    placeholder="連続日数"
                    min="0"
                    max="100"
                  />
                  <button
                    onClick={() => {
                      const streak = parseInt(debugStreak) || 0;
                      setDebugStreak(streak);
                      const stats = getDailyChallengeStats();
                      setDailyChallengeStats(stats);
                      const today = getTodayDateJST();
                      const info = `
📅 今日の日付(JST): ${today}
📈 統計:
  - 連続日数: ${stats.currentStreak}日（設定済み）
                      `.trim();
                      setDailyDebugInfo(info);
                      alert(`連続日数を ${streak} 日に設定しました`);
                    }}
                    className="bg-blue-500 hover:bg-blue-400 text-white text-xs py-1 px-2 rounded"
                  >
                    設定
                  </button>
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  ※ 連続日数を6に設定→完了→7日バッジ
                </p>
                
                {/* クイックテスト用ボタン */}
                <div className="grid grid-cols-2 gap-1">
                  <button
                    onClick={() => {
                      setDebugStreak(6);
                      resetDailyChallengeState();
                      const stats = getDailyChallengeStats();
                      setDailyChallengeStats(stats);
                      setDailyChallengeState(null);
                      alert('7日バッジテスト準備完了！チャレンジを完了してください');
                    }}
                    className="bg-purple-500 hover:bg-purple-400 text-white text-xs py-1 px-2 rounded"
                  >
                    🔥 7日準備
                  </button>
                  <button
                    onClick={() => {
                      setDebugStreak(29);
                      resetDailyChallengeState();
                      const stats = getDailyChallengeStats();
                      setDailyChallengeStats(stats);
                      setDailyChallengeState(null);
                      alert('30日バッジテスト準備完了！チャレンジを完了してください');
                    }}
                    className="bg-purple-500 hover:bg-purple-400 text-white text-xs py-1 px-2 rounded"
                  >
                    ⭐ 30日準備
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

      {/* アップグレードモーダル */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        lessonNumber={selectedLessonNumber}
      />

      {/* バッジゲット通知モーダル */}
      {showAchievementModal && newAchievements.length > 0 && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center animate-bounce-in">
            <div className="text-6xl mb-4">
              {newAchievements[currentAchievementIndex].icon}
            </div>
            <h2 className="text-2xl font-bold text-purple-600 mb-2">
              {language === "ja" ? "🎉 バッジゲット！" : "🎉 Achievement Unlocked!"}
            </h2>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {newAchievements[currentAchievementIndex].name[language]}
            </h3>
            <p className="text-gray-600 mb-6">
              {newAchievements[currentAchievementIndex].description[language]}
            </p>
            
            {/* ページ表示（複数ある場合） */}
            {newAchievements.length > 1 && (
              <p className="text-sm text-gray-400 mb-4">
                {currentAchievementIndex + 1} / {newAchievements.length}
              </p>
            )}
            
            <button
              onClick={() => {
                if (currentAchievementIndex < newAchievements.length - 1) {
                  setCurrentAchievementIndex(currentAchievementIndex + 1);
                } else {
                  setShowAchievementModal(false);
                  setCurrentAchievementIndex(0);
                }
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full transition-colors"
            >
              {currentAchievementIndex < newAchievements.length - 1
                ? (language === "ja" ? "次へ" : "Next")
                : (language === "ja" ? "閉じる" : "Close")}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
