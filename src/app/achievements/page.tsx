"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { achievements, categoryNames, Achievement } from "@/data/achievements";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Footer from "@/components/Footer";

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-400 to-purple-600">
        <div className="text-white text-xl">{t("common.loading")}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-400 to-purple-600">
      {/* ヘッダー */}
      <header className="bg-purple-700 text-white p-4 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🍀</span>
            <span className="text-xl font-bold">CodeBlock</span>
          </Link>
          <h1 className="text-xl font-bold">
            {language === "ja" ? "🏆 実績" : "🏆 Achievements"}
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 pb-20">
        {/* 進捗サマリー */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <div className="text-center">
            <p className="text-gray-600 mb-2">
              {language === "ja" ? "獲得した実績" : "Achievements Unlocked"}
            </p>
            <p className="text-4xl font-bold text-purple-600">
              {unlockedAchievements.length} / {achievements.length}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
              <div
                className="bg-purple-600 h-4 rounded-full transition-all duration-500"
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
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-700 hover:bg-purple-100"
              }`}
            >
              {category === "all"
                ? (language === "ja" ? "すべて" : "All")
                : categoryNames[category][language]}
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
                  {achievement.name[language]}
                </h3>
                <p className={`text-xs ${isUnlocked ? "text-gray-600" : "text-gray-400"}`}>
                  {achievement.description[language]}
                </p>
                {isUnlocked && (
                  <div className="mt-2">
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                      {language === "ja" ? "獲得済み" : "Unlocked"}
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

