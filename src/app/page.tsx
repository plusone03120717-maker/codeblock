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
import { UNIT_COLORS, getUnitGradient, getUnitSolid } from "@/utils/unitColors";
import { useAuth } from "@/contexts/AuthContext";
import { logout } from "@/lib/auth";

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
    <div className="min-h-screen bg-gradient-to-b from-purple-500 to-blue-600">
      {/* ヘッダー */}
      <header className="flex justify-between items-center p-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🍀</span>
          <span className="text-2xl font-bold text-white">CodeBlock</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-white font-medium hover:text-purple-200 transition-colors"
          >
            {t("common.login")}
          </Link>
          <Link
            href="/login?mode=register"
            className="bg-white text-purple-600 font-bold py-2 px-6 rounded-full hover:bg-purple-100 transition-colors"
          >
            {language === "ja" ? "新規登録" : "Sign Up"}
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
          href="/login"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold text-xl py-4 px-10 rounded-full shadow-lg transform hover:scale-105 transition-all"
        >
          {language === "ja" ? "無料で始める 🚀" : "Start Free 🚀"}
        </Link>
      </section>

      {/* 特徴セクション */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            {language === "ja" ? "CodeBlockの特徴" : "Features"}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🧩</div>
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
              <div className="text-5xl mb-4">✨</div>
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
              <div className="text-5xl mb-4">💡</div>
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

      {/* キャラクター紹介セクション */}
      <section className="py-16 px-4 bg-purple-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            {language === "ja" ? "なかまたち" : "Meet the Characters"}
          </h2>
          <p className="text-center text-gray-600 mb-12">
            {language === "ja" 
              ? "個性豊かなキャラクターたちが、きみの学習をサポートするよ！" 
              : "Unique characters will support your learning journey!"}
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {/* コーディ */}
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center w-64">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-green-100 flex items-center justify-center">
                <Image
                  src="/images/characters/cody.png"
                  alt="コーディ"
                  width={96}
                  height={96}
                  className="w-20 h-20 object-contain"
                  unoptimized
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    if (target.parentElement) {
                      target.parentElement.innerHTML = '<span class="text-5xl">🐸</span>';
                    }
                  }}
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {language === "ja" ? "コーディ" : "Cody"}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === "ja" 
                  ? "プログラミングの基本を教えてくれる、元気いっぱいのヘビ！" 
                  : "An energetic snake who teaches programming basics!"}
              </p>
            </div>
            
            {/* ディジー */}
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center w-64">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
                <Image
                  src="/images/characters/dizzy.png"
                  alt="ディジー"
                  width={96}
                  height={96}
                  className="w-20 h-20 object-contain"
                  unoptimized
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    if (target.parentElement) {
                      target.parentElement.innerHTML = '<span class="text-5xl">🐕</span>';
                    }
                  }}
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {language === "ja" ? "ディジー" : "Diggy"}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === "ja" 
                  ? "変数について楽しく教えてくれる、好奇心旺盛な仲間！" 
                  : "A curious friend who teaches variables in a fun way!"}
              </p>
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

      {/* 学習内容セクション */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            {language === "ja" ? "学べること" : "What You'll Learn"}
          </h2>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="bg-green-100 rounded-lg p-4 text-center">
              <span className="font-bold text-green-800">✓ {language === "ja" ? "print関数" : "print function"}</span>
            </div>
            <div className="bg-blue-100 rounded-lg p-4 text-center">
              <span className="font-bold text-blue-800">✓ {language === "ja" ? "変数" : "Variables"}</span>
            </div>
            <div className="bg-purple-100 rounded-lg p-4 text-center">
              <span className="font-bold text-purple-800">✓ {language === "ja" ? "データ型" : "Data Types"}</span>
            </div>
            <div className="bg-yellow-100 rounded-lg p-4 text-center">
              <span className="font-bold text-yellow-800">✓ {language === "ja" ? "条件分岐" : "Conditionals"}</span>
            </div>
            <div className="bg-red-100 rounded-lg p-4 text-center">
              <span className="font-bold text-red-800">✓ {language === "ja" ? "ループ" : "Loops"}</span>
            </div>
            <div className="bg-indigo-100 rounded-lg p-4 text-center">
              <span className="font-bold text-indigo-800">✓ {language === "ja" ? "リスト" : "Lists"}</span>
            </div>
            <div className="bg-pink-100 rounded-lg p-4 text-center">
              <span className="font-bold text-pink-800">✓ {language === "ja" ? "関数" : "Functions"}</span>
            </div>
            <div className="bg-teal-100 rounded-lg p-4 text-center">
              <span className="font-bold text-teal-800">✓ {language === "ja" ? "辞書" : "Dictionaries"}</span>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <span className="font-bold text-gray-800">✓ {language === "ja" ? "さらに追加予定！" : "More coming!"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 学習の流れセクション */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            {language === "ja" ? "学習の流れ" : "How It Works"}
          </h2>
          <p className="text-center text-gray-600 mb-12">
            {language === "ja" 
              ? "3つのステップでプログラミングをマスターしよう！" 
              : "Master programming in 3 simple steps!"}
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* ステップ1: チュートリアル */}
            <div className="relative">
              <div className="bg-purple-100 rounded-2xl p-6 text-center h-full">
                <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  1
                </div>
                <div className="text-4xl mb-4">📖</div>
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
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-purple-400 text-2xl">
                →
              </div>
            </div>
            
            {/* ステップ2: 問題に挑戦 */}
            <div className="relative">
              <div className="bg-green-100 rounded-2xl p-6 text-center h-full">
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <div className="text-4xl mb-4">🧩</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {language === "ja" ? "ブロックで問題を解く" : "Solve with Blocks"}
                </h3>
                <p className="text-gray-600 text-sm">
                  {language === "ja" 
                    ? "ドラッグ＆ドロップでコードを組み立て。タイピングなしでプログラミング！" 
                    : "Build code with drag & drop. No typing required!"}
                </p>
              </div>
              {/* 矢印（PC表示のみ） */}
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-green-400 text-2xl">
                →
              </div>
            </div>
            
            {/* ステップ3: ヒントをもらう */}
            <div className="relative">
              <div className="bg-yellow-100 rounded-2xl p-6 text-center h-full">
                <div className="w-12 h-12 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <div className="text-4xl mb-4">💡</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {language === "ja" ? "困ったらヒントをもらう" : "Get Hints When Stuck"}
                </h3>
                <p className="text-gray-600 text-sm">
                  {language === "ja" 
                    ? "わからなくても大丈夫！AIがキャラクターになってヒントを教えてくれるよ" 
                    : "Don't worry if you're stuck! AI characters will give you hints"}
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

      {/* CTAセクション */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          {language === "ja" ? "さあ、はじめよう！" : "Let's Get Started!"}
        </h2>
        <p className="text-purple-100 mb-8">
          {language === "ja" ? "無料でアカウントを作成して、今すぐ学習スタート" : "Create a free account and start learning today"}
        </p>
        <Link
          href="/login"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold text-xl py-4 px-10 rounded-full shadow-lg transform hover:scale-105 transition-all"
        >
          {language === "ja" ? "無料で始める 🚀" : "Start Free 🚀"}
        </Link>
      </section>

      {/* フッター */}
      <footer className="py-8 px-4 bg-gray-800 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-2xl">🍀</span>
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
  const { user, userId, displayName, contactEmail, loading, progressLoaded } = useAuth();
  
  // すべてのフックを先に宣言（条件分岐の前に）
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [totalXP, setTotalXP] = useState(0);
  const [levelInfo, setLevelInfo] = useState({ level: 1, name: "ビギナー", minXP: 0, maxXP: 99 });
  const [levelProgress, setLevelProgress] = useState(0);
  const [xpToNext, setXpToNext] = useState(100);
  const [highestStreak, setHighestStreak] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [showEmailBanner, setShowEmailBanner] = useState(true);
  const [debugXP, setDebugXP] = useState("");
  const [debugLessonId, setDebugLessonId] = useState("");
  const [resumeStatus, setResumeStatus] = useState<Record<string, boolean>>({});
  const [debugStartLessonId, setDebugStartLessonId] = useState("");
  const [debugStartMission, setDebugStartMission] = useState("");
  const [lastOpenedMission, setLastOpenedMission] = useState<LastOpenedMission | null>(null);
  const [unitImageErrors, setUnitImageErrors] = useState<Record<number, boolean>>({});


  useEffect(() => {
    if (!progressLoaded) return;
    
    const progress = getProgress();
    setTotalXP(progress.totalXP);
    setCompletedLessons(progress.completedLessons);
    setLevelInfo(getLevelInfo(progress.totalXP));
    setLevelProgress(getLevelProgress(progress.totalXP));
    setXpToNext(getXPToNextLevel(progress.totalXP));
    setHighestStreak(progress.highestStreak);
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

    // ユニット名を取得するヘルパー関数
    const getUnitName = (unit: number) => {
      if (unit === 1) return "print";
      if (unit === 2) return <FW word="変数" />;
      if (unit === 3) return <>データ<F reading="がた">型</F></>;
      if (unit === 4) return <>条件<F reading="ぶんき">分岐</F></>;
      if (unit === 5) return "ループ";
      if (unit === 6) return "リスト";
      if (unit === 7) return <>関数の基本</>;
      if (unit === 8) return <>戻り値と応用</>;
      return "";
    };

    return {
      allUnits,
      firstRowUnits,
      secondRowUnits,
      renderUnitPoint,
      getUnitName,
    };
  }, [completedLessons, lessons, unitImageErrors]);

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


  // 進捗データのローディング中の表示
  if (!progressLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-100 via-purple-50 to-pink-100">
        <div className="text-xl text-gray-700">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-purple-50 to-pink-100">
      {/* 2カラムレイアウト（デスクトップ） */}
      <div className="pt-6 px-4 pb-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 左カラム：ロゴ + ステータスカード + 前回の続き（1/3幅） */}
            <div className="space-y-4 md:col-span-1">
              {/* ヘッダー：ロゴとユーザー情報 */}
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-left text-purple-800">
                  🐍 CodeBlock
                </h1>
                {!loading && (
                  user ? (
                    <button
                      onClick={handleLogout}
                      className="text-lg font-bold bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-full transition-colors"
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
              </div>
              
              {/* メール設定促進バナー */}
              {user && !contactEmail && showEmailBanner && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg relative">
                  <button
                    onClick={() => setShowEmailBanner(false)}
                    className="absolute top-2 right-2 text-yellow-600 hover:text-yellow-800"
                  >
                    ✕
                  </button>
                  <div className="flex items-start gap-2">
                    <span className="text-xl">📧</span>
                    <div>
                      <p className="text-sm font-bold text-yellow-800">
                        メールアドレスを設定しよう！
                      </p>
                      <p className="text-xs text-yellow-700 mt-1">
                        パスワードを忘れた時に、メールアドレスがあると安心です。
                      </p>
                      <Link
                        href="/options"
                        className="inline-block mt-2 text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-full"
                      >
                        設定する
                      </Link>
                    </div>
                  </div>
                </div>
              )}
              
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
                    <span>前回の続きから学習する</span>
                  </Link>
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
            // ユニットボタンの色定義を使用
            const bgColor = isLocked ? "from-gray-400 to-gray-500" : getUnitGradient(lesson.unitNumber);

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
