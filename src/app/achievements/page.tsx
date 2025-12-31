"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { achievements, categoryNames, Achievement } from "@/data/achievements";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Footer from "@/components/Footer";
import { FW, FuriganaText } from "@/components/Furigana";

export default function AchievementsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { language, t } = useLanguage();
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  // 未ログイン時はログインページへリダイレクト
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // ユーザーの実績データを取得
  useEffect(() => {
    const fetchAchievements = async () => {
      if (!user) return;
      
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUnlockedAchievements(data.achievements || []);
        }
      } catch (error) {
        console.error("Failed to fetch achievements:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAchievements();
    }
  }, [user]);

  // カテゴリでフィルタリング
  const filteredAchievements = selectedCategory === "all"
    ? achievements
    : achievements.filter(a => a.category === selectedCategory);

  // カテゴリ一覧
  const categories = ["all", "progress", "streak", "correct", "xp", "challenge"];

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-100 via-purple-50 to-pink-100">
        <div className="text-gray-700 text-xl">{t("common.loading")}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-purple-50 to-pink-100 pb-20">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-600 relative overflow-hidden">
        <header className="flex justify-between items-center p-4 max-w-6xl mx-auto relative z-20">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="CodeBlock ロゴ" width={40} height={40} className="rounded-full border-2 border-white" />
            <span className="text-2xl font-bold text-white">CodeBlock</span>
          </Link>
          <h1 className="text-xl md:text-2xl font-bold text-white">
            {language === "ja" ? "🏅 バッジ" : "🏅 Achievements"}
          </h1>
        </header>
      </div>

      <main className="max-w-4xl mx-auto p-4 pt-6 pb-20">
        {/* 進捗サマリー */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <div className="text-center">
            <p className="text-gray-600 mb-2">
              {language === "ja" ? <><FW word="獲得" />したバッジ</> : "Achievements Unlocked"}
            </p>
            <p className="text-4xl font-bold text-purple-500">
              {unlockedAchievements.length} / {achievements.length}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
              <div
                className="bg-purple-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${(unlockedAchievements.length / achievements.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* カテゴリフィルター */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-purple-500 text-white"
                  : "bg-white text-gray-700 hover:bg-purple-100"
              }`}
            >
              {category === "all"
                ? (language === "ja" ? "すべて" : "All")
                : language === "ja" ? <FuriganaText text={categoryNames[category][language]} /> : categoryNames[category][language]}
            </button>
          ))}
        </div>

        {/* 実績一覧 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredAchievements.map((achievement) => {
            const isUnlocked = unlockedAchievements.includes(achievement.id);
            
            return (
              <div
                key={achievement.id}
                className={`rounded-xl p-4 text-center transition-all ${
                  isUnlocked
                    ? "bg-white shadow-lg"
                    : "bg-gray-200 opacity-60"
                }`}
              >
                <div className={`text-4xl mb-2 ${!isUnlocked && "grayscale"}`}>
                  {achievement.icon}
                </div>
                <h3 className={`font-bold mb-1 ${isUnlocked ? "text-gray-800" : "text-gray-500"}`}>
                  {language === "ja" ? <FuriganaText text={achievement.name[language]} /> : achievement.name[language]}
                </h3>
                <p className={`text-xs ${isUnlocked ? "text-gray-600" : "text-gray-400"}`}>
                  {language === "ja" ? <FuriganaText text={achievement.description[language]} /> : achievement.description[language]}
                </p>
                {isUnlocked && (
                  <div className="mt-2">
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                      {language === "ja" ? <>ゲット<FW word="済み" />！</> : "Unlocked"}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </main>

      {/* フッター */}
      <Footer />
    </div>
  );
}

