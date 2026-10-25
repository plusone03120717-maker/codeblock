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
import LandingPage from "@/components/landing/LandingPage";
import { F, FW, FuriganaText } from "@/components/Furigana";
import { UNIT_COLORS, getUnitGradient, getUnitSolid } from "@/utils/unitColors";
import { useAuth } from "@/contexts/AuthContext";
import { isNaviUser } from "@/lib/navi/access";
import { logout } from "@/lib/auth";
import ReviewSection from "@/components/ReviewSection";
import { resetReviewData, getReviewCount } from "@/utils/reviewSystem";
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

export default function Home() {
  const router = useRouter();
  const { user, userId, displayName, contactEmail, loading, progressLoaded, canAccessLesson, userProfile } = useAuth();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedLessonNumber, setSelectedLessonNumber] = useState(0);
  const { language } = useLanguage();

  // Python ナビ（新しいコース）を使うアカウントは、ナビのホームへ移る
  const naviUser = isNaviUser(user?.uid);
  useEffect(() => {
    if (naviUser) router.replace("/navi");
  }, [naviUser, router]);
  
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
      <div className="min-h-screen flex items-center justify-center bg-[#f5f3ff]">
        <div className="text-base font-bold text-[#6d6893]">読み込み中...</div>
      </div>
    );
  }

  // Python ナビを使うアカウントは、今までのホームを見せずにナビへ
  if (naviUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f3ff]">
        <div className="text-base font-bold text-[#6d6893]">Python ナビへ移動しています…</div>
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
    
    // localStorageに設定
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
